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
        if (ip) {
            try {
                // Using ip-api.com (free, no key required for basic use)
                // Note: limited to 45 requests per minute
                const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
                const geo = await geoRes.json();
                
                // console.log("Geo API Response:", JSON.stringify(geo));

                if (geo.status === 'success') {
                    locationData = {
                        city: geo.city,
                        state: geo.region, // Use region code (e.g. NY) instead of full name
                        country: geo.country
                    };
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
            ip,
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