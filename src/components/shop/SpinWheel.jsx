import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Gift, Sparkles, Frown, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

const SEGMENTS = [
    { label: '5% OFF', color: '#ef4444', text: 'white', value: '5OFF', type: 'discount', weight: 1 },
    { label: 'Try Again', color: '#1f2937', text: 'white', value: null, type: 'loss', weight: 2 },
    { label: '10% OFF', color: '#ef4444', text: 'white', value: '10OFF', type: 'discount', weight: 1 },
    { label: 'Try Again', color: '#1f2937', text: 'white', value: null, type: 'loss', weight: 2 },
    { label: 'Free Hat', color: '#ef4444', text: 'white', value: 'FREEHAT', type: 'prize', weight: 1 },
    { label: 'Try Again', color: '#1f2937', text: 'white', value: null, type: 'loss', weight: 2 },
    { label: 'Free Hoodie', color: '#ef4444', text: 'white', value: 'FREEHOODIE', type: 'prize', weight: 1 },
    { label: 'Try Again', color: '#1f2937', text: 'white', value: null, type: 'loss', weight: 2 },
    { label: 'Free Tee', color: '#ef4444', text: 'white', value: 'FREESHIRT', type: 'prize', weight: 1 },
    { label: 'Try Again', color: '#1f2937', text: 'white', value: null, type: 'loss', weight: 2 },
];

const TOTAL_WEIGHT = SEGMENTS.reduce((sum, s) => sum + s.weight, 0);

export default function SpinWheel() {
    const [hasSpun, setHasSpun] = useState(true);
    const [isSpinning, setIsSpinning] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState(null);
    const controls = useAnimation();

    useEffect(() => {
        // DEBUG: Reset spin for testing - remove this line after testing
        localStorage.removeItem('dancoby_shop_spin');
        
        const spun = localStorage.getItem('dancoby_shop_spin');
        setHasSpun(!!spun);
    }, []);

    const spin = async () => {
        if (isSpinning || hasSpun) return;

        setIsSpinning(true);
        
        // Randomly pick a value between 0 and TOTAL_WEIGHT
        let randomWeight = Math.random() * TOTAL_WEIGHT;
        let selectedIndex = 0;
        let accumulatedWeight = 0;
        
        // Find which segment corresponds to the random weight
        for (let i = 0; i < SEGMENTS.length; i++) {
            accumulatedWeight += SEGMENTS[i].weight;
            if (randomWeight <= accumulatedWeight) {
                selectedIndex = i;
                break;
            }
        }
        
        const selectedSegment = SEGMENTS[selectedIndex];
        
        // Calculate the center angle of the selected segment
        // Need to calculate start angle of this segment first
        let currentStartWeight = 0;
        for (let i = 0; i < selectedIndex; i++) {
            currentStartWeight += SEGMENTS[i].weight;
        }
        
        const startAngle = (currentStartWeight / TOTAL_WEIGHT) * 360;
        const segmentSize = (selectedSegment.weight / TOTAL_WEIGHT) * 360;
        const segmentCenter = startAngle + (segmentSize / 2);
        
        // Base rotation to bring the segment center to 0deg (3 o'clock)
        const baseRotation = 360 - segmentCenter;
        
        const fullRotations = 360 * 5;
        const finalRotation = fullRotations + baseRotation;

        await controls.start({
            rotate: finalRotation,
            transition: { 
                duration: 4, 
                ease: [0.13, 0.99, 0.29, 0.99]
            }
        });

        localStorage.setItem('dancoby_shop_spin', 'true');
        setHasSpun(true);
        setIsSpinning(false);
        setResult(selectedSegment);
        setShowResult(true);

        if (selectedSegment.type !== 'loss') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ef4444', '#ffffff', '#000000']
            });
        }
    };

    const getSectorPath = (startAngle, endAngle) => {
        const center = 50;
        const radius = 50;
        // startAngle and endAngle are in degrees
        
        // Convert to radians
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;

        const x1 = center + radius * Math.cos(startRad);
        const y1 = center + radius * Math.sin(startRad);
        const x2 = center + radius * Math.cos(endRad);
        const y2 = center + radius * Math.sin(endRad);

        // Large arc flag: if angle > 180, use 1, else 0. 
        // Our segments are small, so 0 is fine.
        const largeArcFlag = (endAngle - startAngle) > 180 ? 1 : 0;

        return `M${center},${center} L${x1},${y1} A${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`;
    };

    let currentAngle = 0;

    return (
        <section className="py-16 bg-zinc-50 border-y border-gray-200 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
                        <Sparkles className="w-4 h-4" />
                        <span>Daily Chance</span>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                        Feeling Lucky? <br />
                        <span className="text-red-600">Spin to Win</span> Free Gear!
                    </h2>
                    <p className="text-lg text-gray-600 max-w-md">
                        Try your luck on the wheel for a chance to win exclusive Dancoby merchandise, discount codes, and more. Only one spin per customer!
                    </p>
                    <div className="pt-4 hidden md:block">
                        <Button 
                            size="lg" 
                            className="bg-zinc-900 text-white hover:bg-zinc-800 px-8 h-12 text-lg shadow-lg shadow-gray-200"
                            onClick={spin}
                            disabled={isSpinning || hasSpun}
                        >
                            {isSpinning ? 'Spinning...' : hasSpun ? 'Already Played' : 'Spin the Wheel'}
                        </Button>
                        {hasSpun && !isSpinning && !showResult && (
                            <p className="text-sm text-gray-500 mt-2">You've already used your daily spin.</p>
                        )}
                    </div>
                </div>

                <div className="order-1 md:order-2 flex flex-col items-center justify-center relative gap-8">
                    {/* Arrow Indicator */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20">
                        <div className="w-8 h-8 bg-zinc-900 rotate-45 transform origin-center border-4 border-white shadow-lg rounded-sm" />
                    </div>

                    {/* Wheel */}
                    <motion.div 
                        className="w-72 h-72 md:w-96 md:h-96 rounded-full border-8 border-white shadow-2xl relative overflow-hidden"
                        animate={controls}
                        style={{ rotate: -90 }} // Start with 0 deg at top
                    >
                        <svg viewBox="0 0 100 100" className="w-full h-full transform transition-transform">
                            {SEGMENTS.map((segment, index) => {
                                const segmentSize = (segment.weight / TOTAL_WEIGHT) * 360;
                                const startAngle = currentAngle;
                                const endAngle = currentAngle + segmentSize;
                                const midAngle = startAngle + (segmentSize / 2);
                                currentAngle += segmentSize;
                                
                                return (
                                    <g key={index}>
                                        <path 
                                            d={getSectorPath(startAngle, endAngle)} 
                                            fill={segment.color}
                                            stroke="white"
                                            strokeWidth="0.5"
                                        />
                                        {/* Text Label */}
                                        <text
                                            x="50"
                                            y="50"
                                            fill={segment.text}
                                            fontSize={segment.weight > 1 ? "3" : "4"} // Smaller text for larger sections if needed? Or inverse.
                                            fontWeight="bold"
                                            textAnchor="end"
                                            alignmentBaseline="middle"
                                            transform={`
                                                rotate(${midAngle}, 50, 50) 
                                                translate(42, 0)
                                            `}
                                            className="uppercase"
                                        >
                                            {segment.label}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>
                        
                        {/* Center Cap */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg z-10 flex items-center justify-center">
                            <Gift className="w-8 h-8 text-red-600" />
                        </div>
                    </motion.div>

                    {/* Mobile Button */}
                    <div className="md:hidden w-full px-4 flex flex-col items-center">
                        <Button 
                            size="lg" 
                            className="w-full bg-zinc-900 text-white hover:bg-zinc-800 h-12 text-lg shadow-lg shadow-gray-200"
                            onClick={spin}
                            disabled={isSpinning || hasSpun}
                        >
                            {isSpinning ? 'Spinning...' : hasSpun ? 'Already Played' : 'Spin the Wheel'}
                        </Button>
                        {hasSpun && !isSpinning && !showResult && (
                            <p className="text-sm text-gray-500 mt-2">You've already used your daily spin.</p>
                        )}
                    </div>
                </div>
            </div>

            <Dialog open={showResult} onOpenChange={setShowResult}>
                <DialogContent className="sm:max-w-md text-center">
                    <DialogHeader>
                        <DialogTitle className="text-2xl flex flex-col items-center gap-4">
                            {result?.type === 'loss' ? (
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Frown className="w-8 h-8 text-gray-500" />
                                </div>
                            ) : (
                                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center animate-bounce">
                                    <Trophy className="w-8 h-8 text-yellow-600" />
                                </div>
                            )}
                            {result?.type === 'loss' ? 'Better Luck Next Time!' : 'You Won!'}
                        </DialogTitle>
                        <DialogDescription className="text-lg pt-2">
                            {result?.type === 'loss' ? (
                                "Sorry, you didn't win anything this time. But hey, our products are still awesome!"
                            ) : (
                                <>
                                    You won <span className="font-bold text-red-600">{result?.label}</span>!
                                    <br />
                                    Use code <code className="bg-gray-100 px-2 py-1 rounded text-black font-mono font-bold">{result?.value}</code> at checkout.
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center pt-4">
                        <Button onClick={() => setShowResult(false)} className="w-full">
                            {result?.type === 'loss' ? 'Browse Shop' : 'Claim Prize'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}