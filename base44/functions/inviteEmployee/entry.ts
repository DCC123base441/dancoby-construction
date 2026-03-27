import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { Resend } from 'npm:resend@3.2.0';

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
        
        const normalizedEmail = email.trim().toLowerCase();

        // Check if user already exists and update their role
        const users = await base44.asServiceRole.entities.User.filter({ email: normalizedEmail });
        const alreadyRegistered = users.length > 0;

        if (alreadyRegistered) {
            await base44.asServiceRole.entities.User.update(users[0].id, { portalRole });
        }

        // Check for existing pending invite to avoid duplicates
        const existingInvites = await base44.asServiceRole.entities.InviteHistory.filter({ email: normalizedEmail, status: 'pending' });
        
        if (existingInvites.length > 0) {
            // Update existing invite instead of creating duplicate
            await base44.asServiceRole.entities.InviteHistory.update(existingInvites[0].id, {
                portalRole,
                invitedBy: user.email,
                status: alreadyRegistered ? 'accepted' : 'pending',
            });
        } else {
            // Create new invite record
            await base44.asServiceRole.entities.InviteHistory.create({
                email: normalizedEmail,
                portalRole,
                invitedBy: user.email,
                status: alreadyRegistered ? 'accepted' : 'pending',
            });
        }

        // Prepare email
        const portalLabel = portalRole === 'customer' ? 'Customer Portal' : 'Employee Portal';
        const portalUrl = appUrl ? `${appUrl}/PortalLogin` : 'PortalLogin';
        const htmlContent = `
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
        `;

        // Try Resend first
        const resendApiKey = Deno.env.get('RESEND_API_KEY');
        if (resendApiKey) {
            try {
                const resend = new Resend(resendApiKey);
                const { error } = await resend.emails.send({
                    from: 'Dancoby Construction <onboarding@resend.dev>',
                    to: [normalizedEmail],
                    subject: `Welcome to the Dancoby ${portalLabel}!`,
                    html: htmlContent
                });

                if (!error) {
                    return Response.json({ success: true, message: `Invited ${normalizedEmail} via Resend` });
                }
                console.error("Resend error:", error);
            } catch (e) {
                console.error("Resend exception:", e);
            }
        }

        // Fallback: standard invite
        try {
            await base44.users.inviteUser(normalizedEmail, role);
            return Response.json({ success: true, message: `Invited ${normalizedEmail} via standard invite` });
        } catch (inviteError) {
            if (alreadyRegistered) {
                return Response.json({ success: true, message: `User ${normalizedEmail} updated` });
            }
            throw inviteError;
        }

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});