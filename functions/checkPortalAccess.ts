import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        let user;
        try {
            user = await base44.auth.me();
        } catch (e) {
            return Response.json({ authorized: false });
        }
        
        if (!user) return Response.json({ authorized: false });

        // Auto-mark any pending invites for this user as accepted
        try {
            const pendingInvites = await base44.asServiceRole.entities.InviteHistory.filter({
                email: user.email,
                status: 'pending'
            });
            for (const inv of pendingInvites) {
                await base44.asServiceRole.entities.InviteHistory.update(inv.id, { status: 'accepted' });
            }
        } catch (e) {
            console.error('Failed to auto-accept invites:', e);
        }

        // Admins always have access
        if (user.role === 'admin') {
            return Response.json({ authorized: true, role: 'admin' });
        }

        // Check if user is explicitly a customer
        const existingRole = user.portalRole;
        if (existingRole === 'customer') {
            return Response.json({ authorized: true, role: 'customer' });
        }

        // Everyone else is an employee — no portalRole needed
        return Response.json({ authorized: true, role: 'employee' });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});