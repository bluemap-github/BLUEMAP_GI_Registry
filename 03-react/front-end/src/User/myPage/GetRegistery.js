import axios from "axios";
import { GET_OWN_REGISTRIES } from "../api";

export const getOwnRegistries = async (role) => {
    const token = localStorage.getItem('jwt');
    try {
        const response = await axios.get(GET_OWN_REGISTRIES, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            params: {
                role: role,
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error(error.message);
        }
    }
};
