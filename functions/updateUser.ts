import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { userId, full_name, role } = await req.json();

    if (!userId) {
      return Response.json({ error: 'userId is required' }, { status: 400 });
    }

    const updateData = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (role !== undefined) updateData.role = role;

    console.log(`Updating user ${userId} with data:`, updateData);

    // Use the admin's token to make the update
    const response = await fetch(
      `https://api.base44.com/apps/${Deno.env.get('BASE44_APP_ID')}/entities/User/${userId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': req.headers.get('authorization') || ''
        },
        body: JSON.stringify(updateData)
      }
    );

    console.log(`Response status: ${response.status}`);
    const data = await response.json();
    console.log(`Response data:`, data);
    
    if (!response.ok) {
      console.error('API error:', data);
      return Response.json({ error: data.detail || 'Failed to update user' }, { status: response.status });
    }

    return Response.json({ success: true, user: data });
  } catch (error) {
    console.error('Error updating user:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});