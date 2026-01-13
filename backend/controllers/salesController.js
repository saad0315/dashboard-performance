const Sales = require("../models/salesModel"); // Assuming salesModel.js is where your Sales schema is defined
const cathAsyncError = require("../middleWare/asyncErrors");
const Lead = require("../models/leadModel");
const userModel = require("../models/userModel");
const Notification = require("../models/notificationModel");
const { sendNotification } = require("../utils/notification");
const Invoice = require("../models/invoiceModel");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/userModel");
const { default: mongoose } = require("mongoose");
const Team = require("../models/teamModel");

// exports.createSale = cathAsyncError(async (req, res, next) => {
//     let formData = req.body;
//     if (formData.comments && typeof formData.comments === "string") {
//         try {
//             formData.comments = JSON.parse(formData.comments);
//         } catch (err) {
//             return next(new ErrorHandler("Invalid comments format", 400));
//         }
//     }
//     if (req.file) {
//         const uploadedFileUrl = req.file.key; // Get the file key from AWS S3
//         formData = { ...formData, saleAgreement: uploadedFileUrl };
//     } else {
//         console.log("No file found in req.file");
//     }

//     const sales = await Sales.create(formData);

//     // const sales = await Sales.create(saleData);

//     if (!sales) {
//         return next(new ErrorHandler("Sales cannot be created", 400));
//     }

//     // Update lead status to "Converted"
//     const lead = await Lead.findById(req.body.lead).select("userName");

//     if (!lead) {
//         return next(new ErrorHandler("Lead not found", 400))
//     }

//     await Lead.findByIdAndUpdate(req.body.lead, { status: "Converted" });


//     if (req.body.invoice) {
//         const invoice = await Invoice.findById(req.body.invoice);

//         if (!invoice) {
//             return next(new ErrorHandler("Invoice not found", 404));
//         }

//         invoice.sale = sales._id;
//         await invoice.save();
//     }


//     // 🔹 Create invoice after sale creation
//     // const invoiceData = {
//     //   invoiceDate: new Date(),
//     //   dueDate: formData.dueDate || new Date(), // fallback to today
//     //   totalAmount: formData.amount,
//     //   customer: lead._id,
//     //   project: sales._id,
//     //   installments: [
//     //     {
//     //       amount: formData.amount,
//     //       dueDate: formData.dueDate || new Date(),
//     //       status: "Pending"
//     //     }
//     //   ]
//     // };

//     // const invoice = await InvoiceModel.create(invoiceData);

//     // Find Admin & Manager users
//     const usersToNotify = await userModel.find({
//         role: { $in: ["admin", "manager"] },
//         _id: { $ne: req.user._id }
//     });

//     // Create a notification
//     const notification = new Notification({
//         recipients: usersToNotify.map(user => user._id),
//         sender: req.user._id, // Store sender ID
//         type: "NEW_SALE_CREATED",
//         content: `<strong>${req.user?.userName}</strong> created a new sale for <strong> ${lead.userName} </strong>  .`,
//         relatedId: sales._id,
//         // onModel: "Sale"
//     });

//     await notification.save();
//     sendNotification(usersToNotify, "NEW_SALE_CREATED", `${req.user?.userName} created a new sale for ${lead.userName} `, sales._id, "Sales");

//     res.status(201).json({
//         success: true,
//         sales,
//     });
// });

exports.createSale = cathAsyncError(async (req, res, next) => {
  let formData = req.body;

  // Parse comments if provided as a string
  if (formData.comments && typeof formData.comments === "string") {
    try {
      formData.comments = JSON.parse(formData.comments);
    } catch (err) {
      return next(new ErrorHandler("Invalid comments format", 400));
    }
  }

  // Handle file upload for saleAgreement
  if (req.file) {
    const uploadedFileUrl = req.file.key; // Get the file key from AWS S3
    formData = { ...formData, saleAgreement: uploadedFileUrl };
  } else {
    console.log("No file found in req.file");
  }

  // Validate required fields
  const { lead: leadId, salesPerson, amount, saleType, team: teamId } = formData;
  if (!leadId || !salesPerson || !amount || !saleType) {
    return next(new ErrorHandler("Missing required fields: lead, salesPerson, amount, or saleType", 400));
  }

  // Validate lead
  const lead = await Lead.findById(leadId).select("userName assigned");
  if (!lead) {
    return next(new ErrorHandler("Lead not found", 404));
  }

  // Validate salesPerson
  const user = await User.findById(salesPerson);
  if (!user) {
    return next(new ErrorHandler("Salesperson not found", 404));
  }

  // Determine team
  let teamIdForSale;
  if (teamId) {
    // Validate provided teamId
    const team = await Team.findById(teamId);
    if (!team) {
      return next(new ErrorHandler(`Team with ID ${teamId} not found`, 404));
    }
    // Check if salesPerson is in the team
    const isInTeam = user.teams.some(t => t.team.toString() === teamId.toString());
    if (!isInTeam) {
      return next(new ErrorHandler("Salesperson is not a member of the specified team", 403));
    }
    teamIdForSale = teamId;
  } else {
    // Try to find team from lead.assigned
    const assignment = lead.assigned.find(a => a.user && a.user.toString() === salesPerson.toString());
    if (assignment && assignment.team) {
      const team = await Team.findById(assignment.team);
      if (!team) {
        return next(new ErrorHandler("Team from lead assignment not found", 404));
      }
      teamIdForSale = assignment.team;
    } else {
      // Fall back to user.teams[0].team
      if (!user.teams || user.teams.length === 0) {
        return next(new ErrorHandler("Salesperson has no assigned teams", 400));
      }
      const primaryTeam = user.teams[0].team;
      const team = await Team.findById(primaryTeam);
      if (!team) {
        return next(new ErrorHandler(`Primary team ${primaryTeam} not found for salesperson`, 404));
      }
      teamIdForSale = primaryTeam;
    }
  }

  // Create sale
  const sales = await Sales.create({
    ...formData,
    team: teamIdForSale,
    date: new Date(),
  });

  if (!sales) {
    return next(new ErrorHandler("Sale cannot be created", 400));
  }

  // Update lead status to "Converted"
  await Lead.findByIdAndUpdate(leadId, { status: "Converted" });

  // Link to existing invoice if provided
  if (formData.invoice) {
    const invoice = await Invoice.findById(formData.invoice);
    if (!invoice) {
      return next(new ErrorHandler("Invoice not found", 404));
    }
    invoice.sale = sales._id;
    invoice.team = sales.team; // Set team in invoice
    await invoice.save();
  }

  // Find admin and manager users for notifications
  const usersToNotify = await User.find({
    role: { $in: ["admin", "manager"] },
    _id: { $ne: req.user._id },
  });

  // Create notification
  const notification = new Notification({
    recipients: usersToNotify.map(user => user._id),
    sender: req.user._id,
    type: "NEW_SALE_CREATED",
    content: `<strong>${req.user?.userName}</strong> created a new sale for <strong>${lead.userName}</strong>.`,
    relatedId: sales._id,
  });

  await notification.save();
  sendNotification(
    usersToNotify,
    "NEW_SALE_CREATED",
    `${req.user?.userName} created a new sale for ${lead.userName}`,
    sales._id,
    "Sales"
  );

  res.status(201).json({
    success: true,
    sales,
  });
});

exports.updateSale = cathAsyncError(async (req, res, next) => {
    const sales = await Sales.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!sales) {
        return next(new ErrorHandler("Sales cannot be updated", 400));
    }

    // Update lead status to "Converted"
    const lead = await Lead.findById(req.body.lead).select("userName");

    if (!lead) {
        return next(new ErrorHandler("Lead not found", 400))
    }

    await Lead.findByIdAndUpdate(req.body.lead, { status: "Converted" });

    // Find Admin & Manager users
    const usersToNotify = await userModel.find({
        role: { $in: ["admin", "manager"] },
        _id: { $ne: req.user._id }
    });

    // Create a notification
    const notification = new Notification({
        recipients: usersToNotify.map(user => user._id),
        sender: req.user._id,
        type: "SALE_UPDATED",
        content: `<strong>${req.user?.userName}</strong> updated a sale for <strong> ${lead.userName} </strong>  .`,
        relatedId: sales._id,
        // onModel: "Sale"
    });

    await notification.save();
    sendNotification(usersToNotify, "SALE_UPDATED", `${req.user?.userName} updated a sale for ${lead.userName} `, sales._id, "Sales");

    res.status(200).json({
        success: true,
        sales,
    });
});


exports.deleteSale = cathAsyncError(async (req, res, next) => {
    const sales = await Sales.findByIdAndDelete(req.params.id);
    if (!sales) {
        return next(new ErrorHandler("Sales can not be deleted", 400));
    }
    res.status(200).json({
        success: true,
        sales,
    });
});

// exports.getAllSales = cathAsyncError(async(req, res, next) => {

//     let filter = {};

//     if (!["admin", "superAdmin"].includes(req.user.role)) {
//         filter.salesPerson = req.user._id;
//     }

//     if (req.query.saleType && req.query.saleType.trim() !== "") {
//         filter.saleType = req.query.saleType;
//     }

//     const sales = await Sales.find(filter)
//         .populate({
//             path: "lead",
//             populate: [{
//                     path: "assigned.user",
//                     select: "userName userEmail role",
//                 },
//                 {
//                     path: "comments.postedBy",
//                 },
//             ],
//         })
//         .populate({
//             path: "salesPerson",
//         })
//         .populate({
//             path: "comments.postedBy",
//         })
//         .sort({ createdAt: -1 });
//     res.status(200).json({
//         success: true,
//         sales,
//     });
// });


exports.getAllSales = cathAsyncError(async (req, res, next) => {
    const userRole = req.user.role;
    const userId = req.user._id;

    // Pagination setup
    // const page = Number(req.query.page) || 1;
    // const limit = Number(req.query.limit) || 20;
    // const skip = (page - 1) * limit;

    let filter = {};

    // Logic for Admin / SuperAdmin

    if (!["admin"].includes(userRole)) {
        // Get teams where user is manager
        const teamsManaged = (req.user.teams || [])
            .filter(t => t.role === "manager")
            .map(t => t.team.toString());

        // Always allow viewing own sales
        let allowedSalesPersonIds = [userId];

        // If manager of any teams, get team members
        if (teamsManaged.length > 0) {
            const teamUsers = await User.find({
                "teams.team": { $in: teamsManaged }
            }).select("_id");

            const teamUserIds = teamUsers.map(u => u._id.toString());
            allowedSalesPersonIds.push(...teamUserIds);
        }

        filter.salesPerson = { $in: [...new Set(allowedSalesPersonIds)] };
    }

    // Optional saleType filtering
    if (req.query.saleType && req.query.saleType.trim() !== "") {
        filter.saleType = req.query.saleType.trim();
    }

    // Get total count for pagination
    const totalCount = await Sales.countDocuments(filter);

    const sales = await Sales.find(filter)
        // .skip(skip)
        // .limit(limit)
        // .lean()
        .populate({
            path: "lead",
            populate: [
                {
                    path: "assigned.user",
                    select: "userName userEmail role",
                },
                {
                    path: "comments.postedBy",
                },
            ],
        })
        .populate("salesPerson")
        .populate("comments.postedBy")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        // totalCount,
        // currentPage: page,
        // totalPages: Math.ceil(totalCount / limit),
        sales,
    });
});

exports.getAllSalesWithFilter = cathAsyncError(async (req, res, next) => {
    // const sales = await Sales.find({createdAt: {$gte: req.query.startDate, $lte: req.query.endDate}}).sort({createdAt: -1});
    const sales = new SaleApiFeature();
    // .sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        sales,
    });
});

exports.getSalesByMonths = cathAsyncError(async (req, res, next) => {
    const salesByMonth = await Sales.aggregate([{
        $lookup: {
            from: "leads",
            localField: "lead",
            foreignField: "_id",
            as: "lead",
        },
    },
    {
        $addFields: {
            lead: { $arrayElemAt: ["$lead", 0] },
        },
    },
    {
        $lookup: {
            from: "users",
            localField: "salesPerson",
            foreignField: "_id",
            as: "salesPerson",
        },
    },
    {
        $addFields: {
            salesPerson: { $arrayElemAt: ["$salesPerson", 0] },
        },
    },
    {
        $group: {
            _id: {
                year: { $year: "$date" },
                month: { $month: "$date" },
            },
            total: {
                $sum: {
                    $cond: {
                        if: { $eq: ["$refunded", true] },
                        then: { $subtract: ["$amount", "$refundAmount"] },
                        else: "$amount",
                    },
                },
            },
            sales: { $push: "$$ROOT" },
        },
    },
    {
        $sort: { "_id.year": 1, "_id.month": 1 },
    },
    ]);
    res.status(200).json({
        success: true,
        salesByMonth,
    });
});

exports.refundSale = cathAsyncError(async (req, res, next) => {
    const sales = await Sales.findByIdAndUpdate(
        req.params.id, {
        refunded: true,
        refundAmount: req.body.refundAmount,
    }, {
        new: true, // Return the updated user document
        runValidators: true, // Run validation on the updated data
    }
    );
    if (!sales) {
        return next(new ErrorHandler("Sales can not be deleted", 400));
    }
    res.status(200).json({
        success: true,
        sales,
    });
});

exports.getSale = cathAsyncError(async (req, res, next) => {
    const sales = await Sales.findById(req.params.id);
    if (!sales) {
        return next(new ErrorHandler("Sales can not be deleted", 400));
    }
    res.status(200).json({
        success: true,
        sales,
    });
});

exports.getsaleTest = cathAsyncError(async (req, res, next) => {
    // Member IDs list
    const memberIds = [
        new mongoose.Types.ObjectId("67b4f303c27a4cc6734b76bc"),
        new mongoose.Types.ObjectId("67b4f37dc27a4cc6734b76be"),
        new mongoose.Types.ObjectId("67b4eea3c27a4cc6734b75e4"),
        new mongoose.Types.ObjectId("682cbd454c045339b3780092"),
        new mongoose.Types.ObjectId("683dc2837ad891a1d55c5de9"),
        new mongoose.Types.ObjectId("68712d771d16efedcea88411"),
        new mongoose.Types.ObjectId("687e6f80f4e2e2b7b94d1240"),
        new mongoose.Types.ObjectId("687e71e6f4e2e2b7b94d18d9"),
        new mongoose.Types.ObjectId("67b4f81ac27a4cc6734b7761"),
        new mongoose.Types.ObjectId("67e47a00318a07520a93fb2a"),
        new mongoose.Types.ObjectId("686d4919499fc1161de0e07d"),
        new mongoose.Types.ObjectId("68712e261d16efedcea8850a"),
        new mongoose.Types.ObjectId("68712f691d16efedcea889a6"),
        new mongoose.Types.ObjectId("687e71b5f4e2e2b7b94d17c3")
    ];

    // Counts
    const countExist = await Sales.countDocuments({ salesPerson: { $exists: true } });
    const countNotExist = await Sales.countDocuments({ salesPerson: { $exists: false } });
    const countMatched = await Sales.countDocuments({ salesPerson: { $in: memberIds } });
    const countNotMatched = await Sales.countDocuments({
        salesPerson: { $exists: true, $nin: memberIds }
    });

    // Get distinct salesPerson IDs which are not in memberIds
    const notMatchedIds = await Sales.distinct("salesPerson", {
        salesPerson: { $exists: true, $nin: memberIds }
    });

    res.status(200).json({
        success: true,
        stats: {
            salesPersonExist: countExist,
            salesPersonNotExist: countNotExist,
            matchedWithMemberIds: countMatched,
            notMatchedWithMemberIds: countNotMatched,
            notMatchedSalesPersonIds: notMatchedIds
        }
    });
});

exports.getSalesBySalesPerson = cathAsyncError(async (req, res, next) => {

    const sales = await Sales.find({ salesPerson: req.params.salesPersonId })
        .populate({
            path: "lead",
            // select: "companyName", // Only select the companyName field
            // match: { companyName: req.query.brand }, // Filter based on companyName
        })
        .populate({
            path: "salesPerson",
        })
        .populate({
            path: "comments.postedBy",
        })
        .sort({ createdAt: -1 });

    if (!sales) {
        return next(new ErrorHandler("Sales can not be deleted", 400));
    }
    res.status(200).json({
        success: true,
        sales,
    });
});

exports.getSalesByClient = cathAsyncError(async (req, res, next) => {

    const sales = await Sales.find({ lead: req.params.id })
        .populate({
            path: "lead",
            // select: "companyName", // Only select the companyName field
            // match: { companyName: req.query.brand }, // Filter based on companyName
        })
        .populate({
            path: "salesPerson",
        })
        .sort({ createdAt: -1 });

    if (!sales) {
        return next(new ErrorHandler("Sales can not be deleted", 400));
    }
    res.status(200).json({
        success: true,
        sales,
    });
});

// Earliest 'frontsell' sale for a given lead
exports.getSalesByLead = cathAsyncError(async (req, res, next) => {
    const leadId = req.params.id;

    const findFilter = {
        lead: leadId,
        // saleType: 'frontsell',
    };

    const [sale, totalSales, frontSellCount, upsellCount] = await Promise.all([
        Sales.findOne(findFilter)
            .sort({ createdAt: 1 }) // earliest
            .populate({ path: 'salesPerson', select: 'userName userEmail' })
            .lean(),
        Sales.countDocuments({ lead: leadId }),
        Sales.countDocuments({ lead: leadId, saleType: 'frontSell' }), 
        Sales.countDocuments({ lead: leadId, saleType: 'upSell' }), 
    ]);

    if (!sale) {
        return res.status(200).json({
            success: true,
            sale: null,
            totalSales,
            message: 'No sale found for this lead.', // ya 'No frontsell sale found...'
        });
    }
    res.status(200).json({
        success: true,
        sale,
        totalSales,
        frontSellCount,
        upsellCount
    });
});

exports.getSalesByBrand = cathAsyncError(async (req, res, next) => {
    const sales = await Sales.find({ lead: req.params.leadId });
    if (!sales) {
        return next(new ErrorHandler("Sales can not be deleted", 400));
    }
    res.status(200).json({
        success: true,
        sales,
    });
});

exports.getSalesByStatus = cathAsyncError(async (req, res, next) => {
    const sales = await Sales.find({ status: req.params.status });
    if (!sales) {
        return next(new ErrorHandler("Sales can not be deleted", 400));
    }
    res.status(200).json({
        success: true,
        sales,
    });
});