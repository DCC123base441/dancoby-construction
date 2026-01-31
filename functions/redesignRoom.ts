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

        // Call ReimagineHome redesign_room (which handles auto-masking)
        // If that fails, we might need a 2-step process (create_mask -> generate_image)
        // But let's try the high-level endpoint first.
        
        let endpoint = 'https://api.reimaginehome.ai/v1/redesign_room';
        let payload = {
            image_url: imageUrl,
            prompt: prompt || `Beautifully designed ${roomType || 'room'}, photorealistic, 8k, interior design`,
            room_type: roomType, 
            style: "Modern" // We should pass style if available, or extract from prompt?
            // "theme": style ?
        };

        // If specific params are needed for redesign_room vs generate_image
        // redesign_room usually takes: image_url, prompt, room_type, style, etc.
        // It might NOT take mask_category/mask_prompt directly if it's "redesign".
        
        // However, to be safe and try to match the "Staging" vs "Renovation" intent:
        if (maskCategory === 'furnishing') {
             // For virtual staging, maybe use 'virtual_staging' endpoint if it exists, or stick to redesign_room with specific prompt
             // or check if we should be using generate_image with a mask (2-step).
             // Let's assume redesign_room handles it.
        }

        const generateResponse = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
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