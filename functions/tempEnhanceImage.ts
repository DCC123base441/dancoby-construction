import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Enhance the image
        const result = await base44.integrations.Core.GenerateImage({
            prompt: "Professional architectural photography of a large modern house under construction wrapped in blue weather barrier, clear blue sky, clean construction site, golden hour lighting, high resolution, photorealistic, 8k. Remove debris, make it look neat and professional.",
            existing_image_urls: ["https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/892293f9a_Photo15.jpg"]
        });

        return Response.json(result);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});