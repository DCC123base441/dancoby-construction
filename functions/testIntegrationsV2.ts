import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const results = {};
        const reimagineKey = Deno.env.get("REIMAGINEHOME_API_KEY");

        if (reimagineKey) {
            // Test Ping again
            const pingRes = await fetch('https://api.reimage.io/api/v1/ping', {
                headers: { 'Authorization': reimagineKey }
            });
            results.ping = { status: pingRes.status, body: await pingRes.text() };

            // Test Create Mask
            const maskRes = await fetch('https://api.reimage.io/api/v1/create_mask', {
                method: 'POST',
                headers: { 'Authorization': reimagineKey, 'Content-Type': 'application/json' },
                body: JSON.stringify({ image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7" })
            });
            results.create_mask = { status: maskRes.status, body: await maskRes.text() };
        }

        return Response.json(results);
    } catch (e) {
        return Response.json({ error: e.message });
    }
});