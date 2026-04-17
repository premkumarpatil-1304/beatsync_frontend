import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

export const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL;
export { API_BASE_URL };
