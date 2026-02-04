import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, X, Plus, Minus, ArrowRight, Tag, Sparkles, Bell } from 'lucide-react';
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
import { createPageUrl } from '../utils';
import NotifyDialog from '../components/shop/NotifyDialog';
import SpinWheel from '../components/shop/SpinWheel';
import FakeCheckoutDialog from '../components/shop/FakeCheckoutDialog';

// Fallback data
const MOCK_PRODUCTS = [
  {
    id: 'mock-1',
    name: 'Next Level T-Shirt',
    description: 'Premium cotton classic fit t-shirt with our signature logo. Comfortable, durable, and stylish.',
    price: 15.00,
    images: ['https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/59e798105_T-shirt.jpg'],
    category: 'Apparel',
    sizes: ['M', 'L'],
    inStock: false
  },
  {
    id: 'mock-2',
    name: 'Champion Hoodie',
    description: 'Ultra-soft fleece hoodie featuring the Dancoby branding. Perfect for colder days.',
    price: 29.00,
    images: ['https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/fc470c4a1_HoodieBlackBig.jpg'],
    category: 'Apparel',
    sizes: ['M', 'L'],
    inStock: false
  },
  {
    id: 'mock-3',
    name: 'Dancoby Trucker Hat',
    description: 'Classic mesh back trucker hat with embroidered logo. Adjustable snapback closure.',
    price: 25.00,
    images: ['https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/28bf19810_image.jpg'],
    category: 'Accessories',
    sizes: ['One Size'],
    inStock: true,
    comingSoon: false
  },
  {
    id: 'mock-4',
    name: 'Worksite Beanie',
    description: 'Warm knit beanie for winter projects. Features a subtle woven label.',
    price: 18.00,
    images: ['https://placehold.co/800x1000/f3f4f6/1c1917?text=Coming+Soon&font=montserrat'],
    category: 'Accessories',
    sizes: ['One Size'],
    inStock: true,
    comingSoon: true
  }
];

export default function Shop() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [notifyDialogOpen, setNotifyDialogOpen] = useState(false);
  const [notifyProduct, setNotifyProduct] = useState(null);
  const [notifySize, setNotifySize] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const { data: dbProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list('order'),
  });

  const products = dbProducts.length > 0 ? dbProducts : MOCK_PRODUCTS;
  
  // Track views on load (simple implementation)
  React.useEffect(() => {
    if (dbProducts.length > 0) {
        // Increment views for all visible products occasionally or just pick one randomly to simulate
        // Real implementation would track viewport visibility or click
    }
  }, [dbProducts.length]);
  
  // Mutation to update stats
  const updateStatsMutation = React.useMemo(() => ({
    mutate: (updates) => {
        // updates is array of {id, data}
        updates.forEach(u => {
            if (u.id.startsWith('mock-')) return;
            base44.entities.Product.update(u.id, u.data);
        });
    }
  }), []);

  const handleCheckoutSuccess = () => {
    // Increment sales for items in cart
    const updates = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return null;
        return {
            id: product.id,
            data: { 
                sales: (product.sales || 0) + item.quantity 
            }
        };
    }).filter(Boolean);
    
    updateStatsMutation.mutate(updates);
    setCart([]);
  };

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
    if (cart.length <= 1) setAppliedDiscount(null);
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

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = appliedDiscount 
    ? (appliedDiscount.type === 'percentage' ? subtotal * (appliedDiscount.value / 100) : appliedDiscount.value)
    : 0;
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyCode = async () => {
    if (!discountCode.trim()) return;
    
    // In a real app, verify against database
    // For demo: "WELCOME10" gives 10% off
    if (discountCode.toUpperCase() === 'WELCOME10') {
        setAppliedDiscount({ code: 'WELCOME10', type: 'percentage', value: 10 });
        toast.success("Discount applied!");
    } else if (discountCode.toUpperCase() === 'DANCOBY20') {
        setAppliedDiscount({ code: 'DANCOBY20', type: 'percentage', value: 20 });
        toast.success("Discount applied!");
    } else {
        toast.error("Invalid discount code");
    }
  };

  const removeDiscount = () => {
      setAppliedDiscount(null);
      setDiscountCode('');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[60vh] flex items-center justify-center overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 flex opacity-40">
            <div className="w-1/2 h-full border-r border-white/10">
                <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/d693bfc2f_Hoodie1.jpg"
                    alt="Official Dancoby Hoodie"
                    className="w-full h-full object-cover grayscale"
                />
            </div>
            <div className="w-1/2 h-full">
                <img 
                    src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80"
                    alt="Cute Dog Adoption"
                    className="w-full h-full object-cover grayscale"
                />
            </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-black/50 to-transparent" />
        <div className="relative z-10 text-center max-w-4xl px-6 pt-48">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-sm mb-8">
                    <span className="text-sm font-bold tracking-wide uppercase text-red-400">Charity Drive</span>
                    <span className="w-1 h-1 rounded-full bg-white/50" />
                    <span className="text-sm font-medium tracking-wide">100% of Proceeds go to the ASPCA</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                    WEAR THE <span className="text-red-600">CRAFT</span>
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 font-light">
                    Official Dancoby apparel. Designed for the builders, the dreamers, and the doers. Support a great cause with every purchase.
                </p>
                <Button 
                    size="lg" 
                    className="bg-white text-zinc-900 hover:bg-gray-100 px-8 py-6 text-lg rounded-full"
                    onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
                >
                    Shop Collection
                </Button>
            </motion.div>
        </div>
      </section>

      {/* Spin Wheel Section */}
      <SpinWheel />

      {/* Cart Sheet */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-md flex flex-col bg-white p-0">
          <div className="p-6 border-b border-gray-100">
            <SheetHeader>
                <SheetTitle className="text-2xl font-bold">Your Cart</SheetTitle>
                <SheetDescription>Free shipping on orders over $100</SheetDescription>
            </SheetHeader>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 opacity-20" />
                </div>
                <p>Your cart is currently empty.</p>
                <Button variant="link" onClick={() => setIsCartOpen(false)}>
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4 group">
                    <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h4>
                            <button 
                                onClick={() => removeFromCart(item.id, item.size)}
                                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500">Size: <span className="uppercase">{item.size}</span></p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.size, -1)}
                            className="p-1 hover:bg-white rounded-md transition-colors shadow-sm"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.size, 1)}
                            className="p-1 hover:bg-white rounded-md transition-colors shadow-sm"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="bg-gray-50 p-6 space-y-4">
                {/* Discount Code */}
                <div className="space-y-2">
                    {appliedDiscount ? (
                        <div className="flex items-center justify-between bg-green-50 text-green-700 px-3 py-2 rounded-lg border border-green-100">
                            <div className="flex items-center gap-2">
                                <Tag className="w-4 h-4" />
                                <span className="text-sm font-medium">Code: {appliedDiscount.code} applied</span>
                            </div>
                            <button onClick={removeDiscount} className="text-green-700 hover:text-green-900">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Input 
                                placeholder="Discount code" 
                                value={discountCode}
                                onChange={(e) => setDiscountCode(e.target.value)}
                                className="bg-white"
                            />
                            <Button variant="outline" onClick={handleApplyCode}>Apply</Button>
                        </div>
                    )}
                </div>

                {/* Totals */}
                <div className="space-y-2 pt-2 border-t border-gray-200">
                    <div className="flex justify-between text-gray-500 text-sm">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {appliedDiscount && (
                        <div className="flex justify-between text-green-600 text-sm font-medium">
                            <span>Discount ({appliedDiscount.value}%)</span>
                            <span>-${discountAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center text-xl font-bold text-gray-900 pt-2">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>

                <Button 
                    size="lg" 
                    className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 h-14 text-lg"
                    onClick={() => {
                        setIsCartOpen(false);
                        setCheckoutOpen(true);
                    }}
                >
                    Checkout Securely <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-xs text-center text-gray-400">
                    Secure checkout powered by Stripe
                </p>
            </div>
          )}
        </SheetContent>
      </Sheet>



      {/* Products Grid */}
      <div id="products" className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Collection</h2>
            <div className="h-1 w-20 bg-red-600 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product) => (
            <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart} 
                onNotify={(product, size) => {
                    setNotifyProduct(product);
                    setNotifySize(size);
                    setNotifyDialogOpen(true);
                }}
            />
          ))}
        </div>
      </div>

      <NotifyDialog 
        open={notifyDialogOpen} 
        onOpenChange={setNotifyDialogOpen}
        product={notifyProduct}
        size={notifySize}
      />
      
      <FakeCheckoutDialog 
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        cart={cart}
        total={total}
        onSuccess={handleCheckoutSuccess}
      />
    </div>
  );
}

function ProductCard({ product, onAddToCart, onNotify }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
        className="group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
        {/* Image Container */}
        <div className="aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden relative mb-6 p-0">
            <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
            />
            {!product.inStock && (
                <div className="absolute top-4 right-4 bg-black text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Sold Out
                </div>
            )}
            
            {/* Quick Add Overlay */}
            <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${isHovered || !product.inStock || product.comingSoon ? 'opacity-100' : 'opacity-0'}`}>
                 {product.inStock && !product.comingSoon ? (
                    <Button 
                        className="w-full bg-white text-black hover:bg-gray-100"
                        onClick={() => onAddToCart(product, selectedSize)}
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add to Cart - ${product.price}
                    </Button>
                 ) : (
                    <Button 
                        className="w-full bg-white text-black hover:bg-gray-100"
                        onClick={() => onNotify(product, selectedSize)}
                    >
                        <Bell className="w-4 h-4 mr-2" /> Notify Me
                    </Button>
                 )}
            </div>
        </div>

        {/* Info */}
        <div className="space-y-3">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                <span className="font-medium text-gray-900">${product.price}</span>
            </div>
            <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{product.description}</p>
            
            {/* Sizes */}
            {product.sizes && (
                <div className="flex gap-2 pt-2">
                    {product.sizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                                selectedSize === size
                                    ? 'bg-black text-white shadow-md scale-110'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:border-black'
                            }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
}