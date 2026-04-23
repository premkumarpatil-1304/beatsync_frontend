import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Music } from 'lucide-react';
import { API_BASE_URL } from '../services/api';
import { MiniAudioVisualizer } from './MiniAudioVisualizer';

export const MusicPlayer = ({
    currentTrack,
    isPlaying,
    currentTime,
    onPlay,
    onPause,
    onSeek,
    onGetLiveTime,
}) => {
    const audioRef = useRef(null);
    const [duration, setDuration] = useState(0);
    const [localTime, setLocalTime] = useState(0);
    const [analyser, setAnalyser] = useState(null);

    // Queued seek applied on the NEXT play call.
    // Set when a track loads or when an explicit server seek arrives while paused.
    const pendingSeekRef = useRef(null);

    // Expose live audio position to parent so play/pause WS messages carry the
    // real timestamp instead of stale React state.
    useEffect(() => {
        if (onGetLiveTime) {
            onGetLiveTime(() => audioRef.current?.currentTime ?? 0);
        }
    }, [onGetLiveTime]);

    // ── New track: load and queue a seek to the server's start position ──
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentTrack) return;
        audio.src = `${API_BASE_URL}${currentTrack}`;
        audio.load();
        pendingSeekRef.current = currentTime; // seek when first played
    }, [currentTrack]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Play / Pause ──────────────────────────────────────────────────
    // NEVER seeks here — only play() / pause().
    // Any required seek is queued in pendingSeekRef and consumed here.
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            // Apply any pending seek (initial position, or explicit server seek)
            if (pendingSeekRef.current !== null) {
                audio.currentTime = pendingSeekRef.current;
                pendingSeekRef.current = null;
            }
            audio.play().catch(err => console.log('Play error:', err));
        } else {
            audio.pause();
        }
    }, [isPlaying]);

    // ── Explicit server seek (e.g. another user scrubbed) ────────────
    // Only fires when currentTime changes significantly (> 1.5 s) vs
    // the actual audio position — not on every state refresh.
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const delta = Math.abs(currentTime - (audio.currentTime || 0));
        if (delta > 1.5) {
            if (isPlaying) {
                audio.currentTime = currentTime;
            } else {
                // Queue it; will be applied when play resumes
                pendingSeekRef.current = currentTime;
            }
        }
    }, [currentTime]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Listeners + AudioContext ──────────────────────────────────────
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setLocalTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);

        const initAudioContext = () => {
            if (analyser) return;
            const Ctx = window.AudioContext || window.webkitAudioContext;
            const ctx = new Ctx();
            const src = ctx.createMediaElementSource(audio);
            const node = ctx.createAnalyser();
            node.fftSize = 256;
            src.connect(node);
            node.connect(ctx.destination);
            setAnalyser(node);
            audio.removeEventListener('play', initAudioContext);
        };
        audio.addEventListener('play', initAudioContext);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('play', initAudioContext);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const formatTime = (t) => {
        if (!t || isNaN(t)) return '0:00';
        return `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
    };

    const handleSeek = (e) => {
        const t = parseFloat(e.target.value);
        if (audioRef.current) audioRef.current.currentTime = t;
        setLocalTime(t);
        onSeek(t);
    };

    const handleSkip = (secs) => {
        const t = Math.max(0, Math.min(duration, localTime + secs));
        if (audioRef.current) audioRef.current.currentTime = t;
        onSeek(t);
    };

    return (
        <div className="glass-card p-8 rounded-2xl space-y-6">
            <audio ref={audioRef} crossOrigin="anonymous" />

            {currentTrack ? (
                <>
                    <div className="space-y-2">
                        <input
                            type="range" min="0" max={duration || 0} value={localTime}
                            onChange={handleSeek}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>{formatTime(localTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {isPlaying && <MiniAudioVisualizer analyser={analyser} isPlaying={isPlaying} />}

                    <div className="flex justify-center items-center gap-4">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            onClick={() => handleSkip(-10)}
                            className="p-3 rounded-full bg-gray-800 text-cyan-400 hover:bg-gray-700">
                            <SkipBack className="w-6 h-6" />
                        </motion.button>

                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            onClick={isPlaying ? onPause : onPlay}
                            className="p-6 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/50">
                            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                        </motion.button>

                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            onClick={() => handleSkip(10)}
                            className="p-3 rounded-full bg-gray-800 text-cyan-400 hover:bg-gray-700">
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
