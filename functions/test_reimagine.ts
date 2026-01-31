import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const payload = {
            image_url: "https://reimaginehome.ai/images/hero_before.jpg", // Use a dummy valid image
            prompt: "Modern living room",
        };

        const response = await fetch('https://api.reimaginehome.ai/v1/generate_image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': Deno.env.get("REIMAGINEHOME_API_KEY")
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        return Response.json(data);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});