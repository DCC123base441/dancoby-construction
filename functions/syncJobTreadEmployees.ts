import { createClientFromRequest } from 'npm:@base44/sdk@0.8.11';

export default async function handler(req) {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();

  if (!user || user.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const jobTreadKey = Deno.env.get("JOBTREAD_GRANT_KEY");
  if (!jobTreadKey) {
    return new Response(JSON.stringify({ error: 'JOBTREAD_GRANT_KEY not configured' }), { status: 500 });
  }

  try {
    // Query JobTread for memberships
    // Based on "find membership" hint and Pave/GraphQL-like structure
    const query = {
      query: {
        memberships: {
          nodes: {
            id: {},
            email: {}, 
            name: {},
            user: {
              email: {},
              name: {}
            }
          }
        }
      }
    };

    const response = await fetch('https://api.jobtread.com/pave', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jobTreadKey}`
      },
      body: JSON.stringify(query)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("JobTread API Error:", errorText);
      return new Response(JSON.stringify({ error: `JobTread API error: ${response.status}`, details: errorText }), { status: 502 });
    }

    const data = await response.json();
    console.log("JobTread Data:", JSON.stringify(data, null, 2));

    const members = data?.memberships?.nodes || [];
    const results = { synced: 0, errors: [], details: [] };

    for (const member of members) {
      // Prioritize user email, then membership email
      const email = member.user?.email || member.email;
      const name = member.user?.name || member.name || "Unknown";
      
      if (!email) {
        results.details.push({ name, status: "skipped_no_email" });
        continue;
      }

      // Check if employee profile exists
      const existingProfiles = await base44.entities.EmployeeProfile.filter({ email });
      
      if (existingProfiles.length > 0) {
        // Update existing? For now, just log match
        results.details.push({ email, name, status: "matched_existing" });
      } else {
        // Create new profile placeholder? 
        // Or just report it found. 
        // User asked to "integrate data", usually implies syncing.
        // Let's create a profile if it matches a registered user, or just leave it for now.
        results.details.push({ email, name, status: "found_in_jobtread" });
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      count: members.length,
      raw_data: members, // Returning raw data for debugging since we are exploring
      results 
    }), { status: 200 });

  } catch (error) {
    console.error("Sync Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}