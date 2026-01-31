import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const apiKey = Deno.env.get("REIMAGINEHOME_API_KEY");
        if (!apiKey) return Response.json({ error: "No API key" });

        console.log("Testing ReimagineHome Key...");

        // Try create_mask as it was in the docs
        const response = await fetch('https://api.reimaginehome.ai/v1/create_mask', {
            method: 'POST',
            headers: {
                'api-key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=500&q=60"
            })
        });

        const text = await response.text();
        console.log("Response:", response.status, text);

        return Response.json({ status: response.status, body: text });
    } catch (e) {
        return Response.json({ error: e.message });
    }
});