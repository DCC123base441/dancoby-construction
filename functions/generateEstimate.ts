import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const costDatabase = {
  Countertops: {
    Granite: 50,
    Quartz: 60,
    Marble: 80,
    Laminate: 20,
    'Butcher Block': 45
  },
  Flooring: {
    Hardwood: 8,
    Tile: 6,
    Vinyl: 3,
    Laminate: 4,
    Marble: 12
  },
  Cabinetry: {
    'White Shaker': 100,
    'Dark Walnut': 120,
    'Light Oak': 90,
    Custom: 150,
    'Two-Tone': 130
  },
  Backsplash: {
    'Subway Tile': 25,
    Mosaic: 35,
    Marble: 40,
    Hexagon: 30,
    None: 0
  },
  Fixtures: {
    Chrome: 15,
    'Brushed Nickel': 18,
    'Matte Black': 20,
    Gold: 25,
    'Stainless Steel': 22
  },
  Paint: {
    'Soft White': 2,
    'Warm Gray': 2,
    'Navy Blue': 2,
    'Sage Green': 2,
    'Classic Beige': 2
  },
  Tile: {
    'White Subway': 8,
    'Carrara Marble': 15,
    Hexagon: 10,
    'Large Format': 12,
    Mosaic: 14
  },
  Hardware: {
    Modern: 30,
    Traditional: 25,
    Industrial: 35,
    Vintage: 20
  }
};

const roomMultipliers = {
  Kitchen: 1.5,
  Bathroom: 1.2,
  Bedroom: 0.9,
  'Living Room': 1.0,
  'Full House': 2.5
};

const laborCost = {
  Kitchen: 5000,
  Bathroom: 3000,
  Bedroom: 2000,
  'Living Room': 2500,
  'Full House': 8000
};

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await req.json();
    const { imageUrl, roomType, finishes } = body;

    if (!imageUrl || !roomType || !finishes) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const base44 = createClientFromRequest(req);

    // Generate visualization prompt
    const finishesDescription = Object.entries(finishes)
      .map(([cat, item]) => `${cat}: ${item}`)
      .join(', ');

    const visualizationPrompt = `You are a professional interior designer. Take this photo of a ${roomType} and create a photorealistic visualization showing a beautiful, sophisticated renovation with these finishes: ${finishesDescription}. The design should be modern, elegant, and high-end. Apply the finishes tastefully and cohesively. The space should look like a professional home renovation magazine feature.`;

    // Generate visualization image
    const imageResponse = await base44.integrations.Core.GenerateImage({
      prompt: visualizationPrompt,
      existing_image_urls: [imageUrl]
    });

    const visualizedImageUrl = imageResponse.url;

    // Calculate costs
    let materialCost = 0;
    for (const [category, selection] of Object.entries(finishes)) {
      const unitCost = costDatabase[category]?.[selection] || 0;
      const sqftEstimate = 200; // Default estimate, could be refined with computer vision
      materialCost += unitCost * sqftEstimate;
    }

    const multiplier = roomMultipliers[roomType] || 1;
    const baseLabor = laborCost[roomType] || 3000;
    const adjustedMaterialCost = materialCost * multiplier;
    const totalLabor = baseLabor * multiplier;

    const minCost = Math.floor(adjustedMaterialCost + totalLabor);
    const maxCost = Math.floor((adjustedMaterialCost + totalLabor) * 1.3); // 30% buffer for contingencies

    // Create breakdown
    const breakdown = {
      Materials: Math.floor(adjustedMaterialCost),
      Labor: Math.floor(totalLabor),
      'Design & Permits': Math.floor((adjustedMaterialCost + totalLabor) * 0.1),
      'Contingency (10%)': Math.floor((adjustedMaterialCost + totalLabor) * 0.1)
    };

    return new Response(
      JSON.stringify({
        originalImageUrl: imageUrl,
        visualizedImageUrl,
        roomType,
        squareFootage: 200,
        costRange: {
          min: minCost,
          max: maxCost
        },
        breakdown,
        finishesSelected: finishes
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error generating estimate:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate estimate' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});