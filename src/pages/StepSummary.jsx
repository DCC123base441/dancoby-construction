import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { createPageUrl } from '../../utils';
import { ArrowLeft, CheckCircle2, ShieldCheck, CreditCard, Building2, Truck } from 'lucide-react';

export default function StepSummary() {
    const location = useLocation();
    const navigate = useNavigate();
    const orderData = location.state;

    // Redirect if no data
    if (!orderData) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">No order details found.</p>
                    <Link to={createPageUrl('StepDashboard')} className="text-red-600 hover:underline">Return to Dashboard</Link>
                </div>
            </div>
        );
    }

    const { items, total, type } = orderData;
    const itemList = Object.values(items);
    
    // Group items by supplier for realistic PO simulation
    const itemsBySupplier = itemList.reduce((acc, item) => {
        const supplier = item.supplier || 'General Supply';
        if (!acc[supplier]) acc[supplier] = [];
        acc[supplier].push(item);
        return acc;
    }, {});

    const handleConfirm = () => {
        // Simulate API call
        setTimeout(() => {
            navigate(createPageUrl('StepSuccess'), { state: { orderId: Math.floor(Math.random() * 100000) } });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
                <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-red-600" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Builder
                </Button>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Purchase Order</h1>
                <p className="text-gray-600 mb-8">Review your selections before we send orders to suppliers.</p>

                <div className="grid lg:grid-cols-[1fr_340px] gap-8">
                    <div className="space-y-6">
                        
                        {/* Supplier Grouping */}
                        {Object.entries(itemsBySupplier).map(([supplier, supplierItems]) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={supplier} 
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                            >
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <Building2 className="w-4 h-4 text-gray-500" />
                                        <h3 className="font-bold text-gray-900">PO for {supplier}</h3>
                                    </div>
                                    <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">Direct Integration</span>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {supplierItems.map((item, idx) => (
                                        <div key={idx} className="p-6 flex gap-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-1">
                                                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                                                    <span className="font-bold text-gray-900">${(item.price * (item.defaultQty || 1)).toLocaleString()}</span>
                                                </div>
                                                <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                                                {item.defaultQty > 1 && (
                                                    <div className="inline-flex items-center text-xs font-medium bg-gray-100 px-2 py-1 rounded">
                                                        Qty: {item.defaultQty} {item.unit}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex gap-4">
                            <Truck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-blue-900 text-sm mb-1">Unified Shipping Coordination</h4>
                                <p className="text-sm text-blue-800 leading-relaxed">
                                    Step coordinates delivery dates across all suppliers to minimize storage needs. 
                                    Expect initial tracking numbers within 24 hours.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                            <h3 className="font-bold text-gray-900 mb-6">Order Summary</h3>
                            
                            <div className="space-y-3 text-sm mb-6 pb-6 border-b border-gray-100">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal ({itemList.length} items)</span>
                                    <span className="font-medium">${total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Service Fee (2%)</span>
                                    <span className="font-medium">${(total * 0.02).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping Estimate</span>
                                    <span className="font-medium text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Taxes (Est.)</span>
                                    <span className="font-medium">${(total * 0.08875).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-8">
                                <span className="font-bold text-gray-900">Total</span>
                                <span className="font-bold text-2xl text-red-600">${(total * 1.10875).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </div>

                            <Button onClick={handleConfirm} className="w-full bg-red-600 hover:bg-red-700 h-14 text-lg shadow-lg shadow-red-100 mb-4">
                                Confirm & Send POs
                            </Button>

                            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                                <ShieldCheck className="w-3 h-3" />
                                <span>Secure SSL Encrypted Transaction</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}