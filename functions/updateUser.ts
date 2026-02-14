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

    const updated = await base44.asServiceRole.entities.User.update(userId, updateData);

    return Response.json({ success: true, user: updated });
  } catch (error) {
    console.error('Error updating user:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});