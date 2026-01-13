import apiMain from "./apiMain";

export const getCardInfo = async (clientId) => {
    return await apiMain.get(`/card/${clientId}`);
};
export const removeCardInfo = async (clientId) => {
    return await apiMain.delete(`/card/${clientId}`);
};
export const updateCardInfo = async (clientId, data) => {
    return await apiMain.put(`/card/${clientId}`, data);
};
export const addCardInfo = async (data, clientId) => {
    return await apiMain.post(`/card/${clientId}`, data);
}