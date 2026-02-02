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
    { label: '10% OFF', color: '#ef4444', value: '10OFF', type: 'discount' },
    { label: 'Try Again', color: '#1f2937', value: null, type: 'loss' },
    { label: 'Free Hat', color: '#ef4444', value: 'FREEHAT', type: 'prize' },
    { label: 'Try Again', color: '#1f2937', value: null, type: 'loss' },
    { label: '20% OFF', color: '#ef4444', value: '20OFF', type: 'discount' },
    { label: 'Try Again', color: '#1f2937', value: null, type: 'loss' },
];

export default function SpinWheel() {
    const [hasSpun, setHasSpun] = useState(true); // Default to true to prevent flash
    const [isSpinning, setIsSpinning] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState(null);
    const controls = useAnimation();

    useEffect(() => {
        const spun = localStorage.getItem('dancoby_shop_spin');
        setHasSpun(!!spun);
    }, []);

    const spin = async () => {
        if (isSpinning || hasSpun) return;

        setIsSpinning(true);
        
        // Determine result (Always loss)
        // Indices 1, 3, 5 are loss
        const losses = [1, 3, 5];
        const selectedIndex = losses[Math.floor(Math.random() * losses.length)];

        const selectedSegment = SEGMENTS[selectedIndex];
        
        // Calculate rotation
        // 360 / 6 segments = 60 degrees per segment
        // We want to land on the selected index
        // Top is 0 degrees. Arrow is usually at top.
        // Rotation needed to put segment at top:
        // Index 0: 0 deg (or 360)
        // Index 1: -60 deg (or 300)
        // Index 2: -120 deg (or 240)
        // ...
        // Add random full rotations (5-10)
        const segmentAngle = 360 / SEGMENTS.length;
        const targetAngle = 360 - (selectedIndex * segmentAngle);
        const rotations = 360 * (5 + Math.floor(Math.random() * 5));
        const finalRotation = rotations + targetAngle;

        await controls.start({
            rotate: finalRotation,
            transition: { 
                duration: 4, 
                ease: [0.13, 0.99, 0.29, 0.99] // Bezier for realistic spin down
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

    // if (hasSpun && !showResult) return null; // Keep visible

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
                    <div className="pt-4">
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

                <div className="order-1 md:order-2 flex justify-center relative">
                    {/* Arrow Indicator */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20">
                        <div className="w-8 h-8 bg-zinc-900 rotate-45 transform origin-center border-4 border-white shadow-lg rounded-sm" />
                    </div>

                    {/* Wheel */}
                    <motion.div 
                        className="w-72 h-72 md:w-96 md:h-96 rounded-full border-8 border-white shadow-2xl relative overflow-hidden bg-zinc-900"
                        animate={controls}
                    >
                        {SEGMENTS.map((segment, index) => {
                            const rotation = (360 / SEGMENTS.length) * index;
                            return (
                                <div
                                    key={index}
                                    className="absolute top-0 left-1/2 w-full h-full origin-left flex items-center justify-center"
                                    style={{
                                        transform: `rotate(${rotation - 90 + 30}deg) skewY(-30deg)`, // Adjust for CSS circle segments
                                        background: segment.color,
                                    }}
                                >
                                    {/* Text correction */}
                                    <span 
                                        className="absolute left-16 md:left-20 text-white font-bold text-xs md:text-base whitespace-nowrap"
                                        style={{
                                            transform: `skewY(30deg) rotate(90deg)`,
                                            textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                                        }}
                                    >
                                        {segment.label}
                                    </span>
                                </div>
                            );
                        })}
                        
                        {/* Center Cap */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg z-10 flex items-center justify-center">
                            <Gift className="w-8 h-8 text-red-600" />
                        </div>
                    </motion.div>
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