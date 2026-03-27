import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Get client IP from headers
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                   req.headers.get('x-real-ip') || 
                   'unknown';
        
        const { action } = await req.json();
        
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const spinKey = `spin_${ip}_${monthKey}`;
        
        if (action === 'check') {
            // Check if this IP has spun today
            const existingSpins = await base44.asServiceRole.entities.SiteVisit.filter({
                page: spinKey
            });
            
            return Response.json({ 
                canSpin: existingSpins.length === 0,
                ip: ip
            });
        } else if (action === 'record') {
            // Record the spin
            await base44.asServiceRole.entities.SiteVisit.create({
                page: spinKey,
                userAgent: req.headers.get('user-agent') || '',
                referrer: 'spin-wheel'
            });
            
            return Response.json({ success: true });
        }
        
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});