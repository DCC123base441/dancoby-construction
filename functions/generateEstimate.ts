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

    // Cost database by room type and category (NYC area pricing)
    const costDatabase = {
      'Kitchen Renovation': {
        materials: { perSqft: 175, base: 8000 },
        labor: { perSqft: 125, base: 5000 },
        permits: { base: 1200 },
        design: { base: 2500 }
      },
      'Bathroom Remodeling': {
        materials: { perSqft: 150, base: 5000 },
        labor: { perSqft: 100, base: 3500 },
        permits: { base: 600 },
        design: { base: 1500 }
      },
      'Whole Home Renovation': {
        materials: { perSqft: 125, base: 20000 },
        labor: { perSqft: 95, base: 15000 },
        permits: { base: 5000 },
        design: { base: 8000 }
      },
      'Basement Remodel': {
        materials: { perSqft: 100, base: 6000 },
        labor: { perSqft: 80, base: 4000 },
        permits: { base: 1500 },
        design: { base: 2000 }
      },
      'Brownstone Restoration': {
        materials: { perSqft: 225, base: 15000 },
        labor: { perSqft: 175, base: 10000 },
        permits: { base: 3500 },
        design: { base: 5000 }
      },
      'Addition/Extension': {
        materials: { perSqft: 200, base: 25000 },
        labor: { perSqft: 150, base: 20000 },
        permits: { base: 8000 },
        design: { base: 10000 }
      }
    };

    // Finish level multipliers
    const finishLevelMultiplier = {
      'Standard / Builder-grade': 0.8,
      'Mid-range / Custom': 1.0,
      'High-End / Luxury': 1.5
    };

    // Location multipliers (NYC areas tend to be more expensive)
    const locationMultiplier = {
      'Manhattan, NY': 1.3,
      'Brooklyn, NY': 1.15,
      'Queens, NY': 1.0,
      'Bronx, NY': 0.95,
      'Staten Island, NY': 0.95,
      'Other NYC Area': 1.0
    };

    // Complexity multipliers
    const complexityMultiplier = {
      low: 0.85,
      medium: 1.0,
      high: 1.35
    };

    // Condition adjustment from user input
    const conditionFromUser = {
      'Good - Minor updates needed': 0.85,
      'Fair - Moderate work required': 1.0,
      'Poor - Major renovation needed': 1.25,
      'Gutted/Empty - Full build-out': 1.4
    };

    // AI condition mapping
    const conditionMultiplier = {
      good: 0.9,
      fair: 1.0,
      poor: 1.25
    };

    const costs = costDatabase[roomType] || costDatabase['Whole Home Renovation'];
    const sqft = sqftEstimate.squareFootage || 200;
    const complexFactor = complexityMultiplier[sqftEstimate.complexity] || 1.0;
    const conditionFactor = conditionFromUser[currentCondition] || conditionMultiplier[sqftEstimate.condition] || 1.0;
    const finishFactor = finishLevelMultiplier[finishLevel] || 1.0;
    const locationFactor = locationMultiplier[location] || 1.0;

    // Calculate costs with all factors
    const materialsCost = Math.round((costs.materials.perSqft * sqft + costs.materials.base) * complexFactor * conditionFactor * finishFactor * locationFactor);
    const laborCost = Math.round((costs.labor.perSqft * sqft + costs.labor.base) * complexFactor * conditionFactor * locationFactor);
    const permitsCost = Math.round(costs.permits.base * conditionFactor);
    const designCost = Math.round((costs.design?.base || 2000) * finishFactor);
    const contingency = Math.round((materialsCost + laborCost + permitsCost + designCost) * 0.15);

    // Finish adjustments for specific selections
    let finishAdjustment = 0;
    if (selectedFinishes) {
      const finishCosts = {
        'Premium Quartz': 3000,
        'Marble': 8000,
        'Granite': 4000,
        'Butcher Block': 1500,
        'Custom Hardwood': 6000,
        'Engineered Hardwood': 3000,
        'Luxury Vinyl': 1500,
        'Porcelain Tile': 2500,
        'Custom Cabinets': 10000,
        'Semi-Custom Cabinets': 5000,
        'Designer Fixtures': 4000,
        'Premium Fixtures': 2500,
        'Standard': 0
      };
      Object.values(selectedFinishes).forEach(finish => {
        finishAdjustment += finishCosts[finish] || 0;
      });
    }

    const subtotal = materialsCost + laborCost + permitsCost + designCost + finishAdjustment;
    const totalWithContingency = subtotal + contingency;
    const totalMin = subtotal;
    const totalMax = Math.round(totalWithContingency * 1.2);

    return Response.json({
      squareFootage: sqft,
      complexity: sqftEstimate.complexity,
      condition: sqftEstimate.condition,
      estimatedWeeks: sqftEstimate.estimatedWeeks || Math.ceil(sqft / 100) + 4,
      visualizationUrl,
      costBreakdown: {
        materials: {
          label: 'Materials & Finishes',
          cost: materialsCost + finishAdjustment,
          percentage: Math.round((materialsCost + finishAdjustment) / totalWithContingency * 100)
        },
        labor: {
          label: 'Labor & Installation',
          cost: laborCost,
          percentage: Math.round(laborCost / totalWithContingency * 100)
        },
        design: {
          label: 'Design & Planning',
          cost: designCost,
          percentage: Math.round(designCost / totalWithContingency * 100)
        },
        permits: {
          label: 'Permits & Inspections',
          cost: permitsCost,
          percentage: Math.round(permitsCost / totalWithContingency * 100)
        },
        contingency: {
          label: 'Contingency (15%)',
          cost: contingency,
          percentage: 15
        }
      },
      totalMin,
      totalMax,
      notes: sqftEstimate.notes,
      projectDetails: {
        roomType,
        propertyType,
        finishLevel,
        location,
        priority
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});