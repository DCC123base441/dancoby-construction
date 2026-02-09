import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (user?.role !== 'admin') {
            return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
        }

        const { email, role = 'user', portalRole = 'employee', appUrl } = await req.json();
        
        if (!email) {
            return Response.json({ error: 'Email is required' }, { status: 400 });
        }

        // We do NOT call inviteUser here anymore, to allow the user to Sign Up themselves.
        // The PortalLogin page will handle assigning the role upon first login if a profile/invite exists.

        // Check if user already exists just to be safe (optional logging)
        const users = await base44.asServiceRole.entities.User.filter({ email });
        if (users.length > 0) {
            // If they exist, we can try to update their role now
            await base44.asServiceRole.entities.User.update(users[0].id, { portalRole });
        }

        // Log invite history
        await base44.asServiceRole.entities.InviteHistory.create({
            email,
            portalRole,
            invitedBy: user.email,
            status: 'pending',
        });

        // Send a custom welcome email with direct portal link
        const portalLabel = portalRole === 'customer' ? 'Customer Portal' : 'Employee Portal';
        const portalUrl = appUrl ? `${appUrl}/PortalLogin` : 'PortalLogin';

        await base44.asServiceRole.integrations.Core.SendEmail({
            to: email,
            from_name: 'Dancoby Construction',
            subject: `Welcome to the Dancoby ${portalLabel}!`,
            body: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #1e293b; font-size: 24px; margin-bottom: 8px;">Welcome to Dancoby Construction!</h1>
                        <p style="color: #64748b; font-size: 14px;">You've been invited to join the ${portalLabel}</p>
                    </div>
                    <div style="background: #fffbeb; border: 1px solid #fcd34d; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                        <p style="color: #92400e; font-size: 16px; margin-bottom: 16px;">
                            Click the button below to access your portal. Please <strong>Sign Up</strong> to create your account.
                        </p>
                        <a href="${portalUrl}" style="display: inline-block; background: #d97706; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                            Sign Up & Open Portal →
                        </a>
                    </div>
                    <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                        If the button doesn't work, copy and paste this link into your browser:<br/>
                        <a href="${portalUrl}" style="color: #d97706;">${portalUrl}</a>
                    </p>
                </div>
            `
        });

        return Response.json({ success: true, message: `Invited ${email} as ${portalRole}` });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});