import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Music, Users, Radio } from 'lucide-react';

export const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black relative overflow-hidden">
            {/* Subtle animated background elements */}
            <div className="absolute inset-0 overflow-hidden opacity-30">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>

            <div className="max-w-5xl w-full space-y-16 relative z-10">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6"
                >
                    <motion.div
                        animate={{
                            textShadow: [
                                '0 0 40px rgba(139,92,246,0.8)',
                                '0 0 60px rgba(59,130,246,0.8)',
                                '0 0 40px rgba(139,92,246,0.8)',
                            ],
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="text-7xl md:text-9xl font-bold text-white"
                    >
                        SyncIt
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl text-gray-400 font-light tracking-wide"
                    >
                        Sync your music across devices in real-time
                    </motion.p>

                    {/* Decorative line */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "200px" }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto"
                    />
                </motion.div>

                {/* Features */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="grid md:grid-cols-3 gap-6"
                >
                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="bg-zinc-900/80 backdrop-blur-xl p-8 rounded-2xl text-center space-y-4 border border-purple-500/20 shadow-[0_0_30px_rgba(139,92,246,0.15)] hover:shadow-[0_0_40px_rgba(139,92,246,0.25)] hover:border-purple-500/40 transition-all duration-300"
                    >
                        <div className="bg-purple-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
                            <Music className="w-8 h-8 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Upload Music</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Upload your favorite tracks and share them
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="bg-zinc-900/80 backdrop-blur-xl p-8 rounded-2xl text-center space-y-4 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:shadow-[0_0_40px_rgba(59,130,246,0.25)] hover:border-blue-500/40 transition-all duration-300"
                    >
                        <div className="bg-blue-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
                            <Radio className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Real-time Sync</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Everyone hears the same thing at the same time
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="bg-zinc-900/80 backdrop-blur-xl p-8 rounded-2xl text-center space-y-4 border border-violet-500/20 shadow-[0_0_30px_rgba(139,92,246,0.15)] hover:shadow-[0_0_40px_rgba(139,92,246,0.25)] hover:border-violet-500/40 transition-all duration-300"
                    >
                        <div className="bg-violet-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
                            <Users className="w-8 h-8 text-violet-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Up to 4 Users</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Listen together with your friends
                        </p>
                    </motion.div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col md:flex-row gap-6 justify-center items-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/create')}
                        className="relative group text-lg px-12 py-4 rounded-full font-semibold overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:shadow-[0_0_50px_rgba(139,92,246,0.6)] transition-all duration-300"
                    >
                        <span className="relative z-10">Create Room</span>
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                            initial={{ x: "100%" }}
                            whileHover={{ x: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/join')}
                        className="relative group text-lg px-12 py-4 rounded-full font-semibold overflow-hidden bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_rgba(59,130,246,0.6)] transition-all duration-300"
                    >
                        <span className="relative z-10">Join Room</span>
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-violet-600 to-blue-600"
                            initial={{ x: "100%" }}
                            whileHover={{ x: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
};