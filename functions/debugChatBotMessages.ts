import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        const messages = await base44.entities.ChatBotMessage.list();
        
        return Response.json({ 
            count: messages.length,
            messages
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});