import { useEffect, useRef, useState } from 'react';
import { WS_BASE_URL } from '../services/api';

export const useWebSocket = (roomId, userId, onMessage) => {
    const ws = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const reconnectTimeout = useRef(null);

    useEffect(() => {
        if (!roomId || !userId) {
            console.log('No roomId or userId, skipping WebSocket connection');
            return;
        }

        const connect = () => {
            console.log(`Connecting to WebSocket: ${WS_BASE_URL}/ws/${roomId}/${userId}`);

            const websocket = new WebSocket(`${WS_BASE_URL}/ws/${roomId}/${userId}`);

            websocket.onopen = () => {
                console.log('WebSocket connected');
                setIsConnected(true);
            };

            websocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log('WebSocket message:', data);
                onMessage(data);
            };

            websocket.onerror = (error) => {
                console.error('WebSocket error:', error);
                setIsConnected(false);
            };

            websocket.onclose = () => {
                console.log('WebSocket disconnected');
                setIsConnected(false);

                // Try to reconnect after 3 seconds
                reconnectTimeout.current = setTimeout(() => {
                    console.log('Attempting to reconnect...');
                    connect();
                }, 3000);
            };

            ws.current = websocket;
        };

        connect();

        return () => {
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
            }
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [roomId, userId, onMessage]);

    const sendMessage = (message) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
            console.log('Sent message:', message);
        } else {
            console.error('WebSocket is not connected');
        }
    };

    return { sendMessage, isConnected };
};
