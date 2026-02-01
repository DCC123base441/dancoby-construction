import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        // Admin only check
        if (user?.role !== 'admin') {
            return Response.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { target } = await req.json(); // 'visits', 'estimates', 'all'

        let deletedVisits = 0;
        let deletedEstimates = 0;

        // Function to batch delete using Service Role to bypass RLS/permission issues
        const deleteBatch = async (entityName) => {
            let count = 0;
            // Use service role for admin operations
            const serviceRoleEntities = base44.asServiceRole.entities[entityName];
            
            while (true) {
                // Fetch a batch
                const items = await serviceRoleEntities.list('-created_date', 50);
                
                // Handle potential different return formats (array vs object)
                const records = Array.isArray(items) ? items : (items?.items || []);
                
                if (!records || records.length === 0) break;

                // Delete concurrently
                await Promise.all(records.map(item => serviceRoleEntities.delete(item.id)));
                count += records.length;
                
                // Safety break
                if (count > 2000) break; 
            }
            return count;
        };

        if (target === 'visits' || target === 'all') {
            deletedVisits = await deleteBatch('SiteVisit');
        }

        if (target === 'estimates' || target === 'all') {
            deletedEstimates = await deleteBatch('Estimate');
        }

        return Response.json({ success: true, deletedVisits, deletedEstimates });

    } catch (error) {
        console.error("Reset analytics error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});