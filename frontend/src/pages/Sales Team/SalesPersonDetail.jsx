import React, { useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";
// import IconHorizontalDots from "../../components/Icon/IconHorizontalDots";
// import Dropdown from "../../components/Dropdown";
import MonthlySaleTable from "../../components/DataTables/SalesByMonth";
import SalesPersonLeadTable from "../../components/DataTables/SalesPersonLeadTable";
import { getLeadsByCategory } from "../../utils/Utils";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLeadsById } from "../../api/leadsApi";
import { getSalesBySalesPerson } from "../../api/salesApi";
import { getUserPerformance } from "../../api/performanceApi";
// import { composeInitialProps } from "react-i18next";

export default function SalesPersonDetail() {
  const { id: paramId } = useParams();
  const currentDate = new Date();

  const { user } = useSelector((state) => state.user);
  // const [selectedMonth, setSelectedMonth] = useState({
  //   year: currentDate.getFullYear(),
  //   month: currentDate.getMonth() + 1, // Months are 0-based, so add 1
  // });
  const [selectedMonth, setSelectedMonth] = useState(null);
  const userId = useMemo(() => (paramId ? paramId : user._id), [paramId, user]);

  const navigate = useNavigate();
  const isDark = useSelector(
    (state) =>
      state.themeConfig.theme === "dark" || state.themeConfig.isDarkMode
  );
  const isRtl =
    useSelector((state) => state.themeConfig.rtlClass) === "rtl" ? true : false;

  const {
    isLoading: perfLoading,
    data: perfData,
    status: perfStatus,
  } = useQuery({
    queryKey: ["userPerformance", userId, selectedMonth],
    queryFn: () => getUserPerformance(userId, selectedMonth),
  });



  const {
    isLoading: salesLoading,
    data: salesData,
    status: salesStatus,
  } = useQuery({
    queryKey: ["userSales", userId],
    queryFn: () => getSalesBySalesPerson(userId),
  });

  const {
    isLoading,
    data: leadsData,
    status,
  } = useQuery({
    queryKey: ["myLeads"],
    queryFn: () => getLeadsById(userId),
  });

  const leadsByCategory = getLeadsByCategory(isDark);
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

  // const handleMonthChange = (e) => {
  //   const value = e.target.value; // Format: "2024-03"
  //   if (value) {
  //     const [year, month] = value.split("-");
  //     setSelectedMonth({
  //       year: parseInt(year),
  //       month: parseInt(month)
  //     });
  //   }
  // };

  const handleMonthChange = (e) => {
    const value = e.target.value;

    if (!value) {
      setSelectedMonth(null); // show all data if cleared
    } else {
      const [year, month] = value.split("-");
      setSelectedMonth({
        year: parseInt(year),
        month: parseInt(month),
      });
    }
  };


  // Filter leads data based on selected month
  const filterLeadsByMonth = (leadsData, selectedMonth) => {
    if (!leadsData || !selectedMonth) return leadsData;

    return leadsData.filter((lead) => {
      const leadDate = new Date(lead.createdAt);
      const leadMonth = leadDate.getMonth() + 1;  // months are 0-based
      const leadYear = leadDate.getFullYear();
      return leadMonth === selectedMonth.month && leadYear === selectedMonth.year;
    });
  };

  const filteredLeadsData = filterLeadsByMonth(leadsData?.leads, selectedMonth);


  // console.log("leadsssss", leadsData.leads)
  /* ---- place these near the top of your file (component ke andar ya bahar) ---- */
  // const STATUS_META = [
  //   { label: "New",       color: "#ef4444" },
  //   { label: "FollowUp",  color: "#8b5cf6" },
  //   { label: "Converted", color: "#22c55e" },
  //   { label: "Lost",      color: "#f43f5e" },
  //   { label: "Contacted", color: "#0ea5e9" },
  //   { label: "Invalid",   color: "#9ca3af" },
  //   { label: "Qualified", color: "#f59e0b" },
  // ];

  // const donutOptions = {
  //   chart: { background: "transparent", toolbar: { show: false } },
  //   labels: STATUS_META.map((s) => s.label),
  //   colors: STATUS_META.map((s) => s.color),
  //   stroke: { width: 4 },
  //   dataLabels: { enabled: true, style: { fontSize: "12px", fontWeight: 600 } },
  //   legend: { show: false },
  //   tooltip: { y: { formatter: (val) => Math.round(val) } },
  //   plotOptions: {
  //     pie: {
  //       expandOnClick: true,
  //       donut: {
  //         size: "72%",
  //         labels: {
  //           show: true,
  //           name: { show: true, offsetY: 10 },
  //           value: {
  //             show: true,
  //             offsetY: -10,
  //             formatter: (val) => `${Math.round(+val)}`,
  //           },
  //           total: {
  //             show: true,
  //             label: "Total",
  //             formatter: (w) =>
  //               w.globals.seriesTotals.reduce((a, b) => a + b, 0),
  //           },
  //         },
  //       },
  //     },
  //   },
  // };

  // /* tiny skeleton */
  // const Skel = ({ h = "h-40" }) => (
  //   <div className={`animate-pulse ${h} bg-slate-200/70 dark:bg-slate-700/40 rounded-2xl`} />
  // );


  function getInitials(name) {
    if (!name) return "U";
    const parts = String(name).trim().split(" ");
    const first = parts[0]?.[0] || "";
    const last = parts[1]?.[0] || "";
    return (first + last).toUpperCase() || first.toUpperCase();
  }

  function formatCurrency(n) {
    const num = Number(n || 0);
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(num);
    } catch {
      return `$${num.toFixed(0)}`;
    }
  }

  const tones = {
    slate:
      "bg-slate-50 text-slate-700 ring-slate-200 dark:bg-slate-800/40 dark:text-slate-200 dark:ring-slate-700",
    emerald:
      "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-800/50",
    indigo:
      "bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:ring-indigo-800/50",
    amber:
      "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:ring-amber-800/50",
  };

  function StatChip({ label, value, tone = "slate" }) {
    return (
      <div
        className={`rounded-lg p-3 ring-1 ${tones[tone] || tones.slate}`}
        title={String(value)}
      >
        <div className="text-[11px] uppercase tracking-wide opacity-75">{label}</div>
        <div className="mt-0.5 text-base font-semibold leading-6">{value}</div>
      </div>
    );
  }

  function LegendItem({ label, color }) {
    return (
      <div className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-900"
          style={{ backgroundColor: color || "#CBD5E1" }}
        />
        <span className="whitespace-nowrap">{label}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center" >
        <ul className="flex space-x-2 rtl:space-x-reverse">
          <li>
            <div
              onClick={() => navigate(-1)}
              className="cursor-pointer text-primary hover:underline"
            >
              Sales Persons
            </div>
          </li>
          <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
            <span>Sales</span>
          </li>
        </ul>

        <div className=" mb-2">
          <input
            type="month"
            className="select form-input"
            // value={`${selectedMonth.year}-${String(selectedMonth.month).padStart(2, "0")}`} // Ensure two-digit month
            value={
              selectedMonth
                ? `${selectedMonth.year}-${String(selectedMonth.month).padStart(2, "0")}`
                : ""
            }
            onChange={handleMonthChange}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pt-5">
        <div className="panel h-full  ">
          <div className="flex items-center justify-between dark:text-white-light mb-5">
            <h5 className="font-semibold text-lg dark:text-white-light">
              User Details
            </h5>
          </div>
          <div>
            <div className="bg-white dark:bg-black rounded-lg overflow-hidden ">
              {perfLoading ? (
                <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                  <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                </div>
              ) : (
                // <div
                //   className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-900"
                // >
                //   <h4 className="font-semibold text-lg">{perfData?.performance?.user.userName}</h4>
                //   <p className="text-sm text-gray-500">{perfData?.performance?.user.designation}</p>
                //   <ul className="mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                //     <li>Leads Assigned: {perfData?.performance?.leadsAssigned}</li>
                //     <li>Converted: {perfData?.performance?.leadsConverted}</li>
                //     <li>Revenue: ${perfData?.performance?.totalSales}</li>
                //     <li>Conversion Rate: {perfData?.performance?.conversionRate?.toFixed(2)}%</li>
                //   </ul>
                // </div>
                <div
                  className="
              rounded-xl p-4 sm:p-5
              bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/40 dark:to-slate-900/40
              ring-1 ring-slate-200 dark:ring-slate-800
            "
                >
                  {/* user header */}
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 font-semibold">
                      {getInitials(perfData?.user?.userName)}
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                        {perfData?.user?.userName || "—"}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {"Member"}
                        {/* {perfData?.performance?.user?.designation || "Member"} */}
                      </p>
                    </div>
                  </div>

                  {/* stats */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <StatChip
                      label="Leads Assigned"
                      value={perfData?.overallPerformance?.totalLeadsAssigned ?? 0}
                    />
                    <StatChip
                      label="Deals Closed"
                      value={perfData?.overallPerformance?.totalDealsClosed ?? 0}
                      tone="emerald"
                    />
                    <StatChip
                      label="Revenue"
                      value={formatCurrency(perfData?.overallPerformance?.totalSales ?? 0)}
                      tone="indigo"
                    />
                    <StatChip
                      label="Conversion Rate"
                      value={`${Number(perfData?.overallPerformance?.avgConversionRate ?? 0).toFixed(2)}%`}
                      tone="amber"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
              {isLoading ? (
                <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                  <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                </div>
              ) : (
                <ReactApexChart
                  series={countLeadsByStatus(filteredLeadsData)}
                  // series={leadsByCategory.series}
                  options={leadsByCategory.options}
                  type="donut"
                  height={460}
                />
              )}
            </div>
          </div>
        </div>

        {/* ---- DROP-IN REPLACEMENT FOR YOUR CURRENT "Leads" PANEL ---- */}
        {/* <div className="panel rounded-3xl border border-slate-200/70 dark:border-slate-700/50 bg-white/70 dark:bg-slate-900/40 backdrop-blur-sm p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h5 className="text-lg font-semibold">Leads</h5>
            <span className="text-xs text-slate-500 dark:text-slate-400">overview</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/50 bg-white/70 dark:bg-slate-900/50 p-5 shadow-sm">
              {perfLoading ? (
                <Skel h="h-36" />
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl grid place-content-center text-white font-semibold
                            bg-gradient-to-br from-indigo-500 to-sky-500 shadow-sm">
                      {perfData?.performance?.user?.userName?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">{perfData?.performance?.user.userName}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {perfData?.performance?.user.designation || "User"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-slate-50/90 dark:bg-slate-800/50 p-3">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Leads Assigned</p>
                      <p className="font-semibold">{perfData?.performance?.leadsAssigned ?? 0}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50/90 dark:bg-slate-800/50 p-3">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Converted</p>
                      <p className="font-semibold">{perfData?.performance?.leadsConverted ?? 0}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50/90 dark:bg-slate-800/50 p-3">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Revenue</p>
                      <p className="font-semibold">${perfData?.performance?.totalSales ?? 0}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50/90 dark:bg-slate-800/50 p-3">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Conversion</p>
                      <p className="font-semibold">
                        {(perfData?.performance?.conversionRate ?? 0).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/50 bg-white/70 dark:bg-slate-900/50 p-4 sm:p-5 shadow-sm">
              {isLoading ? (
                <Skel h="h-[340px]" />
              ) : (
                <>
                  <ReactApexChart
                    series={countLeadsByStatus(filteredLeadsData)}
                    options={donutOptions}
                    type="donut"
                    height={340}
                  />

                  <div className="mt-4 flex flex-wrap gap-2">
                    {STATUS_META.map((s, i) => {
                      const count = countLeadsByStatus(filteredLeadsData)?.[i] ?? 0;
                      return (
                        <span
                          key={s.label}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700
                             px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300"
                        >
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: s.color }}
                          />
                          {s.label} <span className="opacity-70">({count})</span>
                        </span>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div> */}

        <div className=" h-full ">
          <MonthlySaleTable
            isLoading={salesLoading}
            salesData={salesData}
            selectedMonth={selectedMonth}
          />
        </div>
      </div>
      <div>
        <SalesPersonLeadTable leadsData={filteredLeadsData} isLoading={isLoading} selectedMonth={selectedMonth} />
      </div>
    </div>
  );
}
