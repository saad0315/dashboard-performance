// import { useMemo, useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import IconMenuDocumentation from "../Icon/Menu/IconMenuDocumentation";

// const MONTHS = [
//   { v: 1, label: "January" }, { v: 2, label: "February" }, { v: 3, label: "March" },
//   { v: 4, label: "April" },   { v: 5, label: "May" },      { v: 6, label: "June" },
//   { v: 7, label: "July" },    { v: 8, label: "August" },   { v: 9, label: "September" },
//   { v: 10, label: "October" },{ v: 11, label: "November" },{ v: 12, label: "December" },
// ];

// function currency(n) {
//   return (n || 0).toLocaleString();
// }

// export default function TopPerformersPanel() {
//   const now = new Date();
//   const [month, setMonth] = useState(""); // "" = all
//   const [year, setYear] = useState("");

//   const years = useMemo(() => {
//     const current = now.getFullYear();
//     return [current + 1, current, current - 1, current - 2, current - 3]; // customize range
//   }, [now]);

//   const { isLoading, data } = useQuery({
//     queryKey: ["topPerformers", month, year],
//     queryFn: () => getTopPerformers({
//       month: month ? Number(month) : undefined,
//       year: year ? Number(year) : undefined,
//     }),
//     keepPreviousData: true,
//   });

//   const rows = data?.results || [];

//   return (
//     <div className="panel lg:col-span-3">
//       <div className="flex items-center justify-between mb-4">
//         <h5 className="font-semibold text-lg dark:text-white-light">Top Performers</h5>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
//         <div className="flex items-center gap-2">
//           <div className="flex items-center gap-2">
//             <label className="text-xs text-white-dark dark:text-gray-400">Month</label>
//             <select
//               value={month}
//               onChange={(e) => setMonth(e.target.value)}
//               className="px-2 py-1.5 text-sm rounded-md border border-white-light dark:border-white/10 bg-transparent"
//             >
//               <option value="">All</option>
//               {MONTHS.map(m => (
//                 <option key={m.v} value={m.v}>{m.label}</option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center gap-2">
//             <label className="text-xs text-white-dark dark:text-gray-400">Year</label>
//             <select
//               value={year}
//               onChange={(e) => setYear(e.target.value)}
//               className="px-2 py-1.5 text-sm rounded-md border border-white-light dark:border-white/10 bg-transparent"
//             >
//               <option value="">All</option>
//               {years.map(y => <option key={y} value={y}>{y}</option>)}
//             </select>
//           </div>

//           {(month || year) && (
//             <button
//               onClick={() => { setMonth(""); setYear(""); }}
//               className="px-2 py-1.5 text-sm rounded-md border border-white-light dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10"
//             >
//               Clear
//             </button>
//           )}
//         </div>

//         {/* Range info */}
//         <div className="text-xs text-white-dark dark:text-gray-400">
//           {data?.scope === "month"
//             ? <>Showing: <strong>{MONTHS.find(m => m.v === data?.month)?.label} {data?.year}</strong></>
//             : <>Showing: <strong>All time</strong></>}
//         </div>
//       </div>

//       {/* Table */}
//       <div className="table-responsive">
//         <table>
//           <thead>
//             <tr>
//               <th className="ltr:rounded-l-md rtl:rounded-r-md">User</th>
//               <th>Revenue</th>
//               <th>Deals Closed</th>
//               <th className="ltr:rounded-r-md rtl:rounded-l-md">Conversion Rate</th>
//             </tr>
//           </thead>
//           <tbody>
//             {isLoading ? (
//               <tr>
//                 <td colSpan="4" className="text-center">
//                   <div className="min-h-[100px] flex items-center justify-center">
//                     <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent rounded-full w-5 h-5 inline-flex"></span>
//                   </div>
//                 </td>
//               </tr>
//             ) : rows.length > 0 ? (
//               rows.map((p, idx) => (
//                 <tr key={idx} className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
//                   <td className="min-w-[150px] text-black dark:text-white">
//                     <div className="flex items-center">
//                       <div className="text-lg font-semibold ltr:mr-3 rtl:ml-3 rounded-md w-8 h-8 flex items-center justify-center bg-primary text-white">
//                         {(p?.user?.userName?.[0] || "U").toUpperCase()}
//                       </div>
//                       <div>
//                         <div className="font-semibold">{p?.user?.userName}</div>
//                         <div className="text-xs text-white-dark">{p?.user?.userEmail}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="text-success font-semibold">${currency(p?.revenue)}</td>
//                   <td>{p?.totalDealsClosed || 0}</td>
//                   <td>{(p?.conversionRate || 0).toFixed(2)}%</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4" className="text-center">
//                   <div className="flex flex-col items-center justify-center h-full py-4">
//                     <IconMenuDocumentation />
//                     <h5 className="font-bold text-black dark:text-white-dark">No performers found</h5>
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTopPerformers } from "../../api/dashboardApi";
import { Link } from "react-router-dom";

export default function TopPerformersPanel() {
  const [selectedMonth, setSelectedMonth] = useState(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`
  );

  // parse month/year from selectedMonth (YYYY-MM)
  const monthNum = selectedMonth ? Number(selectedMonth.split("-")[1]) : undefined;
  const yearNum = selectedMonth ? Number(selectedMonth.split("-")[0]) : undefined;

  const { isLoading, data } = useQuery({
    queryKey: ["topPerformers", selectedMonth],
    queryFn: () =>
      selectedMonth
        ? getTopPerformers({ month: monthNum, year: yearNum })
        : getTopPerformers(),
    keepPreviousData: true,
  });
  const rows = data?.results || [];
  return (
    <div className="panel lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h5 className="font-semibold text-lg dark:text-white-light">Top Performers</h5>
      </div>

      {/* Month filter */}
      {/* <div className="flex items-center gap-2 mb-4">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="select form-input"
        />
        <button
          onClick={() => setSelectedMonth("")}
          className="px-2 py-1.5 text-sm rounded-md border border-white-light dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10"
        >
          Clear
        </button>
      </div> */}

      {/* Table */}
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Revenue</th>
              <th>Deals Closed</th>
              <th>Conversion Rate</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" className="text-center">
                  <div className="min-h-[100px] flex items-center justify-center">
                    <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent rounded-full w-5 h-5 inline-flex"></span>
                  </div>
                </td>
              </tr>
            ) : rows.length > 0 ? (
              rows.map((performer, idx) => (
                <tr key={idx}>
                  <td className="min-w-[150px]">
                    <div className="flex items-center">
                      <div className="text-lg font-semibold mr-3 rounded-md w-8 h-8 flex items-center justify-center bg-primary text-white">
                        {performer?.user?.userName?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <Link to={`/sales-persons/${performer?.user?._id}`} className="font-semibold hover:underline cursor-pointer">{performer?.user?.userName}</Link>
                        <div className="text-xs text-white-dark">{performer?.user?.userEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-success font-semibold">${(performer?.revenue || 0).toLocaleString()}</td>
                  <td>{performer?.totalDealsClosed || 0}</td>
                  <td>{(performer?.conversionRate || 0).toFixed(2)}%</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No performers found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
