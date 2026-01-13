// const cathAsyncError = require("../middleWare/asyncErrors");
// const Performance = require("../models/performanceModel");
// const ErrorHandler = require("../utils/errorHandler");

// exports.getUserPerformance = cathAsyncError(async(req, res, next) => {
//     const { userId } = req.params;
//     const { month } = req.query;

//     const period = month || new Date().toISOString().slice(0, 7); // e.g., '2025-07'

//     const performance = await Performance.findOne({
//         user: userId,
//         period
//     }).populate("user", "userName designation");

//     if (!performance) {
//         return next(new ErrorHandler("Performance data not found", 404));
//     }

//     res.status(200).json({
//         success: true,
//         performance,
//     });
// });




const mongoose = require("mongoose");
const Performance = require("../models/performanceModel");
const Lead = require("../models/leadModel");
const Sales = require("../models/salesModel");
const Invoice = require("../models/invoiceModel");
const Team = require("../models/teamModel");
const User = require("../models/userModel");
const cathAsyncError = require("../middleWare/asyncErrors");
const ErrorHandler = require("../utils/errorHandler");

// Helper: get start & end date of a month
// function getMonthRange(period) {
//     const start = new Date(`${period}-01`);
//     const end = new Date(start);
//     end.setMonth(end.getMonth() + 1);
//     return { start, end };
// }
function getMonthRange(period) {
    const [y, m] = period.split('-').map(Number);
    const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0, 0)); // YYYY-MM-01T00:00:00.000Z
    const end = new Date(Date.UTC(y, m, 1, 0, 0, 0, 0)); // next month 01T00:00:00.000Z
    return { start, end };
}


// GET: User Performance
// exports.getUserPerformance = cathAsyncError(async (req, res, next) => {
//     const { userId } = req.params;
//     const { month } = req.query;

//     const query = { user: userId };
//     if (month) {
//         query.period = month; // Expecting 'YYYY-MM' format
//     }

//     const performanceData = await Performance.find(query).populate("user", "userName designation");

//     if (!performanceData || performanceData.length === 0) {
//         return next(new ErrorHandler("Performance data not found", 404));
//     }

//     res.status(200).json({
//         success: true,
//         performance: month ? performanceData[0] : performanceData, // Return one or many depending on query
//     });
// });

exports.getUserOverallPerformance = cathAsyncError(async (req, res, next) => {
    const { userId } = req.params;
    const { month } = req.query;

    if (month) {
        // If month is provided, return performance for that specific month
        const performance = await Performance.findOne({ user: userId, period: month })
            .populate("user", "userName designation");

        if (!performance) return next(new ErrorHandler("Performance data not found for the given month", 404));

        return res.status(200).json({ success: true, performance });
    }

    // If no month is provided, aggregate all performance data
    const performances = await Performance.find({ user: userId })
        .populate("user", "userName designation");

    if (!performances || performances.length === 0) {
        return next(new ErrorHandler("No performance data found", 404));
    }

    // Aggregate logic (example - customize based on schema)
    const aggregatedPerformance = performances.reduce((acc, curr) => {
        for (let key in curr._doc) {
            if (typeof curr[key] === 'number') {
                acc[key] = (acc[key] || 0) + curr[key];
            }
        }
        return acc;
    }, { user: performances[0].user });

    res.status(200).json({ success: true, performance: aggregatedPerformance });
});

// GET: Overall performance of a user across all months
// exports.getUserPerformance = cathAsyncError(async (req, res, next) => {
//     const { userId } = req.params;
//     const { month } = req.query;

//     // Build match query
//     const matchQuery = {
//         user: mongoose.Types.ObjectId(userId),
//     };

//     if (month) {
//         // validate format
//         const ok = /^\d{4}-(0[1-9]|1[0-2])$/.test(month);
//         if (!ok) return next(new ErrorHandler("Invalid month format. Use YYYY-MM", 400));
//         matchQuery.period = month;         // 👈 direct string match
//     }

//     const stats = await Performance.aggregate([
//         { $match: matchQuery },
//         {
//             $group: {
//                 _id: "$user",
//                 totalLeadsAssigned: { $sum: "$leadsAssigned" },
//                 totalLeadsConverted: { $sum: "$leadsConverted" },
//                 totalLeadsContacted: { $sum: "$leadsContacted" },
//                 totalLeadsQualified: { $sum: "$leadsQualified" },
//                 totalLeadsLost: { $sum: "$leadsLost" },
//                 totalDealsClosed: { $sum: "$totalDealsClosed" },
//                 totalSales: { $sum: "$totalSales" },
//                 totalRevenue: { $sum: "$revenue" },
//                 totalRefundAmount: { $sum: "$refundAmount" },
//                 netRevenue: { $sum: "$netRevenue" },
//                 avgConversionRate: { $avg: "$conversionRate" },
//                 monthsTracked: { $sum: 1 },
//             },
//         },
//     ]);

//     if (!stats || stats.length === 0) {
//         return next(new ErrorHandler("No performance data found for this user", 404));
//     }

//     const user = await User.findById(userId).select("userName designation");

//     res.status(200).json({
//         success: true,
//         period: month || "overall",
//         user,
//         overallPerformance: stats[0],
//     });
// });

exports.getUserPerformance = cathAsyncError(async (req, res, next) => {
    const { userId } = req.params;
    const { month } = req.query;

    // Build match query for month filtering
    let dateFilter = {};
    if (month) {
        const ok = /^\d{4}-(0[1-9]|1[0-2])$/.test(month);
        if (!ok) return next(new ErrorHandler("Invalid month format. Use YYYY-MM", 400));

        const [year, monthNum] = month.split("-").map(Number);
        const startDate = new Date(year, monthNum - 1, 1);
        const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);
        dateFilter = {
            $gte: startDate,
            $lte: endDate,
        };
    }

    // Aggregate leads data for unique lead count
    const leadMatchQuery = {
        "assigned.user": mongoose.Types.ObjectId(userId),
    };
    if (month) {
        leadMatchQuery.date = dateFilter;
    }

    const leadStats = await Lead.aggregate([
        { $match: leadMatchQuery },
        { $unwind: "$assigned" },
        { $match: { "assigned.user": mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: null,
                uniqueLeads: { $addToSet: "$_id" }, // Collect unique lead IDs
            },
        },
        {
            $project: {
                totalLeadsAssigned: { $size: "$uniqueLeads" }, // Count unique leads
            },
        },
    ]);

    // Aggregate sales data
    const salesMatchQuery = {
        salesPerson: mongoose.Types.ObjectId(userId),
    };
    if (month) {
        salesMatchQuery.date = dateFilter;
    }

    const salesStats = await Sales.aggregate([
        { $match: salesMatchQuery },
        {
            $group: {
                _id: "$salesPerson",
                totalDealsClosed: { $sum: 1 },
                totalSales: { $sum: "$amount" },
                totalRevenue: { $sum: "$amount" },
                totalRefundAmount: { $sum: "$refundAmount" },
                netRevenue: { $sum: { $subtract: ["$amount", "$refundAmount"] } },
            },
        },
    ]);

    // If no data found, return error
    if (!leadStats.length && !salesStats.length) {
        return next(new ErrorHandler("No performance data found for this user", 404));
    }

    // Combine stats
    const stats = {
        _id: userId,
        totalLeadsAssigned: leadStats[0]?.totalLeadsAssigned || 0,
        totalDealsClosed: salesStats[0]?.totalDealsClosed || 0,
        totalSales: salesStats[0]?.totalSales || 0,
        totalRevenue: salesStats[0]?.totalRevenue || 0,
        totalRefundAmount: salesStats[0]?.totalRefundAmount || 0,
        netRevenue: salesStats[0]?.netRevenue || 0,
        avgConversionRate:
            leadStats[0]?.totalLeadsAssigned > 0
                ? (salesStats[0]?.totalDealsClosed || 0) / leadStats[0].totalLeadsAssigned * 100
                : 0,
        monthsTracked: month
            ? 1
            : await Lead.distinct("date", { "assigned.user": mongoose.Types.ObjectId(userId) }).then(
                dates => {
                    const uniqueMonths = new Set(
                        dates.map(date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`)
                    );
                    return uniqueMonths.size;
                }
            ),
    };

    // Fetch user details
    const user = await User.findById(userId).select("userName designation");
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
        success: true,
        period: month || "overall",
        user,
        overallPerformance: stats,
    });
});

// exports.getUserPerformance = cathAsyncError(async (req, res, next) => {
//     const { userId } = req.params;

//     const stats = await Performance.aggregate([{
//         $match: {
//             user: mongoose.Types.ObjectId(userId)
//         }
//     },
//     {
//         $group: {
//             _id: "$user",
//             totalLeadsAssigned: { $sum: "$leadsAssigned" },
//             totalLeadsConverted: { $sum: "$leadsConverted" },
//             totalLeadsContacted: { $sum: "$leadsContacted" },
//             totalLeadsQualified: { $sum: "$leadsQualified" },
//             totalLeadsLost: { $sum: "$leadsLost" },
//             totalDealsClosed: { $sum: "$totalDealsClosed" },
//             totalSales: { $sum: "$totalSales" },
//             totalRevenue: { $sum: "$revenue" },
//             totalRefundAmount: { $sum: "$refundAmount" },
//             netRevenue: { $sum: "$netRevenue" },
//             avgConversionRate: { $avg: "$conversionRate" },
//             monthsTracked: { $sum: 1 }
//         }
//     }
//     ]);

//     if (!stats || stats.length === 0) {
//         return next(new ErrorHandler("No performance data found for this user", 404));
//     }

//     const user = await User.findById(userId).select("userName designation");

//     res.status(200).json({
//         success: true,
//         user,
//         overallPerformance: stats[0],
//     });
// });


// GET: Team Performance
exports.getTeamPerformance = cathAsyncError(async (req, res, next) => {
    const { teamId } = req.params;
    const period = req.query.month || new Date().toISOString().slice(0, 7);

    const performance = await Performance.findOne({ team: teamId, period }).populate("team", "teamName teamType");
    if (!performance) return next(new ErrorHandler("Performance data not found", 404));

    res.status(200).json({ success: true, performance });
});

// GET: Summary for Admin (Top agents, teams, totals)
exports.getPerformanceSummary = cathAsyncError(async (req, res, next) => {
    const period = req.query.month || new Date().toISOString().slice(0, 7);

    const topPerformers = await Performance.find({ period })
        .sort({ leadsConverted: -1 })
        .limit(5)
        .populate("user", "userName")
        .populate("team", "teamName");

    const summary = {
        topUsers: topPerformers.filter(p => p.user),
        topTeams: topPerformers.filter(p => p.team),
    };

    res.status(200).json({ success: true, summary });
});




exports.refreshPerformance = cathAsyncError(async (req, res, next) => {
    const period = req.body.month || new Date().toISOString().slice(0, 7);
    const { start, end } = getMonthRange(period);

    const users = await User.find({});

    console.log("data start end", start, end)

    for (const user of users) {
        // ✅ Aggregate leads using `assigned[]`
        // const leadStatusCounts = await Lead.aggregate([
        //     { $unwind: "$assigned" },
        //     {
        //         $match: {
        //             "assigned.user": mongoose.Types.ObjectId(user._id),
        //             "assigned.assignedAt": { $gte: start, $lt: end }
        //         }
        //     },
        //     { $sort: { "assigned.assignedAt": -1 } },
        //     {
        //         $group: {
        //             _id: "$_id",
        //             role: { $first: "$assigned.role" },
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: "$assigned.status",
        //             role: { $first: "$assigned.role" },
        //             count: { $sum: 1 }
        //         }
        //     }
        // ]);

        const agg = await Lead.aggregate([
            { $unwind: "$assigned" },
            { $match: { "assigned.assignedAt": { $gte: start, $lt: end } } }, // date first
            { $sort: { "assigned.assignedAt": -1 } },                         // latest first
            { $group: { _id: "$_id", latest: { $first: "$assigned" } } },     // 1 row per lead
            { $match: { "latest.user": user._id } },                          // <- user now
            {
                $facet: {
                    byStatus: [
                        { $group: { _id: "$latest.status", count: { $sum: 1 } } }
                    ],
                    totals: [{ $count: "uniqueLeads" }],
                    ids: [
                        {
                            $project: {
                                _id: 0,
                                leadId: "$_id",
                                latestAssignedAt: "$latest.assignedAt",
                                latestStatus: "$latest.status",
                                latestRole: "$latest.role"
                            }
                        }
                    ]
                }
            }
        ]);

        const byStatus = agg[0]?.byStatus || [];
        const uniqueLeads = agg[0]?.totals?.[0]?.uniqueLeads || 0;
        const ids = agg[0]?.ids || [];

        const getStatusCount = (status) =>
            byStatus.find(x => x._id === status)?.count || 0;

        const leadsAssigned = uniqueLeads;
        const leadsConverted = getStatusCount("Converted");
        const leadsContacted = getStatusCount("Contacted");
        const leadsQualified = getStatusCount("Qualified");
        const leadsLost = getStatusCount("Lost");

        console.log(`[${user.userName}] leadsAssigned=${leadsAssigned} ids=`, ids.map(x => String(x.leadId)));


        // ✅ Sales (same logic)
        const sales = await Sales.find({
            salesPerson: user._id,
            date: { $gte: start, $lt: end }
        });

        const totalSales = sales.reduce((acc, sale) => acc + sale.amount, 0);
        const totalDealsClosed = sales.length;
        const refundAmount = sales.reduce((acc, sale) => acc + (sale.refunded ? sale.refundAmount : 0), 0);
        const conversionRate = leadsAssigned > 0 ? (totalDealsClosed / leadsAssigned) * 100 : 0;

        // ✅ Invoices
        const invoices = await Invoice.find({
            salesPerson: user._id,
            invoiceDate: { $gte: start, $lt: end },
            paymentStatus: "Paid"
        });

        const revenue = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
        const netRevenue = revenue - refundAmount;

        // ✅ Upsert Performance document
        await Performance.findOneAndUpdate({ user: user._id, period }, {
            user: user._id,
            period,
            role: user.designation || '',
            leadsAssigned,
            leadsConverted,
            leadsContacted,
            leadsQualified,
            leadsLost,
            totalSales,
            totalDealsClosed,
            refundAmount,
            revenue,
            netRevenue,
            conversionRate,
        }, { upsert: true, new: true });
    }

    res.status(200).json({
        success: true,
        message: `Performance refreshed for period ${period}`,
    });
});

exports.backfillAllPerformance = cathAsyncError(async (req, res, next) => {
    const earliestLead = await Lead.findOne().sort({ createdAt: 1 });
    const earliestSale = await Sales.findOne().sort({ date: 1 });
    const earliestInvoice = await Invoice.findOne().sort({ invoiceDate: 1 });

    const firstDate = new Date(Math.min(
        earliestLead?.createdAt?.getTime() || Infinity,
        earliestSale?.date?.getTime() || Infinity,
        earliestInvoice?.invoiceDate?.getTime() || Infinity
    ));

    if (!firstDate || isNaN(firstDate)) {
        return next(new ErrorHandler("No historical data found to backfill", 404));
    }

    const now = new Date();
    const yearMonthList = [];

    const cursor = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);

    while (cursor <= now) {
        const year = cursor.getFullYear();
        const month = `${cursor.getMonth() + 1}`.padStart(2, "0");
        yearMonthList.push(`${year}-${month}`);
        cursor.setMonth(cursor.getMonth() + 1);
    }

    for (const period of yearMonthList) {
        req.body.month = period;
        await module.exports.refreshPerformance(req, res, () => { });
    }

    res.status(200).json({
        success: true,
        message: `Backfill complete. Performance stored for months: ${yearMonthList.join(", ")}`,
        totalMonths: yearMonthList.length
    });
});

exports.getTeamPerformanceWithUsers = cathAsyncError(async (req, res, next) => {
    const { teamId } = req.params;
    const period = req.query.month || new Date().toISOString().slice(0, 7);
    const team = await Team.findById(teamId);
    if (!team) return next(new ErrorHandler("Team not found", 404));
    // Get team-level performance
    const teamPerformance = await Performance.findOne({ team: teamId, period });
    // Get users of the team
    const users = await User.find({ "teams.team": teamId }).select("_id userName designation");
    const userPerformances = await Performance.find({
        user: { $in: users.map(u => u._id) },
        period
    }).populate("user", "userName designation");
    res.status(200).json({
        success: true,
        team: {
            _id: team._id,
            teamName: team.teamName,
            department: team.department,
        },
        teamPerformance,
        userPerformances,
    });
});
exports.getAllTeamsPerformance = cathAsyncError(async (req, res, next) => {
    const period = req.query.month || new Date().toISOString().slice(0, 7); // e.g., '2025-07'

    const teams = await Team.find({});

    // Get current month performance
    const monthlyPerformances = await Performance.find({
        team: { $ne: null },
        period
    }).populate("team", "teamName department");

    // Get overall performance (excluding month filter)
    const overallPerformances = await Performance.find({
        team: { $ne: null }
    }).populate("team", "teamName department");

    res.status(200).json({
        success: true,
        teams: teams.map(team => {
            const currentMonthPerf = monthlyPerformances.find(
                p => p.team?._id.toString() === team._id.toString()
            );

            const overallPerf = overallPerformances
                .filter(p => p.team?._id.toString() === team._id.toString());

            return {
                teamId: team._id,
                teamName: team.teamName,
                department: team.department,
                currentMonthPerformance: currentMonthPerf || null,
                overallPerformance: overallPerf.length ? overallPerf : []
            };
        })
    });
});

///////////////////////////////////////////////////

exports.getUserTeamPerformance = cathAsyncError(async (req, res, next) => {
    const { userId, teamId } = req.params;
    const period = req.query.month || new Date().toISOString().slice(0, 7);
    const { start, end } = getMonthRange(period);

    // Get user's performance in specific team
    const leadStats = await Lead.aggregate([
        { $unwind: "$assigned" },
        {
            $match: {
                "assigned.user": mongoose.Types.ObjectId(userId),
                "assigned.team": mongoose.Types.ObjectId(teamId),
                "assigned.assignedAt": { $gte: start, $lt: end }
            }
        },
        {
            $group: {
                _id: "$assigned.status",
                count: { $sum: 1 }
            }
        }
    ]);

    // Sales stats for specific user
    const salesStats = await Sales.aggregate([
        {
            $match: {
                salesPerson: mongoose.Types.ObjectId(userId),
                date: { $gte: start, $lt: end }
            }
        },
        {
            $group: {
                _id: null,
                totalSales: { $sum: "$amount" },
                totalDeals: { $sum: 1 },
                refundAmount: { $sum: { $cond: ["$refunded", "$refundAmount", 0] } }
            }
        }
    ]);

    // Format response
    const getStatusCount = (status) => {
        const found = leadStats.find(l => l._id === status);
        return found ? found.count : 0;
    };

    const performance = {
        user: await User.findById(userId).select('userName designation'),
        team: await Team.findById(teamId).select('teamName department'),
        period,
        leadsAssigned: leadStats.reduce((acc, obj) => acc + obj.count, 0),
        leadsConverted: getStatusCount("Converted"),
        leadsContacted: getStatusCount("Contacted"),
        leadsQualified: getStatusCount("Qualified"),
        leadsLost: getStatusCount("Lost"),
        totalSales: salesStats[0]?.totalSales || 0,
        totalDeals: salesStats[0]?.totalDeals || 0,
        refundAmount: salesStats[0]?.refundAmount || 0
    };

    performance.conversionRate = performance.leadsAssigned > 0
        ? (performance.leadsConverted / performance.leadsAssigned) * 100
        : 0;

    res.status(200).json({ success: true, performance });
});

exports.getTeamOverallPerformance = cathAsyncError(async (req, res, next) => {
    const { teamId } = req.params;
    const period = req.query.month;
    const { start, end } = period ? getMonthRange(period) : {};

    // Validate month format if provided
    if (period) {
        const ok = /^\d{4}-(0[1-9]|1[0-2])$/.test(period);
        if (!ok) return next(new ErrorHandler("Invalid month format. Use YYYY-MM", 400));
    }

    const team = await Team.findById(teamId);
    if (!team) {
        return next(new ErrorHandler("Team not found", 404));
    }

    // Get all team members
    const teamMembers = await User.find({
        "teams.team": mongoose.Types.ObjectId(teamId),
    }).select("_id userName designation");

    if (!teamMembers.length) {
        return next(new ErrorHandler("No team members found for this team", 404));
    }

    const memberIds = teamMembers.map(m => m._id);

    // Team lead performance (unique lead count)
    const leadMatchStage = {
        "assigned.team": mongoose.Types.ObjectId(teamId),
    };
    if (period) {
        leadMatchStage.date = { $gte: start, $lte: end };
    }

    const teamLeadStats = await Lead.aggregate([
        { $match: leadMatchStage },
        { $unwind: "$assigned" },
        { $match: { "assigned.team": mongoose.Types.ObjectId(teamId) } },
        {
            $group: {
                _id: null,
                uniqueLeads: { $addToSet: "$_id" }, // Collect unique lead IDs
                users: { $addToSet: "$assigned.user" },
            },
        },
        {
            $project: {
                leadsAssigned: { $size: "$uniqueLeads" }, // Count unique leads
                users: 1,
            },
        },
    ]);

    // Team sales performance
    const salesMatchStage = {
        team: mongoose.Types.ObjectId(teamId), // Use team field directly
    };
    if (period) {
        salesMatchStage.date = { $gte: start, $lte: end };
    }

    const teamSalesStats = await Sales.aggregate([
        { $match: salesMatchStage },
        {
            $group: {
                _id: null,
                totalDeals: { $sum: 1 },
                totalSales: { $sum: "$amount" },
                refundAmount: { $sum: "$refundAmount" },
                netRevenue: { $sum: { $subtract: ["$amount", "$refundAmount"] } },
                salesPeople: { $addToSet: "$salesPerson" },
            },
        },
    ]);

    // Individual member performances
    const memberPerformances = await Promise.all(
        teamMembers.map(async (member) => {
            const memberLeadMatch = {
                "assigned.user": member._id,
                "assigned.team": mongoose.Types.ObjectId(teamId),
            };
            if (period) {
                memberLeadMatch.date = { $gte: start, $lte: end };
            }

            const memberLeadStats = await Lead.aggregate([
                { $match: memberLeadMatch },
                { $unwind: "$assigned" },
                { $match: { "assigned.user": member._id, "assigned.team": mongoose.Types.ObjectId(teamId) } },
                {
                    $group: {
                        _id: null,
                        uniqueLeads: { $addToSet: "$_id" }, // Collect unique lead IDs
                    },
                },
                {
                    $project: {
                        leadsAssigned: { $size: "$uniqueLeads" }, // Count unique leads
                    },
                },
            ]);

            const memberSalesMatch = {
                salesPerson: member._id,
                team: mongoose.Types.ObjectId(teamId), // Filter by team for member deals
            };
            if (period) {
                memberSalesMatch.date = { $gte: start, $lte: end };
            }

            const memberSalesStats = await Sales.aggregate([
                { $match: memberSalesMatch },
                {
                    $group: {
                        _id: null,
                        totalDeals: { $sum: 1 },
                        totalSales: { $sum: "$amount" },
                        refundAmount: { $sum: "$refundAmount" },
                        netRevenue: { $sum: { $subtract: ["$amount", "$refundAmount"] } },
                    },
                },
            ]);

            return {
                user: {
                    _id: member._id,
                    userName: member.userName,
                    designation: member.designation,
                },
                leadsAssigned: memberLeadStats[0]?.leadsAssigned || 0,
                totalDeals: memberSalesStats[0]?.totalDeals || 0,
                totalSales: memberSalesStats[0]?.totalSales || 0,
                refundAmount: memberSalesStats[0]?.refundAmount || 0,
                netRevenue: memberSalesStats[0]?.netRevenue || 0,
                conversionRate:
                    memberLeadStats[0]?.leadsAssigned > 0
                        ? (memberSalesStats[0]?.totalDeals || 0) / memberLeadStats[0].leadsAssigned * 100
                        : 0,
            };
        })
    );

    // Team totals
    const teamTotals = {
        leadsAssigned: teamLeadStats[0]?.leadsAssigned || 0,
        totalDeals: teamSalesStats[0]?.totalDeals || 0,
        totalSales: teamSalesStats[0]?.totalSales || 0,
        refundAmount: teamSalesStats[0]?.refundAmount || 0,
        netRevenue: teamSalesStats[0]?.netRevenue || 0,
        conversionRate:
            teamLeadStats[0]?.leadsAssigned > 0
                ? (teamSalesStats[0]?.totalDeals || 0) / teamLeadStats[0].leadsAssigned * 100
                : 0,
    };

    res.status(200).json({
        success: true,
        team,
        period: period || "overall",
        teamTotals,
        memberPerformances,
        totalMembers: teamMembers.length,
    });
});

// exports.getTeamOverallPerformance = cathAsyncError(async (req, res, next) => {
//     const { teamId } = req.params;
//     const period = req.query.month;
//     const { start, end } = period ? getMonthRange(period) : {};

//     // Get all team members
//     const teamMembers = await User.find({
//         'teams.team': teamId
//     }).select('_id userName designation');

//     const memberIds = teamMembers.map(m => m._id);
//     // Team lead performance

//     const leadMatchStage = {
//         "assigned.team": mongoose.Types.ObjectId(teamId)
//     };
//     if (period) {
//         leadMatchStage["assigned.assignedAt"] = { $gte: start, $lt: end };
//     }
//     // Team lead performance
//     const teamLeadStats = await Lead.aggregate([
//         { $unwind: "$assigned" },
//         { $match: leadMatchStage },
//         {
//             $group: {
//                 _id: "$assigned.status",
//                 count: { $sum: 1 },
//                 users: { $addToSet: "$assigned.user" }
//             }
//         }
//     ]);
//     // Team sales performance
//     const salesMatchStage = {
//         salesPerson: { $in: memberIds }
//     };
//     if (period) {
//         salesMatchStage.date = { $gte: start, $lt: end };
//     }
//     // Team sales performance
//     const teamSalesStats = await Sales.aggregate([
//         {
//             $match: salesMatchStage
//         },
//         {
//             $group: {
//                 _id: null,
//                 totalSales: { $sum: "$amount" },
//                 totalDeals: { $sum: 1 },
//                 refundAmount: { $sum: { $cond: ["$refunded", "$refundAmount", 0] } },
//                 salesPeople: { $addToSet: "$salesPerson" }
//             }
//         }
//     ]);

//     // Individual member performances
//     const memberPerformances = await Promise.all(
//         teamMembers.map(async (member) => {
//             const memberLeadMatch = {
//                 "assigned.user": member._id,
//                 "assigned.team": mongoose.Types.ObjectId(teamId)
//             };
//             if (period) {
//                 memberLeadMatch["assigned.assignedAt"] = { $gte: start, $lt: end };
//             }
//             const memberLeadStats = await Lead.aggregate([
//                 { $unwind: "$assigned" },
//                 {
//                     $match: memberLeadMatch
//                 },
//                 {
//                     $group: {
//                         _id: "$assigned.status",
//                         count: { $sum: 1 }
//                     }
//                 }
//             ]);
//             const memberSalesMatch = {
//                 salesPerson: member._id
//             };
//             if (period) {
//                 memberSalesMatch.date = { $gte: start, $lt: end };
//             }
//             const memberSalesStats = await Sales.aggregate([
//                 {
//                     $match: memberSalesMatch
//                 },
//                 {
//                     $group: {
//                         _id: null,
//                         totalSales: { $sum: "$amount" },
//                         totalDeals: { $sum: 1 }
//                     }
//                 }
//             ]);

//             const getStatusCount = (status) => {
//                 const found = memberLeadStats.find(l => l._id === status);
//                 return found ? found.count : 0;
//             };

//             const leadsAssigned = memberLeadStats.reduce((acc, obj) => acc + obj.count, 0);
//             const leadsConverted = getStatusCount("Converted");

//             return {
//                 user: member,
//                 leadsAssigned,
//                 leadsConverted,
//                 leadsContacted: getStatusCount("FollowUp"),
//                 leadsContacted: getStatusCount("Contacted"),
//                 leadsQualified: getStatusCount("Qualified"),
//                 leadsLost: getStatusCount("Lost"),
//                 totalSales: memberSalesStats[0]?.totalSales || 0,
//                 totalDeals: memberSalesStats[0]?.totalDeals || 0,
//                 conversionRate: leadsAssigned > 0 ? (memberSalesStats[0]?.totalDeals / leadsAssigned) * 100 : 0
//             };
//         })
//     );

//     // Team totals
//     const getTeamStatusCount = (status) => {
//         const found = teamLeadStats.find(l => l._id === status);
//         return found ? found.count : 0;
//     };

//     const teamTotals = {
//         leadsAssigned: teamLeadStats.reduce((acc, obj) => acc + obj.count, 0),
//         leadsConverted: getTeamStatusCount("Converted"),
//         leadsContacted: getTeamStatusCount("Contacted"),
//         leadsQualified: getTeamStatusCount("Qualified"),
//         leadsLost: getTeamStatusCount("Lost"),
//         totalSales: teamSalesStats[0]?.totalSales || 0,
//         totalDeals: teamSalesStats[0]?.totalDeals || 0,
//         refundAmount: teamSalesStats[0]?.refundAmount || 0
//     };

//     teamTotals.conversionRate = teamTotals.leadsAssigned > 0
//         ? (teamTotals.totalDeals / teamTotals.leadsAssigned) * 100
//         : 0;

//     res.status(200).json({
//         success: true,
//         team: await Team.findById(teamId),
//         period,
//         teamTotals,
//         memberPerformances,
//         totalMembers: teamMembers.length
//     });
// });

// ====== SOLUTION 4: Fallback Method (Agar purane leads mein team data nahi hai) ======

exports.getTeamPerformanceFallback = cathAsyncError(async (req, res, next) => {
    const { teamId } = req.params;
    const period = req.query.month || new Date().toISOString().slice(0, 7);
    const { start, end } = getMonthRange(period);

    // Step 1: Get all team members
    const teamMembers = await User.find({
        'teams.team': teamId
    }).select('_id userName designation');

    if (teamMembers.length === 0) {
        return next(new ErrorHandler("No members found in this team", 404));
    }

    const memberIds = teamMembers.map(m => m._id);

    // Step 2: Get all leads assigned to team members (fallback method)
    const teamLeadStats = await Lead.aggregate([
        { $unwind: "$assigned" },
        {
            $match: {
                "assigned.user": { $in: memberIds },
                "assigned.assignedAt": { $gte: start, $lt: end }
            }
        },
        {
            $group: {
                _id: "$assigned.status",
                count: { $sum: 1 }
            }
        }
    ]);

    // Step 3: Get sales data for team members
    const teamSalesStats = await Sales.aggregate([
        {
            $match: {
                salesPerson: { $in: memberIds },
                date: { $gte: start, $lt: end }
            }
        },
        {
            $group: {
                _id: null,
                totalSales: { $sum: "$amount" },
                totalDeals: { $sum: 1 },
                refundAmount: { $sum: { $cond: ["$refunded", "$refundAmount", 0] } }
            }
        }
    ]);

    // Step 4: Format team performance
    const getStatusCount = (status) => {
        const found = teamLeadStats.find(l => l._id === status);
        return found ? found.count : 0;
    };

    const teamPerformance = {
        team: await Team.findById(teamId),
        period,
        members: teamMembers,
        performance: {
            leadsAssigned: teamLeadStats.reduce((acc, obj) => acc + obj.count, 0),
            leadsConverted: getStatusCount("Converted"),
            leadsContacted: getStatusCount("Contacted"),
            leadsQualified: getStatusCount("Qualified"),
            leadsLost: getStatusCount("Lost"),
            totalSales: teamSalesStats[0]?.totalSales || 0,
            totalDeals: teamSalesStats[0]?.totalDeals || 0,
            refundAmount: teamSalesStats[0]?.refundAmount || 0
        }
    };

    teamPerformance.performance.conversionRate =
        teamPerformance.performance.leadsAssigned > 0
            ? (teamPerformance.performance.leadsConverted / teamPerformance.performance.leadsAssigned) * 100
            : 0;

    res.status(200).json({
        success: true,
        ...teamPerformance
    });
});

// exports.getCompleteDashboard = cathAsyncError(async (req, res, next) => {
//     const { month } = req.query;
//     let start = null;
//     let end = null;

//     if (month) {
//         const range = getMonthRange(month);
//         start = range.start;
//         end = range.end;
//     }

//     // All teams performance
//     const teams = await Team.find({});
//     const teamsPerformance = [];

//     for (const team of teams) {
//         const teamMembers = await User.find({
//             'teams.team': team._id
//         }).select('_id userName designation');

//         const memberIds = teamMembers.map(m => m._id);

//         if (memberIds.length > 0) {
//             const matchLead = {
//                 "assigned.user": { $in: memberIds }
//             };
//             if (start && end) {
//                 matchLead["assigned.assignedAt"] = { $gte: start, $lt: end };
//             }

//             const teamStats = await Lead.aggregate([
//                 { $unwind: "$assigned" },
//                 { $match: matchLead },
//                 {
//                     $group: {
//                         _id: "$assigned.status",
//                         count: { $sum: 1 }
//                     }
//                 }
//             ]);

//             const matchSales = {
//                 salesPerson: { $in: memberIds }
//             };
//             if (start && end) {
//                 matchSales["date"] = { $gte: start, $lt: end };
//             }

//             const salesStats = await Sales.aggregate([
//                 { $match: matchSales },
//                 {
//                     $group: {
//                         _id: null,
//                         totalSales: { $sum: "$amount" },
//                         totalDeals: { $sum: 1 }
//                     }
//                 }
//             ]);

//             const getStatusCount = (status) => {
//                 const found = teamStats.find(l => l._id === status);
//                 return found ? found.count : 0;
//             };

//             const leadsAssigned = teamStats.reduce((acc, obj) => acc + obj.count, 0);
//             const leadsConverted = getStatusCount("Converted");

//             teamsPerformance.push({
//                 team: team,
//                 memberCount: teamMembers.length,
//                 performance: {
//                     leadsAssigned,
//                     leadsConverted,
//                     leadsContacted: getStatusCount("Contacted"),
//                     leadsQualified: getStatusCount("Qualified"),
//                     leadsLost: getStatusCount("Lost"),
//                     totalSales: salesStats[0]?.totalSales || 0,
//                     totalDeals: salesStats[0]?.totalDeals || 0,
//                     conversionRate: leadsAssigned > 0 ? (salesStats[0]?.totalDeals / leadsAssigned) * 100 : 0
//                 }
//             });
//         }
//     }

//     const overallStats = teamsPerformance.reduce((acc, team) => {
//         acc.totalLeadsAssigned += team.performance.leadsAssigned;
//         acc.totalLeadsConverted += team.performance.leadsConverted;
//         acc.totalSales += team.performance.totalSales;
//         acc.totalDeals += team.performance.totalDeals;
//         return acc;
//     }, {
//         totalLeadsAssigned: 0,
//         totalLeadsConverted: 0,
//         totalSales: 0,
//         totalDeals: 0
//     });

//     overallStats.overallConversionRate = overallStats.totalLeadsAssigned > 0
//         ? (overallStats.totalDeals / overallStats.totalLeadsAssigned) * 100
//         : 0;

//     res.status(200).json({
//         success: true,
//         period: month || "overall",
//         overallStats,
//         teamsPerformance,
//         totalTeams: teams.length
//     });
// });

exports.getCompleteDashboard = cathAsyncError(async (req, res, next) => {
  const { month } = req.query;
  let start = null;
  let end = null;

  if (month) {
    const ok = /^\d{4}-(0[1-9]|1[0-2])$/.test(month);
    if (!ok) return next(new ErrorHandler("Invalid month format. Use YYYY-MM", 400));
    const range = getMonthRange(month);
    start = range.start;
    end = range.end;
  }

  // All teams performance
  const teams = await Team.find({});
  const teamsPerformance = [];

  for (const team of teams) {
    const teamMembers = await User.find({
      "teams.team": team._id,
    }).select("_id userName designation");

    const memberIds = teamMembers.map(m => m._id);

    if (memberIds.length > 0) {
      const matchLead = {
        "assigned.user": { $in: memberIds },
        "assigned.team": mongoose.Types.ObjectId(team._id),
      };
      if (start && end) {
        matchLead.date = { $gte: start, $lte: end };
      }

      const teamStats = await Lead.aggregate([
        { $match: matchLead },
        { $unwind: "$assigned" },
        { $match: { "assigned.user": { $in: memberIds }, "assigned.team": mongoose.Types.ObjectId(team._id) } },
        {
          $group: {
            _id: null,
            uniqueLeads: { $addToSet: "$_id" }, // Collect unique lead IDs
          },
        },
        {
          $project: {
            leadsAssigned: { $size: "$uniqueLeads" }, // Count unique leads
          },
        },
      ]);

      const matchSales = {
        team: mongoose.Types.ObjectId(team._id), // Use team field directly
      };
      if (start && end) {
        matchSales.date = { $gte: start, $lte: end };
      }

      const salesStats = await Sales.aggregate([
        { $match: matchSales },
        {
          $group: {
            _id: null,
            totalDeals: { $sum: 1 },
            totalSales: { $sum: "$amount" },
            refundAmount: { $sum: "$refundAmount" },
            netRevenue: { $sum: { $subtract: ["$amount", "$refundAmount"] } },
          },
        },
      ]);

      teamsPerformance.push({
        team,
        memberCount: teamMembers.length,
        performance: {
          leadsAssigned: teamStats[0]?.leadsAssigned || 0,
          totalDeals: salesStats[0]?.totalDeals || 0,
          totalSales: salesStats[0]?.totalSales || 0,
          refundAmount: salesStats[0]?.refundAmount || 0,
          netRevenue: salesStats[0]?.netRevenue || 0,
          conversionRate:
            teamStats[0]?.leadsAssigned > 0
              ? ((salesStats[0]?.totalDeals || 0) / teamStats[0].leadsAssigned) * 100
              : 0,
        },
      });
    }
  }

  // Overall stats across all teams
  const overallStats = teamsPerformance.reduce(
    (acc, team) => {
      acc.totalLeadsAssigned += team.performance.leadsAssigned;
      acc.totalDeals += team.performance.totalDeals;
      acc.totalSales += team.performance.totalSales;
      acc.refundAmount += team.performance.refundAmount;
      acc.netRevenue += team.performance.netRevenue;
      return acc;
    },
    {
      totalLeadsAssigned: 0,
      totalDeals: 0,
      totalSales: 0,
      refundAmount: 0,
      netRevenue: 0,
    }
  );

  overallStats.overallConversionRate =
    overallStats.totalLeadsAssigned > 0
      ? (overallStats.totalDeals / overallStats.totalLeadsAssigned) * 100
      : 0;

  res.status(200).json({
    success: true,
    period: month || "overall",
    overallStats,
    teamsPerformance,
    totalTeams: teams.length,
  });
});

// exports.getCompleteDashboard = cathAsyncError(async (req, res, next) => {
//     const { month } = req.query;
//     let start = null;
//     let end = null;

//     if (month) {
//         const ok = /^\d{4}-(0[1-9]|1[0-2])$/.test(month);
//         if (!ok) return next(new ErrorHandler("Invalid month format. Use YYYY-MM", 400));
//         const range = getMonthRange(month);
//         start = range.start;
//         end = range.end;
//     }

//     // All teams performance
//     const teams = await Team.find({});
//     const teamsPerformance = [];

//     for (const team of teams) {
//         const teamMembers = await User.find({
//             "teams.team": team._id,
//         }).select("_id userName designation");

//         const memberIds = teamMembers.map(m => m._id);

//         if (memberIds.length > 0) {
//             const matchLead = {
//                 "assigned.user": { $in: memberIds },
//                 "assigned.team": mongoose.Types.ObjectId(team._id),
//             };
//             if (start && end) {
//                 matchLead.date = { $gte: start, $lte: end };
//             }

//             const teamStats = await Lead.aggregate([
//                 { $match: matchLead },
//                 { $unwind: "$assigned" },
//                 { $match: { "assigned.user": { $in: memberIds }, "assigned.team": mongoose.Types.ObjectId(team._id) } },
//                 {
//                     $group: {
//                         _id: null,
//                         uniqueLeads: { $addToSet: "$_id" }, // Collect unique lead IDs
//                     },
//                 },
//                 {
//                     $project: {
//                         leadsAssigned: { $size: "$uniqueLeads" }, // Count unique leads
//                     },
//                 },
//             ]);

//             const matchSales = {
//                 salesPerson: { $in: memberIds },
//             };
//             if (start && end) {
//                 matchSales.date = { $gte: start, $lte: end };
//             }

//             const salesStats = await Sales.aggregate([
//                 { $match: matchSales },
//                 {
//                     $group: {
//                         _id: null,
//                         totalDeals: { $sum: 1 },
//                         totalSales: { $sum: "$amount" },
//                         refundAmount: { $sum: "$refundAmount" },
//                         netRevenue: { $sum: { $subtract: ["$amount", "$refundAmount"] } },
//                     },
//                 },
//             ]);

//             teamsPerformance.push({
//                 team,
//                 memberCount: teamMembers.length,
//                 performance: {
//                     leadsAssigned: teamStats[0]?.leadsAssigned || 0,
//                     totalDeals: salesStats[0]?.totalDeals || 0,
//                     totalSales: salesStats[0]?.totalSales || 0,
//                     refundAmount: salesStats[0]?.refundAmount || 0,
//                     netRevenue: salesStats[0]?.netRevenue || 0,
//                     conversionRate:
//                         teamStats[0]?.leadsAssigned > 0
//                             ? (salesStats[0]?.totalDeals || 0) / teamStats[0].leadsAssigned * 100
//                             : 0,
//                 },
//             });
//         }
//     }

//     // Overall stats across all teams
//     const overallStats = teamsPerformance.reduce(
//         (acc, team) => {
//             acc.totalLeadsAssigned += team.performance.leadsAssigned;
//             acc.totalDeals += team.performance.totalDeals;
//             acc.totalSales += team.performance.totalSales;
//             acc.refundAmount += team.performance.refundAmount;
//             acc.netRevenue += team.performance.netRevenue;
//             return acc;
//         },
//         {
//             totalLeadsAssigned: 0,
//             totalDeals: 0,
//             totalSales: 0,
//             refundAmount: 0,
//             netRevenue: 0,
//         }
//     );

//     overallStats.overallConversionRate =
//         overallStats.totalLeadsAssigned > 0
//             ? (overallStats.totalDeals / overallStats.totalLeadsAssigned) * 100
//             : 0;

//     res.status(200).json({
//         success: true,
//         period: month || "overall",
//         overallStats,
//         teamsPerformance,
//         totalTeams: teams.length,
//     });
// });

////////////////////////////

// exports.getCompleteDashboard = cathAsyncError(async (req, res, next) => {
//     const period = req.query.month || new Date().toISOString().slice(0, 7);
//     const { start, end } = getMonthRange(period);

//     // All teams performance
//     const teams = await Team.find({});
//     const teamsPerformance = [];

//     for (const team of teams) {
//         const teamMembers = await User.find({
//             'teams.team': team._id
//         }).select('_id userName designation');

//         const memberIds = teamMembers.map(m => m._id);

//         if (memberIds.length > 0) {
//             const teamStats = await Lead.aggregate([
//                 { $unwind: "$assigned" },
//                 {
//                     $match: {
//                         "assigned.user": { $in: memberIds },
//                         "assigned.assignedAt": { $gte: start, $lt: end }
//                     }
//                 },
//                 {
//                     $group: {
//                         _id: "$assigned.status",
//                         count: { $sum: 1 }
//                     }
//                 }
//             ]);

//             const salesStats = await Sales.aggregate([
//                 {
//                     $match: {
//                         salesPerson: { $in: memberIds },
//                         date: { $gte: start, $lt: end }
//                     }
//                 },
//                 {
//                     $group: {
//                         _id: null,
//                         totalSales: { $sum: "$amount" },
//                         totalDeals: { $sum: 1 }
//                     }
//                 }
//             ]);

//             const getStatusCount = (status) => {
//                 const found = teamStats.find(l => l._id === status);
//                 return found ? found.count : 0;
//             };

//             const leadsAssigned = teamStats.reduce((acc, obj) => acc + obj.count, 0);
//             const leadsConverted = getStatusCount("Converted");

//             teamsPerformance.push({
//                 team: team,
//                 memberCount: teamMembers.length,
//                 performance: {
//                     leadsAssigned,
//                     leadsConverted,
//                     leadsContacted: getStatusCount("Contacted"),
//                     leadsQualified: getStatusCount("Qualified"),
//                     leadsLost: getStatusCount("Lost"),
//                     totalSales: salesStats[0]?.totalSales || 0,
//                     totalDeals: salesStats[0]?.totalDeals || 0,
//                     conversionRate: leadsAssigned > 0 ? (leadsConverted / leadsAssigned) * 100 : 0
//                 }
//             });
//         }
//     }

//     // Overall company stats
//     const overallStats = teamsPerformance.reduce((acc, team) => {
//         acc.totalLeadsAssigned += team.performance.leadsAssigned;
//         acc.totalLeadsConverted += team.performance.leadsConverted;
//         acc.totalSales += team.performance.totalSales;
//         acc.totalDeals += team.performance.totalDeals;
//         return acc;
//     }, {
//         totalLeadsAssigned: 0,
//         totalLeadsConverted: 0,
//         totalSales: 0,
//         totalDeals: 0
//     });

//     overallStats.overallConversionRate = overallStats.totalLeadsAssigned > 0
//         ? (overallStats.totalLeadsConverted / overallStats.totalLeadsAssigned) * 100
//         : 0;

//     res.status(200).json({
//         success: true,
//         period,
//         overallStats,
//         teamsPerformance,
//         totalTeams: teams.length
//     });
// });
