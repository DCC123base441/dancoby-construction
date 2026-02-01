import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // 1. Create a message
        const created = await base44.entities.ChatBotMessage.create({
            content: "Debug Message " + Date.now(),
            target_page: "all",
            is_page_welcome: false
        });
        
        console.log("Created:", created);

        // 2. Update the message
        const updated = await base44.entities.ChatBotMessage.update(created.id, {
            target_page: "/Projects",
            is_page_welcome: true
        });
        
        console.log("Updated:", updated);

        // 3. Fetch it back to verify
        const fetched = await base44.entities.ChatBotMessage.get(created.id);
        console.log("Fetched:", fetched);

        // Cleanup
        await base44.entities.ChatBotMessage.delete(created.id);

        return Response.json({ 
            success: true, 
            created, 
            updated, 
            fetched,
            match: fetched.target_page === "/Projects" && fetched.is_page_welcome === true
        });
    } catch (error) {
        return Response.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
});