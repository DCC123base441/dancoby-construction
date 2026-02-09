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

        // Send a custom welcome email with direct portal link
        const portalLabel = portalRole === 'customer' ? 'Customer Portal' : 'Employee Portal';
        const portalUrl = appUrl ? `${appUrl}/PortalLogin` : 'PortalLogin';

        const emailHtml = `
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

        try {
            const resendApiKey = Deno.env.get('RESEND_API_KEY');
            let sent = false;

            // Try Resend first if key is available
            if (resendApiKey) {
                try {
                    console.log('Attempting to send via Resend API...');
                    const res = await fetch('https://api.resend.com/emails', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${resendApiKey}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            from: 'Dancoby Construction <onboarding@resend.dev>',
                            to: email,
                            subject: `Welcome to the Dancoby ${portalLabel}!`,
                            html: emailHtml
                        })
                    });

                    if (res.ok) {
                        sent = true;
                        console.log('Email sent via Resend');
                    } else {
                        const errorData = await res.json();
                        console.warn('Resend API returned error, falling back to system email:', errorData);
                    }
                } catch (resendError) {
                    console.warn('Resend attempt failed, falling back to system email:', resendError);
                }
            }

            // Fallback to default system email
            if (!sent) {
                console.log('Sending via system email...');
                await base44.asServiceRole.integrations.Core.SendEmail({
                    to: email,
                    from_name: 'Dancoby Construction',
                    subject: `Welcome to the Dancoby ${portalLabel}!`,
                    body: emailHtml
                });
            }
        } catch (error) {
            console.error('Failed to send invite email:', error);
            throw new Error('Failed to send email. Invite not created.');
        }

        // Log invite history ONLY if email was sent successfully
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