import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const toTitleCase = (str) => {
      if (!str) return '';
      return String(str)
        .trim()
        .replace(/[._]/g, ' ')
        .split(/\s+/)
        .map((part) => part
          .split('-')
          .map((s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s))
          .join('-')
        )
        .join(' ');
    };

    const users = await base44.asServiceRole.entities.User.list();
    let updated = 0;
    let skipped = 0;

    await Promise.all(users.map(async (u) => {
      const baseName = (u.full_name && String(u.full_name).trim())
        ? String(u.full_name)
        : (u.email ? String(u.email).split('@')[0] : '');
      const computed = toTitleCase(baseName);

      if (!computed) { skipped++; return; }
      if (u.displayName && u.displayName === computed) { skipped++; return; }

      await base44.asServiceRole.entities.User.update(u.id, { displayName: computed });
      updated++;
    }));

    return Response.json({ success: true, total: users.length, updated, skipped });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});