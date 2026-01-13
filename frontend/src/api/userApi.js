import { BASE_URL } from "../constants/constants";
import apiMain from "./apiMain";

// export const loginApi = async (data) => {
//     const response = await fetch(BASE_URL+"login", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//     });
//     return response.json();
// }
export const loginApi = async (data) => {
  return apiMain.post("/login", data);
};
export const registerApi = async (data) => {
  return apiMain.post("/sign-up", data);
};
export const registerUserByAdmin = async (data) => {
  return apiMain.post("/registerUserByAdmin", data);
};
export const createPassword = async (data, token) => {
  return apiMain.put(`/resetPassword/${token}`, data);
};
export const forgotPassword = async (data) => {
  return apiMain.post(`/forgotPassword`, data);
};

export const getAllUsers = async () => {
  return (await apiMain.get("/getAllUsers")).data;
};
export const getAllMembers = async () => {
  return (await apiMain.get("/getAllMembers")).data;
};

export const searchUser = async (value) => {
  return (await apiMain.get(`searchUser?keyword=${value}`)).data;
};
export const updateProfile = async (data, id) => {
  return await apiMain.put(`/user/${id}`, data);
};
export const updateRole = async (role, id) => {
  return await apiMain.post(`/updateRole/${id}`, role);
};
export const removeUser = async (id) => {
  return await apiMain.delete(`/user/${id}`);
};
export const updateStatus = async (id, data) => {
  return await apiMain.post(`/updateAccountStatus/${id}`, data);
};
export const removeTeam = async (id) => {
  return await apiMain.put(`/removeTeam/${id}`);
};
export const assignedTeam = async (data) => {
  return await apiMain.post("/assignTeam", data);
};
