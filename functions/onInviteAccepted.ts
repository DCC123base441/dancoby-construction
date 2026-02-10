import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const body = await req.json();

        const { event, data, old_data } = body;

        // Only act on updates where status changed to 'accepted'
        if (event?.type !== 'update') {
            return Response.json({ skipped: true, reason: 'not an update event' });
        }

        if (!data || data.status !== 'accepted') {
            return Response.json({ skipped: true, reason: 'status not accepted' });
        }

        if (old_data && old_data.status === 'accepted') {
            return Response.json({ skipped: true, reason: 'already accepted' });
        }

        const email = data.email?.toLowerCase();
        if (!email) {
            return Response.json({ skipped: true, reason: 'no email on invite' });
        }

        // Update the linked User record: set role='user' and name=email
        const users = await base44.asServiceRole.entities.User.filter({ email: email });
        for (const u of users) {
            await base44.asServiceRole.entities.User.update(u.id, {
                role: 'user',
                full_name: email,
                portalRole: data.portalRole || 'employee'
            });
        }

        // Find the EmployeeProfile tied to this invite email
        const profiles = await base44.asServiceRole.entities.EmployeeProfile.filter({ userEmail: email });

        if (profiles.length > 0) {
            // Update existing profile to active
            for (const profile of profiles) {
                await base44.asServiceRole.entities.EmployeeProfile.update(profile.id, { status: 'active' });
            }
            return Response.json({ success: true, updated: profiles.length, usersUpdated: users.length, email });
        }

        // If no profile exists yet and it's an employee invite, create one
        if (data.portalRole === 'employee') {
            await base44.asServiceRole.entities.EmployeeProfile.create({
                userEmail: email,
                email: email,
                position: 'New Employee',
                status: 'active'
            });
            return Response.json({ success: true, created: true, usersUpdated: users.length, email });
        }

        return Response.json({ success: true, usersUpdated: users.length, reason: 'user updated, no employee profile action needed' });

    } catch (error) {
        console.error('onInviteAccepted error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});