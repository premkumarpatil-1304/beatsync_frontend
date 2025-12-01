import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const CreateRoom = () => {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreate = async (e) => {
        e.preventDefault();

        if (!username.trim()) {
            toast.error('Please enter a username');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('https://sync-backend-1lxu.onrender.com/room/create', {
                username: username
            });

            console.log('✅ Room created:', response.data);

            const { room_id, user_id } = response.data;

            sessionStorage.setItem('roomId', room_id);
            sessionStorage.setItem('userId', user_id);
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('isHost', 'true');

            console.log('Stored - RoomId:', room_id, 'UserId:', user_id);

            toast.success('Room created successfully!');

            setTimeout(() => {
                navigate(`/room/${room_id}`);
            }, 100);

        } catch (error) {
            console.error('❌ Create room error:', error);
            toast.error('Failed to create room: ' + (error.response?.data?.detail || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black relative overflow-hidden">
            {/* Subtle animated background elements */}
            <div className="absolute inset-0 overflow-hidden opacity-30">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 bg-zinc-900/95 backdrop-blur-xl p-10 rounded-3xl max-w-md w-full border border-purple-500/20 shadow-[0_0_60px_rgba(139,92,246,0.2)]"
            >
                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-8"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Sparkles className="w-7 h-7 text-purple-400" />
                        <motion.h1
                            animate={{
                                textShadow: [
                                    '0 0 20px rgba(139,92,246,0.5)',
                                    '0 0 30px rgba(139,92,246,0.8)',
                                    '0 0 20px rgba(139,92,246,0.5)',
                                ],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-4xl font-bold text-white"
                        >
                            Create Room
                        </motion.h1>
                    </div>
                    <p className="text-gray-400 text-sm">Start a new listening session</p>
                </motion.div>

                {/* Form */}
                <motion.form
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onSubmit={handleCreate}
                    className="space-y-6"
                >
                    <div>
                        <label className="block text-white font-medium mb-3 text-sm">
                            Your Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-zinc-700 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-300"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                />
                                Creating...
                            </span>
                        ) : (
                            'Create Room'
                        )}
                    </motion.button>
                </motion.form>

                {/* Back Button */}
                <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/')}
                    className="mt-6 w-full py-3.5 rounded-xl font-medium bg-black/50 border border-zinc-700 text-gray-300 hover:bg-black/70 hover:border-purple-500/50 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Home
                </motion.button>
            </motion.div>
        </div>
    );
};