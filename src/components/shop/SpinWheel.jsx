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
    { label: '5% OFF', color: '#ef4444', text: 'white', value: '5OFF', type: 'discount' },
    { label: '10% OFF', color: '#1f2937', text: 'white', value: '10OFF', type: 'discount' },
    { label: 'Free Merch', color: '#ef4444', text: 'white', value: 'FREEMERCH', type: 'prize' },
    { label: 'Free Hat', color: '#1f2937', text: 'white', value: 'FREEHAT', type: 'prize' },
    { label: 'Free Hoodie', color: '#ef4444', text: 'white', value: 'FREEHOODIE', type: 'prize' },
    { label: 'Try Again', color: '#1f2937', text: 'white', value: null, type: 'loss' },
    { label: 'Free Tee', color: '#ef4444', text: 'white', value: 'FREESHIRT', type: 'prize' },
];

export default function SpinWheel() {
    const [hasSpun, setHasSpun] = useState(true);
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
        
        // Random selection from all segments (fair chance)
        const selectedIndex = Math.floor(Math.random() * SEGMENTS.length);
        const selectedSegment = SEGMENTS[selectedIndex];
        
        const segmentAngle = 360 / SEGMENTS.length;
        // Calculate rotation to land with selected segment at top (0 degrees)
        // SVG index 0 is at 3 o'clock (0 deg).
        // To put index 0 at 12 o'clock (-90 deg), we rotate -90.
        // To put index i at 12 o'clock, we need to rotate further.
        // Center of segment i is at: i * segmentAngle + segmentAngle/2
        // We want that center to be at -90 deg (top).
        // Current position: angle
        // Target position: -90
        // Rotation needed: -90 - angle
        // Add full rotations (360 * 5) + 360 (to ensure positive/consistent direction if needed, but framer handles it)
        
        // Let's stick to a simpler logic:
        // Rotate lots of times + specific offset.
        // Offset = 360 - (selectedIndex * segmentAngle + segmentAngle/2) -> puts it at 3 o'clock.
        // Then rotate -90 to put 3 o'clock at 12 o'clock.
        
        const anglePerSegment = 360 / SEGMENTS.length;
        const segmentCenter = (selectedIndex * anglePerSegment) + (anglePerSegment / 2);
        
        // Base rotation to bring the segment to 0deg (3 o'clock)
        const baseRotation = 360 - segmentCenter;
        
        // Adjust for -90deg offset of container (so 0deg is at top)
        // Actually, if container is rotated -90deg, 0deg (3 o'clock) becomes 12 o'clock.
        // So baseRotation is correct to bring it to "Start" (which is top).
        
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

    const getSectorPath = (index, total) => {
        const center = 50;
        const radius = 50;
        const angle = 360 / total;
        const startAngle = index * angle;
        const endAngle = (index + 1) * angle;

        // Convert to radians
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;

        const x1 = center + radius * Math.cos(startRad);
        const y1 = center + radius * Math.sin(startRad);
        const x2 = center + radius * Math.cos(endRad);
        const y2 = center + radius * Math.sin(endRad);

        return `M${center},${center} L${x1},${y1} A${radius},${radius} 0 0,1 ${x2},${y2} Z`;
    };

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
                        className="w-72 h-72 md:w-96 md:h-96 rounded-full border-8 border-white shadow-2xl relative overflow-hidden"
                        animate={controls}
                        style={{ rotate: -90 }} // Start with 0 deg at top
                    >
                        <svg viewBox="0 0 100 100" className="w-full h-full transform transition-transform">
                            {SEGMENTS.map((segment, index) => {
                                return (
                                    <g key={index}>
                                        <path 
                                            d={getSectorPath(index, SEGMENTS.length)} 
                                            fill={segment.color}
                                            stroke="white"
                                            strokeWidth="0.5"
                                        />
                                        {/* Text Label */}
                                        <text
                                            x="50"
                                            y="50"
                                            fill={segment.text}
                                            fontSize="4"
                                            fontWeight="bold"
                                            textAnchor="end"
                                            alignmentBaseline="middle"
                                            transform={`
                                                rotate(${(index * (360/SEGMENTS.length)) + (360/SEGMENTS.length)/2}, 50, 50) 
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