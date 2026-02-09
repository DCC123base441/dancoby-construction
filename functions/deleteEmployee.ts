import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (user?.role !== 'admin') {
            return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
        }

        const { userId, userEmail } = await req.json();
        
        if (!userId) {
            return Response.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Delete their employee profile if exists
        if (userEmail) {
            const profiles = await base44.asServiceRole.entities.EmployeeProfile.filter({ userEmail });
            for (const p of profiles) {
                await base44.asServiceRole.entities.EmployeeProfile.delete(p.id);
            }
        }

        // Delete the user
        await base44.asServiceRole.entities.User.delete(userId);

        return Response.json({ success: true, message: `Deleted user ${userEmail || userId}` });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});