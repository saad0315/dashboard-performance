const Performance = require("../models/performanceModel");
const Lead = require("../models/leadModel");
const Sales = require("../models/salesModel");
const Invoice = require("../models/invoiceModel");
const mongoose = require("mongoose");

function getMonthPeriod(date = new Date()) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
}

async function updateUserPerformance(userId, period = getMonthPeriod()) {
  const start = new Date(`${period}-01`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  // Leads (based on assigned[])
  const leadStatusCounts = await Lead.aggregate([
    { $unwind: "$assigned" },
    {
      $match: {
        "assigned.user": mongoose.Types.ObjectId(userId),
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

  const getStatusCount = (status) => {
    const item = leadStatusCounts.find(l => l._id === status);
    return item ? item.count : 0;
  };

  const leadsAssigned = leadStatusCounts.reduce((acc, obj) => acc + obj.count, 0);
  const leadsConverted = getStatusCount("Converted");
  const leadsContacted = getStatusCount("Contacted");
  const leadsQualified = getStatusCount("Qualified");
  const leadsLost = getStatusCount("Lost");

  const conversionRate = leadsAssigned > 0 ? (leadsConverted / leadsAssigned) * 100 : 0;

  const sales = await Sales.find({
    salesPerson: userId,
    date: { $gte: start, $lt: end }
  });

  const totalSales = sales.reduce((acc, sale) => acc + sale.amount, 0);
  const totalDealsClosed = sales.length;
  const refundAmount = sales.reduce((acc, sale) => acc + (sale.refunded ? sale.refundAmount : 0), 0);

  const invoices = await Invoice.find({
    salesPerson: userId,
    invoiceDate: { $gte: start, $lt: end },
    paymentStatus: "Paid"
  });

  const revenue = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const netRevenue = revenue - refundAmount;

  await Performance.findOneAndUpdate(
    { user: userId, period },
    {
      user: userId,
      period,
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
      conversionRate
    },
    { upsert: true, new: true }
  );
}

module.exports = { updateUserPerformance };
