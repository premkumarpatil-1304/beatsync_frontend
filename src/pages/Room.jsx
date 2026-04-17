import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';
import { getRoomInfo } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';
import { MusicPlayer } from '../components/MusicPlayer';
import { FileUpload } from '../components/FileUpload';
import { UserList } from '../components/UserList';
import { RoomInfo } from '../components/RoomInfo';
import { ChatRoom } from '../components/ChatRoom';
import { FloatingReactions } from '../components/FloatingReactions';

export const Room = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [roomData, setRoomData] = useState(null);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [chatMessages, setChatMessages] = useState([]);
    const [reactions, setReactions] = useState([]);

    const userId = sessionStorage.getItem('userId');
    const isHost = sessionStorage.getItem('isHost') === 'true';

    const handleWebSocketMessage = useCallback((data) => {
        console.log('WebSocket message:', data);

        switch (data.type) {
            case 'state':
                setRoomData(data.data);
                setCurrentTrack(data.data.current_track);
                setIsPlaying(data.data.is_playing);
                setCurrentTime(data.data.current_time);
                break;

            case 'new_track':
                setCurrentTrack(data.data.track_url);
                toast.success(`New track: ${data.data.filename}`);
                break;

            case 'play':
                setCurrentTrack(data.data.current_track);
                setIsPlaying(true);
                setCurrentTime(data.data.current_time);
                break;

            case 'pause':
                setIsPlaying(false);
                setCurrentTime(data.data.current_time);
                break;

            case 'seek':
                setCurrentTime(data.data.current_time);
                break;

            case 'user_joined':
                toast.success(`${data.data.username || 'Someone'} joined the room`);
                fetchRoomInfo();
                break;

            case 'user_left':
                toast.info('A user left the room');
                fetchRoomInfo();
                break;

            case 'chat':
                setChatMessages(prev => [...prev, data.data]);
                break;

            case 'reaction':
                const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
                const startX = Math.random() * (windowWidth - 100);
                const endX = startX + (Math.random() * 200 - 100);
                const newReaction = { 
                    id: Date.now() + Math.random().toString(), 
                    emoji: data.data.emoji,
                    startX,
                    endX,
                    duration: 3 + Math.random() * 2
                };
                setReactions((prev) => [...prev, newReaction]);
                break;

            default:
                break;
        }
    }, []);

    const { sendMessage, isConnected } = useWebSocket(roomId, userId, handleWebSocketMessage);

    const fetchRoomInfo = async () => {
        try {
            const data = await getRoomInfo(roomId);
            setRoomData(data);
        } catch (error) {
            console.error('Failed to fetch room info:', error);
            toast.error('Failed to load room data');
        }
    };

    useEffect(() => {
        if (!userId) {
            toast.error('Please create or join a room first');
            navigate('/');
            return;
        }

        fetchRoomInfo();
    }, [roomId, userId, navigate]);

    const handlePlay = () => {
        sendMessage({
            type: 'play',
            track_url: currentTrack,
            current_time: currentTime,
        });
    };

    const handlePause = () => {
        sendMessage({
            type: 'pause',
            current_time: currentTime,
        });
    };

    const handleSeek = (newTime) => {
        sendMessage({
            type: 'seek',
            current_time: newTime,
        });
    };

    const handleUploadSuccess = () => {
        fetchRoomInfo();
    };

    const removeReaction = useCallback((id) => {
        setReactions(prev => prev.filter(r => r.id !== id));
    }, []);

    if (!roomData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center space-y-4">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"
                    />
                    <p className="text-gray-400">Loading room...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black p-4 md:p-8 relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto space-y-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between bg-zinc-900/50 backdrop-blur-sm p-4 rounded-2xl border border-zinc-800"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Leave Room
                    </motion.button>

                    <motion.div
                        className={`flex items-center gap-2 px-4 py-2 rounded-full ${isConnected
                                ? 'bg-green-500/10 text-green-400'
                                : 'bg-red-500/10 text-red-400'
                            }`}
                    >
                        {isConnected ? (
                            <>
                                <Wifi className="w-4 h-4" />
                                <span className="text-sm font-medium">Connected</span>
                            </>
                        ) : (
                            <>
                                <WifiOff className="w-4 h-4" />
                                <span className="text-sm font-medium">Disconnected</span>
                            </>
                        )}
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'
                                }`}
                        />
                    </motion.div>
                </motion.div>

                <RoomInfo roomId={roomId} />

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Player & Upload */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        <MusicPlayer
                            currentTrack={currentTrack}
                            isPlaying={isPlaying}
                            currentTime={currentTime}
                            onPlay={handlePlay}
                            onPause={handlePause}
                            onSeek={handleSeek}
                        />

                        <FileUpload
                            roomId={roomId}
                            isHost={isHost}
                            onUploadSuccess={handleUploadSuccess}
                        />
                    </motion.div>

                    {/* Right Column - Users */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <UserList users={roomData.users} hostId={roomData.host_id} />
                        <ChatRoom 
                            sendMessage={sendMessage} 
                            chatMessages={chatMessages} 
                            currentUserId={userId} 
                        />
                    </motion.div>
                </div>
            </div>
            
            <FloatingReactions reactions={reactions} removeReaction={removeReaction} />
        </div>
    );
};