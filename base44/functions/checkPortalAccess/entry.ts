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

        // If user already has a portal role, they're good
        if (user.portalRole === 'employee' || user.portalRole === 'customer') {
            return Response.json({ authorized: true, role: user.portalRole });
        }

        const emailLower = user.email.toLowerCase();
        
        // Look for a pending invite matching this email
        const invites = await base44.asServiceRole.entities.InviteHistory.filter({ email: emailLower });

        if (invites.length > 0) {
            const invite = invites[0];
            
            // Assign the portal role to the user
            await base44.asServiceRole.entities.User.update(user.id, { portalRole: invite.portalRole });
            
            // Mark ALL matching invites as accepted
            for (const inv of invites) {
                if (inv.status !== 'accepted') {
                    await base44.asServiceRole.entities.InviteHistory.update(inv.id, { status: 'accepted' });
                }
            }
            
            return Response.json({ authorized: true, role: invite.portalRole, assignedNow: true });
        }

        // Check EmployeeProfile as fallback
        let profiles = await base44.asServiceRole.entities.EmployeeProfile.filter({ userEmail: emailLower });
        if (profiles.length === 0 && user.email !== emailLower) {
            profiles = await base44.asServiceRole.entities.EmployeeProfile.filter({ userEmail: user.email });
        }

        if (profiles.length > 0) {
            await base44.asServiceRole.entities.User.update(user.id, { portalRole: 'employee' });
            return Response.json({ authorized: true, role: 'employee', assignedNow: true });
        }

        return Response.json({ authorized: true, role: null });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});