import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export const FloatingReactions = ({ reactions, removeReaction }) => {
    const [windowHeight, setWindowHeight] = useState(0);

    useEffect(() => {
        setWindowHeight(window.innerHeight);
        // Only get on mount to avoid resize issues during animation
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
            <AnimatePresence>
                {reactions.map((reaction) => (
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
                            y: -(windowHeight + 100), // Fly past the top
                            x: reaction.endX,
                            scale: [0.5, 2, 2, 0.8] 
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ 
                            duration: reaction.duration, 
                            ease: "easeOut" 
                        }}
                        onAnimationComplete={() => removeReaction(reaction.id)}
                        className="absolute bottom-10 text-5xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                    >
                        {reaction.emoji}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
