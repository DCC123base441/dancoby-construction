import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { Resend } from 'npm:resend@4.0.0';

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
        const visualizationPrompt = `Photorealistic interior design of a ${roomType}, chic stylish finishes, contemporary elegance, sophisticated, ${finishLevel || 'modern'} style, ${priority === 'Luxury Finishes & Design' ? 'luxury high-end materials' : 'clean modern aesthetic'}, renovated, professional photography, 8k, highly detailed, interior architecture, bright lighting`;
        
        // REimagineHome API Implementation
        const apiKey = Deno.env.get("REIMAGINEHOME_API_KEY");
        if (!apiKey) throw new Error("REIMAGINEHOME_API_KEY not set");

        // 1. Initiate Generation
        const generateResponse = await fetch('https://api.reimaginehome.ai/v1/generate_image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey
            },
            body: JSON.stringify({
                image_url: imageUrl,
                prompt: visualizationPrompt + ", keep exact layout, preserve existing furniture placement, maintain room structure, do not move walls or windows, photorealistic, architectural accuracy",
                negative_prompt: "changing layout, moving furniture, removing furniture, adding random objects, distorted perspective, blurry, low quality, bad anatomy, watermark, text, signature, ugly, lowres, glitchy, artifacts, mirrored, flipped, inverted, resizing room, wrong scale",
                control_strength: 0.95
            })
        });

        if (!generateResponse.ok) {
            const errorText = await generateResponse.text();
            throw new Error(`API Error: ${generateResponse.status} ${errorText}`);
        }

        const generateData = await generateResponse.json();
        const jobId = generateData?.data?.job_id;

        if (!jobId) throw new Error("No job_id returned from REimagineHome");

        // 2. Poll for Results
        let attempts = 0;
        const maxAttempts = 30; // 60 seconds max
        
        while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const statusResponse = await fetch(`https://api.reimaginehome.ai/v1/generate_image/${jobId}`, {
                method: 'GET',
                headers: {
                    'api-key': apiKey
                }
            });
            
            if (statusResponse.ok) {
                const statusData = await statusResponse.json();
                const jobStatus = statusData?.data?.job_status;
                
                if (jobStatus === 'done') {
                    // Assuming structure based on docs (create_mask had masks array, generate_image likely has result_url or similar)
                    // We'll look for result_url or images array
                    const resultData = statusData.data;
                    visualizationUrl = resultData.result_url || (resultData.images && resultData.images[0]?.url);
                    break;
                } else if (jobStatus === 'error') {
                    throw new Error("Job failed with status: error");
                }
            }
            attempts++;
        }

      } catch (vizError) {
        console.log('Visualization generation failed:', vizError.message);
        // Fallback to old method if Replicate fails (e.g. if token invalid)
        try {
             const visualizationPrompt = `Generate a photorealistic interior renovation visualization. Transform this ${roomType} space into a beautifully renovated ${finishLevel || 'mid-range'} ${roomType.toLowerCase()}.`;
             const visualization = await base44.asServiceRole.integrations.Core.GenerateImage({
                prompt: visualizationPrompt,
                existing_image_urls: [imageUrl]
              });
              visualizationUrl = visualization?.url;
        } catch (fallbackError) {
            console.log('Fallback visualization failed:', fallbackError.message);
        }
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

    // Apply multipliers (with 50% reduction as requested)
    const costReduction = 0.5;
    const materialsCost = Math.round(baseMaterialsCost * combinedMultiplier * costReduction);
    const laborCost = Math.round(baseLaborCost * combinedMultiplier * costReduction);
    const permitsCost = Math.round(basePermitsCost * costReduction);
    const designCost = Math.round(baseDesignCost * costReduction);

    // Calculate finish adjustments from specific selections
    let finishAdjustment = 0;
    if (selectedFinishes && Object.keys(selectedFinishes).length > 0) {
      Object.values(selectedFinishes).forEach(finish => {
        finishAdjustment += finishCostAdjustments[finish] || 0;
      });
      // Apply location factor to finish upgrades (with 50% reduction)
      finishAdjustment = Math.round(finishAdjustment * locationFactor * 0.5);
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

    // Save estimate to database
    try {
        await base44.asServiceRole.entities.Estimate.create({
            roomType: roomType,
            userEmail: userAnswers?.email,
            userName: userAnswers?.name,
            originalImageUrl: imageUrl,
            visualizedImageUrl: visualizationUrl,
            selectedFinishes: selectedFinishes,
            estimatedCost: {
                min: totalMin,
                max: totalMax,
                breakdown: {
                    materials: materialsCost + finishAdjustment,
                    labor: laborCost,
                    design: designCost,
                    permits: permitsCost,
                    contingency: contingency
                }
            },
            squareFootageEstimate: sqft,
            status: 'sent',
            generationPrompt: estimationPrompt
        });
    } catch (dbError) {
        console.error('Failed to save estimate to database:', dbError);
    }

    // Send email with estimate results
    const userEmail = userAnswers?.email;
    const userName = userAnswers?.name || 'Valued Customer';
    
    if (userEmail) {
      try {
        const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #dc2626; color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px; background: #f9f9f9; }
    .estimate-box { background: linear-gradient(135deg, #fef2f2, #fff7ed); border: 2px solid #dc2626; border-radius: 12px; padding: 25px; margin: 20px 0; text-align: center; }
    .estimate-range { font-size: 32px; font-weight: bold; color: #dc2626; }
    .breakdown { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .breakdown-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .breakdown-item:last-child { border-bottom: none; }
    .details { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .detail-row { padding: 8px 0; }
    .label { color: #666; }
    .value { font-weight: 600; }
    .cta { text-align: center; margin: 30px 0; }
    .cta a { background: #dc2626; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .disclaimer { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Renovation Estimate</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Dancoby Construction</p>
    </div>
    
    <div class="content">
      <p>Hi ${userName},</p>
      <p>Thank you for using our online estimator! Based on your inputs, here's your preliminary renovation estimate:</p>
      
      <div class="estimate-box">
        <p style="margin: 0 0 10px 0; color: #666;">Estimated Budget Range</p>
        <div class="estimate-range">$${totalMin.toLocaleString()} - $${totalMax.toLocaleString()}</div>
        <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">Includes 10% contingency</p>
      </div>
      
      <div class="details">
        <h3 style="margin-top: 0;">Project Details</h3>
        <div class="detail-row"><span class="label">Project Type:</span> <span class="value">${roomType}</span></div>
        <div class="detail-row"><span class="label">Property Type:</span> <span class="value">${propertyType || 'Not specified'}</span></div>
        <div class="detail-row"><span class="label">Square Footage:</span> <span class="value">${sqft} sq ft</span></div>
        <div class="detail-row"><span class="label">Finish Level:</span> <span class="value">${finishLevel || 'Mid-range'}</span></div>
        <div class="detail-row"><span class="label">Location:</span> <span class="value">${location || 'NYC Area'}</span></div>
        <div class="detail-row"><span class="label">Est. Timeline:</span> <span class="value">${estimatedWeeks} weeks</span></div>
      </div>
      
      <div class="breakdown">
        <h3 style="margin-top: 0;">Cost Breakdown</h3>
        <div class="breakdown-item"><span>Materials & Finishes</span><span>$${(materialsCost + finishAdjustment).toLocaleString()}</span></div>
        <div class="breakdown-item"><span>Labor & Installation</span><span>$${laborCost.toLocaleString()}</span></div>
        <div class="breakdown-item"><span>Design & Planning</span><span>$${designCost.toLocaleString()}</span></div>
        <div class="breakdown-item"><span>Permits & Inspections</span><span>$${permitsCost.toLocaleString()}</span></div>
        <div class="breakdown-item"><span>Contingency (10%)</span><span>$${contingency.toLocaleString()}</span></div>
      </div>
      
      <div class="disclaimer">
        <strong>⚠️ Important:</strong> This is a preliminary estimate based on the information provided. Actual costs may vary based on site conditions, final material selections, permit requirements, and other factors discovered during detailed planning. Schedule a free consultation for an accurate quote.
      </div>
      
      <div class="cta">
        <a href="https://dancoby.com/Contact">Schedule Free Consultation</a>
      </div>
      
      <p>Questions? Reply to this email or call us at <strong>(516) 684-9766</strong>.</p>
      
      <p>Best regards,<br>The Dancoby Construction Team</p>
    </div>
    
    <div class="footer">
      <p>Dancoby Construction | Brooklyn, NY<br>
      <a href="https://dancoby.com" style="color: #dc2626;">dancoby.com</a> | (516) 684-9766</p>
    </div>
  </div>
</body>
</html>`;

        const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
        await resend.emails.send({
          from: 'Dancoby Construction <onboarding@resend.dev>',
          to: userEmail,
          subject: `Your ${roomType} Estimate: $${totalMin.toLocaleString()} - $${totalMax.toLocaleString()}`,
          html: emailBody
        });
        console.log('Estimate email sent to:', userEmail);
      } catch (emailError) {
        console.error('Failed to send estimate email:', emailError.message);
      }
    }

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