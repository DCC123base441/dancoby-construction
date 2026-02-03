import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const SHOPIFY_DOMAIN = Deno.env.get("SHOPIFY_DOMAIN");
const SHOPIFY_TOKEN = Deno.env.get("SHOPIFY_STOREFRONT_TOKEN");

async function shopifyQuery(query, variables = {}) {
    const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
        },
        body: JSON.stringify({ query, variables }),
    });

    const json = await response.json();
    if (json.errors) {
        throw new Error(JSON.stringify(json.errors));
    }
    return json.data;
}

Deno.serve(async (req) => {
    try {
        if (req.method !== 'POST') {
            return new Response('Method not allowed', { status: 405 });
        }

        const { action, ...params } = await req.json();

        if (action === 'products') {
            const query = `
                {
                    products(first: 20) {
                        edges {
                            node {
                                id
                                title
                                description
                                images(first: 5) {
                                    edges {
                                        node {
                                            url
                                        }
                                    }
                                }
                                variants(first: 20) {
                                    edges {
                                        node {
                                            id
                                            title
                                            price {
                                                amount
                                            }
                                            availableForSale
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `;
            
            const data = await shopifyQuery(query);
            
            // Map to simplified format for frontend
            const products = data.products.edges.map(({ node }) => ({
                id: node.id,
                name: node.title,
                description: node.description,
                images: node.images.edges.map(img => img.node.url),
                price: parseFloat(node.variants.edges[0]?.node.price.amount || 0),
                inStock: node.variants.edges.some(v => v.node.availableForSale),
                variants: node.variants.edges.map(v => ({
                    id: v.node.id,
                    name: v.node.title,
                    price: parseFloat(v.node.price.amount),
                    available: v.node.availableForSale
                })),
                // Helper for UI that expects "sizes"
                sizes: node.variants.edges.map(v => v.node.title)
            }));

            return Response.json(products);
        }

        if (action === 'checkout') {
            const { lineItems } = params;
            
            // Format line items for Shopify
            // Expected lineItems: [{ variantId: "...", quantity: 1 }]
            
            const query = `
                mutation checkoutCreate($input: CheckoutCreateInput!) {
                    checkoutCreate(input: $input) {
                        checkout {
                            id
                            webUrl
                        }
                        checkoutUserErrors {
                            code
                            field
                            message
                        }
                    }
                }
            `;

            const variables = {
                input: {
                    lineItems: lineItems.map(item => ({
                        variantId: item.variantId,
                        quantity: item.quantity
                    }))
                }
            };

            const data = await shopifyQuery(query, variables);
            
            if (data.checkoutCreate.checkoutUserErrors.length > 0) {
                throw new Error(data.checkoutCreate.checkoutUserErrors[0].message);
            }

            return Response.json({ 
                checkoutUrl: data.checkoutCreate.checkout.webUrl 
            });
        }

        return Response.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Shopify Error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});