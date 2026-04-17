import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Smile } from 'lucide-react';

const QUiCK_EMOJIS = ['🔥', '❤️', '🎉', '😂', '🙌', '🎵'];

export const ChatRoom = ({ sendMessage, chatMessages, currentUserId }) => {
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        sendMessage({
            type: 'chat',
            message: messageInput.trim()
        });
        setMessageInput('');
    };

    const handleReaction = (emoji) => {
        sendMessage({
            type: 'reaction',
            emoji: emoji
        });
    };

    return (
        <div className="glass-card flex flex-col  h-[400px] rounded-2xl border-blue-500 border-1 overflow-hidden mt-31">
            <div className="bg-zinc-900/50 p-4 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="font-bold text-blue-400">Room Chat</h3>
                <div className="flex gap-2">
                    {QUiCK_EMOJIS.map(emoji => (
                        <motion.button
                            key={emoji}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleReaction(emoji)}
                            className="text-lg hover:bg-zinc-800 p-1 rounded-md transition-colors"
                        >
                            {emoji}
                        </motion.button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {chatMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
                        <Smile className="w-8 h-8 opacity-50" />
                        <p className="text-sm">Be the first to say hello!</p>
                    </div>
                ) : (
                    chatMessages.map((msg, index) => {
                        const isMe = msg.user_id === currentUserId;
                        return (
                            <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                {!isMe && <span className="text-xs text-gray-400 ml-1 mb-1">{msg.username}</span>}
                                <div 
                                    className={`px-4 py-2 rounded-2xl max-w-[85%] break-words shadow-sm ${
                                        isMe 
                                        ? 'bg-blue-600 text-white rounded-br-none' 
                                        : 'bg-zinc-800 text-gray-200 rounded-bl-none'
                                    }`}
                                >
                                    {msg.message}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 bg-zinc-900/30 border-t border-zinc-800">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full bg-zinc-800 text-white placeholder-gray-400 rounded-full pl-4 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-zinc-700"
                    />
                    <button 
                        type="submit"
                        disabled={!messageInput.trim()}
                        className="absolute right-2 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                    >
                        <Send className="w-4 h-4 ml-0.5" />
                    </button>
                </div>
            </form>
        </div>
    );
};
