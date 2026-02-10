import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jobTreadKey = Deno.env.get("JOBTREAD_GRANT_KEY");
    if (!jobTreadKey) {
      return Response.json({ error: 'JOBTREAD_GRANT_KEY not configured' }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const searchTerm = body.search || '';
    const page = body.page || null;

    // Build where clause for search
    let whereClause = undefined;
    if (searchTerm) {
      whereClause = ["name", "~*", searchTerm];
    }

    const jobsInput = {
      size: 50,
      sortBy: [{ field: "createdAt", order: "desc" }],
    };
    if (whereClause) jobsInput.where = whereClause;
    if (page) jobsInput.page = page;

    const query = {
      query: {
        $: { grantKey: jobTreadKey },
        currentGrant: {
          user: {
            memberships: {
              nodes: {
                organization: {
                  id: {},
                  jobs: {
                    $: jobsInput,
                    nextPage: {},
                    nodes: {
                      id: {},
                      name: {},
                      status: {},
                      createdAt: {},
                    }
                  }
                }
              }
            }
          }
        }
      }
    };

    const response = await fetch('https://api.jobtread.com/pave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json({ error: `JobTread API error: ${response.status}` }, { status: 502 });
    }

    const data = await response.json();
    
    // Navigate through the nested structure
    const memberships = data?.currentGrant?.user?.memberships?.nodes || [];
    const org = memberships[0]?.organization;
    const jobs = org?.jobs?.nodes || [];
    const nextPage = org?.jobs?.nextPage || null;

    return Response.json({ jobs, nextPage });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});