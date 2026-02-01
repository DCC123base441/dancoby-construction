import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { createPageUrl } from '../../utils';
import { CheckCircle2, Package, ArrowRight, Calendar } from 'lucide-react';

export default function StepSuccess() {
    const location = useLocation();
    const orderId = location.state?.orderId || '12345';

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-md w-full p-8 text-center"
            >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                <p className="text-gray-600 mb-8">
                    Your purchase orders have been generated and forwarded to our partner suppliers.
                </p>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-8 text-left">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                        <span className="text-sm text-gray-500">Order Reference</span>
                        <span className="font-mono font-bold text-gray-900">PO-{orderId}</span>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-gray-900">Supplier Processing</p>
                                <p className="text-xs text-gray-500">POs received by Build.com & TileBar</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-gray-900">Est. Delivery Start</p>
                                <p className="text-xs text-gray-500">3-5 Business Days</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <Button asChild className="w-full bg-red-600 hover:bg-red-700 h-12">
                        <Link to={createPageUrl('StepDashboard')}>Start Another Project</Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full text-gray-500 hover:text-gray-900">
                        <Link to={createPageUrl('Home')}>Return to Home</Link>
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}