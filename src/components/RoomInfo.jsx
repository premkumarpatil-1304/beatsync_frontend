import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const RoomInfo = ({ roomId }) => {
    const [copied, setCopied] = useState(false);

    const copyRoomId = () => {
        navigator.clipboard.writeText(roomId);
        setCopied(true);
        toast.success('Room ID copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="glass-card p-4 rounded-xl flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-400">Room ID</p>
                <p className="text-xl font-bold text-cyan-400">{roomId}</p>
            </div>
            <button
                onClick={copyRoomId}
                className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
                {copied ? (
                    <Check className="w-5 h-5 text-green-400" />
                ) : (
                    <Copy className="w-5 h-5 text-cyan-400" />
                )}
            </button>
        </div>
    );
};
