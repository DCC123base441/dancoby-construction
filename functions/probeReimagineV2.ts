import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const reimagineKey = Deno.env.get("REIMAGINEHOME_API_KEY");
        if (!reimagineKey) return Response.json({error: "No key"});

        const largeImage = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1024&q=80";
        
        const results = {};

        // 1. Try create_mask with api-key
        try {
            const res = await fetch('https://api.reimaginehome.ai/v1/create_mask', {
                method: 'POST',
                headers: {
                    'api-key': reimagineKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ image_url: largeImage })
            });
            results.create_mask = { status: res.status, body: await res.text() };
        } catch(e) {
            results.create_mask = { error: e.message };
        }

        // 2. Try generate_image with api-key and mask_category
        try {
            const body = {
                image_url: largeImage,
                prompt: "Modern style living room",
                mask_category: "architectural"
            };

            const res = await fetch('https://api.reimaginehome.ai/v1/generate_image', {
                method: 'POST',
                headers: {
                    'api-key': reimagineKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            results.generate_image = { status: res.status, body: await res.text() };
        } catch(e) {
            results.generate_image = { error: e.message };
        }

        return Response.json(results);
    } catch (e) {
        return Response.json({ error: e.message });
    }
});