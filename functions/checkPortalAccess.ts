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

        // Admins always have access
        if (user.role === 'admin') {
            return Response.json({ authorized: true, role: 'admin' });
        }

        // If user has a customer portalRole, send them to customer portal
        const existingRole = user.portalRole || user.data?.portalRole;
        if (existingRole === 'customer') {
            return Response.json({ authorized: true, role: 'customer' });
        }

        // All non-admin, non-customer users are treated as employees by default
        // No portalRole assignment needed — they just get in
        return Response.json({ authorized: true, role: 'employee' });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});