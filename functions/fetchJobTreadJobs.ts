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

    // Build where clause for search only (status filtered post-fetch)
    const jobsInput = {
      size: 50,
      sortBy: [{ field: "name", order: "asc" }],
    };
    if (searchTerm) {
      jobsInput.where = ["name", "~*", searchTerm];
    }
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
                      location: {
                        name: {},
                      },
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
      console.error("JobTread error:", errorText);
      return Response.json({ error: `JobTread API error: ${response.status}`, details: errorText }, { status: 502 });
    }

    const data = await response.json();
    
    // Navigate through the nested structure
    const memberships = data?.currentGrant?.user?.memberships?.nodes || [];
    const org = memberships[0]?.organization;
    const allJobs = org?.jobs?.nodes || [];
    const nextPage = org?.jobs?.nextPage || null;

    // Only return active jobs (not closed)
    const jobs = allJobs.filter(j => j.status !== 'closed');

    return Response.json({ jobs, nextPage });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});