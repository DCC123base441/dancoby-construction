import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Optional: Check if user is authenticated if you want to restrict access
        // const user = await base44.auth.me();
        // if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

        const { imageUrl, prompt, roomType, maskCategory } = await req.json();

        if (!imageUrl) {
            return Response.json({ error: 'Image URL is required' }, { status: 400 });
        }

        const apiKey = Deno.env.get("REIMAGINEHOME_API_KEY");
        if (!apiKey) {
            return Response.json({ error: 'API Configuration Error' }, { status: 500 });
        }

        console.log('Starting redesign for:', roomType);
        console.log('Image URL:', imageUrl);

        // Determine mask category if not provided
        // Options: architectural, furnishing, landscaping, etc.
        let category = maskCategory;
        if (!category) {
            const type = (roomType || "").toLowerCase();
            if (type.includes("kitchen") || type.includes("bath")) {
                category = "architectural"; // Changes cabinets, tiles, etc.
            } else if (type.includes("exterior")) {
                category = "architectural"; // or landscaping
            } else {
                category = "furnishing"; // Bedrooms, living rooms usually just need furniture update
            }
        }

        // Two-step process: 1. Create Mask, 2. Generate Image
        console.log("Step 1: Creating mask...");
        
        const maskResponse = await fetch('https://api.reimaginehome.ai/v1/create_mask', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image_url: imageUrl,
                // We can optionally pass mask_prompt to auto-select? 
                // Or maybe create_mask just returns all? 
                // Let's try sending mask_prompt if architectural to limit?
                // For now just image_url as per docs hint.
            })
        });

        if (!maskResponse.ok) {
             const err = await maskResponse.text();
             console.error("Mask creation failed:", err);
             throw new Error(`Mask creation failed: ${maskResponse.status} ${err}`);
        }

        const maskData = await maskResponse.json();
        console.log("Mask data received:", JSON.stringify(maskData).substring(0, 200) + "...");

        // Parse mask data to find the mask URL
        // maskData usually contains job_id. We might need to poll for mask? 
        // Or does it return immediately?
        // If it returns job_id, we need to poll.
        
        // Assuming it works like generate_image and returns job_id
        let maskJobId = maskData.data?.job_id || maskData.job_id;
        let maskUrl = null;

        if (maskJobId) {
             // Poll for mask
             console.log("Polling for mask job:", maskJobId);
             for (let i=0; i<30; i++) {
                 await new Promise(r => setTimeout(r, 2000));
                 const check = await fetch(`https://api.reimaginehome.ai/v1/get_job_details/${maskJobId}`, {
                      headers: { 'Authorization': `Bearer ${apiKey}` }
                 });
                 if (check.ok) {
                      const d = await check.json();
                      const status = d.data?.job_status;
                      console.log("Mask job status:", status);
                      if (status === 'done') {
                          // Where is the mask?
                          // d.data.result_url? or d.data.masks?
                          // result_url might be a zip or a combined mask?
                          // If we want segmentation, it might be d.data.segments?
                          // Let's assume result_url is usable or we find it.
                          maskUrl = d.data?.result_url || d.data?.mask_url;
                          // If there are multiple masks, we might need to pick?
                          // For now, let's just grab result_url.
                          break;
                      } else if (status === 'failed') {
                          throw new Error("Mask job failed");
                      }
                 }
             }
        } else {
             // Maybe it returned immediately?
             maskUrl = maskData.data?.mask_url || maskData.mask_url;
        }

        if (!maskUrl) throw new Error("Could not retrieve mask URL");

        console.log("Step 2: Generating image with mask:", maskUrl);

        const generateResponse = await fetch('https://api.reimaginehome.ai/v1/generate_image', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image_url: imageUrl,
                prompt: prompt || `Beautifully designed ${roomType || 'room'}, photorealistic, 8k, interior design`,
                mask_urls: [maskUrl], // Provide the mask!
                // mask_category: category, // Maybe remove this if we provide mask_urls
            })
        });

        if (!generateResponse.ok) {
            const errorText = await generateResponse.text();
            console.error('ReimagineHome Error:', errorText);
            let errorMsg = `Generation failed: ${generateResponse.status}`;
            try {
                const errorJson = JSON.parse(errorText);
                if (errorJson.error_message) errorMsg = errorJson.error_message;
                if (errorJson.message) errorMsg = errorJson.message;
            } catch (e) {}
            throw new Error(errorMsg);
        }

        const generateData = await generateResponse.json();
        const jobId = generateData?.data?.job_id;

        if (!jobId) throw new Error("No job_id returned");

        // Poll for completion
        let resultUrl = null;
        let attempts = 0;
        const maxAttempts = 40; // ~80 seconds

        while (attempts < maxAttempts) {
            await new Promise(r => setTimeout(r, 2000));
            
            // Try get_job_details first
            let statusResponse = await fetch(`https://api.reimaginehome.ai/v1/get_job_details/${jobId}`, {
                headers: { 'Authorization': `Bearer ${apiKey}` }
            });

            // Fallback to generate_image/{id} if 404
            if (statusResponse.status === 404) {
                statusResponse = await fetch(`https://api.reimaginehome.ai/v1/generate_image/${jobId}`, {
                    headers: { 'Authorization': `Bearer ${apiKey}` }
                });
            }

            if (!statusResponse.ok) continue; // retry on transient error

            const statusData = await statusResponse.json();
            const status = statusData?.data?.job_status;

            console.log(`Job ${jobId} status: ${status}`);

            if (status === 'done') {
                resultUrl = statusData?.data?.result_url || statusData?.data?.generated_image_url;
                // Sometimes outputs is an array
                if (!resultUrl && statusData?.data?.outputs?.[0]) {
                    resultUrl = statusData.data.outputs[0];
                }
                break;
            } else if (status === 'error' || status === 'failed') {
                throw new Error("AI Generation failed");
            }

            attempts++;
        }

        if (!resultUrl) throw new Error("Generation timed out");

        return Response.json({ 
            success: true, 
            resultUrl,
            originalUrl: imageUrl
        });

    } catch (error) {
        console.error('Redesign error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});