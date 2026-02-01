import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        if (req.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                }
            });
        }

        const base44 = createClientFromRequest(req);
        const { page, userAgent, referrer } = await req.json();
        
        // Debug logging
        // console.error("Request Headers:", JSON.stringify(Object.fromEntries(req.headers.entries())));

        // Prioritize cf-connecting-ip as it's the most reliable on Deno/Cloudflare
        let ip = req.headers.get("cf-connecting-ip");
        
        if (!ip) {
             const forwarded = req.headers.get("x-forwarded-for");
             if (forwarded) {
                 ip = forwarded.split(',')[0].trim();
             }
        }
        
        if (!ip) {
            ip = req.headers.get("x-real-ip");
        }

        console.log("Resolved IP:", ip);
        
        let locationData = {};
        
        // Try Cloudflare headers first (most accurate if available)
        const cfCity = req.headers.get("cf-ipcity");
        const cfCountry = req.headers.get("cf-ipcountry");
        const cfRegion = req.headers.get("cf-region"); // State code usually
        
        if (cfCity) {
             locationData = {
                 city: cfCity,
                 state: cfRegion,
                 country: cfCountry
             };
             console.log("Resolved location from headers:", locationData);
        } else if (ip) {
            try {
                // Fallback to ip-api.com
                const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
                const geo = await geoRes.json();
                
                if (geo.status === 'success') {
                    locationData = {
                        city: geo.city,
                        state: geo.regionName || geo.region, // Prefer full name, fallback to code
                        country: geo.country
                    };
                    console.log("Resolved location from API:", locationData);
                } else {
                    console.warn("Geo lookup returned status:", geo.status, geo.message);
                }
            } catch (e) {
                console.error("Geo lookup failed", e);
            }
        }

        // Create the visit record
        // We use asServiceRole to ensure we can write even if public users have restrictions,
        // though typically SiteVisit should be open. Safest to use service role for backend logic.
        const visit = await base44.asServiceRole.entities.SiteVisit.create({
            page,
            userAgent,
            referrer,
            ...locationData
        });

        return Response.json(visit, {
            headers: { 'Access-Control-Allow-Origin': '*' }
        });
    } catch (error) {
        console.error("Track visit error", error);
        return Response.json({ error: error.message }, { 
            status: 500,
            headers: { 'Access-Control-Allow-Origin': '*' }
        });
    }
});