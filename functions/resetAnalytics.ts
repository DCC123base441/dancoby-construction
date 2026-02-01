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

        // Helper for delay
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        // Function to batch delete using Service Role with rate limiting
        const deleteBatch = async (entityName) => {
            let count = 0;
            const serviceRoleEntities = base44.asServiceRole.entities[entityName];
            
            // Loop until no more items
            while (true) {
                // Fetch a smaller batch
                const items = await serviceRoleEntities.list('-created_date', 20);
                const records = Array.isArray(items) ? items : (items?.items || []);
                
                if (!records || records.length === 0) break;

                // Process in smaller chunks to avoid rate limits
                // Delete 3 at a time
                const chunkSize = 3;
                for (let i = 0; i < records.length; i += chunkSize) {
                    const chunk = records.slice(i, i + chunkSize);
                    await Promise.all(chunk.map(item => serviceRoleEntities.delete(item.id)));
                    // Small delay between chunks
                    await delay(200);
                }

                count += records.length;
                
                // Safety break
                if (count > 2000) break; 
                
                // Delay between main batches
                await delay(500);
            }
            return count;
        };

        if (target === 'visits' || target === 'all') {
            deletedVisits = await deleteBatch('SiteVisit');
        }

        if (target === 'estimates' || target === 'all') {
            deletedEstimates = await deleteBatch('Estimate');
        }

        let deletedProjects = 0;
        if (target === 'projects' || target === 'all') {
            deletedProjects = await deleteBatch('Project');
        }

        let deletedBlogs = 0;
        if (target === 'blogs' || target === 'all') {
            deletedBlogs = await deleteBatch('BlogPost');
        }

        let deletedLeads = 0;
        if (target === 'leads' || target === 'all') {
            deletedLeads = await deleteBatch('Lead');
        }

        return Response.json({ 
            success: true, 
            deletedVisits, 
            deletedEstimates,
            deletedProjects,
            deletedBlogs,
            deletedLeads
        });

    } catch (error) {
        console.error("Reset analytics error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});