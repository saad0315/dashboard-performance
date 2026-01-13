const mongoose = require("mongoose");
const { db1 } = require("../config/db");


const performanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false // Null if it's team-level performance
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: false // Null if it's individual performance
    },

    // Tracking period
    period: {
        type: String, // Format: YYYY-MM e.g. "2025-07"
        required: true
    },

    // Lead KPIs
    leadsAssigned: {
        type: Number,
        default: 0
    },
    leadsContacted: {
        type: Number,
        default: 0
    },
    leadsQualified: {
        type: Number,
        default: 0
    },
    leadsConverted: {
        type: Number,
        default: 0
    },
    leadsLost: {
        type: Number,
        default: 0
    },

    // Sales KPIs
    totalSales: {
        type: Number,
        default: 0
    },
    totalDealsClosed: {
        type: Number,
        default: 0
    },
    refundAmount: {
        type: Number,
        default: 0
    },

    // Revenue
    revenue: {
        type: Number,
        default: 0
    },
    netRevenue: {
        type: Number,
        default: 0
    },

    // Conversion & efficiency
    conversionRate: {
        type: Number, // calculated field (Converted / Assigned) * 100
        default: 0
    },

    // Target Tracking (optional)
    targetLeads: {
        type: Number,
        default: 0
    },
    targetSales: {
        type: Number,
        default: 0
    },
    targetRevenue: {
        type: Number,
        default: 0
    },

    // Additional
    role: {
        type: String,
        enum: ['frontSell', 'upSell', 'projectManagement', 'admin', 'ppc'],
    },

    generatedAt: {
        type: Date,
        default: Date.now
    }
});


const Performance = db1.model("Performance", performanceSchema);

module.exports = Performance;