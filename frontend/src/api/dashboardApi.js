import apiMain from "./apiMain";

// 1. Dashboard Summary Stats
export const getDashboardStats = async () => {
  const res = await apiMain.get('/stats');
  return res.data;
};

// 2. Lead Status Breakdown  
export const getLeadStatusBreakdown = async () => {
  const res = await apiMain.get('/leads/status-breakdown');
  return res.data;
};

// 3. Sales Trend (pass days as query parameter)
export const getSalesTrend = async (days = 30) => {
  const query = days ? `?days=${days}` : '';
  const res = await apiMain.get(`/sales/trend${query}`);
  return res.data;
};

// 4. Revenue Trend (pass days as query parameter)  
export const getRevenueTrend = async (days = 30) => {
  const query = days ? `?days=${days}` : '';
  const res = await apiMain.get(`/revenue/trend${query}`);
  return res.data;
};

// 5. Top Performers
export const getTopPerformers = async ({ month, year } = {}) => {
  const params = new URLSearchParams();
  if (month) params.append("month", month);
  if (year) params.append("year", year);
  const res = await apiMain.get(`/performance/top-users`);
  return res.data;
};


// 6. Team Performance
export const getTeamPerformance = async () => {
  const res = await apiMain.get('/performance/teams');
  return res.data;
};

// 7. Recent Sales
export const getRecentSales = async () => {
  const res = await apiMain.get('/sales/recent');
  return res.data;
};

// 8. Recent Invoices
export const getRecentInvoices = async () => {
  const res = await apiMain.get('/invoices/recent');
  return res.data;
};

// 9. Invoice Summary (Pending, Paid, Partial)
export const getInvoiceSummary = async () => {
  const res = await apiMain.get('/invoices/summary');
  return res.data;
};

// 10. Lead Source Breakdown
export const getLeadSourcesBreakdown = async () => {
  const res = await apiMain.get('/leads/sources');
  return res.data;
};

// 11. Lead Follow-up Alerts
export const getLeadFollowUpAlerts = async () => {
  const res = await apiMain.get('/leads/follow-ups');
  return res.data;
};

// 12. Service Stats
// api
export const getServiceStats = async ({ period = "all", from, to } = {}) => {
  const params = new URLSearchParams();
  if (period) params.append("period", period);
  if (from) params.append("from", from);
  if (to) params.append("to", to);

  const res = await apiMain.get(`/services/stats?${params.toString()}`);
  return res.data;
};


// 13. System Activity (new users, remote access, suspended)
export const getSystemActivity = async () => {
  const res = await apiMain.get('/system/activity');
  return res.data;
};