import { motion, AnimatePresence } from 'framer-motion';
import { Users, Crown } from 'lucide-react';

export const UserList = ({ users, hostId }) => {
    return (
        <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">
                    Users ({users.length}/4)
                </h3>
            </div>

            <AnimatePresence>
                <div className="space-y-2">
                    {users.map((user) => (
                        <motion.div
                            key={user.user_id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                {user.username[0].toUpperCase()}
                            </div>
                            <span className="flex-1 text-white">{user.username}</span>
                            {user.user_id === hostId && (
                                <Crown className="w-5 h-5 text-yellow-400" />
                            )}
                        </motion.div>
                    ))}
                </div>
            </AnimatePresence>
        </div>
    );
};
