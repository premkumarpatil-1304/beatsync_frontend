import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

// Generates dynamic shadow colors to "glow" vibrantly
const getGlowColor = () => {
    const colors = [
        'rgba(0, 240, 255, 0.8)', // Cyan
        'rgba(255, 0, 255, 0.8)', // Magenta
        'rgba(144, 0, 255, 0.8)', // Purple
        'rgba(255, 215, 0, 0.8)'  // Gold
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

export const FloatingReactions = ({ reactions, removeReaction }) => {
    const [windowHeight, setWindowHeight] = useState(0);

    useEffect(() => {
        setWindowHeight(window.innerHeight);
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
            <AnimatePresence>
                {reactions.map((reaction) => {
                    const glowColor = getGlowColor();
                    // Create a wavy path and rotation
                    const controlPoints = [
                        reaction.startX,
                        reaction.startX + (Math.random() * 80 - 40),
                        reaction.startX - (Math.random() * 80 - 40),
                        reaction.endX
                    ];
                    
                    const rotatePath = [
                        0,
                        Math.random() * 30 - 15,
                        Math.random() * -30 + 15,
                        0
                    ];

                    return (
                        <motion.div
                            key={reaction.id}
                            initial={{ 
                                opacity: 0, 
                                y: 100, 
                                x: reaction.startX, 
                                scale: 0.5 
                            }}
                            animate={{ 
                                opacity: [0, 1, 1, 0], 
                                y: -(windowHeight + 150),
                                x: controlPoints,
                                rotate: rotatePath,
                                scale: [0.5, 2.5, 2.5, 1] 
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ 
                                duration: reaction.duration, 
                                ease: "easeInOut", // softer ease
                                times: [0, 0.2, 0.8, 1] // map opacity array
                            }}
                            onAnimationComplete={() => removeReaction(reaction.id)}
                            className="absolute bottom-10 text-5xl md:text-6xl"
                            style={{
                                filter: `drop-shadow(0 0 25px ${glowColor}) drop-shadow(0 0 10px rgba(255,255,255,0.5))`
                            }}
                        >
                            {reaction.emoji}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};
