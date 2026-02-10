import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        // Check auth
        let user;
        try {
            user = await base44.auth.me();
        } catch (e) {
            return Response.json({ authorized: false });
        }
        
        if (!user) return Response.json({ authorized: false });

        // If already has role, return it (portalRole may be at top level or inside data)
        const existingRole = user.portalRole || user.data?.portalRole;
        if (existingRole === 'employee' || existingRole === 'customer') {
            return Response.json({ authorized: true, role: existingRole });
        }

        // Search for invites/profiles
        const email = user.email;
        const emailLower = email.toLowerCase();
        
        // Check InviteHistory (try both exact and lower)
        const invites1 = await base44.asServiceRole.entities.InviteHistory.filter({ email: email });
        const invites2 = await base44.asServiceRole.entities.InviteHistory.filter({ email: emailLower });
        const invite = invites1[0] || invites2[0];

        if (invite) {
            // Found invite -> Assign Role
            await base44.asServiceRole.entities.User.update(user.id, { portalRole: invite.portalRole });
            // Mark invite as accepted
            await base44.asServiceRole.entities.InviteHistory.update(invite.id, { status: 'accepted' });
            return Response.json({ authorized: true, role: invite.portalRole, assignedNow: true });
        }

        // Check EmployeeProfile
        // Try exact match
        let profiles = await base44.asServiceRole.entities.EmployeeProfile.filter({ userEmail: email });
        if (profiles.length === 0 && email !== emailLower) {
             profiles = await base44.asServiceRole.entities.EmployeeProfile.filter({ userEmail: emailLower });
        }

        if (profiles.length > 0) {
            // Found profile -> Assign Employee
             await base44.asServiceRole.entities.User.update(user.id, { portalRole: 'employee' });
             return Response.json({ authorized: true, role: 'employee', assignedNow: true });
        }

        return Response.json({ authorized: true, role: null });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});