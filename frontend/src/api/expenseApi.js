import apiMain from "./apiMain";



export const getExpense = async () => {
    const response = await apiMain.get('/expense');
    return response.data;
};
export const deleteExpense = async (id) => {
    const response = await apiMain.delete(`/expense/${id}`);
    return response.data;
};

export const addExpense = async (data) => {
    const responce = await apiMain.post("/expense", data, {
        headers: { 'content-Type': 'application/json' }
    })
    return responce.data
}