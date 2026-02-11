import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (user?.role !== 'admin') {
            return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
        }

        const result = await base44.asServiceRole.integrations.Core.GenerateImage({
            prompt: "A professional branded construction company transit van (grey and white wrap with geometric diamond pattern, company name 'Dancoby Construction Company' on the side) parked on a clean NYC Brooklyn street with brownstone buildings in the background. Bright natural daylight, professional commercial photography style, clean and polished look. The van should look exactly like a Ford Transit high-roof cargo van with a professional grey/white vehicle wrap.",
            existing_image_urls: [
                "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/2735193cb_79253312687__21808B29-B752-4A18-9D29-1AF223044461.jpg"
            ]
        });

        return Response.json({ url: result.url });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});