import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const reimagineKey = Deno.env.get("REIMAGINEHOME_API_KEY");
        const largeImage = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1024&q=80";
        
        const body = {
            image_url: largeImage,
            prompt: "Modern living room renovation",
            mask_category: "architectural" 
        };

        const res = await fetch('https://api.reimaginehome.ai/v1/generate_image', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${reimagineKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        const text = await res.text();
        return Response.json({ status: res.status, body: text });

    } catch (e) {
        return Response.json({ error: e.message });
    }
});