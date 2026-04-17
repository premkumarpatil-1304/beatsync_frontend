import { useEffect, useRef, useState, useCallback } from 'react';
import { WS_BASE_URL } from '../services/api';

export const useWebSocket = (roomId, userId, onMessage) => {
    const ws = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const reconnectTimeout = useRef(null);
    const pingInterval = useRef(null);

    const connect = useCallback(() => {
        if (!roomId || !userId) {
            console.log('No roomId or userId, skipping WebSocket connection');
            return;
        }
        
        // Prevent multiple connections
        if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)) {
            return;
        }

        console.log(`Connecting to WebSocket: ${WS_BASE_URL}/ws/${roomId}/${userId}`);

        const websocket = new WebSocket(`${WS_BASE_URL}/ws/${roomId}/${userId}`);

        websocket.onopen = () => {
            console.log('WebSocket connected');
            setIsConnected(true);
            
            // Keep-alive ping every 20 seconds
            if (pingInterval.current) clearInterval(pingInterval.current);
            pingInterval.current = setInterval(() => {
                if (websocket.readyState === WebSocket.OPEN) {
                    websocket.send(JSON.stringify({ type: 'ping' }));
                }
            }, 20000);
        };

        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type !== 'pong') { // ignore our own ping responses if the server implements pong
                console.log('WebSocket message:', data);
                onMessage(data);
            }
        };

        websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
            setIsConnected(false);
        };

        websocket.onclose = () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
            if (pingInterval.current) clearInterval(pingInterval.current);

            // Try to reconnect after 3 seconds
            if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
            reconnectTimeout.current = setTimeout(() => {
                console.log('Attempting to reconnect...');
                connect();
            }, 3000);
        };

        ws.current = websocket;
    }, [roomId, userId, onMessage]);

    useEffect(() => {
        connect();

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                console.log('App became visible, checking connection...');
                if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
                    console.log('Socket not open on visibility gain, reconnecting instantly...');
                    if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
                    connect();
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
            if (pingInterval.current) clearInterval(pingInterval.current);
            if (ws.current) {
                // Ensure we don't trigger the onclose reconnect when deliberately unmounting
                ws.current.onclose = null;
                ws.current.close();
            }
        };
    }, [connect]);

    const sendMessage = useCallback((message) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
            console.log('Sent message:', message);
        } else {
            console.error('WebSocket is not connected');
        }
    }, []);

    return { sendMessage, isConnected };
};
