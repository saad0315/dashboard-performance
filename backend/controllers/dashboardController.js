const InvoiceModel = require("../models/invoiceModel");
const Lead = require("../models/leadModel");
const Performance = require("../models/performanceModel");
const Sales = require("../models/salesModel");
const User = require("../models/userModel");

exports.getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        const startOfToday = new Date(today.setHours(0, 0, 0, 0));

        const totalLeads = await Lead.countDocuments();
        const totalSales = await Sales.countDocuments();

        const revenueAgg = await Sales.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalRevenue = revenueAgg[0]?.total || 0;

        const refundsAgg = await Sales.aggregate([
            { $group: { _id: null, total: { $sum: "$refundAmount" } } }
        ]);
        const totalRefunds = refundsAgg[0]?.total || 0;

        const netRevenue = totalRevenue - totalRefunds;

        const newLeadsToday = await Lead.countDocuments({ createdAt: { $gte: startOfToday } });
        const newSalesToday = await Sales.countDocuments({ createdAt: { $gte: startOfToday } });

        const totalAssigned = await Lead.aggregate([
            { $unwind: "$assigned" },
            { $count: "totalAssigned" }
        ]);
        const totalConverted = await Lead.aggregate([
            { $unwind: "$assigned" },
            { $match: { "assigned.status": "Converted" } },
            { $count: "totalConverted" }
        ]);

        const assigned = totalAssigned[0]?.totalAssigned || 0;
        const converted = totalConverted[0]?.totalConverted || 0;
        const conversionRate = assigned > 0 ? (converted / assigned) * 100 : 0;

        const activeUsers = await User.countDocuments({ status: 'active' });

        res.status(200).json({
            totalLeads,
            totalSales,
            totalRevenue,
            netRevenue,
            activeUsers,
            newLeadsToday,
            newSalesToday,
            conversionRate: parseFloat(conversionRate.toFixed(2)),
        });
    } catch (error) {
        console.error("Error in getDashboardStats:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getLeadStatusBreakdown = async (req, res) => {
    try {
        const leadStatusAgg = await Lead.aggregate([
            { $unwind: "$assigned" },
            {
                $group: {
                    _id: "$assigned.status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const statusMap = {};
        leadStatusAgg.forEach(item => {
            statusMap[item._id] = item.count;
        });

        res.status(200).json({
            New: statusMap["New"] || 0,
            Contacted: statusMap["Contacted"] || 0,
            Qualified: statusMap["Qualified"] || 0,
            Converted: statusMap["Converted"] || 0,
            Lost: statusMap["Lost"] || 0,
            Invalid: statusMap["Invalid"] || 0,
            FollowUp: statusMap["FollowUp"] || 0
        });
    } catch (error) {
        console.error("Error in getLeadStatusBreakdown:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getSalesTrend = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - days);

        const trend = await Sales.aggregate([
            {
                $match: { createdAt: { $gte: fromDate } }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    totalSales: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.status(200).json(trend);
    } catch (error) {
        console.error("Error in getSalesTrend:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getRevenueTrend = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - days);

        const trend = await Sales.aggregate([
            {
                $match: {
                    createdAt: { $gte: fromDate },
                    refunded: false
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    revenue: { $sum: "$amount" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.status(200).json(trend);
    } catch (error) {
        console.error("Error in getRevenueTrend:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getTopPerformers = async (req, res) => {
    try {
        const top = await Performance.find({ user: { $ne: null } })
            .sort({ revenue: -1 })
            .limit(5)
            .populate('user', 'userName userEmail')
            .select('user revenue totalDealsClosed conversionRate');
        //       scope: month && year ? "month" : "all",
        //       month: month ? Number(month) : null,
        //       year: year ? Number(year) : null,
        //       results: top
        res.status(200).json({results: top});
    } catch (error) {
        console.error("Error in getTopPerformers:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getTeamPerformance = async (req, res) => {
    try {
        const teams = await Performance.find({ team: { $ne: null } })
            .populate('team', 'teamName department')
            .select('team leadsAssigned leadsConverted revenue conversionRate');

        res.status(200).json(teams);
    } catch (error) {
        console.error("Error in getTeamPerformance:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// /performance/top-users?month=7&year=2025
// exports.getTopPerformers = async (req, res) => {
//   try {
//     const { month, year } = req.query; // month: 1-12, year: 4-digit
//     // TODO: is field ko apne schema ke mutabiq set karo:
//     const DATE_FIELD = "createdAt"; // e.g. "createdAt" | "date" | "closedAt"
//     const TIMEZONE = "Asia/Karachi";

//     // Base match: user not null
//     const baseMatch = { user: { $ne: null } };

//     // Pipeline build
//     const pipeline = [
//       { $match: baseMatch },

//       // 🔁 Ensure we are working with a proper Date
//       {
//         $addFields: {
//           _date: {
//             $toDate: `$${DATE_FIELD}` // handles Date or ISO string; null -> error if truly missing
//           }
//         }
//       },

//       // 🧭 Extract parts in your timezone
//       {
//         $addFields: {
//           _parts: {
//             $dateToParts: { date: "$_date", timezone: TIMEZONE }
//           }
//         }
//       },

//       // ⛳️ Filter by month/year only when provided
//       ...(month && year
//         ? [{
//             $match: {
//               $expr: {
//                 $and: [
//                   { $eq: ["$_parts.year", Number(year)] },
//                   { $eq: ["$_parts.month", Number(month)] },
//                 ]
//               }
//             }
//           }]
//         : []),

//       // 👤 Group per user
//       {
//         $group: {
//           _id: "$user",
//           revenue: { $sum: "$revenue" },
//           totalDealsClosed: { $sum: "$totalDealsClosed" },
//           // NOTE: yeh simple average hai. Weighted chahiye to won/opportunities se nikalo.
//           conversionRate: { $avg: "$conversionRate" },
//         }
//       },

//       { $sort: { revenue: -1 } },
//       { $limit: 5 },

//       // 🔎 bring user fields
//       {
//         $lookup: {
//           from: "users",
//           localField: "_id",
//           foreignField: "_id",
//           as: "user"
//         }
//       },
//       { $unwind: "$user" },

//       // 🧹 shape output
//       {
//         $project: {
//           _id: 0,
//           user: { _id: "$user._id", userName: "$user.userName", userEmail: "$user.userEmail" },
//           revenue: 1,
//           totalDealsClosed: 1,
//           conversionRate: 1
//         }
//       }
//     ];

//     const top = await Performance.aggregate(pipeline);

//     res.status(200).json({
//       scope: month && year ? "month" : "all",
//       month: month ? Number(month) : null,
//       year: year ? Number(year) : null,
//       results: top
//     });
//   } catch (error) {
//     console.error("Error in getTopPerformers:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };



exports.getRecentSales = async (req, res) => {
    try {
        const sales = await Sales.find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('salesPerson', 'userName')
            .populate('lead', 'userName companyName');

        res.status(200).json(sales);
    } catch (error) {
        console.error("Error in getRecentSales:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getRecentInvoices = async (req, res) => {
    try {
        const invoices = await InvoiceModel.find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('salesPerson', 'userName')
            .populate('customer', 'companyName userName');

        res.status(200).json(invoices);
    } catch (error) {
        console.error("Error in getRecentInvoices:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getInvoiceSummary = async (req, res) => {
    try {
        const summary = await InvoiceModel.aggregate([
            {
                $group: {
                    _id: "$paymentStatus",
                    count: { $sum: 1 },
                    totalAmount: { $sum: "$totalAmount" }
                }
            }
        ]);

        const map = {
            Pending: { count: 0, totalAmount: 0 },
            Partial: { count: 0, totalAmount: 0 },
            Paid: { count: 0, totalAmount: 0 }
        };

        summary.forEach(item => {
            map[item._id] = {
                count: item.count,
                totalAmount: item.totalAmount
            };
        });

        res.status(200).json(map);
    } catch (error) {
        console.error("Error in getInvoiceSummary:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getLeadSourcesBreakdown = async (req, res) => {
    try {
        const sources = await Lead.aggregate([
            {
                $group: {
                    _id: "$source",
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json(sources);
    } catch (error) {
        console.error("Error in getLeadSourcesBreakdown:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getLeadFollowUpAlerts = async (req, res) => {
    try {
        const today = new Date();

        const dueFollowUps = await Lead.find({
            assigned: {
                $elemMatch: {
                    "followUp.isActive": true,
                    // "followUp.endDate": { $lte: today }
                }
            }
        }).select('userName companyName assigned');

        res.status(200).json({
            totalDue: dueFollowUps.length,
            leads: dueFollowUps
        });
    } catch (error) {
        console.error("Error in getLeadFollowUpAlerts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


// /services/stats?period=all|day|week|month&from=2025-08-01&to=2025-08-12
exports.getServiceStats = async (req, res) => {
  try {
    const { period = "all", from, to } = req.query;
    const DATE_FIELD = "createdAt";

    // ---- date range calc (same as your code) ----
    let start = null, end = null;
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (from || to) {
      if (from) start = new Date(from);
      if (to) end = new Date(to);
      if (start && !end) end = new Date();
    } else {
      if (period === "day") {
        start = startOfDay; end = endOfDay;
      } else if (period === "week") {
        const day = startOfDay.getDay();
        const diff = (day === 0 ? 6 : day - 1);
        start = new Date(startOfDay);
        start.setDate(start.getDate() - diff);
        end = new Date(start);
        end.setDate(end.getDate() + 6);
        end.setHours(23, 59, 59, 999);
      } else if (period === "month") {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      }
    }

    const matchStage = {};
    if (start || end) {
      matchStage[DATE_FIELD] = {};
      if (start) matchStage[DATE_FIELD]["$gte"] = start;
      if (end)   matchStage[DATE_FIELD]["$lte"] = end;
    }
    const matchPart = Object.keys(matchStage).length ? [{ $match: matchStage }] : [];

    // 1) True summary WITHOUT unwind
    const [trueSummary = { totalCount: 0, totalRevenue: 0 }] = await Sales.aggregate([
      ...matchPart,
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          totalRevenue: { $sum: "$amount" }
        }
      },
      { $project: { _id: 0 } }
    ]);

    // 2) Services breakdown (counts) — each sale counted once per service
    //    Agar same sale me ek service bar-bar aa sakti ho to usko unique count karne ke liye $addToSet use karo.
    const servicesCounts = await Sales.aggregate([
      ...matchPart,
      { $unwind: "$services" },
      {
        $group: {
          _id: "$services",
          saleIds: { $addToSet: "$_id" } // unique sales per service
        }
      },
      {
        $project: {
          _id: 1,
          count: { $size: "$saleIds" }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // 3) Services breakdown (revenue) — PRO-RATA distribute (optional)
    //    amount ko services ki tadaad se divide kar dete hain taake duplicate na ho.
    const servicesRevenue = await Sales.aggregate([
      ...matchPart,
      {
        $addFields: {
          servicesCount: {
            $cond: [
              { $isArray: "$services" },
              { $size: "$services" },
              0
            ]
          }
        }
      },
      { $unwind: "$services" },
      {
        $group: {
          _id: "$services",
          totalRevenue: {
            $sum: {
              $cond: [
                { $gt: ["$servicesCount", 0] },
                { $divide: ["$amount", "$servicesCount"] },
                0
              ]
            }
          }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    // merge counts + revenue by service
    const revenueMap = new Map(servicesRevenue.map(s => [String(s._id), s.totalRevenue]));
    const services = servicesCounts.map(s => ({
      _id: s._id,
      count: s.count,
      totalRevenue: revenueMap.get(String(s._id)) || 0
    }));

    res.status(200).json({
      period,
      range: { from: start ? start.toISOString() : null, to: end ? end.toISOString() : null },
      summary: trueSummary,
      services
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


// exports.getServiceStats = async (req, res) => {
//     try {
//         const { period = "all", from, to } = req.query;

//         // NOTE: yeh field aapke Sales model me hona chahiye.
//         // Agar 'createdAt' nahi hai to apne date field ka naam yahan set kar dena.
//         const DATE_FIELD = "createdAt";

//         // Date range calculate
//         let start = null;
//         let end = null;

//         const now = new Date();
//         const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//         const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

//         if (from || to) {
//             if (from) start = new Date(from);
//             if (to) end = new Date(to);
//             if (start && !end) end = new Date(); // until now
//         } else {
//             if (period === "day") {
//                 start = startOfDay;
//                 end = endOfDay;
//             } else if (period === "week") {
//                 // ISO week start (Mon)
//                 const day = startOfDay.getDay(); // 0..6 Sun..Sat
//                 const diff = (day === 0 ? 6 : day - 1); // days since Monday
//                 start = new Date(startOfDay);
//                 start.setDate(start.getDate() - diff);
//                 end = new Date(start);
//                 end.setDate(end.getDate() + 6);
//                 end.setHours(23, 59, 59, 999);
//             } else if (period === "month") {
//                 start = new Date(now.getFullYear(), now.getMonth(), 1);
//                 end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
//             }
//             // period === "all" -> no date filter
//         }

//         const matchStage = {};
//         if (start || end) {
//             matchStage[DATE_FIELD] = {};
//             if (start) matchStage[DATE_FIELD]["$gte"] = start;
//             if (end) matchStage[DATE_FIELD]["$lte"] = end;
//         }

//         const pipeline = [
//             ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
//             { $unwind: "$services" },
//             {
//                 $group: {
//                     _id: "$services",                  
//                     count: { $sum: 1 },
//                     totalRevenue: { $sum: "$amount" }, 
//                 },
//             },
//             { $sort: { count: -1 } },
//         ];

//         const services = await Sales.aggregate(pipeline);

//         // Totals (optional, nice for UI footers)
//         const summary = services.reduce(
//             (acc, s) => {
//                 acc.totalCount += s.count || 0;
//                 acc.totalRevenue += s.totalRevenue || 0;
//                 return acc;
//             },
//             { totalCount: 0, totalRevenue: 0 }
//         );

//         res.status(200).json({
//             period,
//             range: {
//                 from: start ? start.toISOString() : null,
//                 to: end ? end.toISOString() : null,
//             },
//             summary,
//             services,
//         });
//     } catch (error) {
//         console.error("Error in getServiceStats:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };


exports.getSystemActivity = async (req, res) => {
    try {
        const newUsers = await User.find({
            createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) }
        }).select('userName userEmail createdAt');

        const remoteAccessUsers = await User.find({ isRemoteAccessAllowed: true })
            .select('userName userEmail role');

        const suspendedUsers = await User.find({ status: 'suspended' })
            .select('userName userEmail role');

        res.status(200).json({
            newUsers: newUsers.length,
            remoteAccessUsers,
            suspendedUsers
        });
    } catch (error) {
        console.error("Error in getSystemActivity:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
