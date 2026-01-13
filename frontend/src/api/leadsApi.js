import apiMain from "./apiMain";

export const getLeads = async (keyword = "", page, pageSize = 10, assigned, companyName, selectedmonth, status) => {
  let query = `/leads/search?keyword=${keyword}&page=${page}&pageSize=${pageSize}`;

  // Only add assignedTo if it's non-empty and defined
  if (assigned && assigned.trim() !== "") {
    query += `&assigned=${encodeURIComponent(assigned)}`;
  }

  if (companyName && companyName.trim() !== "") {
    query += `&companyName=${companyName}`;
  }
  if (selectedmonth && selectedmonth.trim() !== "") {
    query += `&selectedmonth=${selectedmonth}`;
  }
  if (status && status.trim() !== "") {
    query += `&status=${status}`;
  }

  const response = await apiMain.get(query);
  return response.data;
};

export const getConvertedLeads = async (keyword = "", page, status = 'Converted') => {
  const response = await apiMain.get(
    `/leads/search?keyword=${keyword}&page=${page}&status=${status}`
  );
  return response.data;
};
export const getSignups = async (keyword = "", page, pageSize = 10 , companyName = 'Rank1Pro') => {
  const response = await apiMain.get(
    `/getForms/search?keyword=${keyword}&page=${page}&pageSize=${pageSize}&companyName=${companyName} `
  );
  return response.data;
};
export const getOldSignups = async (keyword = "", page, pageSize = 10, status) => {
  let query = `/getOldLeads/search?keyword=${keyword}&page=${page}&pageSize=${pageSize}`;

  if (status && status.trim() !== "") {
    query += `&status=${status}`;
  }
 
  const response = await apiMain.get(query);
  return response.data;
};

export const deleteSignupById = async (id) => {
  const response = await apiMain.delete(`/form/${id}`);
  return response.data;
};
export const getLeadsById = async (id) => {
  const response = await apiMain.get(`/myLeads/${id}`);
  return response.data;
};
export const getAllLeads = async () => {
  const response = await apiMain.get(`/allLeads`);
  return response.data;
};
export const getConvertedFormIds = async () => {
  const response = await apiMain.get(`/convertedFormIds`);
  return response.data;
};
export const getAllSignups = async () => {
  const response = await apiMain.get(`/getForms`);
  return response.data;
};
export const LeadById = async (id) => {
  const response = await apiMain.get(`/lead/${id}`);
  return response.data;
};
export const deleteLead = async (id) => {
  const response = await apiMain.delete(`/lead/${id}`);
  return response.data;
};
export const markLead = async (id) => {
  const response = await apiMain.post(`/markLeadAsSeen/${id}`);
  return response.data;
};
export const addLeads = async (data) => {
  const response = await apiMain.post("/register", data, {
    headers: { "content-Type": "application/json" },
  });
  return response.data;
};
export const updateLead = async (data, id) => {
  const response = await apiMain.put(`/lead/${id}`, data, {
    headers: { "content-Type": "application/json" },
  });
  return response.data;
};
export const updateOldLead = async (data, id) => {
  const response = await apiMain.put(`/oldLead/${id}`, data, {
    headers: { "content-Type": "application/json" },
  });
  return response.data;
};
