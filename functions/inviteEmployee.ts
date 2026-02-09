import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (user?.role !== 'admin') {
            return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
        }

        const { email, role = 'user', portalRole = 'employee' } = await req.json();
        
        if (!email) {
            return Response.json({ error: 'Email is required' }, { status: 400 });
        }

        // Invite the user
        await base44.users.inviteUser(email, role);
        
        // Set their portal role
        const users = await base44.asServiceRole.entities.User.filter({ email });
        if (users.length > 0) {
            await base44.asServiceRole.entities.User.update(users[0].id, { portalRole });
        }

        // Log invite history
        await base44.asServiceRole.entities.InviteHistory.create({
            email,
            portalRole,
            invitedBy: user.email,
            status: 'pending',
        });

        return Response.json({ success: true, message: `Invited ${email} as ${portalRole}` });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});