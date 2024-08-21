import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/api',
    
});


export const get = async (endpoint) => {
    try {
        const response = await instance.get(endpoint);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};


export const post = async (endpoint, body) => {
    try {
        const response = await instance.post(endpoint, body);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};


export const remove = async (endpoint, body) => {
    try {
        const response = await instance.delete(endpoint, {
            data: body // Wrapping the body inside `data`
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};



export const put = async (endpoint, body) => {
    try {
        const response = await instance.put(endpoint, body);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};