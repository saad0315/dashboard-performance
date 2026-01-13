import apiMain from "./apiMain";

export const getTeamPerformanceWithUsers = async (teamId, monthObj) => {
  // console.log("Fetching team performance for teamId:", teamId, "and month:", month);
  const month = monthObj
    ? `${monthObj.year}-${String(monthObj.month).padStart(2, "0")}`
    : null;
  // Build query string conditionally
  const query = month ? `?month=${month}` : "";

  const res = await apiMain.get(`/team/${teamId}/overall${query}`);
  return res.data;
};

export const getUserPerformance = async (userId, monthObj) => {
  // console.log("Fetching team performance for teamId:", teamId, "and month:", month);
  const month = monthObj
    ? `${monthObj.year}-${String(monthObj.month).padStart(2, "0")}`
    : null;
  // Build query string conditionally
  const query = month ? `?month=${month}` : "";

  const res = await apiMain.get(`/userPerf/${userId}${query}`);
  return res.data;
};

export const getDashboardPerformance = async (monthObj) => {
  // console.log("Fetching team performance for teamId:", teamId, "and month:", month);
  
    // console.log("fetching dashboard performance for month:", monthObj);
  const month = monthObj
    ? `${monthObj.year}-${String(monthObj.month).padStart(2, "0")}`
    : null;
  // Build query string conditionally
  const query = month ? `?month=${month}` : "";

  const res = await apiMain.get(`/dashboard${query}`);
  return res.data;
};
