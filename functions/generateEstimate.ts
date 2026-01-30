import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { imageUrl, roomType, selectedFinishes, userAnswers } = body;

    // Extract user-provided info
    const userSqFt = userAnswers?.squareFootage;
    const finishLevel = userAnswers?.finishLevel;
    const currentCondition = userAnswers?.currentCondition;
    const propertyType = userAnswers?.propertyType;
    const location = userAnswers?.location;
    const priority = userAnswers?.priority;

    // Generate prompt for AI to estimate square footage and analyze space
    const estimationPrompt = `Analyze this ${roomType} renovation photo for a ${propertyType || 'residential'} property.

User-provided context:
- Approximate square footage selected: ${userSqFt || 'Not provided'}
- Current condition: ${currentCondition || 'Not specified'}
- Finish level desired: ${finishLevel || 'Mid-range'}
- Location: ${location || 'NYC area'}
- Priority: ${priority || 'General renovation'}

Provide:
1. Refined square footage estimate (consider user input but adjust based on photo if needed)
2. Room condition assessment
3. Complexity factors that affect cost
4. Estimated project timeline in weeks

Respond with JSON:
{
  "squareFootage": <number>,
  "complexity": "low|medium|high",
  "condition": "good|fair|poor",
  "estimatedWeeks": <number>,
  "notes": "<brief description of the space and renovation scope>"
}`;

    // Get square footage estimate from AI
    const sqftEstimate = await base44.integrations.Core.InvokeLLM({
      prompt: estimationPrompt,
      response_json_schema: {
        type: 'object',
        properties: {
          squareFootage: { type: 'number' },
          complexity: { type: 'string' },
          condition: { type: 'string' },
          estimatedWeeks: { type: 'number' },
          notes: { type: 'string' }
        }
      },
      file_urls: imageUrl ? [imageUrl] : []
    });

    // Generate AI visualization if photo provided
    let visualizationUrl = null;
    if (imageUrl) {
      try {
        const visualizationPrompt = `Generate a photorealistic interior renovation visualization. Transform this ${roomType} space into a beautifully renovated ${finishLevel || 'mid-range'} ${roomType.toLowerCase()}. 
        
Style: ${priority === 'Luxury Finishes & Design' ? 'High-end luxury with premium materials' : 'Modern and functional with quality finishes'}. 
Property type: ${propertyType || 'residential'}.

The image should show:
- Updated flooring, lighting, and fixtures
- Modern cabinetry and countertops if applicable
- Fresh paint and updated trim
- The same general room layout but completely renovated
- Professional interior design quality`;

        const visualization = await base44.integrations.Core.GenerateImage({
          prompt: visualizationPrompt,
          existing_image_urls: [imageUrl]
        });
        visualizationUrl = visualization?.url;
      } catch (vizError) {
        console.log('Visualization generation failed:', vizError.message);
      }
    }

    // Cost database by room type and category
    const costDatabase = {
      'Kitchen Renovation': {
        materials: { perSqft: 150, base: 5000 },
        labor: { perSqft: 100, base: 3000 },
        permits: { base: 800 }
      },
      'Bathroom Remodeling': {
        materials: { perSqft: 120, base: 3000 },
        labor: { perSqft: 80, base: 2000 },
        permits: { base: 400 }
      },
      'Interior Renovations': {
        materials: { perSqft: 100, base: 4000 },
        labor: { perSqft: 75, base: 2500 },
        permits: { base: 600 }
      },
      'Brownstone Restoration': {
        materials: { perSqft: 200, base: 10000 },
        labor: { perSqft: 150, base: 5000 },
        permits: { base: 2000 }
      },
      'Townhouse & Apartment': {
        materials: { perSqft: 130, base: 6000 },
        labor: { perSqft: 90, base: 3500 },
        permits: { base: 1200 }
      },
      'Full House Renovation': {
        materials: { perSqft: 110, base: 15000 },
        labor: { perSqft: 85, base: 10000 },
        permits: { base: 3000 }
      }
    };

    // Complexity multipliers
    const complexityMultiplier = {
      low: 0.8,
      medium: 1.0,
      high: 1.3
    };

    // Condition adjustment
    const conditionMultiplier = {
      good: 0.9,
      fair: 1.0,
      poor: 1.3
    };

    const costs = costDatabase[roomType] || costDatabase['Interior Renovations'];
    const sqft = sqftEstimate.squareFootage || 200;
    const complexFactor = complexityMultiplier[sqftEstimate.complexity] || 1.0;
    const conditionFactor = conditionMultiplier[sqftEstimate.condition] || 1.0;

    // Calculate costs
    const materialsCost = Math.round((costs.materials.perSqft * sqft + costs.materials.base) * complexFactor * conditionFactor);
    const laborCost = Math.round((costs.labor.perSqft * sqft + costs.labor.base) * complexFactor * conditionFactor);
    const permitsCost = Math.round(costs.permits.base * conditionFactor);
    const contingency = Math.round((materialsCost + laborCost + permitsCost) * 0.15); // 15% contingency

    const totalMin = materialsCost + laborCost + permitsCost;
    const totalMax = Math.round(totalMin * 1.25); // 25% variance for unknowns

    // Finish adjustments
    let finishAdjustment = 0;
    if (selectedFinishes) {
      const finishCosts = {
        'Premium': 5000,
        'High-End': 8000,
        'Standard': 0,
        'Budget': -2000
      };
      Object.values(selectedFinishes).forEach(finish => {
        finishAdjustment += finishCosts[finish] || 0;
      });
    }

    return Response.json({
      squareFootage: sqft,
      complexity: sqftEstimate.complexity,
      condition: sqftEstimate.condition,
      costBreakdown: {
        materials: {
          label: 'Materials & Finishes',
          cost: materialsCost + finishAdjustment,
          percentage: Math.round((materialsCost + finishAdjustment) / (totalMin + finishAdjustment) * 100)
        },
        labor: {
          label: 'Labor & Installation',
          cost: laborCost,
          percentage: Math.round(laborCost / (totalMin + finishAdjustment) * 100)
        },
        permits: {
          label: 'Permits & Inspections',
          cost: permitsCost,
          percentage: Math.round(permitsCost / (totalMin + finishAdjustment) * 100)
        },
        contingency: {
          label: 'Contingency (15%)',
          cost: contingency,
          percentage: 15
        }
      },
      totalMin: totalMin + finishAdjustment,
      totalMax: totalMax + finishAdjustment,
      notes: sqftEstimate.notes
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});