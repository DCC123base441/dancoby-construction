import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const results = {};

        // Test ReimagineHome Ping
        const reimagineKey = Deno.env.get("REIMAGINEHOME_API_KEY");
        if (reimagineKey) {
            try {
                // Ping Test - Raw Key
                console.log("Testing api.reimage.io ping (Raw Key)...");
                const pingRes = await fetch('https://api.reimage.io/api/v1/ping', {
                    method: 'GET',
                    headers: {
                        'Authorization': reimagineKey 
                    }
                });
                results.ping_RawKey = {
                    status: pingRes.status,
                    body: await pingRes.text()
                };

                 // Ping Test - Bearer Token
                console.log("Testing api.reimage.io ping (Bearer)...");
                const pingRes2 = await fetch('https://api.reimage.io/api/v1/ping', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${reimagineKey}`
                    }
                });
                results.ping_Bearer = {
                    status: pingRes2.status,
                    body: await pingRes2.text()
                };
                
            } catch (e) {
                results.error = e.message;
            }
        } else {
            results.reimagineHome = "No key set";
        }

        return Response.json(results);
    } catch (e) {
        return Response.json({ error: e.message });
    }
});