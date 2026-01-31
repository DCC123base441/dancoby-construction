import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const results = {};

        // Test ReimagineHome
        const reimagineKey = Deno.env.get("REIMAGINEHOME_API_KEY");
        if (reimagineKey) {
            try {
                // Try with Bearer and valid image
                const largeImage = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1024&q=80";
                
                // Probe Create Mask - Bearer
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
                results.reimagineHome_CreateMask_Bearer = { status: response2.status, body: await response2.text() };

                // Probe Create Mask - api-key
                const response3 = await fetch('https://api.reimaginehome.ai/v1/create_mask', {
                    method: 'POST',
                    headers: {
                        'api-key': reimagineKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        image_url: largeImage
                    })
                });
                results.reimagineHome_CreateMask_ApiKey = { status: response3.status, body: await response3.text() };

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
                
                 // Probe Renovate
                const responseGen3 = await fetch('https://api.reimaginehome.ai/v1/renovate', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${reimagineKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ image_url: largeImage })
                });
                results.reimagineHome_Renovate = { status: responseGen3.status, body: await responseGen3.text() };

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