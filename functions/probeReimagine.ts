import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const reimagineKey = Deno.env.get("REIMAGINEHOME_API_KEY");
        if (!reimagineKey) return Response.json({error: "No key"});

        const largeImage = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1024&q=80";
        
        const results = {};

        // Try generate_image with api-key and dummy params
        try {
            const body = {
                image_url: largeImage,
                prompt: "Modern living room renovation",
                mask_category: "architectural", // Guessing
                mask_prompt: "wall, floor" // Guessing
            };

            const res = await fetch('https://api.reimaginehome.ai/v1/generate_image', {
                method: 'POST',
                headers: {
                    'api-key': reimagineKey, // Using api-key header
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            results.generate_image_probe = { status: res.status, body: await res.text() };
        } catch(e) {
            results.generate_image_probe = { error: e.message };
        }

        return Response.json(results);
    } catch (e) {
        return Response.json({ error: e.message });
    }
});