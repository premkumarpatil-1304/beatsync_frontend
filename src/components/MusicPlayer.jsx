import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Music } from 'lucide-react';
import { API_BASE_URL } from '../services/api';

export const MusicPlayer = ({ currentTrack, isPlaying, currentTime, onPlay, onPause, onSeek }) => {
    const audioRef = useRef(null);
    const [duration, setDuration] = useState(0);
    const [localTime, setLocalTime] = useState(0);

    useEffect(() => {
        if (audioRef.current && currentTrack) {
            audioRef.current.src = `${API_BASE_URL}${currentTrack}`;
            audioRef.current.load();
        }
    }, [currentTrack]);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.currentTime = currentTime;
                audioRef.current.play().catch(err => console.log('Play error:', err));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTime]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setLocalTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
        };
    }, []);

    const formatTime = (time) => {
        if (!time || isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSeek = (e) => {
        const newTime = parseFloat(e.target.value);
        setLocalTime(newTime);
        onSeek(newTime);
    };

    const handleSkip = (seconds) => {
        const newTime = Math.max(0, Math.min(duration, localTime + seconds));
        onSeek(newTime);
    };

    return (
        <div className="glass-card p-8 rounded-2xl space-y-6">
            <audio ref={audioRef} />

            {currentTrack ? (
                <>
                    <div className="flex justify-center">
                        <motion.div
                            animate={{ rotate: isPlaying ? 360 : 0 }}
                            transition={{ duration: 3, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
                            className="w-48 h-48 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center"
                        >
                            <div className="w-44 h-44 rounded-full bg-gray-900 flex items-center justify-center">
                                <Music className="w-16 h-16 text-cyan-400" />
                            </div>
                        </motion.div>
                    </div>

                    <div className="space-y-2">
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={localTime}
                            onChange={handleSeek}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>{formatTime(localTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    <div className="flex justify-center items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleSkip(-10)}
                            className="p-3 rounded-full bg-gray-800 text-cyan-400 hover:bg-gray-700"
                        >
                            <SkipBack className="w-6 h-6" />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={isPlaying ? onPause : onPlay}
                            className="p-6 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/50"
                        >
                            {isPlaying ? (
                                <Pause className="w-8 h-8" />
                            ) : (
                                <Play className="w-8 h-8" />
                            )}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleSkip(10)}
                            className="p-3 rounded-full bg-gray-800 text-cyan-400 hover:bg-gray-700"
                        >
                            <SkipForward className="w-6 h-6" />
                        </motion.button>
                    </div>
                </>
            ) : (
                <div className="text-center text-gray-400 py-16">
                    <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No track loaded</p>
                    <p className="text-sm">Upload music to get started</p>
                </div>
            )}
        </div>
    );
};
