export const stepData = {
  buildTypes: [
    {
      id: 'bathroom',
      title: 'Bathroom Remodel',
      description: 'Complete single bathroom overhaul',
      image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2574&auto=format&fit=crop',
      estimatedCost: '$15k - $25k',
      duration: '3-5 weeks'
    },
    {
      id: 'kitchen',
      title: 'Kitchen Renovation',
      description: 'Full kitchen update including cabinets & appliances',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2940&auto=format&fit=crop',
      estimatedCost: '$30k - $60k',
      duration: '6-8 weeks'
    },
    {
      id: 'powder',
      title: 'Powder Room Update',
      description: 'Quick refresh for guest bathrooms',
      image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=2676&auto=format&fit=crop',
      estimatedCost: '$5k - $10k',
      duration: '2-3 weeks'
    }
  ],
  packages: {
    bathroom: {
      title: 'All-in-One Bathroom Package',
      sections: [
        {
          id: 'vanity',
          title: 'Vanity & Sink',
          items: [
            {
              id: 'vanity-mod',
              name: 'Modern Floating Vanity 36"',
              price: 1200,
              image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=2669&auto=format&fit=crop',
              description: 'Wall-mounted oak veneer with ceramic top',
              supplier: 'Build.com'
            },
            {
              id: 'vanity-trad',
              name: 'Classic White Vanity 36"',
              price: 950,
              image: 'https://images.unsplash.com/photo-1584622050111-993a426fbf0a?q=80&w=2670&auto=format&fit=crop',
              description: 'Freestanding solid wood with marble top',
              supplier: 'Signature Hardware'
            }
          ]
        },
        {
          id: 'toilet',
          title: 'Toilet',
          items: [
            {
              id: 'toilet-toto',
              name: 'Toto Drake II',
              price: 450,
              image: 'https://images.unsplash.com/photo-1564540586988-aa4e53c3d003?q=80&w=2574&auto=format&fit=crop', // generic bathroom
              description: 'Elongated bowl, 1.28 GPF, SoftClose seat',
              supplier: 'Supply.com'
            },
            {
              id: 'toilet-kohler',
              name: 'Kohler Santa Rosa',
              price: 380,
              image: 'https://images.unsplash.com/photo-1564540583225-b461876a40a2?q=80&w=2574&auto=format&fit=crop',
              description: 'One-piece compact elongated toilet',
              supplier: 'Kohler'
            }
          ]
        },
        {
          id: 'fixtures',
          title: 'Shower Fixtures',
          items: [
            {
              id: 'fix-matte',
              name: 'Matte Black Rainfall System',
              price: 680,
              image: 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=2670&auto=format&fit=crop',
              description: '12" rain head with handheld wand',
              supplier: 'Moen'
            },
            {
              id: 'fix-chrome',
              name: 'Polished Chrome Set',
              price: 420,
              image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=2670&auto=format&fit=crop',
              description: 'Classic multifunction shower trim',
              supplier: 'Delta'
            }
          ]
        },
        {
          id: 'tile_floor',
          title: 'Floor Tile',
          items: [
            {
              id: 'tile-hex',
              name: 'Marble Hexagon Mosaic',
              price: 15.50,
              unit: 'sq ft',
              defaultQty: 60,
              image: 'https://images.unsplash.com/photo-1517646331032-9e8563c523a1?q=80&w=2670&auto=format&fit=crop',
              description: '2" Carrara marble hexagon tiles',
              supplier: 'TileBar'
            },
            {
              id: 'tile-slate',
              name: 'Matte Black Slate',
              price: 8.95,
              unit: 'sq ft',
              defaultQty: 60,
              image: 'https://images.unsplash.com/photo-1618220252344-8ec99ec624b1?q=80&w=2080&auto=format&fit=crop',
              description: '12x24 porcelain slate look',
              supplier: 'TileBar'
            }
          ]
        },
        {
            id: 'paint',
            title: 'Wall Paint',
            items: [
              {
                id: 'paint-white',
                name: 'Chantilly Lace',
                price: 75,
                unit: 'gallon',
                defaultQty: 2,
                image: 'https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?q=80&w=2574&auto=format&fit=crop',
                description: 'Crisp clean white, Eggshell finish',
                supplier: 'Benjamin Moore'
              },
              {
                id: 'paint-gray',
                name: 'Repose Gray',
                price: 75,
                unit: 'gallon',
                defaultQty: 2,
                image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2670&auto=format&fit=crop',
                description: 'Warm light gray, Satin finish',
                supplier: 'Sherwin Williams'
              }
            ]
          }
      ]
    },
    // Mock kitchen data minimal for now
    kitchen: {
        title: 'Chef\'s Kitchen Package',
        sections: [
            {
                id: 'cabinets',
                title: 'Cabinetry',
                items: [{ id: 'cab-shaker', name: 'White Shaker Set', price: 8500, description: 'Solid wood RTA cabinets', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2940&auto=format&fit=crop' }]
            }
        ]
    },
    powder: {
        title: 'Quick Powder Room Refresh',
        sections: [
            {
                id: 'pedestal',
                title: 'Sink',
                items: [{ id: 'sink-ped', name: 'Classic Pedestal', price: 350, description: 'Vitreous china', image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=2676&auto=format&fit=crop' }]
            }
        ]
    }
  }
};