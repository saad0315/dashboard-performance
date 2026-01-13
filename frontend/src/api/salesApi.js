import apiMain from "./apiMain";

export const getSales = async (saleType) => {
  let query = `/sale`;
  if (saleType && saleType.trim() !== "") {
    query += `?saleType=${saleType}`;
  }
  const response = await apiMain.get(query);
  return response.data;
};

export const getSalesTeam = async (id) => {
  const response = await apiMain.get(`/getTeam/${id}`);
  return response.data;
};
export const deleteSale = async (id) => {
  const response = await apiMain.delete(`/sale/${id}`);
  return response.data;
};

export const getSalesByMonth = async () => {
  const response = await apiMain.get("/salesByMonth");
  return response.data;
};
export const getSalesBySalesPerson = async (id) => {
  const response = await apiMain.get(`/getSalesBySalesPerson/${id}`);
  return response.data;
};
export const getSalesByClient = async (id) => {
  const response = await apiMain.get(`/getSalesByClient/${id}`);
  return response.data;
};
export const getSalesByLead = async (id) => {
  const response = await apiMain.get(`/getSalesByLead/${id}`);
  return response.data;
};

export const addTeam = async (data) => {
  const response = await apiMain.post("/team", data);
  return response.data;
};

export const deleteTeam = async (id) => {
  const response = await apiMain.delete(`/team/${id}`);
  return response.data;
};
export const getTeam = async () => {
  const response = await apiMain.get("/team");
  return response.data;
};
export const addSales = async (data) => {
  const responce = await apiMain.post("/sale", data, {
    headers: { 'content-Type': 'multipart/form-data' },
  });
  return responce.data;
};
export const updateSales = async (data, id) => {
  const response = await apiMain.put(`/sale/${id}`, data, {
    headers: { "Content-Type": "application/json" }
  });
  return response.data;
};
