import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        if (req.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                }
            });
        }

        const base44 = createClientFromRequest(req);
        const data = await req.json();

        // Use service role to bypass any public permission restrictions on creating leads
        const lead = await base44.asServiceRole.entities.Lead.create({
            name: data.name,
            email: data.email,
            phone: data.phone,
            serviceType: data.serviceType,
            source: data.source,
            status: 'new',
            notes: `
Project Description: ${data.message}

---
Address: ${data.address}
Budget: ${data.budget}
Timeline: ${data.timeline}
            `.trim()
        });

        return Response.json({ success: true, lead }, {
            headers: { 'Access-Control-Allow-Origin': '*' }
        });

    } catch (error) {
        console.error("Create lead error:", error);
        return Response.json({ error: error.message }, { 
            status: 500,
            headers: { 'Access-Control-Allow-Origin': '*' }
        });
    }
});