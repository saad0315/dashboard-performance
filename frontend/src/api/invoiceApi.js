import apiMain from "./apiMain";

export const getInvoices = async () => {
    return (await apiMain.get('/myInvoice')).data;
};
export const getAllInvoices = async () => {
    return (await apiMain.get('/invoice')).data;
};
export const createInstallment = async (id, data) => {
    return (await apiMain.put(`/invoice/${id}`, data));
};
export const updateInvoice = async (id, data) => {
    return (await apiMain.put(`/invoice/${id}`, data));
};
export const deleteInvoice = async (id, data) => {
    return (await apiMain.delete(`/invoice/${id}`, data));
};
export const getInvoiceId = async (id) => {
    return (await apiMain.get(`/clientInvoices/${id}`)).data;
};
export const getPartialInvoice = async (id) => {
    return (await apiMain.get(`/getPartialInvoice/${id}`)).data;
};
export const invoicePaymentApi = async (data) => {
    return apiMain.post('/payment', data);
};
export const invoiceApi = async (data) => {
    const response = await apiMain.post('/invoice', data);
    // console.log("resonponsee data " , response.data)
    return response.data;
};
export const createInstallmentApi = async (data) => {
    const response = await apiMain.post(`/createInstallment/${data.invoiceId}`, data);
    return response.data
};
export const invoiceEmailApi = async (id) => {
    const res = await apiMain.post(`/sendMail/${id}`);
    return res.data;
};
export const getTransaction = async (id) => {
    return (await apiMain.get(`/transaction/${id}`)).data;
};