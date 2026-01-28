import axios from 'axios';
import { GET_ATTRIBUTE_CONSTRAINTS } from './apis/api.js';

export const getAttributeConstraints = async (item_id, item_iv) => {
    try {
        const response = await axios.get(GET_ATTRIBUTE_CONSTRAINTS, {
            params: {
                item_id: item_id,
                item_iv: item_iv
            }
        });
        return response.data.attribute_constraint;
    } catch (error) {
        return error;
    }
};
