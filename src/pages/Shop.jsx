import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, X, Plus, Minus, CreditCard, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { toast } from "sonner";

// Temporary fallback data until database is populated
const MOCK_PRODUCTS = [
  {
    id: 'mock-1',
    name: 'Dancoby Signature T-Shirt',
    description: 'Premium cotton classic fit t-shirt with our signature logo. Comfortable, durable, and stylish for on-site or casual wear.',
    price: 29.99,
    images: ['https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/59e798105_T-shirt.jpg'],
    category: 'Apparel',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    inStock: true
  },
  {
    id: 'mock-2',
    name: 'Dancoby Heavyweight Hoodie',
    description: 'Ultra-soft fleece hoodie featuring the Dancoby branding. Perfect for colder days on the job site.',
    price: 54.99,
    images: ['https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/fc470c4a1_HoodieBlackBig.jpg'],
    category: 'Apparel',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    inStock: true
  }
];

export default function Shop() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch products from DB
  const { data: dbProducts = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list(),
  });

  // Use DB products if available, otherwise fall back to mock data
  const products = dbProducts.length > 0 ? dbProducts : MOCK_PRODUCTS;

  const addToCart = (product, size) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === size);
      if (existing) {
        return prev.map(item => 
          item.id === product.id && item.size === size 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, size, quantity: 1 }];
    });
    setIsCartOpen(true);
    toast.success("Added to cart");
  };

  const removeFromCart = (productId, size) => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.size === size)));
  };

  const updateQuantity = (productId, size, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId && item.size === size) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    // This will be replaced with real Stripe integration
    toast.info("Redirecting to checkout...");
    try {
        // Example of how we might call a checkout function later
        // await base44.functions.invoke('createCheckoutSession', { cart });
    } catch (e) {
        console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Dancoby Shop</h1>
            <p className="text-lg text-gray-600">Official merchandise and apparel.</p>
          </div>
          
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button size="lg" className="relative bg-gray-900 hover:bg-gray-800">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Cart
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg flex flex-col">
              <SheetHeader>
                <SheetTitle>Your Shopping Cart</SheetTitle>
                <SheetDescription>
                  Review your items before checking out.
                </SheetDescription>
              </SheetHeader>
              
              <div className="flex-1 overflow-y-auto py-6">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                    <p>Your cart is empty</p>
                    <Button variant="link" onClick={() => setIsCartOpen(false)}>
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-500 mb-2">Size: {item.size}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 border rounded-md p-1">
                              <button 
                                onClick={() => updateQuantity(item.id, item.size, -1)}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.size, 1)}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="text-gray-400 hover:text-red-500 self-start"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <SheetFooter className="flex-col sm:flex-col gap-4 border-t pt-6">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <Button size="lg" className="w-full bg-red-600 hover:bg-red-700" onClick={handleCheckout}>
                    Checkout <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <p className="text-xs text-center text-gray-400">
                    Secure checkout powered by Stripe
                  </p>
                </SheetFooter>
              )}
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, onAddToCart }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]);

  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow group">
      <div className="aspect-square bg-white relative overflow-hidden">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
        {!product.inStock && (
          <div className="absolute top-4 right-4 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">{product.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
          </div>
          <span className="font-bold text-lg text-red-600">${product.price}</span>
        </div>
        
        {product.sizes && (
          <div className="mt-4">
            <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider block mb-2">Size</span>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium transition-colors ${
                    selectedSize === size
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button 
          className="w-full bg-red-600 hover:bg-red-700" 
          onClick={() => onAddToCart(product, selectedSize)}
          disabled={!product.inStock}
        >
          <Plus className="w-4 h-4 mr-2" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}