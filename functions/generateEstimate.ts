import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Allow unauthenticated access for public estimator tool
    // Use service role for integrations
    const body = await req.json();
    const { imageUrl, roomType, selectedFinishes, userAnswers } = body;

    // Extract user-provided info
    const userSqFt = userAnswers?.squareFootage;
    const finishLevel = userAnswers?.finishLevel;
    const currentCondition = userAnswers?.currentCondition;
    const propertyType = userAnswers?.propertyType;
    const location = userAnswers?.location;
    const priority = userAnswers?.priority;
    const timeline = userAnswers?.timeline;

    // Parse user square footage to numeric range
    const sqftRanges = {
      'Under 100 sq ft': { min: 50, max: 100 },
      '100-250 sq ft': { min: 100, max: 250 },
      '250-500 sq ft': { min: 250, max: 500 },
      '500-1,000 sq ft': { min: 500, max: 1000 },
      '1,000-2,000 sq ft': { min: 1000, max: 2000 },
      '2,000+ sq ft': { min: 2000, max: 3500 }
    };
    const userSqftRange = sqftRanges[userSqFt] || { min: 150, max: 300 };

    // Generate prompt for AI to estimate square footage and analyze space
    const estimationPrompt = `Analyze this ${roomType} renovation photo for a ${propertyType || 'residential'} property.

User-provided context:
- Approximate square footage selected: ${userSqFt || 'Not provided'} (range: ${userSqftRange.min}-${userSqftRange.max} sqft)
- Current condition: ${currentCondition || 'Not specified'}
- Finish level desired: ${finishLevel || 'Mid-range'}
- Location: ${location || 'NYC area'}
- Priority: ${priority || 'General renovation'}

Provide:
1. Refined square footage estimate within the user's selected range
2. Room condition assessment
3. Complexity factors that affect cost
4. Estimated project timeline in weeks

Respond with JSON:
{
  "squareFootage": <number between ${userSqftRange.min} and ${userSqftRange.max}>,
  "complexity": "low|medium|high",
  "condition": "good|fair|poor",
  "estimatedWeeks": <number>,
  "notes": "<brief description of the space and renovation scope>"
}`;

    // Get square footage estimate from AI using service role
    const sqftEstimate = await base44.asServiceRole.integrations.Core.InvokeLLM({
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

        const visualization = await base44.asServiceRole.integrations.Core.GenerateImage({
          prompt: visualizationPrompt,
          existing_image_urls: [imageUrl]
        });
        visualizationUrl = visualization?.url;
      } catch (vizError) {
        console.log('Visualization generation failed:', vizError.message);
      }
    }

    // Updated cost database with 2024-2025 NYC pricing (per square foot)
    const costDatabase = {
      'Kitchen Renovation': {
        materials: { perSqft: 200, base: 8000 },
        labor: { perSqft: 150, base: 6000 },
        permits: { base: 1500 },
        design: { base: 3000 }
      },
      'Bathroom Remodeling': {
        materials: { perSqft: 185, base: 4000 },
        labor: { perSqft: 140, base: 3000 },
        permits: { base: 800 },
        design: { base: 1500 }
      },
      'Whole Home Renovation': {
        materials: { perSqft: 150, base: 15000 },
        labor: { perSqft: 100, base: 12000 },
        permits: { base: 5000 },
        design: { base: 8000 }
      },
      'Basement Remodel': {
        materials: { perSqft: 85, base: 5000 },
        labor: { perSqft: 65, base: 4000 },
        permits: { base: 1800 },
        design: { base: 2000 }
      },
      'Brownstone Restoration': {
        materials: { perSqft: 250, base: 20000 },
        labor: { perSqft: 200, base: 15000 },
        permits: { base: 4000 },
        design: { base: 6000 }
      },
      'Addition/Extension': {
        materials: { perSqft: 220, base: 30000 },
        labor: { perSqft: 180, base: 25000 },
        permits: { base: 10000 },
        design: { base: 12000 }
      }
    };

    // Finish level multipliers
    const finishLevelMultiplier = {
      'Standard / Builder-grade': 0.75,
      'Mid-range / Custom': 1.0,
      'High-End / Luxury': 1.6
    };

    // Location multipliers (NYC areas)
    const locationMultiplier = {
      'Manhattan, NY': 1.35,
      'Brooklyn, NY': 1.18,
      'Queens, NY': 1.0,
      'Bronx, NY': 0.92,
      'Staten Island, NY': 0.90,
      'Long Island, NY': 1.08,
      'Other NYC Area': 1.0
    };

    // Priority multipliers - adjust cost based on project priority
    const priorityMultiplier = {
      'Functionality & Layout': 1.0,
      'Luxury Finishes & Design': 1.25,
      'Expanding Space': 1.15,
      'Energy Efficiency': 1.1,
      'Boosting Home Value': 1.05,
      'Complete Modernization': 1.15
    };

    // Timeline multipliers - rush jobs cost more
    const timelineMultiplier = {
      'ASAP (Next 30 days)': 1.25,
      '1-3 months': 1.1,
      '3-6 months': 1.0,
      '6-12 months': 0.95,
      'Just Researching': 1.0
    };

    // Complexity multipliers
    const complexityMultiplier = {
      low: 0.88,
      medium: 1.0,
      high: 1.3
    };

    // Condition adjustment from user input
    const conditionFromUser = {
      'Good - Minor updates needed': 0.8,
      'Fair - Moderate work required': 1.0,
      'Poor - Major renovation needed': 1.3,
      'Gutted/Empty - Full build-out': 1.45
    };

    // AI condition mapping
    const conditionMultiplier = {
      good: 0.85,
      fair: 1.0,
      poor: 1.25
    };

    // Granular finish cost adjustments (based on 2024-2025 market prices)
    const finishCostAdjustments = {
      // Kitchen Countertops
      'Laminate': 0,
      'Butcher Block': 1500,
      'Granite': 4000,
      'Quartz': 6000,
      'Marble': 12000,
      // Kitchen Cabinetry
      'Stock Cabinets': 0,
      'Semi-Custom': 5000,
      'Custom Cabinets': 15000,
      'High-End Custom': 35000,
      // Flooring
      'Vinyl Plank': 0,
      'Luxury Vinyl Plank': 500,
      'Luxury Vinyl Tile': 500,
      'Ceramic Tile': 1000,
      'Porcelain Tile': 2000,
      'Engineered Hardwood': 3500,
      'Solid Hardwood': 6000,
      'Premium Wide Plank': 10000,
      'Refinish Existing': 1500,
      'Reclaimed/Antique': 15000,
      // Appliances
      'Budget Package': 0,
      'Mid-Range Package': 5000,
      'Premium Package': 15000,
      'Luxury Package': 40000,
      // Bathroom Vanity
      'Prefab Vanity': 0,
      'Semi-Custom Vanity': 1200,
      'Custom Vanity + Quartz': 3500,
      'Custom + Marble Top': 7000,
      // Bathroom Tile
      'Natural Stone': 3000,
      'Large Format/Custom': 5000,
      // Fixtures
      'Builder Grade': 0,
      'Mid-Range': 1500,
      'Premium': 4000,
      'Designer/Luxury': 10000,
      // Shower/Tub
      'Prefab Shower': 0,
      'Tile Shower': 3000,
      'Custom Tile Shower': 7000,
      'Frameless Glass + Custom': 15000,
      // Paint
      'Standard Paint': 0,
      'Premium Paint': 1500,
      'Designer Colors + Trim': 4000,
      'Custom Finishes + Wallpaper': 8000,
      // Lighting
      'Basic Fixtures': 0,
      'Mid-Range Fixtures': 4000,
      'Designer Fixtures': 12000,
      'Custom/Luxury': 30000,
      // Trim & Millwork
      'Standard Trim': 0,
      'Crown Molding + Baseboards': 3000,
      'Custom Millwork': 8000,
      'Ornate/Historical': 20000,
      'Simple Restoration': 5000,
      'Period-Accurate': 15000,
      'Custom Ornate': 30000,
      'Historical Replication': 60000,
      // Basement specific
      'Epoxy Coating': 0,
      'Polished Concrete': 1500,
      'Basic Drywall': 0,
      'Drywall + Insulation': 2000,
      'Drop Ceiling': 1500,
      'Custom Ceiling + Soundproofing': 5000,
      'Half Bath Basic': 6000,
      'Half Bath Mid-Range': 12000,
      'Full Bath Standard': 18000,
      'Full Bath Premium': 30000,
      // Windows & Doors
      'Standard Replacement': 0,
      'Wood Clad': 3000,
      'Custom Wood': 8000,
      'Historical Restoration': 20000,
      // Facade
      'Basic Repointing': 0,
      'Full Repointing + Repair': 5000,
      'Brownstone Patching': 12000,
      'Full Facade Restoration': 30000,
      // Addition Foundation
      'Basic Slab': 0,
      'Crawl Space': 5000,
      'Full Basement': 20000,
      'Complex/Underpinning': 50000,
      // Exterior
      'Vinyl Siding': 0,
      'Fiber Cement': 4000,
      'Brick Veneer': 12000,
      'Stone/Custom': 25000,
      // Interior Finish Level
      'Builder Grade': 0,
      'High-End': 25000,
      'Luxury': 60000
    };

    const costs = costDatabase[roomType] || costDatabase['Whole Home Renovation'];
    const sqft = sqftEstimate.squareFootage || Math.round((userSqftRange.min + userSqftRange.max) / 2);
    const complexFactor = complexityMultiplier[sqftEstimate.complexity] || 1.0;
    const conditionFactor = conditionFromUser[currentCondition] || conditionMultiplier[sqftEstimate.condition] || 1.0;
    const finishFactor = finishLevelMultiplier[finishLevel] || 1.0;
    const locationFactor = locationMultiplier[location] || 1.0;
    const priorityFactor = priorityMultiplier[priority] || 1.0;
    const timelineFactor = timelineMultiplier[timeline] || 1.0;

    // Combined multiplier (capped to reasonable range)
    const combinedMultiplier = Math.min(complexFactor * conditionFactor * finishFactor * locationFactor * priorityFactor * timelineFactor, 3.0);

    // Calculate base costs
    const baseMaterialsCost = costs.materials.perSqft * sqft + costs.materials.base;
    const baseLaborCost = costs.labor.perSqft * sqft + costs.labor.base;
    const basePermitsCost = costs.permits.base * (conditionFactor > 1.2 ? 1.3 : 1.0);
    const baseDesignCost = costs.design.base * finishFactor;

    // Apply multipliers
    const materialsCost = Math.round(baseMaterialsCost * combinedMultiplier);
    const laborCost = Math.round(baseLaborCost * combinedMultiplier);
    const permitsCost = Math.round(basePermitsCost);
    const designCost = Math.round(baseDesignCost);

    // Calculate finish adjustments from specific selections
    let finishAdjustment = 0;
    if (selectedFinishes && Object.keys(selectedFinishes).length > 0) {
      Object.values(selectedFinishes).forEach(finish => {
        finishAdjustment += finishCostAdjustments[finish] || 0;
      });
      // Apply location factor to finish upgrades
      finishAdjustment = Math.round(finishAdjustment * locationFactor);
    }

    const subtotal = materialsCost + laborCost + permitsCost + designCost + finishAdjustment;
    const contingencyRate = 0.10; // 10% contingency for tighter range
    const contingency = Math.round(subtotal * contingencyRate);

    const totalBase = subtotal + contingency;
    // Tighter range: -5% to +12%
    const totalMin = Math.round(totalBase * 0.95);
    const totalMax = Math.round(totalBase * 1.12);

    // Adjusted timeline based on all factors
    let estimatedWeeks = sqftEstimate.estimatedWeeks || Math.ceil(sqft / 80) + 3;
    if (timeline === 'ASAP (Next 30 days)') estimatedWeeks = Math.max(3, Math.ceil(estimatedWeeks * 0.7));
    if (conditionFactor > 1.2) estimatedWeeks = Math.ceil(estimatedWeeks * 1.25);
    if (complexFactor > 1.2) estimatedWeeks = Math.ceil(estimatedWeeks * 1.2);

    return Response.json({
      squareFootage: sqft,
      complexity: sqftEstimate.complexity,
      condition: sqftEstimate.condition,
      estimatedWeeks,
      visualizationUrl,
      costBreakdown: {
        materials: {
          label: 'Materials & Finishes',
          cost: materialsCost + finishAdjustment,
          percentage: Math.round((materialsCost + finishAdjustment) / totalBase * 100)
        },
        labor: {
          label: 'Labor & Installation',
          cost: laborCost,
          percentage: Math.round(laborCost / totalBase * 100)
        },
        design: {
          label: 'Design & Planning',
          cost: designCost,
          percentage: Math.round(designCost / totalBase * 100)
        },
        permits: {
          label: 'Permits & Inspections',
          cost: permitsCost,
          percentage: Math.round(permitsCost / totalBase * 100)
        },
        contingency: {
          label: 'Contingency (10%)',
          cost: contingency,
          percentage: 10
        }
      },
      totalMin,
      totalMax,
      notes: sqftEstimate.notes,
      appliedFactors: {
        finishLevel: finishFactor,
        location: locationFactor,
        priority: priorityFactor,
        timeline: timelineFactor,
        complexity: complexFactor,
        condition: conditionFactor
      },
      projectDetails: {
        roomType,
        propertyType,
        finishLevel,
        location,
        priority,
        timeline
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});