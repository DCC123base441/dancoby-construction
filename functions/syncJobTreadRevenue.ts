import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import moment from 'npm:moment';

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

  const currentYear = new Date().getFullYear();
  const startOfYear = `${currentYear}-01-01T00:00:00Z`;
  const endOfYear = `${currentYear}-12-31T23:59:59Z`;

  try {
    // Query JobTread for Customer Orders closed this year
    const query = {
      query: {
        customerOrders: {
          nodes: {
            id: {},
            price: {}, 
            closedAt: {},
            status: {}
          },
          filter: {
            closedAt: {
              gte: startOfYear,
              lte: endOfYear
            },
            status: {
              in: ['submitted', 'approved', 'pending']
            },
            includedInBudget: {
              eq: true
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
    const orders = data?.customerOrders?.nodes || [];

    let totalRevenue = 0;
    const quarterlyRevenue = { q1: 0, q2: 0, q3: 0, q4: 0 };

    for (const order of orders) {
      const price = parseFloat(order.price || 0);
      totalRevenue += price;

      const month = moment(order.closedAt).month(); // 0-11
      if (month < 3) quarterlyRevenue.q1 += price;
      else if (month < 6) quarterlyRevenue.q2 += price;
      else if (month < 9) quarterlyRevenue.q3 += price;
      else quarterlyRevenue.q4 += price;
    }

    // Update CompanyGoal entity
    const existingGoals = await base44.entities.CompanyGoal.filter({ year: currentYear });
    let goalRecord;

    if (existingGoals.length > 0) {
      goalRecord = existingGoals[0];
      await base44.entities.CompanyGoal.update(goalRecord.id, {
        currentRevenue: totalRevenue,
        quarterlyBreakdown: quarterlyRevenue,
        lastUpdated: new Date().toISOString()
      });
    } else {
      // Create new with default target
      goalRecord = await base44.entities.CompanyGoal.create({
        year: currentYear,
        currentRevenue: totalRevenue,
        targetRevenue: 2500000, // Default target
        quarterlyBreakdown: quarterlyRevenue,
        lastUpdated: new Date().toISOString()
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      count: orders.length,
      revenue: totalRevenue,
      quarterly: quarterlyRevenue,
      goal: goalRecord
    }), { status: 200 });

  } catch (error) {
    console.error("Sync Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}