import { useMemo, useState } from "react";
import IconTag from "../Icon/IconTag";
import IconMenuDocumentation from "../Icon/Menu/IconMenuDocumentation";
import { RecentTransactionSkeleton } from "../Skeletons/Skeletons";

export default function FollowUpAlertsPanel({ followUpAlertsData, followUpAlertsLoading }) {
    const [tab, setTab] = useState("all"); // 'all' | 'overdue' | 'due'
    const [range, setRange] = useState("7"); // 'today' | '7' | '30' | 'all' (only for 'due' tab)
    const [q, setQ] = useState(""); // search

    const {
        overdueItems,
        dueTodayItems,
        upcomingItems,
        noDateItems,
        allItems,
        counts
    } = useMemo(() => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        const leads = followUpAlertsData?.leads || [];

        // flatten: [{ lead, assigned, endDate }]
        const flat = leads.flatMap((lead) =>
            (lead?.assigned || [])
                .filter((a) => a?.followUp?.isActive === true)
                .map((a) => ({
                    lead,
                    assigned: a,
                    endDate: a.followUp?.endDate ? new Date(a.followUp.endDate) : null,
                }))
        );

        const overdue = flat.filter((x) => x.endDate < startOfToday);
        const dueToday = flat.filter((x) => x.endDate >= startOfToday && x.endDate <= endOfToday);
        const upcoming = flat.filter((x) => x.endDate > endOfToday);
        const noDate = flat.filter((x) => !x.endDate);

        // sort: nearest first
        const byDateAscNullLast = (a, b) => {
            if (!a.endDate && !b.endDate) return 0;
            if (!a.endDate) return 1;
            if (!b.endDate) return -1;
            return a.endDate - b.endDate;
        };

        return {
            overdueItems: overdue.sort(byDateAscNullLast),
            dueTodayItems: dueToday.sort(byDateAscNullLast),
            upcomingItems: upcoming.sort(byDateAscNullLast),
            noDateItems: noDate, // for "No Due Date" group
            allItems: [...overdue, ...dueToday, ...upcoming, ...noDate].sort(byDateAscNullLast),
            counts: {
                overdue: overdue.length,
                due: dueToday.length + upcoming.length,
                noDate: noDate.length,
                all: flat.length,
            },
        };
    }, [followUpAlertsData]);

    // filter helpers
    const filteredDue = useMemo(() => {
        const now = new Date();
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        let pool = [...dueTodayItems, ...upcomingItems];

        if (range === "today") {
            pool = [...dueTodayItems];
        } else if (range === "7") {
            const till = new Date(endOfToday);
            till.setDate(till.getDate() + 7);
            pool = pool.filter((x) => x.endDate <= till);
        } else if (range === "30") {
            const till = new Date(endOfToday);
            till.setDate(till.getDate() + 30);
            pool = pool.filter((x) => x.endDate <= till);
        } // 'all' => no extra filter

        return pool;
    }, [dueTodayItems, upcomingItems, range]);

    const visibleItems = useMemo(() => {
        let pool =
            tab === "overdue" ? overdueItems :
                tab === "due" ? filteredDue :
                    tab === "noDate" ? noDateItems :
                        allItems;

        // simple search on lead name/company/role/status
        const ql = q.trim().toLowerCase();
        if (ql) {
            pool = pool.filter(({ lead, assigned }) => {
                const hay =
                    `${lead?.userName || ""} ${lead?.companyName || ""} ${assigned?.role || ""} ${assigned?.status || ""}`
                        .toLowerCase();
                return hay.includes(ql);
            });
        }
        return pool;
    }, [tab, filteredDue, overdueItems, allItems, q]);

    const totalDueFromAPI =
        typeof followUpAlertsData?.totalDue === "number" ? followUpAlertsData.totalDue : counts.due;

    // label helpers
    const getBadge = (endDate) => {
        if (!endDate) return { text: "No Due Date", tone: "secondary" };

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        if (endDate < startOfToday) return { text: "Overdue", tone: "warning" };
        if (endDate >= startOfToday && endDate <= endOfToday) return { text: "Due Today", tone: "primary" };

        const diffDays = Math.ceil((endDate - endOfToday) / (1000 * 60 * 60 * 24));
        return { text: `Due in ${diffDays}d`, tone: "info" };
    };

    return (
        <div className="panel h-full">
            <div className="flex items-center justify-between dark:text-white-light mb-4">
                <h5 className="font-semibold text-lg">Follow-up Alerts</h5>
            </div>

            {/* Controls: tabs + due-range + search */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Tabs */}
                <div className="inline-flex rounded-md border border-white-light dark:border-white/10 overflow-hidden">
                    <button
                        onClick={() => setTab("all")}
                        className={`px-3 py-1.5 text-sm ${tab === "all" ? "bg-primary text-white" : "hover:bg-white/60 dark:hover:bg-white/10"}`}
                    >
                        All <span className="ml-1 rounded-full px-2 py-0.5 text-xs bg-black/10 dark:bg-white/10">{counts.all}</span>
                    </button>
                    <button
                        onClick={() => setTab("overdue")}
                        className={`px-3 py-1.5 text-sm border-l border-white-light dark:border-white/10 ${tab === "overdue" ? "bg-warning text-white" : "hover:bg-white/60 dark:hover:bg-white/10"}`}
                    >
                        Overdue <span className="ml-1 rounded-full px-2 py-0.5 text-xs bg-black/10 dark:bg-white/10">{counts.overdue}</span>
                    </button>
                    <button
                        onClick={() => setTab("due")}
                        className={`px-3 py-1.5 text-sm border-l border-white-light dark:border-white/10 ${tab === "due" ? "bg-primary text-white" : "hover:bg-white/60 dark:hover:bg-white/10"}`}
                    >
                        Due <span className="ml-1 rounded-full px-2 py-0.5 text-xs bg-black/10 dark:bg-white/10">{counts.due}</span>
                    </button>
                    <button
                        onClick={() => setTab("noDate")}
                        className={`px-3 py-1.5 text-sm border-l border-white-light dark:border-white/10 ${tab === "noDate" ? "bg-gray-500 text-white" : "hover:bg-white/60 dark:hover:bg-white/10"}`}
                    >
                        No Due Date <span className="ml-1 rounded-full px-2 py-0.5 text-xs bg-black/10 dark:bg-white/10">{counts.noDate}</span>
                    </button>

                </div>

                {/* Due range (visible only when 'due' tab) */}
                {tab === "due" && (
                    <div className="flex items-center gap-2">
                        <label className="text-xs text-white-dark dark:text-gray-400">Range:</label>
                        <select
                            value={range}
                            onChange={(e) => setRange(e.target.value)}
                            className="px-2 py-1.5 text-sm rounded-md border border-white-light dark:border-white/10 bg-transparent"
                        >
                            <option value="today">Today</option>
                            <option value="7">Next 7 days</option>
                            <option value="30">Next 30 days</option>
                            <option value="all">All future</option>
                        </select>
                    </div>
                )}

                {/* Search */}
                <div className="flex-1 sm:flex-none">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search lead / company / role / status…"
                        className="w-full sm:w-64 px-3 py-2 text-sm rounded-md border border-white-light dark:border-white/10 bg-transparent"
                    />
                </div>
            </div>

            {/* List */}
            <div className="space-y-6">
                {followUpAlertsLoading ? (
                    Array.from({ length: 5 }).map((_, i) => <RecentTransactionSkeleton key={i} />)
                ) : visibleItems.length > 0 ? (
                    visibleItems.slice(0, 20).map(({ lead, assigned, endDate }, index) => {
                        const badge = getBadge(endDate);
                        return (
                            <div key={index} className="flex">
                                <span className="shrink-0 grid place-content-center w-9 h-9 rounded-md bg-warning-light dark:bg-warning text-warning dark:text-warning-light">
                                    <IconTag />
                                </span>

                                <div className="px-3 flex-1">
                                    <div className="font-semibold">
                                        {lead?.userName || lead?.companyName || "Lead"}
                                    </div>

                                    <div className="text-xs text-white-dark dark:text-gray-500">
                                        {assigned?.role ? `Role: ${assigned.role}` : null}
                                        {assigned?.status ? (assigned?.role ? " • " : "") + `Status: ${assigned.status}` : null}
                                    </div>

                                    <div className="text-xs text-white-dark dark:text-gray-500">
                                        Due: {endDate ? endDate.toLocaleDateString() : "-"}
                                    </div>
                                </div>

                                <span
                                    className={`text-sm px-2 py-1 rounded-md h-fit ltr:ml-auto rtl:mr-auto ${badge.tone === "warning"
                                        ? "text-warning bg-warning/10"
                                        : badge.tone === "primary"
                                            ? "text-primary bg-primary/10"
                                            : "text-info bg-info/10"
                                        }`}
                                >
                                    {badge.text}
                                </span>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex justify-center items-center h-full w-full">
                        <div className="group flex cursor-pointer flex-col items-center justify-center gap-4 rounded-md px-8 py-2.5 text-center text-[#506690] duration-300 hover:bg-white hover:text-primary dark:hover:bg-[#1B2E4B]">
                            <IconMenuDocumentation />
                            <h5 className="font-bold text-black dark:text-white-dark">No follow-ups</h5>
                        </div>
                    </div>
                )}

                {/* Footer counts */}
                {(counts.overdue > 0 || totalDueFromAPI > 0) && (
                    <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white-light dark:border-white/10 text-sm">
                        <div className="text-warning font-semibold">Overdue: {counts.overdue}</div>
                        <div className="text-primary font-semibold text-right">Due: {totalDueFromAPI}</div>
                        <div className="text-gray-500 font-semibold">No Due Date: {counts.noDate}</div>
                    </div>
                )}
            </div>
        </div>
    );
}
