import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactApexChart from "react-apexcharts";
import { setPageTitle } from "../store/themeConfigSlice";
import IconDollarSign from "../components/Icon/IconDollarSign";
import IconInbox from "../components/Icon/IconInbox";
import IconTag from "../components/Icon/IconTag";
import IconCreditCard from "../components/Icon/IconCreditCard";
import IconCashBanknotes from "../components/Icon/IconCashBanknotes";

import { getSales, getSalesByMonth } from "../api/salesApi";
import { useQuery } from "@tanstack/react-query";
import { getAllLeads, getLeads } from "../api/leadsApi";
import { getExpense } from "../api/expenseApi";
import {
  combineAndSortData,
  getLeadsByCategory,
  getRevenueChart,
  getTopPackages,
} from "../utils/Utils";
import {
  DataTableSkeleton,
  RecentTransactionSkeleton,
  SkeletonSummaryCard,
} from "../components/Skeletons/Skeletons";
import IconMenuDocumentation from "../components/Icon/Menu/IconMenuDocumentation";
import { getDashboardPerformance } from "../api/performanceApi";
import IconUser from "../components/Icon/IconUser";

import {
  getDashboardStats,
  getLeadStatusBreakdown,
  getSalesTrend,
  getRevenueTrend,
  // getTopPerformers,
  getTeamPerformance,
  getRecentSales,
  getRecentInvoices,
  getInvoiceSummary,
  getLeadSourcesBreakdown,
  getLeadFollowUpAlerts,
  // getServiceStats,
  getSystemActivity
} from "../api/dashboardApi";
import FollowUpAlertsPanel from "../components/DashboardComponents/followUpPanel";
import ServicesStatsPanel from "../components/DashboardComponents/servicesStatsPanel";
import TopPerformersPanel from "../components/DashboardComponents/TopPerformancePanel";

const Index = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle("Sales Admin"));
  });
  const { isLoading: dashboardStatsLoading, data: dashboardStats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
  });

  const { isLoading: leadStatusLoading, data: leadStatusData } = useQuery({
    queryKey: ["leadStatusBreakdown"],
    queryFn: getLeadStatusBreakdown,
  });

  const [salesTrendDays, setSalesTrendDays] = useState(30);
  const { isLoading: salesTrendLoading, data: salesTrendData } = useQuery({
    queryKey: ["salesTrend", salesTrendDays],
    queryFn: () => getSalesTrend(salesTrendDays),
  });

  const [revenueTrendDays, setRevenueTrendDays] = useState(30);
  const { isLoading: revenueTrendLoading, data: revenueTrendData } = useQuery({
    queryKey: ["revenueTrend", revenueTrendDays],
    queryFn: () => getRevenueTrend(revenueTrendDays),
  });

  // const { isLoading: topPerformersLoading, data: topPerformersData } = useQuery({
  //   queryKey: ["topPerformers"],
  //   queryFn: getTopPerformers,
  // });

  const { isLoading: teamPerformanceLoading, data: teamPerformanceData } = useQuery({
    queryKey: ["teamPerformance"],
    queryFn: getTeamPerformance,
  });

  const { isLoading: recentSalesLoading, data: recentSalesData } = useQuery({
    queryKey: ["recentSales"],
    queryFn: getRecentSales,
  });

  const { isLoading: recentInvoicesLoading, data: recentInvoicesData } = useQuery({
    queryKey: ["recentInvoices"],
    queryFn: getRecentInvoices,
  });

  const { isLoading: invoiceSummaryLoading, data: invoiceSummaryData } = useQuery({
    queryKey: ["invoiceSummary"],
    queryFn: getInvoiceSummary,
  });

  const { isLoading: leadSourcesLoading, data: leadSourcesData } = useQuery({
    queryKey: ["leadSources"],
    queryFn: getLeadSourcesBreakdown,
  });

  const { isLoading: followUpAlertsLoading, data: followUpAlertsData } = useQuery({
    queryKey: ["followUpAlerts"],
    queryFn: getLeadFollowUpAlerts,
  });

  // const { isLoading: serviceStatsLoading, data: serviceStatsData } = useQuery({
  //   queryKey: ["serviceStats"],
  //   queryFn: getServiceStats,
  // });

  const { isLoading: systemActivityLoading, data: systemActivityData } = useQuery({
    queryKey: ["systemActivity"],
    queryFn: getSystemActivity,
  });

  const { isLoading: salesLoading, data: allSales } = useQuery({
    queryKey: ["Sales"],
    queryFn: getSales,
  });

  const { isLoading, data: salesData } = useQuery({
    queryKey: ["MonthlySale"],
    queryFn: getSalesByMonth,
  });

  const { isLoading: expenseLoading, data: expenseData } = useQuery({
    queryKey: ["expense"],
    queryFn: getExpense,
  });

  const {
    isLoading: leadsLoading,
    data: leadsData,
    status,
  } = useQuery({
    queryKey: ["allLeads"],
    queryFn: getAllLeads,
  });

  const [topPackages, setTopPackages] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [selectedLeadMonth, setSelectedLeadMonth] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(
      2,
      "0"
    )}`
  );
  const [selectedSellMonth, setSelectedSellMonth] = useState(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(
      2,
      "0"
    )}`
  );
  // const [selectedDashboardMonth, setSelectedDashboardMonth] = useState({
  //   year: new Date().getFullYear(),
  //   month: new Date().getMonth() + 1,
  // });
  const [selectedDashboardMonth, setSelectedDashboardMonth] = useState(null);

  const [leads, setLeads] = useState(null);
  const [monthlySalesAmount, setMonthlySalesAmount] = useState(null);
  const [chartData, setChartData] = useState({
    series: [
      { name: "Income", data: [] },
      { name: "Expenses", data: [] },
      { name: "Profit", data: [] },
    ],
  });
  const [summaryData, setSummaryData] = useState({
    income: 0,
    expense: 0,
    profit: 0,
  });
  const [totalProfit, setTotalProfit] = useState(0);

  const isDark = useSelector(
    (state) =>
      state.themeConfig.theme === "dark" || state.themeConfig.isDarkMode
  );
  const isRtl =
    useSelector((state) => state.themeConfig.rtlClass) === "rtl" ? true : false;
  // useEffect(() => {
  //   if (salesData?.salesByMonth) {
  //     setSelectedMonth(salesData?.salesByMonth[0]._id.month);
  //   }
  // }, [salesData]);

  const [loading] = useState(false);

  const extractAmounts = (sales) => {
    return sales?.map((sale) => sale.amount);
  };

  const [recentEntries, setRecentEntries] = useState([]);
  const {
    isLoading: dashboardLoading,
    data: dashboardData,
  } = useQuery({
    queryKey: ["dashboardPerformance", selectedDashboardMonth],
    queryFn: () => getDashboardPerformance(selectedDashboardMonth),
  });

  const [revenueChartData, setRevenueChartData] = useState({
    series: [{ name: "Revenue", data: [] }],
    categories: []
  });

  // Prepare chart data for sales trend  
  const [salesChartData, setSalesChartData] = useState({
    series: [{ name: "Sales", data: [] }],
    categories: []
  });

  // Prepare donut chart data for lead status
  const [leadStatusChartData, setLeadStatusChartData] = useState({
    series: [],
    labels: []
  });

  useEffect(() => {
    if (salesData && expenseData) {
      const combinedData = combineAndSortData(salesData);
      setRecentEntries(combinedData);
    }
  }, [salesData, expenseData]);

  useEffect(() => {
    if (salesData?.salesByMonth && expenseData?.expensesByMonth) {
      const incomeData = new Array(12).fill(0);
      const expensesData = new Array(12).fill(0);
      const profitData = new Array(12).fill(0);

      const filteredSalesData = salesData.salesByMonth.filter(
        (monthData) => monthData._id.year === selectedYear
      );
      const filteredExpenseData = expenseData.expensesByMonth.filter(
        (monthData) => monthData._id.year === selectedYear
      );

      salesData?.salesByMonth.forEach((monthData) => {
        const monthIndex = monthData._id.month - 1;
        incomeData[monthIndex] = monthData.total;
      });

      expenseData?.expensesByMonth.forEach((monthData) => {
        const monthIndex = monthData._id.month - 1;
        expensesData[monthIndex] = monthData.total;
      });

      // filteredSalesData.forEach((monthData) => {
      //   const monthIndex = monthData._id.month - 1;
      //   incomeData[monthIndex] = monthData.total;
      // });

      // filteredExpenseData.forEach((monthData) => {
      //   const monthIndex = monthData._id.month - 1;
      //   expensesData[monthIndex] = monthData.total;
      // });

      // incomeData.forEach((income, index) => {
      //   profitData[index] = income - expensesData[index];
      // });

      const totalProfitValue = incomeData.reduce(
        (acc, income) => acc + income,
        0
      );
      setTotalProfit(totalProfitValue);
      setChartData((prevState) => ({
        ...prevState,
        series: [
          { name: "Income", data: incomeData },
          // { name: "Expenses", data: expensesData },
        ],
      }));
    }
  }, [salesData, expenseData, selectedYear]);

  useEffect(() => {
    if (salesData?.salesByMonth && expenseData?.expensesByMonth) {
      const [year, month] = selectedMonth.split("-").map(Number);

      const filteredSalesData = salesData.salesByMonth.find(
        (item) => item._id.year === year && item._id.month === month
      );
      const filteredExpenseData = expenseData.expensesByMonth.find(
        (item) => item._id.year === year && item._id.month === month
      );

      const income = filteredSalesData ? filteredSalesData.total : 0;
      const expense = filteredExpenseData ? filteredExpenseData.total : 0;
      const profit = income - expense;

      setSummaryData({ income, expense, profit });
    }
  }, [selectedMonth, salesData, expenseData]);

  useEffect(() => {
    if (salesData?.salesByMonth) {
      const [year, month] = selectedSellMonth.split("-").map(Number);

      const filteredSalesData = salesData.salesByMonth.find(
        (item) => item._id.year === year && item._id.month === month
      );

      const veryTop = getTopPackages(filteredSalesData);
      setTopPackages(veryTop);
    }
  }, [selectedSellMonth, salesData]);

  useEffect(() => {
    if (selectedLeadMonth && leadsData?.leadByMonth) {
      const filteredData = leadsData?.leadByMonth.find(
        (item) =>
          item._id.month === selectedLeadMonth.month &&
          item._id.year === selectedLeadMonth.year
      );
      if (filteredData) {
        setLeads(filteredData);
      }
    }
  }, [selectedLeadMonth, leadsData]);

  useEffect(() => {
    if (leadsData?.leadByMonth) {
      const lastIndex = leadsData?.leadByMonth?.length - 1;
      const lastMonthYear = leadsData?.leadByMonth[lastIndex]?._id;
      setSelectedLeadMonth({
        year: lastMonthYear?.year,
        month: lastMonthYear?.month,
      });
    }
  }, [leadsData]);

  useEffect(() => {
    if (revenueTrendData) {
      const categories = revenueTrendData.map(item => item._id);
      const data = revenueTrendData.map(item => item.revenue);
      setRevenueChartData({
        series: [{ name: "Revenue", data }],
        categories
      });
    }
  }, [revenueTrendData]);

  // Prepare sales trend chart data
  useEffect(() => {
    if (salesTrendData) {
      const categories = salesTrendData.map(item => item._id);
      const data = salesTrendData.map(item => item.totalSales);
      setSalesChartData({
        series: [{ name: "Sales", data }],
        categories
      });
    }
  }, [salesTrendData]);

  // Prepare lead status chart data
  useEffect(() => {
    if (leadStatusData) {
      const labels = Object.keys(leadStatusData);
      const series = Object.values(leadStatusData);
      setLeadStatusChartData({ series, labels });
    }
  }, [leadStatusData]);

  const handleMonthChange = (value) => {
    const [year, month] = value.split("-");
    setSelectedLeadMonth({
      year: parseInt(year, 10),
      month: parseInt(month, 10),
    });
  };

  const countLeadsByStatus = (leads) => {
    const statusCounts = {
      New: 0,
      FollowUp: 0,
      Converted: 0,
      Lost: 0,
      Contacted: 0,
      Invalid: 0,
      Qualified: 0,
    };
    // Ensure leads is an array
    if (!Array.isArray(leads)) {
      leads = [];
    }
    leads?.forEach((lead) => {
      statusCounts[lead.status] += 1;
    });

    return Object.values(statusCounts);
  };

  const revenueChart = getRevenueChart(isDark, isRtl);
  const leadsByCategory = getLeadsByCategory(isDark);

  const handleDashboardMonthChange = (e) => {
    const value = e.target.value;

    if (!value) {
      setSelectedDashboardMonth(null); // show all data if cleared
    } else {
      const [year, month] = value.split("-");
      setSelectedDashboardMonth({
        year: parseInt(year),
        month: parseInt(month),
      });
    }
  };
  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link to="#" className="text-primary hover:underline">
            Dashboard
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Sales</span>
        </li>
      </ul>

      <div className="pt-5">
        {/* // Add this where you want to render the UI */}
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6 mb-6">
          {/* <div className="panel bg-gradient-to-r from-cyan-500 to-cyan-400"> */}
          <div className="panel bg-gradient-to-r from-teal-400/60 to-cyan-300/60 
backdrop-blur-lg border border-white/20 
hover:from-teal-300/70 hover:to-cyan-200/70 
transition duration-300 shadow-md hover:shadow-lg">
            <div className="flex justify-between">
              <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold !text-white">Total Leads</div>
              <div className="dropdown">
                <IconInbox className="text-white-light hover:text-white" />
              </div>
            </div>
            <div className="flex items-center mt-5">
              <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3 text-white-light">
                {dashboardStatsLoading ? "..." : dashboardStats?.totalLeads || 0}
              </div>
            </div>
            <div className="flex items-center font-semibold mt-5">
              <IconTag className="w-5 h-5 text-white-light ltr:mr-2 rtl:ml-2" />
              <div className="text-white-light">New Today: {dashboardStats?.newLeadsToday || 0}</div>
            </div>
          </div>

          {/* <div className="panel bg-gradient-to-r from-violet-500 to-violet-400"> */}
          <div className="panel bg-gradient-to-r from-violet-400/60 to-purple-300/60 
backdrop-blur-lg border border-white/20 
hover:from-violet-300/70 hover:to-purple-200/70 
transition duration-300 shadow-md hover:shadow-lg">

            <div className="flex justify-between">
              <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold !text-white">Total Sales</div>
              <div className="dropdown">
                <IconCreditCard className="text-white-light hover:text-white" />
              </div>
            </div>
            <div className="flex items-center mt-5">
              <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3 text-white-light">
                {dashboardStatsLoading ? "..." : dashboardStats?.totalSales || 0}
              </div>
            </div>
            <div className="flex items-center font-semibold mt-5">
              <IconDollarSign className="w-5 h-5 text-white-light ltr:mr-2 rtl:ml-2" />
              <div className="text-white-light">New Today: {dashboardStats?.newSalesToday || 0}</div>
            </div>
          </div>

          {/* <div className="panel bg-gradient-to-r from-blue-500 to-blue-400"> */}
          <div className="panel bg-gradient-to-r from-sky-400/60 to-blue-300/60 
backdrop-blur-lg border border-white/20 
hover:from-sky-300/70 hover:to-blue-200/70 
transition duration-300 shadow-md hover:shadow-lg">

            <div className="flex justify-between">
              <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold !text-white">Total Revenue</div>
              <div className="dropdown">
                <IconCashBanknotes className="text-white-light hover:text-white" />
              </div>
            </div>
            <div className="flex items-center mt-5">
              <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3 text-white-light">
                ${dashboardStatsLoading ? "..." : (dashboardStats?.totalRevenue || 0).toLocaleString()}
              </div>
            </div>
            <div className="flex items-center font-semibold mt-5">
              <IconTag className="w-5 h-5 text-white-light ltr:mr-2 rtl:ml-2" />
              <div className="text-white-light">Net: ${(dashboardStats?.netRevenue || 0).toLocaleString()}</div>
            </div>
          </div>

          {/* <div className="panel bg-gradient-to-r from-fuchsia-500 to-fuchsia-400"> */}
          <div className="panel bg-gradient-to-r from-pink-400/60 to-fuchsia-300/60 
backdrop-blur-lg border border-white/20 
hover:from-pink-300/70 hover:to-fuchsia-200/70 
transition duration-300 shadow-md hover:shadow-lg">
            <div className="flex justify-between">
              <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold !text-white">Conversion Rate</div>
              <div className="dropdown">
                <IconUser className="text-white-light hover:text-white" />
              </div>
            </div>
            <div className="flex items-center mt-5">
              <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3 text-white-light">
                {dashboardStatsLoading ? "..." : `${dashboardStats?.conversionRate || 0}%`}
              </div>
            </div>
            <div className="flex items-center font-semibold mt-5">
              <IconUser className="w-5 h-5 text-white-light ltr:mr-2 rtl:ml-2" />
              <div className="text-white-light">Active Users: {dashboardStats?.activeUsers || 0}</div>
            </div>
          </div>
        </div>
        {/* <div className="panel mb-6 "> */}
        <div className="panel mb-6 bg-gradient-to-br from-[rgba(20,30,48,0.6)] to-[rgba(36,59,85,0.4)] backdrop-blur-lg rounded-xl border border-white/10 p-5">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-5">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Team-wise Monthly & Overall Performance
            </h5>
            <input
              type="month"
              value={
                selectedDashboardMonth
                  ? `${selectedDashboardMonth.year}-${String(selectedDashboardMonth.month).padStart(2, "0")}`
                  : ""
              }
              onChange={handleDashboardMonthChange}
              className="select form-input w-auto "
            />
          </div>

          {dashboardLoading ? (
            <div className="min-h-[300px] flex items-center justify-center">
              <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-4 gap-4 mb-6 ">
                <div className="p-4 bg-white dark:bg-black rounded-lg shadow">
                  <h6 className="text-sm text-white mb-1">Leads Assigned</h6>
                  <p className="text-xl font-bold text-teal-400">
                    {dashboardData?.overallStats?.totalLeadsAssigned}
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-black rounded-lg shadow">
                  <h6 className="text-sm text-white mb-1">Total Deals</h6>
                  <p className="text-xl font-bold text-purple-400">
                    {dashboardData?.overallStats?.totalDeals}
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-black rounded-lg shadow">
                  <h6 className="text-sm text-white mb-1">Total Sales</h6>
                  <p className="text-xl font-bold text-sky-400">
                    ${dashboardData?.overallStats?.totalSales.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-black rounded-lg shadow">
                  <h6 className="text-sm text-white mb-1">Conversion Rate</h6>
                  <p className="text-xl font-bold text-pink-400">
                    {dashboardData?.overallStats?.overallConversionRate?.toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium">Team</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Leads Assigned</th>
                      {/* <th className="px-4 py-2 text-left text-sm font-medium">Converted</th> */}
                      <th className="px-4 py-2 text-left text-sm font-medium">Sales</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Deals</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                    {dashboardData?.teamsPerformance?.map((team, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-white/5">
                        <td className="px-4 py-2 font-semibold flex gap-2 items-center">
                          <Link to={`/team-dashboard/${team?.team?._id}`} className="cursor-pointer flex gap-2 hover:underline hover:text-primary" >
                            <IconUser className="text-primary w-5 h-5" />
                            <span>{team?.team?.teamName}</span>
                          </Link>
                        </td>
                        <td className="px-4 py-2">{team?.performance?.leadsAssigned}</td>
                        {/* <td className="px-4 py-2">{team?.performance?.leadsConverted}</td> */}
                        <td className="px-4 py-2 text-success font-medium">
                          ${team?.performance?.totalSales.toLocaleString()}
                        </td>
                        <td className="px-4 py-2">{team?.performance?.totalDeals}</td>
                        <td className="px-4 py-2">
                          {team?.performance?.conversionRate?.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Charts Section */}
        {/* <div className="grid grid-cols-12 xl:grid-cols-2 gap-6 mb-6">
          <div className="panel h-full">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between dark:text-white-light mb-5">
              <h5 className="font-semibold text-lg">Revenue Trend</h5>
              <select
                value={revenueTrendDays}
                onChange={(e) => setRevenueTrendDays(parseInt(e.target.value))}
                className="form-select w-auto px-7"
              >
                <option value={7}>Last 7 Days</option>
                <option value={30}>Last 30 Days</option>
                <option value={90}>Last 90 Days</option>
              </select>
            </div>
            <div className="relative">
              <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                {revenueTrendLoading ? (
                  <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08]">
                    <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent rounded-full w-5 h-5 inline-flex"></span>
                  </div>
                ) : (
                  <ReactApexChart
                    series={revenueChartData.series}
                    options={{
                      ...revenueChart.options,
                      xaxis: { ...revenueChart.options.xaxis, categories: revenueChartData.categories }
                    }}
                    type="line"
                    height={325}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="panel h-full">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between dark:text-white-light mb-5">
              <h5 className="font-semibold text-lg">Sales Trend</h5>
              <select
                value={salesTrendDays}
                onChange={(e) => setSalesTrendDays(parseInt(e.target.value))}
                className="form-select w-auto px-7"
              >
                <option value={7}>Last 7 Days</option>
                <option value={30}>Last 30 Days</option>
                <option value={90}>Last 90 Days</option>
              </select>
            </div>
            <div className="relative">
              <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                {salesTrendLoading ? (
                  <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08]">
                    <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent rounded-full w-5 h-5 inline-flex"></span>
                  </div>
                ) : (
                  <ReactApexChart
                    series={salesChartData.series}
                    options={{
                      ...revenueChart.options,
                      xaxis: { ...revenueChart.options.xaxis, categories: salesChartData.categories },
                      colors: ['#00ab55']
                    }}
                    type="line"
                    height={325}
                  />
                )}
              </div>
            </div>
          </div>
        </div> */}

        <div className="xl:grid-cols-3 gap-6 mb-6">
          {/* Lead Status Breakdown */}
          <div className="panel h-full xl:col-span-2">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between dark:text-white-light mb-5">
              <h5 className="font-semibold text-lg dark:text-white-light">
                Lead Status Breakdown
              </h5>
            </div>
            <div>
              <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                {leadStatusLoading ? (
                  <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08]">
                    <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent rounded-full w-5 h-5 inline-flex"></span>
                  </div>
                ) : (
                  <ReactApexChart
                    series={leadStatusChartData.series}
                    options={{
                      ...leadsByCategory.options,
                      labels: leadStatusChartData.labels
                    }}
                    type="donut"
                    height={460}
                  />
                )}
              </div>
            </div>
          </div>
          {/* Follow-up Alerts */}
          {/* <FollowUpAlertsPanel followUpAlertsData={followUpAlertsData} followUpAlertsLoading={followUpAlertsLoading} /> */}
        </div>

        {/* Invoice Summary */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-5 mb-6">
          <div className="panel ">
            <div className="flex items-center justify-between mb-5">
              <h5 className="font-semibold text-lg dark:text-white-light">Invoice Summary</h5>
            </div>
            {invoiceSummaryLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonSummaryCard key={index} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <Link to={`/invoices?status=paid`} className="flex items-center justify-between p-3 bg-success-light dark:bg-success/20 rounded">
                  <div>
                    <div className="font-semibold text-success">Paid</div>
                    <div className="text-xs text-success/70">Count: {invoiceSummaryData?.Paid?.count || 0}</div>
                  </div>
                  <div className="text-success font-bold">
                    ${(invoiceSummaryData?.Paid?.totalAmount || 0).toLocaleString()}
                  </div>
                </Link>
                <Link to={`/invoices?status=Pending`} className="flex items-center justify-between p-3 bg-warning-light dark:bg-warning/20 rounded">
                  <div>
                    <div className="font-semibold text-warning">Pending</div>
                    <div className="text-xs text-warning/70">Count: {invoiceSummaryData?.Pending?.count || 0}</div>
                  </div>
                  <div className="text-warning font-bold">
                    ${(invoiceSummaryData?.Pending?.totalAmount || 0).toLocaleString()}
                  </div>
                </Link>
                <div className="flex items-center justify-between p-3 bg-info-light dark:bg-info/20 rounded">
                  <div>
                    <div className="font-semibold text-info">Partial</div>
                    <div className="text-xs text-info/70">Count: {invoiceSummaryData?.Partial?.count || 0}</div>
                  </div>
                  <div className="text-info font-bold">
                    ${(invoiceSummaryData?.Partial?.totalAmount || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
          <TopPerformersPanel />
        </div>

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 mb-6">
          <div className="panel h-full w-full">
            <div className="flex items-center justify-between mb-5">
              <h5 className="font-semibold text-lg dark:text-white-light">
                Recent Sales
              </h5>
            </div>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th className="ltr:rounded-l-md rtl:rounded-r-md">Customer</th>
                    <th>Sales Person</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSalesLoading ? (
                    <tr>
                      <td colSpan="4" className="text-center">
                        <div className="min-h-[200px] flex items-center justify-center">
                          <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent rounded-full w-5 h-5 inline-flex"></span>
                        </div>
                      </td>
                    </tr>
                  ) : recentSalesData?.length > 0 ? (
                    recentSalesData.slice(0, 8).map((sale, index) => (
                      <tr
                        key={index}
                        className="text-white-dark hover:text-black dark:hover:text-white-light/90 group"
                      >
                        <td className="min-w-[150px] text-black dark:text-white">
                          <div className="flex items-center">
                            <div className="text-lg font-semibold ltr:mr-3 rtl:ml-3 rounded-md w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700">
                              {sale?.lead?.userName?.charAt(0).toUpperCase() || sale?.lead?.companyName?.charAt(0).toUpperCase() || "C"}
                            </div>
                            <span className="capitalize whitespace-nowrap">
                              {sale?.lead?.userName || sale?.lead?.companyName}
                            </span>
                          </div>
                        </td>
                        <td className="capitalize">{sale?.salesPerson?.userName}</td>
                        <td className="text-success font-semibold">${(sale?.amount || 0).toLocaleString()}</td>
                        <td className="text-xs">{new Date(sale?.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        <div className="flex flex-col items-center justify-center h-full py-4">
                          <IconMenuDocumentation />
                          <h5 className="font-bold text-black dark:text-white-dark">
                            No recent sales
                          </h5>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel h-full w-full">
            <div className="flex items-center justify-between mb-5">
              <h5 className="font-semibold text-lg dark:text-white-light">
                Recent Invoices
              </h5>
            </div>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th className="ltr:rounded-l-md rtl:rounded-r-md">Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoicesLoading ? (
                    <tr>
                      <td colSpan="4" className="text-center">
                        <div className="min-h-[200px] flex items-center justify-center">
                          <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent rounded-full w-5 h-5 inline-flex"></span>
                        </div>
                      </td>
                    </tr>
                  ) : recentInvoicesData?.length > 0 ? (
                    recentInvoicesData.slice(0, 8).map((invoice, index) => (
                      <tr
                        key={index}
                        className="text-white-dark hover:text-black dark:hover:text-white-light/90 group"
                      >
                        <td className="min-w-[150px] text-black dark:text-white">
                          <div className="flex items-center">
                            <div className="text-lg font-semibold ltr:mr-3 rtl:ml-3 rounded-md w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700">
                              {invoice?.customer?.userName?.charAt(0).toUpperCase() || invoice?.customer?.companyName?.charAt(0).toUpperCase() || "C"}
                            </div>
                            <span className="capitalize whitespace-nowrap">
                              {invoice?.customer?.userName || invoice?.customer?.companyName}
                            </span>
                          </div>
                        </td>
                        <td className="text-primary font-semibold">${(invoice?.totalAmount || 0).toLocaleString()}</td>
                        <td>
                          <span className={`badge ${invoice?.paymentStatus === 'Paid' ? 'bg-success' :
                            invoice?.paymentStatus === 'Partial' ? 'bg-warning' : 'bg-danger'
                            }`}>
                            {invoice?.paymentStatus}
                          </span>
                        </td>
                        <td className="text-xs">{new Date(invoice?.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        <div className="flex flex-col items-center justify-center h-full py-4">
                          <IconMenuDocumentation />
                          <h5 className="font-bold text-black dark:text-white-dark">
                            No recent invoices
                          </h5>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Service Stats & Lead Sources */}
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 mb-6">
          {/* Service Stats */}
          {/* <div className="panel h-full w-full">
            <div className="flex items-center justify-between mb-5">
              <h5 className="font-semibold text-lg dark:text-white-light">
                Service Statistics
              </h5>
            </div>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th className="ltr:rounded-l-md rtl:rounded-r-md">Service</th>
                    <th>Count</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceStatsLoading ? (
                    <tr>
                      <td colSpan="3" className="text-center">
                        <div className="min-h-[200px] flex items-center justify-center">
                          <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent rounded-full w-5 h-5 inline-flex"></span>
                        </div>
                      </td>
                    </tr>
                  ) : serviceStatsData?.length > 0 ? (
                    serviceStatsData.slice(0, 8).map((service, index) => (
                      <tr
                        key={index}
                        className="text-white-dark hover:text-black dark:hover:text-white-light/90 group"
                      >
                        <td className="min-w-[150px] text-black dark:text-white font-semibold">
                          {service?._id || 'Unknown Service'}
                        </td>
                        <td>{service?.count || 0}</td>
                        <td className="text-success font-semibold">${(service?.totalRevenue || 0).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        <div className="flex flex-col items-center justify-center h-full py-4">
                          <IconMenuDocumentation />
                          <h5 className="font-bold text-black dark:text-white-dark">
                            No service data
                          </h5>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div> */}

          <ServicesStatsPanel />

          {/* Lead Sources */}
          <div className="panel h-full w-full">
            <div className="flex items-center justify-between mb-5">
              <h5 className="font-semibold text-lg dark:text-white-light">
                Lead Sources
              </h5>
            </div>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th className="ltr:rounded-l-md rtl:rounded-r-md">Source</th>
                    <th>Count</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {leadSourcesLoading ? (
                    <tr>
                      <td colSpan="3" className="text-center">
                        <div className="min-h-[200px] flex items-center justify-center">
                          <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent rounded-full w-5 h-5 inline-flex"></span>
                        </div>
                      </td>
                    </tr>
                  ) : leadSourcesData?.length > 0 ? (
                    (() => {
                      const totalLeads = leadSourcesData.reduce((sum, source) => sum + (source?.count || 0), 0);
                      return leadSourcesData.slice(0, 8).map((source, index) => (
                        <tr
                          key={index}
                          className="text-white-dark hover:text-black dark:hover:text-white-light/90 group"
                        >
                          <td className="min-w-[150px] text-black dark:text-white font-semibold capitalize">
                            {source?._id || 'Unknown Source'}
                          </td>
                          <td>{source?.count || 0}</td>
                          <td className="text-primary font-semibold">
                            {totalLeads > 0 ? ((source?.count || 0) / totalLeads * 100)?.toFixed(1) : 0}%
                          </td>
                        </tr>
                      ));
                    })()
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        <div className="flex flex-col items-center justify-center h-full py-4">
                          <IconMenuDocumentation />
                          <h5 className="font-bold text-black dark:text-white-dark">
                            No lead source data
                          </h5>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>


        {/* <div className="grid xl:grid-cols-3 gap-6 mb-6">
          <div className="panel h-full xl:col-span-2">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between dark:text-white-light mb-5">
              <h5 className="font-semibold text-lg">Revenue</h5>
             
            </div>
            <p className="text-lg dark:text-white-light/90">
              Total Profit{" "}
              <span className="text-success ml-2">${totalProfit}</span>
            </p>
            <div className="relative">
              <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                {expenseLoading || salesLoading ? (
                  <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                    <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                  </div>
                ) : (
                  <ReactApexChart
                    series={chartData.series}
                    options={revenueChart.options}
                    type="area"
                    height={325}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="panel h-full">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between dark:text-white-light mb-5">
              <h5 className="font-semibold text-lg">Summary</h5>
              <div className="dropdown">
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="select form-input"
                />
              </div>
            </div>
            {isLoading ? (
              <div className="space-y-9">
                {Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonSummaryCard key={index} />
                ))}
              </div>
            ) : (
              <div className="space-y-9">
                <div className="flex items-center">
                  <div className="w-9 h-9 ltr:mr-3 rtl:ml-3">
                    <div className="bg-secondary-light dark:bg-secondary text-secondary dark:text-secondary-light rounded-full w-9 h-9 grid place-content-center">
                      <IconInbox />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex font-semibold text-white-dark mb-2">
                      <h6>Income</h6>
                      <p className="ltr:ml-auto rtl:mr-auto">
                        ${summaryData.income.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                      <div
                        className="bg-gradient-to-r from-[#7579ff] to-[#b224ef] w-11/12 h-full rounded-full"
                        style={{
                          width: `${(summaryData.income /
                            (summaryData.income + summaryData.expense)) *
                            100
                            }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-9 h-9 ltr:mr-3 rtl:ml-3">
                    <div className="bg-success-light dark:bg-success text-success dark:text-success-light rounded-full w-9 h-9 grid place-content-center">
                      <IconTag />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex font-semibold text-white-dark mb-2">
                      <h6>Profit</h6>
                      <p className="ltr:ml-auto rtl:mr-auto">
                        ${summaryData.profit.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-full rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                      <div
                        className="bg-gradient-to-r from-[#3cba92] to-[#0ba360] w-full h-full rounded-full"
                        style={{
                          width: `${(summaryData.profit /
                            (summaryData.income + summaryData.expense)) *
                            100
                            }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-9 h-9 ltr:mr-3 rtl:ml-3">
                    <div className="bg-warning-light dark:bg-warning text-warning dark:text-warning-light rounded-full w-9 h-9 grid place-content-center">
                      <IconCreditCard />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex font-semibold text-white-dark mb-2">
                      <h6>Expenses</h6>
                      <p className="ltr:ml-auto rtl:mr-auto">
                        ${summaryData.expense.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-full rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                      <div
                        className="bg-gradient-to-r from-[#f09819] to-[#ff5858] w-full h-full rounded-full"
                        style={{
                          width: `${(summaryData.expense /
                            (summaryData.income + summaryData.expense)) *
                            100
                            }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div> */}

        {/* <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6 mb-6">
          <div className="panel h-full w-full col-span-3 md:col-span-2 ">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between dark:text-white-light mb-5">
              <h5 className="font-semibold text-lg dark:text-white-light">
                Leads By Category
              </h5>
              <div className="dropdown w-full max-w-sm">
                <select
                  id="category"
                  name="category"
                  className="form-select"
                  // defaultValue={selectedYear}
                  onChange={(e) => handleMonthChange(e.target.value)}
                >
                  <option
                    disabled
                    value=""
                    selected
                    hidden
                    label="Select Month"
                  />
                  {leadsData?.leadByMonth?.map((item, index) => (
                    <option
                      key={index}
                      value={`${item._id.year}-${item._id.month}`}
                    >
                      {item._id.year}-{item._id.month}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                {leadsLoading ? (
                  <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                    <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                  </div>
                ) : (
                  <ReactApexChart
                    series={countLeadsByStatus(leads?.sales)}
                    options={leadsByCategory.options}
                    type="donut"
                    height={460}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="panel h-full  col-span-3 md:col-span-1">
            <div className="flex items-center justify-between dark:text-white-light mb-5">
              <h5 className="font-semibold text-lg">Recent Transactions</h5>
            </div>
            <div className="space-y-6">
              {salesLoading || expenseLoading ? (
                Array.from({ length: 7 }).map((_, index) => (
                  <RecentTransactionSkeleton key={index} />
                ))
              ) : recentEntries?.length > 0 ? (
                recentEntries?.map((item, index) => (
                  <div key={index}>
                    <div className="flex">
                      <span
                        className={`shrink-0 grid place-content-center w-9 h-9 rounded-md ${item.type == "expense"
                          ? "bg-danger-light dark:bg-danger text-danger dark:text-danger-light"
                          : "bg-success-light dark:bg-success text-success dark:text-success-light"
                          }  `}
                      >
                        <IconCashBanknotes />
                      </span>
                      <div className="px-3 flex-1">
                        <div>{item?.name}</div>
                        <div className="text-xs text-white-dark dark:text-gray-500">
                          {item?.date}
                        </div>
                      </div>
                      <span
                        className={` ${item.type == "expense"
                          ? "text-danger"
                          : "text-success"
                          }  text-base px-1 ltr:ml-auto rtl:mr-auto whitespace-pre`}
                      >
                        {item?.amount}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center  h-full w-full">
                  <li
                    className={`group flex  cursor-pointer flex-col items-center justify-center gap-4 rounded-md px-8 py-2.5 text-center text-[#506690] duration-300 hover:bg-white hover:text-primary dark:hover:bg-[#1B2E4B]
                      'bg-white  dark:bg-[#1B2E4B]' `}
                  >
                    <IconMenuDocumentation />

                    <h5 className="font-bold text-black dark:text-white-dark">
                      No records
                    </h5>
                  </li>
                </div>
              )}
            </div>
          </div>
        </div> */}

        {/* <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
          <div className="panel h-full w-full">
            <div className="flex items-center justify-between mb-5">
              <h5 className="font-semibold text-lg dark:text-white-light">
                Recent Sales
              </h5>
            </div>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th className="ltr:rounded-l-md rtl:rounded-r-md">
                      Customer
                    </th>
                    <th>Sales Person</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {allSales?.sales?.length > 0 ? (
                    allSales?.sales?.slice(0, 6)?.map((item, index) => (
                      <tr
                        key={index}
                        className="text-white-dark hover:text-black dark:hover:text-white-light/90 group"
                      >
                        <td className="min-w-[150px] text-black dark:text-white">
                          <div className="flex items-center">
                            <div className="text-lg font-semibold ltr:mr-3 rtl:ml-3 rounded-md w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700">
                              {item?.lead?.userName
                                ? item?.lead?.userName.charAt(0).toUpperCase()
                                : ""}
                            </div>
                            <span className="capitalize whitespace-nowrap">
                              {item?.lead?.userName}
                            </span>
                          </div>
                        </td>
                        <td className="capitalize">
                          {item?.salesPerson?.userName}
                        </td>
                        <td>${item?.amount}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center ">
                        <div className="flex flex-col items-center justify-center h-full py-4">
                          <IconMenuDocumentation />
                          <h5 className="font-bold text-black dark:text-white-dark">
                            No records
                          </h5>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div> */}
        {/* 
          <div className="panel h-full w-full">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-5">
              <h5 className="font-semibold text-lg dark:text-white-light">
                Top Selling Packages
              </h5>
              <div className="dropdown">
                <input
                  type="month"
                  value={selectedSellMonth}
                  onChange={(e) => setSelectedSellMonth(e.target.value)}
                  className="select form-input"
                />
              </div>
            </div>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr className="border-b-0">
                    <th className="ltr:rounded-l-md rtl:rounded-r-md">
                      Package
                    </th>
                    <th>Amount</th>
                    <th>Sold</th>
                  </tr>
                </thead>
                {isLoading ? (
                  <div className="min-h-[325px]  !mx-auto grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                    <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                  </div>
                ) : (
                  <tbody>
                    {Array.isArray(topPackages) && topPackages?.length > 0 ? (
                      topPackages?.map((item, index) => (
                        <tr
                          key={index}
                          className="text-white-dark hover:text-black dark:hover:text-white-light/90 group"
                        >
                          <td className="min-w-[150px] text-black dark:text-white">
                            <div className="flex items-center">
                              <div className="shrink-0 ltr:mr-3 rtl:ml-3 grid place-content-center w-9 h-9 rounded-md bg-success-primary dark:bg-primary text-primary dark:text-primary-light">
                                <IconDollarSign />
                              </div>
                              <p className="whitespace-nowrap">{item?.name}</p>
                            </div>
                          </td>
                          <td>${item?.amount}</td>
                          <td>{item?.sold}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center ">
                          <div className="flex flex-col items-center justify-center h-full py-4">
                            <IconMenuDocumentation />
                            <h5 className="font-bold text-black dark:text-white-dark">
                              No records
                            </h5>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                )}
              </table>
            </div>
          </div> */}
      </div>
    </div>
    // </div >
  );
};

export default Index;