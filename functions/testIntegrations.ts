import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const results = {};

        // Test RenovateAI
        const renovateKey = Deno.env.get("RENOVATEAI_API_KEY");
        if (renovateKey) {
            try {
                // Test RenovateAI Upload (simplest endpoint?) or just check if key is accepted
                // Using a dummy upload to test auth
                const formData = new FormData();
                // We need a dummy file or URL. Let's try to just hit an endpoint or upload a tiny dummy image if possible?
                // Or just use a public URL.
                formData.append('image_url', "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=500&q=60");
                formData.append('asset_name', "test_auth");

                const response = await fetch('https://api.tech.renovateai.app/public/v1/assets/upload', {
                    method: 'POST',
                    headers: {
                        'x-api-key': renovateKey
                    },
                    body: formData
                });
                const text = await response.text();
                results.renovateAI = { status: response.status, body: text };
            } catch (e) {
                results.renovateAI = { error: e.message };
            }
        } else {
            results.renovateAI = "No key set";
        }

        // Test ReimagineHome
        const reimagineKey = Deno.env.get("REIMAGINEHOME_API_KEY");
        if (reimagineKey) {
            try {
                // Try with api-key header
                const response1 = await fetch('https://api.reimaginehome.ai/v1/create_mask', {
                    method: 'POST',
                    headers: {
                        'api-key': reimagineKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=500&q=60"
                    })
                });
                results.reimagineHome_ApiKeyHeader = { status: response1.status, body: await response1.text() };

                // Try with Bearer and valid image
                const largeImage = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1024&q=80";
                
                const response2 = await fetch('https://api.reimaginehome.ai/v1/create_mask', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${reimagineKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        image_url: largeImage
                    })
                });
                results.reimagineHome_CreateMask = { status: response2.status, body: await response2.text() };

                // Probe Generate Image
                const responseGen1 = await fetch('https://api.reimaginehome.ai/v1/generate_image', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${reimagineKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ image_url: largeImage })
                });
                results.reimagineHome_GenerateImage = { status: responseGen1.status, body: await responseGen1.text() };

                // Probe Redesign
                const responseGen2 = await fetch('https://api.reimaginehome.ai/v1/redesign_room', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${reimagineKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ image_url: largeImage })
                });
                results.reimagineHome_RedesignRoom = { status: responseGen2.status, body: await responseGen2.text() };

            } catch (e) {
                results.reimagineHome = { error: e.message };
            }
        } else {
            results.reimagineHome = "No key set";
        }

        return Response.json(results);
    } catch (e) {
        return Response.json({ error: e.message });
    }
});