import axios from "axios";

const url = "http://localhost:3000/api/v1/Empleado";

export const getAll = async () => {
    try {
        const response = await axios.get(url);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

export const getById = async (id) => {
    try {
        const response = await axios.get(`${url}/${id}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching data with id ${id}:`, error);
        throw error;
    }
};

export const create = async (data) => {
    try {
        const response = await axios.post(url, data);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error creating data:", error);
        throw error;
    }
};

export const update = async (id, data) => {
    try {
        const response = await axios.put(`${url}/${id}`, data);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(`Error updating data with id ${id}:`, error);
        throw error;
    }
};

export const remove = async (id) => {
    try {
        const response = await axios.delete(`${url}/${id}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(`Error deleting data with id ${id}:`, error);
        throw error;
    }
};

export default { getAll, getById, create, update, remove };