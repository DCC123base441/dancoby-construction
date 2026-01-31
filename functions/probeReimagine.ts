import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const reimagineKey = Deno.env.get("REIMAGINEHOME_API_KEY");
        if (!reimagineKey) return Response.json({error: "No key"});

        const largeImage = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1024&q=80";
        const endpoints = [
            "create_mask",
            "generate_image", 
            "renovate",
            "redesign_room",
            "virtual_staging",
            "space_redesign"
        ];
        
        const results = {};
        
        for (const ep of endpoints) {
            try {
                const res = await fetch(`https://api.reimaginehome.ai/v1/${ep}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${reimagineKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ image_url: largeImage })
                });
                results[ep] = { status: res.status, body: await res.text() };
            } catch(e) {
                results[ep] = { error: e.message };
            }
        }

        return Response.json(results);
    } catch (e) {
        return Response.json({ error: e.message });
    }
});