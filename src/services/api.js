import axios from 'axios';

// We use import.meta.env.VITE_API_BASE_URL.
// Added the fallback so your live site doesn't break while you add env vars to your deployment platform!
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://beatsync-backend-6.onrender.com';


export const createRoom = async (username) => {
    const response = await axios.post(`${API_BASE_URL}/room/create`, {
        username
    });
    return response.data;
};

export const joinRoom = async (roomId, username) => {
    const response = await axios.post(`${API_BASE_URL}/room/join`, {
        room_id: roomId,
        username
    });
    return response.data;
};

export const getRoomInfo = async (roomId) => {
    const response = await axios.get(`${API_BASE_URL}/room/${roomId}`);
    return response.data;
};

export const uploadMusic = async (roomId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(
        `${API_BASE_URL}/upload-music/${roomId}`,
        formData,
        {
            headers: { 'Content-Type': 'multipart/form-data' }
        }
    );
    return response.data;
};
export const uploadUrl = async (roomId, url) => {
    const response = await axios.post(`${API_BASE_URL}/upload-url/${roomId}`, { url });
    return response.data;
};

// Convert http:// to ws:// and https:// to wss://
export const WS_BASE_URL = API_BASE_URL ? API_BASE_URL.replace(/^http/, 'ws') : '';
export { API_BASE_URL };
