import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
    ArrowLeft, 
    ShoppingCart, 
    ChevronDown, 
    Info, 
    Check, 
    RefreshCcw, 
    Truck,
    CreditCard,
    ShieldCheck,
    CheckCircle2
} from 'lucide-react';
import { stepData } from '../components/step/stepData';
import { toast } from "sonner";

export default function StepBuilder() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const typeId = searchParams.get('type') || 'bathroom';
    const buildData = stepData.packages[typeId] || stepData.packages.bathroom;
    const buildInfo = stepData.buildTypes.find(b => b.id === typeId) || stepData.buildTypes[0];

    // State for selections: { sectionId: selectedItemId }
    const [selections, setSelections] = useState({});
    const [expandedSection, setExpandedSection] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Initialize selections with first item of each section
    useEffect(() => {
        const initial = {};
        buildData.sections.forEach(section => {
            if (section.items.length > 0) {
                initial[section.id] = section.items[0]; // Store full item object
            }
        });
        setSelections(initial);
        // Expand first section by default
        if (buildData.sections.length > 0) {
            setExpandedSection(buildData.sections[0].id);
        }
    }, [typeId]);

    const handleSelect = (sectionId, item) => {
        setSelections(prev => ({
            ...prev,
            [sectionId]: item
        }));
        toast.success(`Selected: ${item.name}`);
    };

    const calculateTotal = () => {
        return Object.values(selections).reduce((acc, item) => {
            const qty = item.defaultQty || 1;
            return acc + (item.price * qty);
        }, 0);
    };

    const handleCheckout = () => {
        // In a real app, you'd save this to a backend/context
        // For now, pass via navigation state or URL
        const orderData = {
            type: buildInfo.title,
            items: selections,
            total: calculateTotal()
        };
        // Use state in navigation
        navigate(createPageUrl('StepSummary'), { state: orderData });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate(createPageUrl('StepDashboard'))}>
                            <ArrowLeft className="w-5 h-5 text-gray-500" />
                        </Button>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 leading-tight">{buildInfo.title}</h1>
                            <p className="text-xs text-gray-500">Package Builder</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="hidden md:block text-right">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Total Estimate</p>
                            <p className="text-xl font-bold text-gray-900">${calculateTotal().toLocaleString()}</p>
                        </div>
                        <Button 
                            className="bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-100"
                            onClick={handleCheckout}
                        >
                            One-Click Buy All
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8 grid lg:grid-cols-[1fr_380px] gap-8">
                
                {/* Main Builder Area */}
                <div className="space-y-6">
                    {buildData.sections.map((section, idx) => {
                        const selectedItem = selections[section.id];
                        const isExpanded = expandedSection === section.id;

                        return (
                            <motion.div 
                                key={section.id}
                                layout
                                className={`bg-white rounded-xl border transition-all ${isExpanded ? 'border-red-200 shadow-md ring-1 ring-red-50' : 'border-gray-200 shadow-sm'}`}
                            >
                                {/* Section Header */}
                                <div 
                                    className="p-6 cursor-pointer flex items-center justify-between"
                                    onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${selections[section.id] ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {selections[section.id] ? <Check className="w-4 h-4" /> : idx + 1}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
                                            {selectedItem && !isExpanded && (
                                                <p className="text-sm text-gray-500 mt-1">{selectedItem.name} — <span className="font-medium text-gray-900">${selectedItem.price.toLocaleString()}</span></p>
                                            )}
                                        </div>
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                </div>

                                {/* Expanded Content */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden border-t border-gray-100"
                                        >
                                            <div className="p-6 bg-gray-50/50">
                                                <div className="grid sm:grid-cols-2 gap-4">
                                                    {section.items.map((item) => {
                                                        const isSelected = selectedItem?.id === item.id;
                                                        return (
                                                            <div 
                                                                key={item.id}
                                                                onClick={() => handleSelect(section.id, item)}
                                                                className={`relative bg-white rounded-lg border-2 p-4 cursor-pointer transition-all hover:shadow-md ${isSelected ? 'border-red-600 shadow-sm ring-1 ring-red-100' : 'border-transparent hover:border-gray-300'}`}
                                                            >
                                                                <div className="aspect-[4/3] rounded-md overflow-hidden bg-gray-100 mb-4 relative">
                                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                                    {isSelected && (
                                                                        <div className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow-sm">
                                                                            <Check className="w-3 h-3" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <h4 className="font-bold text-gray-900 text-sm leading-tight">{item.name}</h4>
                                                                    <span className="font-bold text-red-600 text-sm whitespace-nowrap">${item.price.toLocaleString()}</span>
                                                                </div>
                                                                <p className="text-xs text-gray-500 leading-relaxed mb-3">{item.description}</p>
                                                                
                                                                <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                                                                    <Truck className="w-3 h-3" />
                                                                    <span>Via {item.supplier}</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Sidebar Summary */}
                <div className="hidden lg:block">
                    <div className="sticky top-24 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <ShoppingCart className="w-4 h-4" />
                                Package Summary
                            </h3>
                            
                            <div className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto pr-2 custom-scrollbar">
                                {Object.entries(selections).map(([sectionId, item]) => {
                                    const section = buildData.sections.find(s => s.id === sectionId);
                                    return (
                                        <div key={sectionId} className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                                            <div>
                                                <p className="text-gray-500 text-xs">{section?.title}</p>
                                                <p className="font-medium text-gray-900 truncate max-w-[180px]">{item.name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-900">${(item.price * (item.defaultQty || 1)).toLocaleString()}</p>
                                                {item.defaultQty > 1 && <p className="text-xs text-gray-400">Qty: {item.defaultQty}</p>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-gray-500 text-sm">Subtotal</span>
                                    <span className="font-bold text-xl text-gray-900">${calculateTotal().toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-gray-400 text-right mb-6">Tax calculated at checkout</p>
                                
                                <Button className="w-full bg-red-600 hover:bg-red-700 h-12" onClick={handleCheckout}>
                                    Checkout Now
                                </Button>
                                
                                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                                    <ShieldCheck className="w-3 h-3" />
                                    <span>Vetted for compatibility</span>
                                </div>
                            </div>
                        </div>

                        {/* Benefits Card */}
                        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                            <h4 className="font-bold text-blue-900 text-sm mb-3">Why this package?</h4>
                            <ul className="space-y-2">
                                <li className="flex gap-2 text-xs text-blue-800">
                                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                    <span>All plumbing fixtures match valve specs</span>
                                </li>
                                <li className="flex gap-2 text-xs text-blue-800">
                                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                    <span>Stock availability verified daily</span>
                                </li>
                                <li className="flex gap-2 text-xs text-blue-800">
                                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                    <span>Contractor-preferred brands</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
            
            {/* Mobile Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-30">
                <div className="flex justify-between items-center gap-4">
                    <div>
                        <p className="text-xs text-gray-500">Total Estimate</p>
                        <p className="text-lg font-bold text-gray-900">${calculateTotal().toLocaleString()}</p>
                    </div>
                    <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={handleCheckout}>
                        Checkout ({Object.keys(selections).length})
                    </Button>
                </div>
            </div>
        </div>
    );
}