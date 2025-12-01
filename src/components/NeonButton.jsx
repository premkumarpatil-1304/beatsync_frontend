import { motion } from 'framer-motion';

export const NeonButton = ({ children, onClick, disabled, className = '' }) => {
    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            onClick={onClick}
            disabled={disabled}
            className={`
        px-6 py-3 rounded-lg font-semibold
        bg-gradient-to-r from-cyan-500 to-purple-500
        text-white shadow-lg
        hover:shadow-cyan-500/50
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
        >
            {children}
        </motion.button>
    );
};
