import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Music, Check, Link } from 'lucide-react';
import { toast } from 'sonner';
import { uploadMusic, uploadUrl } from '../services/api';

export const FileUpload = ({ roomId, isHost, onUploadSuccess }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleFileSelect = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            handleFiles(files);
        }
    };

    const handleFiles = async (files) => {
        if (!isHost) {
            toast.error('Only the host can upload music');
            return;
        }

        const audioFile = files.find((file) =>
            ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'].includes(file.type)
        );

        if (!audioFile) {
            toast.error('Please upload a valid audio file (MP3, WAV, OGG, M4A)');
            return;
        }

        setUploading(true);

        try {
            await uploadMusic(roomId, audioFile);
            toast.success('Music uploaded successfully!');
            onUploadSuccess();
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.detail || 'Failed to upload music');
        } finally {
            setUploading(false);
        }
    };

    const handleUrlSubmit = async (e) => {
        e.preventDefault();
        if (!isHost) {
            toast.error('Only the host can upload music');
            return;
        }
        
        if (!urlInput.trim()) {
            toast.error('Please enter a valid URL');
            return;
        }

        setUploading(true);
        try {
            await uploadUrl(roomId, urlInput.trim());
            toast.success('URL music added successfully!');
            setUrlInput('');
            onUploadSuccess();
        } catch (error) {
            console.error('URL upload error:', error);
            toast.error(error.response?.data?.detail || 'Failed to process URL');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-cyan-400">Upload Music</h3>
                <div className="text-xs text-gray-400">MP3, WAV, OGG, M4A</div>
            </div>

            <motion.div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                animate={{
                    borderColor: isDragging ? '#00F0FF' : '#444',
                    boxShadow: isDragging ? '0 0 20px #00F0FF' : 'none',
                }}
                className="border-2 border-dashed rounded-xl p-8 text-center space-y-4 cursor-pointer transition-all"
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={!isHost || uploading}
                />

                <motion.div
                    animate={{
                        y: isDragging ? -5 : 0,
                        scale: isDragging ? 1.1 : 1,
                    }}
                    className="flex justify-center"
                >
                    {uploading ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                            <Music className="w-12 h-12 text-purple-500" />
                        </motion.div>
                    ) : isDragging ? (
                        <Check className="w-12 h-12 text-cyan-400" />
                    ) : (
                        <Upload className="w-12 h-12 text-purple-500" />
                    )}
                </motion.div>

                <div>
                    <p className="text-white font-medium">
                        {uploading
                            ? 'Uploading...'
                            : isDragging
                                ? 'Drop your music here'
                                : 'Drag & drop your music here'}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">or click to browse</p>
                </div>

                {!isHost && (
                    <p className="text-sm text-red-500">Only the host can upload music</p>
                )}
            </motion.div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-zinc-900 text-gray-400">Or paste a link</span>
                </div>
            </div>

            <form onSubmit={handleUrlSubmit} className="flex gap-2">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Link className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        disabled={!isHost || uploading}
                        placeholder="YouTube or SoundCloud URL..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                    />
                </div>
                <motion.button
                    whileHover={isHost && !uploading ? { scale: 1.05 } : {}}
                    whileTap={isHost && !uploading ? { scale: 0.95 } : {}}
                    type="submit"
                    disabled={!isHost || uploading || !urlInput.trim()}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
                >
                    {uploading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        'Add'
                    )}
                </motion.button>
            </form>
        </div>
    );
};
