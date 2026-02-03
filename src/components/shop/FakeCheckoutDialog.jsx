import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, CreditCard, ShieldCheck } from 'lucide-react';
import { toast } from "sonner";

export default function FakeCheckoutDialog({ open, onOpenChange, cart, total, onSuccess }) {
  const handlePayment = () => {
    onOpenChange(false);
    toast.success("Order placed successfully! Thank you for your donation.");
    if (onSuccess) onSuccess();
  };

  const formattedTotal = typeof total === 'number' ? total.toFixed(2) : total;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden flex flex-col md:flex-row gap-0 max-h-[90vh]">
        {/* Left Side - Checkout Form */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-white">
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
               <h2 className="text-xl font-semibold tracking-tight">Contact</h2>
               <Button variant="link" className="text-red-600 font-medium px-0">Log in</Button>
            </div>
            <Input placeholder="Email or mobile phone number" className="bg-white h-11 border-gray-300" />
            
            <div className="space-y-4 pt-4">
                <h2 className="text-xl font-semibold tracking-tight">Delivery</h2>
                <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="First name" className="col-span-1 h-11 border-gray-300" />
                    <Input placeholder="Last name" className="col-span-1 h-11 border-gray-300" />
                    <Input placeholder="Address" className="col-span-2 h-11 border-gray-300" />
                    <Input placeholder="City" className="col-span-1 h-11 border-gray-300" />
                    <Input placeholder="ZIP code" className="col-span-1 h-11 border-gray-300" />
                </div>
            </div>

            <div className="space-y-4 pt-6">
                <h2 className="text-xl font-semibold tracking-tight">Payment</h2>
                <div className="space-y-3">
                    <p className="text-sm text-gray-500">All transactions are secure and encrypted.</p>
                    
                    <div className="border rounded-lg overflow-hidden">
                        <div className="flex items-center gap-3 p-4 bg-white border-b">
                            <div className="w-4 h-4 rounded-full border-[5px] border-red-600 bg-white" />
                            <CreditCard className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium">Credit Card</span>
                        </div>
                        <div className="p-4 bg-gray-50/50 space-y-3">
                            <Input placeholder="Card number" className="bg-white h-11" />
                            <div className="grid grid-cols-2 gap-3">
                                <Input placeholder="Expiration (MM / YY)" className="bg-white h-11" />
                                <Input placeholder="Security code" className="bg-white h-11" />
                            </div>
                        </div>
                    </div>

                     <div className="bg-red-50 border border-red-100 p-4 rounded-lg flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="bg-white p-1.5 rounded-full shadow-sm shrink-0">
                            <Heart className="w-4 h-4 text-red-600 fill-red-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-red-900 text-sm">Charity Donation Active</h4>
                            <p className="text-red-700 text-xs mt-1 leading-relaxed">
                                You are about to donate <strong>${formattedTotal}</strong>. 100% of the proceeds from this order go directly to the ASPCA.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Button onClick={handlePayment} className="w-full bg-red-600 hover:bg-red-700 h-14 text-lg font-medium shadow-lg shadow-red-100 mt-2">
                Pay now
            </Button>
          </div>
        </div>

        {/* Right Side - Order Summary (Gray background like Shopify) */}
        <div className="hidden md:block w-[380px] bg-gray-50 p-8 border-l border-gray-200 overflow-y-auto">
            <div className="space-y-6">
                <div className="space-y-4">
                    {cart.map((item, i) => (
                        <div key={i} className="flex gap-4 items-center">
                            <div className="relative w-16 h-16 bg-white border border-gray-200 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                                <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-gray-50">
                                    {item.quantity}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                                <p className="text-xs text-gray-500">{item.size}</p>
                            </div>
                            <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-200 pt-6 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">${formattedTotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="text-gray-500 text-xs">Free</span>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <div className="text-right">
                         <span className="text-xs text-gray-500 block mb-0.5">USD</span>
                         <span className="text-2xl font-bold text-gray-900">${formattedTotal}</span>
                    </div>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-auto pt-8">
                    <ShieldCheck className="w-3 h-3" />
                    Secure Checkout
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}