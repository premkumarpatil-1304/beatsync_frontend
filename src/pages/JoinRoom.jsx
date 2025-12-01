import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { ArrowLeft, LogIn } from 'lucide-react';

export const JoinRoom = () => {
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleJoin = async (e) => {
        e.preventDefault();

        if (!roomId.trim()) {
            toast.error('Please enter a room ID');
            return;
        }

        if (!username.trim()) {
            toast.error('Please enter a username');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('https://sync-backend-1lxu.onrender.com/room/join', {
                room_id: roomId.trim(),
                username: username
            });

            console.log('✅ Joined room:', response.data);

            const { room_id, user_id } = response.data;

            sessionStorage.setItem('roomId', room_id);
            sessionStorage.setItem('userId', user_id);
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('isHost', 'false');

            console.log('Stored - RoomId:', room_id, 'UserId:', user_id);

            toast.success('Joined room successfully!');

            setTimeout(() => {
                navigate(`/room/${room_id}`);
            }, 100);

        } catch (error) {
            console.error('❌ Join room error:', error);

            if (error.response?.status === 404) {
                toast.error('Room not found');
            } else if (error.response?.status === 400) {
                toast.error('Room is full (max 4 users)');
            } else {
                toast.error('Failed to join room: ' + (error.response?.data?.detail || error.message));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black relative overflow-hidden">
            {/* Subtle animated background elements */}
            <div className="absolute inset-0 overflow-hidden opacity-30">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 bg-zinc-900/95 backdrop-blur-xl p-10 rounded-3xl max-w-md w-full border border-blue-500/20 shadow-[0_0_60px_rgba(59,130,246,0.2)]"
            >
                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-8"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <LogIn className="w-7 h-7 text-blue-400" />
                        <motion.h1
                            animate={{
                                textShadow: [
                                    '0 0 20px rgba(59,130,246,0.5)',
                                    '0 0 30px rgba(59,130,246,0.8)',
                                    '0 0 20px rgba(59,130,246,0.5)',
                                ],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-4xl font-bold text-white"
                        >
                            Join Room
                        </motion.h1>
                    </div>
                    <p className="text-gray-400 text-sm">Enter a room and start listening</p>
                </motion.div>

                {/* Form */}
                <motion.form
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onSubmit={handleJoin}
                    className="space-y-5"
                >
                    <div>
                        <label className="block text-white font-medium mb-3 text-sm">
                            Room ID
                        </label>
                        <input
                            type="text"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            placeholder="Enter room ID"
                            className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-zinc-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300"
                        />
                    </div>

                    <div>
                        <label className="block text-white font-medium mb-3 text-sm">
                            Your Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-zinc-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 mt-6"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                />
                                Joining...
                            </span>
                        ) : (
                            'Join Room'
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
                    className="mt-6 w-full py-3.5 rounded-xl font-medium bg-black/50 border border-zinc-700 text-gray-300 hover:bg-black/70 hover:border-blue-500/50 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Home
                </motion.button>
            </motion.div>
        </div>
    );
};