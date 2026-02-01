import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const results = {};
        const reimagineKey = Deno.env.get("REIMAGINEHOME_API_KEY");
        const largeImage = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1024&q=80";

        if (reimagineKey) {
            // Test Path 1: /api/v1/generate_image
            try {
                const res1 = await fetch('https://api.reimage.io/api/v1/generate_image', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${reimagineKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        image_url: largeImage,
                        prompt: "Modern living room",
                        mask_category: "furnishing",
                        mask_prompt: "furniture"
                    })
                });
                results.path_api_v1 = { status: res1.status, body: await res1.text() };
            } catch (e) { results.path_api_v1 = { error: e.message }; }

            // Test Path 2: /v1/generate_image
            try {
                const res2 = await fetch('https://api.reimage.io/v1/generate_image', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${reimagineKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        image_url: largeImage,
                        prompt: "Modern living room",
                        mask_category: "furnishing",
                        mask_prompt: "furniture"
                    })
                });
                results.path_v1 = { status: res2.status, body: await res2.text() };
            } catch (e) { results.path_v1 = { error: e.message }; }
        }

        return Response.json(results);
    } catch (e) {
        return Response.json({ error: e.message });
    }
});