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

        // Function to batch delete
        const deleteBatch = async (entityName) => {
            let count = 0;
            while (true) {
                // Fetch a batch
                const items = await base44.entities[entityName].list('-created_date', 50);
                if (!items || items.length === 0) break;

                // Delete concurrently
                await Promise.all(items.map(item => base44.entities[entityName].delete(item.id)));
                count += items.length;
                
                // Safety break for single run execution time limits (though Deno deploy is generous)
                // If we have thousands, this might take a while.
                if (count > 1000) break; // Limit per request to prevent timeouts
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
        return Response.json({ error: error.message }, { status: 500 });
    }
});