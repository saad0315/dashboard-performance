import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import IconMenuDocumentation from "../Icon/Menu/IconMenuDocumentation";
import { getServiceStats } from "../../api/dashboardApi";

function currency(n) {
  return (n || 0).toLocaleString(undefined, { minimumFractionDigits: 0 });
}

export default function ServicesStatsPanel() {
  const [period, setPeriod] = useState("all"); // 'all' | 'day' | 'week' | 'month'
  const [from, setFrom] = useState(""); // optional ISO date yyyy-mm-dd
  const [to, setTo] = useState("");     // optional ISO date

  const { isLoading, data } = useQuery({
    queryKey: ["serviceStats", period, from, to],
    queryFn: () =>
      getServiceStats({
        period,
        from: from ? new Date(from).toISOString() : undefined,
        to: to ? new Date(to + "T23:59:59.999Z").toISOString() : undefined,
      }),
    keepPreviousData: true,
  });


  const services = data?.services || [];

  return (
    <div className="panel h-full w-full">
      <div className="flex items-center justify-between mb-4">
        <h5 className="font-semibold text-lg dark:text-white-light">Service Statistics</h5>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-3 mb-4">
        {/* Period toggle */}
        {/* <div className="flex flex-wrap w-full md:w-auto rounded-md border border-white-light dark:border-white/10 overflow-hidden">
          {["all", "day", "week", "month"].map((p, idx) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`w-1/4 sm:w-auto flex-1 px-3 py-1.5 text-sm ${idx ? "border-l border-white-light dark:border-white/10" : ""} ${period === p ? "bg-primary text-white" : "hover:bg-white/60 dark:hover:bg-white/10"
                }`}
            >
              {p === "all" ? "All" : p === "day" ? "Daily" : p === "week" ? "Weekly" : "Monthly"}
            </button>
          ))}
        </div> */}

        <div className="w-full ">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="form-select "
          >
            <option value="all">All</option>
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-[auto_auto_auto] gap-2 w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
            <label className="text-xs text-white-dark dark:text-gray-400">From</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="px-2 py-1.5 text-sm rounded-md border border-white-light dark:border-white/10 bg-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-white-dark dark:text-gray-400">To</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="px-2 py-1.5 text-sm rounded-md border border-white-light dark:border-white/10 bg-transparent"
            />
          </div>
          {/* Clear range */}
          {(from || to) && (
            <button
              onClick={() => {
                setFrom("");
                setTo("");
              }}
              className="px-2 py-1.5 text-sm rounded-md border border-white-light dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10"
            >
              Clear Range
            </button>
          )}
        </div>
      </div>

      {/* Meta line */}
      <div className="text-xs text-white-dark dark:text-gray-400 mb-2">
        {data?.range?.from || data?.range?.to ? (
          <span>
            Showing:{" "}
            <strong>
              {data?.range?.from ? new Date(data.range.from).toLocaleDateString() : "…"} –{" "}
              {data?.range?.to ? new Date(data.range.to).toLocaleDateString() : "…"}
            </strong>{" "}
            ({data?.period})
          </span>
        ) : (
          <span>Showing: <strong>All time</strong></span>
        )}
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th className="ltr:rounded-l-md rtl:rounded-r-md">Service</th>
              <th>Count</th>
              <th className="ltr:rounded-r-md rtl:rounded-l-md">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="3" className="text-center">
                  <div className="min-h-[200px] flex items-center justify-center">
                    <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent rounded-full w-5 h-5 inline-flex"></span>
                  </div>
                </td>
              </tr>
            ) : services.length > 0 ? (
              services.slice(0, 20).map((service, index) => (
                <tr
                  key={index}
                  className="text-white-dark hover:text-black dark:hover:text-white-light/90 group"
                >
                  <td className="min-w-[150px] text-black dark:text-white font-semibold">
                    {service?._id || "Unknown Service"}
                  </td>
                  <td>{service?.count || 0}</td>
                  <td className="text-success font-semibold">${currency(service?.totalRevenue)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  <div className="flex flex-col items-center justify-center h-full py-4">
                    <IconMenuDocumentation />
                    <h5 className="font-bold text-black dark:text-white-dark">No service data</h5>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
          {/* Footer summary */}
          {!isLoading && services.length > 0 && (
            <tfoot>
              <tr className="font-semibold">
                <td>Total</td>
                <td>{data?.summary?.totalCount || 0}</td>
                <td className="text-success">${currency(data?.summary?.totalRevenue)}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div >
  );
}
