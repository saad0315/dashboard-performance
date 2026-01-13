const mongoose = require("mongoose");
const ErrorHandler = require("../utils/errorHandler");
const cathAsyncError = require("../middleWare/asyncErrors");
require("dotenv");
const sendEmail = require("../utils/sendEmail");
const Lead = require("../models/leadModel");
const CCList = require("../models/ccListModel");
const Organization = require("../models/organizationModel");
const { extractSourceFromURL } = require("../utils/urlExtractor");
const ApiFeatures = require("../utils/apiFeatures");
const xlsx = require('xlsx');
const Sales = require("../models/salesModel"); // Assuming salesModel.js is where your Sales schema is defined
const userModel = require("../models/userModel");
const Notification = require("../models/notificationModel");
const { sendNotification } = require("../utils/notification");
const OldLead = require("../models/oldLeadModel");
// const { getSocketIO } = require("../utils/socket");
// const io = getSocketIO(); // Get the io instance


exports.registerUser = cathAsyncError(async (req, res, next) => {
  // Extract form data from the request body
  let { formId, companyName, userName, userEmail, userPhone, businessName, message, ipInfo, fullPageUrl, status, leadType, source, comments, date, assigned } = req.body;

  // Validate companyName
  if (!companyName) {
    return next(new ErrorHandler("Brand name is required", 400));
  }

  // Handle file uploads
  let formData = req.body;
  if (Array.isArray(req.files)) {
    let uploadedFilesUrl = req.files.map((file) => file.key).join(", ");
    formData = { ...formData, uploadedFilesUrl };
  }

  // Process assigned array to include team from User.teams[0]
  let processedAssigned = [];
  if (Array.isArray(assigned) && assigned.length > 0) {
    const assignedUserIds = assigned
      .map(item => item.user)
      .filter(id => id && mongoose.isValidObjectId(id)); // Remove invalid IDs

    if (assignedUserIds.length === 0) {
      console.log("No valid user IDs in assigned array, proceeding without assignments");
    } else {

      // Fetch users for assigned IDs
      const assignedUsers = await userModel.find({ _id: { $in: assignedUserIds } });

      // Map users by ID for quick lookup
      const userMap = new Map(assignedUsers.map(user => [user._id.toString(), user]));

      // Process each assignment
      processedAssigned = assigned.map(assignment => {
        if (!assignment.user || !mongoose.isValidObjectId(assignment.user)) {
          return null; // Skip invalid user IDs
        }
        const user = userMap.get(assignment.user.toString());
        if (!user) {
          console.log(`User not found for ID: ${assignment.user}`);
          return null; // Skip if user not found
        }
        const primaryTeam = user.teams && user.teams.length > 0 ? user.teams[0].team : null;
        if (!primaryTeam) {
          console.log(`No teams found for user: ${assignment.user}`);
          return null; // Skip if user has no teams
        }
        return {
          user: assignment.user,
          role: assignment.role || "member",
          team: primaryTeam,
        };
      }).filter(Boolean); // Remove null entries

      if (processedAssigned.length === 0) {
        return next(new ErrorHandler("No valid assignments could be processed", 400));
      }
    }
  } else {
    console.log("No assigned users provided, proceeding without assignments");
  }

  // Set followUp based on status
  const followUp =
    status === "FollowUp"
      ? {
        isActive: true,
        startDate: new Date(),
        endDate: req.body.followUpEndDate,
      }
      : undefined;

  // Create lead
  let form;
  try {
    form = await Lead.create({
      formId,
      companyName,
      userName,
      userEmail,
      userPhone,
      businessName,
      message,
      ipInfo,
      fullPageUrl,
      status,
      leadType,
      assigned: processedAssigned,
      source,
      comments,
      date,
      followUp,
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    return next(new ErrorHandler("Failed to create lead", 500));
  }

  if (!form) {
    return next(new ErrorHandler("Something went wrong", 400));
  }

  // Notify admins, PPC, and managers
  const usersToNotify = await userModel.find({
    role: { $in: ["admin", "ppc", "manager"] },
    _id: { $ne: req.user?._id }, // Exclude sender
  });

  const notification = new Notification({
    recipients: usersToNotify.map(user => user._id),
    sender: req.user._id,
    type: "NEW_LEAD_ADDED",
    content: `<strong class="text-sm mr-1">${req.user?.userName}</strong> added a new lead: <strong>${userName}</strong>`,
    relatedId: form._id,
  });

  await notification.save();
  sendNotification(usersToNotify, "NEW_LEAD_ADDED", `${req.user?.userName} added a new lead: ${userName}`, form._id, "Lead");

  // Notify assigned users
  if (processedAssigned.length > 0) {
    const assignedUserIds = processedAssigned.map(item => item.user);
    const assignedUsers = await userModel.find({
      _id: { $in: assignedUserIds, $ne: req.user?._id },
    });

    if (assignedUsers.length > 0) {
      const assignNotifications = assignedUsers.map(user => ({
        recipients: [user._id],
        sender: req.user._id,
        type: "LEAD_ASSIGNED",
        content: `<strong class="text-sm mr-1">${req.user?.userName}</strong> assigned you a new lead: <strong>${userName}</strong>`,
        relatedId: form._id,
      }));

      await Notification.insertMany(assignNotifications);
      sendNotification(assignedUsers, "LEAD_ASSIGNED", `${req.user?.userName} assigned you a new lead: ${userName}`, form._id, "Lead");
    }
  }

  res.status(200).json({
    success: true,
    form,
  });
});

// exports.registerUser = cathAsyncError(async (req, res, next) => {
//   // Extract form data from the request body
//   let formData = req.body;
//   let form;
//   const { formId, companyName, userName, userEmail, userPhone, businessName, message, ipInfo, fullPageUrl, status, leadType, source, comments, date, assigned } = req.body;
//   // const ccList = await CCList.findOne();
//   // Validate the presence of brandName and formData in the request body
//   if (!companyName) {
//     return next(new ErrorHandler("Brand name is required", 400));
//   }
//   if (Array.isArray(req.files)) {
//     let uploadedFilesUrl = Array.isArray(req.files)
//       ? req.files.map((file) => file.key).join(", ")
//       : [];

//     formData = { ...formData, uploadedFilesUrl };
//   }
//   // Save the form data to the database
//   try {
//     const followUp =
//       status === "FollowUp"
//         ? {
//           isActive: true,
//           startDate: new Date(),
//           endDate: req.body.followUpEndDate,
//         }
//         : undefined;


//     form = await Lead.create({
//       formId,
//       companyName,
//       userName,
//       userEmail,
//       userPhone,
//       businessName,
//       message,
//       ipInfo,
//       fullPageUrl,
//       status,
//       leadType,
//       assigned,
//       source,
//       comments,
//       date,
//       followUp,
//     });
//   } catch (error) {
//     console.log(error);
//   }

//   if (!form) {
//     return next(new ErrorHandler("something went wrong", 400));
//   }

//   // Find all users with roles Admin, PPC, and Manager
//   const usersToNotify = await userModel.find({
//     role: { $in: ['admin', 'ppc', 'manager'] },
//     _id: { $ne: req.user?._id }  // Exclude sender
//   });
//   // Create notifications for each user
//   const notification = new Notification({
//     recipients: usersToNotify.map(user => user._id),
//     sender: req.user._id,  // Store sender ID
//     type: 'NEW_LEAD_ADDED',
//     content: `<strong class="text-sm mr-1">${req.user?.userName}</strong>added a new lead: <strong>${userName}</strong>   `,
//     relatedId: form._id,
//     // onModel: 'Lead'
//   });

//   await notification.save();
//   sendNotification(usersToNotify, "NEW_LEAD_ADDED", `${req.user?.userName} added a new lead: ${userName}`, form._id, "Lead");

//   if (Array.isArray(assigned) && assigned.length > 0) {
//     // const assignedUsers = await userModel.find({ _id: { $in: assigned.user, $ne: req.user?._id } });

//     const assignedUserIds = assigned.map(item => item.user).filter(Boolean); // remove falsy values like ''
//     const assignedUsers = await userModel.find({
//       _id: { $in: assignedUserIds, $ne: req.user?._id },
//     });


//     if (assignedUsers.length > 0) {
//       const assignNotifications = assignedUsers.map(user => ({
//         recipients: [user._id],  // Send notification to each assigned user
//         sender: req.user._id,
//         type: 'LEAD_ASSIGNED',
//         content: `<strong class="text-sm mr-1">${req.user?.userName}</strong> assigned you a new lead: <strong>${userName}</strong>`,
//         relatedId: form._id,
//       }));

//       // Save all notifications in one go
//       await Notification.insertMany(assignNotifications);

//       // Send real-time notifications
//       sendNotification(assignedUsers, "LEAD_ASSIGNED", `${req.user?.userName} assigned you a new lead: ${userName}`, form._id, "Lead");
//     }
//   }

//   res.status(200).json({
//     success: true,
//     form,
//   });
// });

exports.registerUserAdmin = cathAsyncError(async (req, res, next) => {
  // Extract form data from the request body
  let formData = req.body;
  let source;
  let comment = { text: req.body.comment, postedBy: req.user._id };
  const { companyName, fullpageurl, fullPageUrl, status, assignedTo } =
    req.body;

  if (fullPageUrl) {
    source = extractSourceFromURL(fullPageUrl);
  }
  if (fullpageurl) {
    source = extractSourceFromURL(fullpageurl);
  }
  if (!companyName) {
    return next(new ErrorHandler("Brand name is required", 400));
  }
  let organization = await Organization.findOne({
    organizationName: companyName,
  });
  if (!organization) {
    return next(new ErrorHandler("Invalid Brand Name", 400));
  }
  if (Array.isArray(req.files)) {
    let uploadedFilesUrl = Array.isArray(req.files)
      ? req.files.map((file) => file.key).join(", ")
      : [];

    formData = { ...formData, uploadedFilesUrl };
  }

  const form = await OldLead.create({
    organization: organization._id,
    formData,
    source: source || "Website",
    status,
    comment,
    assignedTo,
  });
  if (!form) {
    return next(new ErrorHandler("Lead Not Sent", 400));
  }

  res.status(200).json({
    success: true,
    form,
  });
});

exports.getByBrand = cathAsyncError(async (req, res, next) => {
  const { brand } = req.params;
  const forms = await Lead.find({ brandName: brand }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    forms,
  });
});

// exports.updateLead = cathAsyncError(async (req, res, next) => {
//   console.log(req.body);

//   const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//     useFindAndModify: false,
//   });
//   if (!lead) {
//     return next(new ErrorHandler("Lead Not Found", 404));
//   }
//   res.status(200).json({
//     success: true,
//     lead,
//   });
// });
///////////////////////////////////

// exports.updateLead = cathAsyncError(async (req, res, next) => {
//   const oldLead = await Lead.findById(req.params.id);
//   if (!oldLead) {
//     return next(new ErrorHandler("Lead Not Found", 404));
//   }

//   const oldAssignedUsers = oldLead.assignedTo.map(user => user.toString());

//   const updateData = { ...req.body };

//   // console.log("Update Data:", updateData);

//   if (req.body.status === "FollowUp") {
//     updateData.followUp = {
//       isActive: true,
//       startDate: new Date(),
//       endDate: req.body.followUpEndDate,
//     };
//   } else if (req.body.status && req.body.status !== "FollowUp") {
//     updateData.followUp = {
//       isActive: false,
//       startDate: null,
//       endDate: null,
//     };
//   }

//   const lead = await Lead.findByIdAndUpdate(req.params.id, updateData, {
//     new: true,
//     runValidators: true,
//     useFindAndModify: false,
//   });

//   if (!lead) {
//     return next(new ErrorHandler("Lead Not Found", 404));
//   }

//   // Extract newly assigned users (users that were not assigned before)
//   const newAssignedUsers = lead.assignedTo
//     .filter(user => !oldAssignedUsers.includes(user.toString())); // Only get newly assigned users

//   if (newAssignedUsers.length > 0) {
//     // Create notifications for only newly assigned users
//     const notification = new Notification({
//       recipients: newAssignedUsers,
//       sender: req.user._id,
//       type: 'LEAD_ASSIGNED',
//       content: `<strong>${req.user?.userName}</strong> assigned a lead Name : <strong>${lead.userName}</strong> to you.`,
//       relatedId: lead._id,
//       // onModel: 'Lead'
//     });

//     await notification.save();

//     // Send real-time notification using your Socket.IO function
//     sendNotification(newAssignedUsers, "LEAD_ASSIGNED",
//       `${req.user?.userName} assigned a lead: ${lead?.userName}`,
//       lead._id, "Lead");
//   }

//   res.status(200).json({
//     success: true,
//     lead,
//   });
// });

////////////////////////////////////////
// exports.updateLead = cathAsyncError(async (req, res, next) => {
//   const oldLead = await Lead.findById(req.params.id);
//   if (!oldLead) {
//     return next(new ErrorHandler("Lead Not Found", 404));
//   }

//   const updateData = { ...req.body };

//   // Build assignedTo array with correct timestamps
//   const updatedAssignedTo = req.body.assignedTo.map(newAssignee => {
//     const existing = oldLead.assignedTo.find(
//       old => old.user.toString() === newAssignee.user
//     );

//     // Determine if it's a new assignment
//     if (!existing) {
//       return {
//         ...newAssignee,
//         assignedAt: new Date(),
//         updatedAt: new Date(),
//       };
//     }

//     // Check if any property has changed
//     const isUpdated =
//       existing.role !== newAssignee.role ||
//       existing.status !== newAssignee.status ||
//       new Date(existing.followUp?.endDate)?.toISOString() !==
//       new Date(newAssignee.followUpEndDate)?.toISOString();

//     return {
//       ...newAssignee,
//       assignedAt: existing.assignedAt,
//       updatedAt: isUpdated ? new Date() : existing.updatedAt,
//     };
//   });

//   updateData.assignedTo = updatedAssignedTo;

//   // Optional: Update global lead follow-up status (legacy fallback if needed)
//   if (req.body.status === "FollowUp") {
//     updateData.followUp = {
//       isActive: true,
//       startDate: new Date(),
//       endDate: req.body.followUpEndDate,
//     };
//   } else if (req.body.status && req.body.status !== "FollowUp") {
//     updateData.followUp = {
//       isActive: false,
//       startDate: null,
//       endDate: null,
//     };
//   }

//   const lead = await Lead.findByIdAndUpdate(req.params.id, updateData, {
//     new: true,
//     runValidators: true,
//     useFindAndModify: false,
//   });

//   if (!lead) {
//     return next(new ErrorHandler("Lead Not Found", 404));
//   }

//   // Find newly added users
//   const oldUserIds = oldLead.assignedTo.map(a => a.user.toString());
//   const newUserIds = updateData.assignedTo.map(a => a.user.toString());
//   const newlyAssignedUsers = newUserIds.filter(id => !oldUserIds.includes(id));

//   if (newlyAssignedUsers.length > 0) {
//     const notification = new Notification({
//       recipients: newlyAssignedUsers,
//       sender: req.user._id,
//       type: 'LEAD_ASSIGNED',
//       content: `<strong>${req.user?.userName}</strong> assigned a lead Name: <strong>${lead.userName}</strong> to you.`,
//       relatedId: lead._id,
//     });

//     await notification.save();

//     sendNotification(
//       newlyAssignedUsers,
//       "LEAD_ASSIGNED",
//       `${req.user?.userName} assigned a lead: ${lead?.userName}`,
//       lead._id,
//       "Lead"
//     );
//   }

//   res.status(200).json({
//     success: true,
//     lead,
//   });
// });

exports.updateLead = cathAsyncError(async (req, res, next) => {
  const oldLead = await Lead.findById(req.params.id);
  if (!oldLead) {
    return next(new ErrorHandler("Lead Not Found", 404));
  }
  const updateData = { ...req.body };

  let defaultTeamId = null;
  if (req.user.teams && req.user.teams.length === 1) {
    defaultTeamId = req.user.teams[0].team.toString();
  }

  // Step 1: Build map of old assigned users
  const oldAssignedMap = new Map();
  oldLead.assigned.forEach(old => {
    oldAssignedMap.set(old.user.toString(), old);
  });

  // Step 2: Process incoming assigned users
  const updatedAssigned = [];

  req.body.assigned.forEach(newAssignee => {
    const userId = newAssignee.user;
    const existing = oldAssignedMap.get(userId);

    const teamId = newAssignee.team || defaultTeamId;

    if (!existing) {
      // New assignment
      updatedAssigned.push({
        ...newAssignee,
        team: teamId,
        assignedAt: new Date(),
        updatedAt: new Date(),
        followUp: newAssignee.status === "FollowUp"
          ? {
            isActive: true,
            startDate: new Date(),
            endDate: newAssignee.followUpEndDate || null,
          }
          : undefined,
      });
    } else {
      // Existing user – check if updated
      const isUpdated =
        existing.role !== newAssignee.role ||
        existing.status !== newAssignee.status ||
        newAssignee.status === "FollowUp";

      updatedAssigned.push({
        ...newAssignee,
        team: newAssignee.team || existing.team, // Keep old if not sent
        assignedAt: existing.assignedAt,
        updatedAt: isUpdated ? new Date() : existing.updatedAt,
        followUp: newAssignee.status === "FollowUp"
          ? {
            isActive: true,
            startDate: existing.followUp?.startDate || new Date(),
            endDate: newAssignee.followUpEndDate || null,
          }
          : existing.followUp,
      });

      // Remove from map so we don't duplicate below
      oldAssignedMap.delete(userId);
    }
  });

  // Step 3: Add untouched old assignees (not in new assignment list)
  for (const [_, oldAssignee] of oldAssignedMap) {
    updatedAssigned.push(oldAssignee);
  }

  // const updatedAssignedTo = req.body.assigned.map(newAssignee => {
  //   const existing = oldLead.assigned.find(
  //     old => old.user.toString() === newAssignee.user
  //   );
  //   // Determine if it's a new assignment
  //   if (!existing) {
  //     return {
  //       ...newAssignee,
  //       team: defaultTeamId,
  //       assignedAt: new Date(),
  //       updatedAt: new Date(),
  //       followUp: newAssignee.status === "FollowUp"
  //         ? {
  //           isActive: true,
  //           startDate: new Date(),
  //           endDate: newAssignee.followUpEndDate || null,
  //         }
  //         : undefined,
  //     };
  //   }
  //   const isUpdated =
  //     existing.role !== newAssignee.role ||
  //     existing.status !== newAssignee.status ||
  //     newAssignee.status === "FollowUp"; // Optional: force update for followups
  //   return {
  //     ...newAssignee,
  //     assignedAt: existing.assignedAt,
  //     updatedAt: isUpdated ? new Date() : existing.updatedAt,
  //     followUp: newAssignee.status === "FollowUp"
  //       ? {
  //         isActive: true,
  //         startDate: existing.followUp?.startDate || new Date(),
  //         endDate: newAssignee.followUpEndDate || null,
  //       }
  //       : existing.followUp, // Keep previous followUp data if status is not FollowUp
  //   };
  // });

  updateData.assigned = updatedAssigned;


  // No need to touch global followUp unless your schema has it (your current schema doesn't)
  // If needed, add global followUp logic here
  const lead = await Lead.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  if (!lead) {
    return next(new ErrorHandler("Lead Not Found", 404));
  }
  // Notify newly assigned users
  const oldUserIds = oldLead.assigned.map(a => a.user.toString());
  const newUserIds = updateData.assigned.map(a => a.user.toString());
  const newlyAssignedUsers = newUserIds.filter(id => !oldUserIds.includes(id));
  if (newlyAssignedUsers.length > 0) {
    const notification = new Notification({
      recipients: newlyAssignedUsers,
      sender: req.user._id,
      type: 'LEAD_ASSIGNED',
      content: `<strong>${req.user?.userName}</strong> assigned a lead Name: <strong>${lead.userName}</strong> to you.`,
      relatedId: lead._id,
    });
    await notification.save();
    sendNotification(
      newlyAssignedUsers,
      "LEAD_ASSIGNED",
      `${req.user?.userName} assigned a lead: ${lead?.userName}`,
      lead._id,
      "Lead"
    );
  }
  res.status(200).json({
    success: true,
    lead,
  });
});

// exports.getAllLeads = cathAsyncError(async (req, res) => {
//   const resultPerPage = 10;
//   // const leadCount = await Lead.countDocuments();
//   console.log(req.query);

//   const apiFeatures = new ApiFeatures(
//     Lead.find()
//       .populate({
//         path: "assignedTo",
//         select: "userName userEmail role"
//       })
//       .populate({
//         path: "projectManager",
//         select: "userName userEmail role"
//       })
//       .populate({
//         path: "comments.postedBy",
//       })
//       .populate({
//         path: "seenBy.user",
//         select: "userName userEmail"
//       }),
//     req.query
//   )
//     .search()
//     .filter()
//     .pagination(resultPerPage);

//   let leads = await apiFeatures.query;

//   // Add isNew field to each lead
//   leads = leads.map(lead => {
//     const leadObj = lead.toObject();
//     leadObj.isNew = !lead.seenBy?.some(view =>
//       view.user && view.user._id?.toString() === req.user?._id?.toString()
//     );
//     return leadObj;
//   });
//   // console.log(leads);
//   res.status(200).json({
//     success: true,
//     leads,
//     leadCount,
//   });
// });

exports.getAllLeads = cathAsyncError(async (req, res) => {
  const resultPerPage = Number(req.query.pageSize) || 10;

  let baseFilter = {};

  if (req.user.role === "upsellManager") {
    baseFilter.status = "Converted";
  }

  const apiFeaturesForCount = new ApiFeatures(
    Lead.find(baseFilter)
      .populate({
        path: "assigned.user",
        select: "userName userEmail role"
      })
      .populate({
        path: "comments.postedBy",
      })
      .populate({
        path: "seenBy.user",
        select: "userName userEmail"
      }),
    req.query
  ).search().filter();

  // Step 2: Get count after filters applied
  const filteredQuery = await apiFeaturesForCount.query;
  const filteredLeadCount = filteredQuery.length;

  // Step 3: Now apply pagination on same filtered query
  const apiFeatures = new ApiFeatures(
    Lead.find(baseFilter)
      .populate({
        path: "assigned.user",
        select: "userName userEmail role"
      })
      .populate({
        path: "comments.postedBy",
      })
      .populate({
        path: "seenBy.user",
        select: "userName userEmail"
      }),
    req.query
  )
    .search()
    .filter()
    .pagination(resultPerPage);

  let leads = await apiFeatures.query;

  // Add isNew field to each lead
  leads = leads.map(lead => {
    const leadObj = lead.toObject();
    leadObj.isNew = !lead.seenBy?.some(view =>
      view.user && view.user._id?.toString() === req.user?._id?.toString()
    );
    return leadObj;
  });

  res.status(200).json({
    success: true,
    leads,
    leadCount: filteredLeadCount, // use filtered count here
  });
});

// Backend (leadController.js)
exports.getConvertedFormIds = cathAsyncError(async (req, res) => {
  // Only fetch formIds of converted leads
  const convertedFormIds = await Lead.distinct('formId');

  res.status(200).json({
    success: true,
    convertedFormIds
  });
});


exports.markLeadAsSeen = cathAsyncError(async (req, res, next) => {
  const { leadId } = req.params;
  const userId = req.user._id;

  const lead = await Lead.findById(leadId);

  if (!lead) {
    return next(new ErrorHandler("Lead not found", 404));
  }

  // Check if user has already seen this lead
  const alreadySeen = lead.seenBy.some(view => view.user.toString() === userId.toString());

  if (!alreadySeen) {
    lead.seenBy.push({
      user: userId,
      seenAt: new Date()
    });
    await lead.save();
  }

  res.status(200).json({
    success: true,
    message: "Lead marked as seen"
  });
});


exports.allLead = cathAsyncError(async (req, res) => {
  // const leads = await Lead.find();

  const leadByMonth = await Lead.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" }, // Extract year from date
          month: { $month: "$createdAt" }, // Extract month from date
        },
        // total: { $sum: "$amount" }, // Calculate total amount for each month
        sales: { $push: "$$ROOT" }, // Include all expense documents
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 }, // Sort by year and month
    },
  ]);
  res.status(200).json({
    success: true,
    leadByMonth,
  });
});

exports.getLeadById = cathAsyncError(async (req, res, next) => {
  const lead = await Lead.findById(req.params.id).populate({
    path: "assigned.user",
    select: "userName userEmail role" // Add any other user fields you need
  })
    .populate({
      path: "comments.postedBy",
    })
    .populate({
      path: "seenBy.user",
      select: "userName userEmail"
    })
  if (!lead) {
    return next(new ErrorHandler("Lead Not Found", 404));
  }
  res.status(200).json({
    success: true,
    lead,
  });
});

exports.getAssignedLeads = cathAsyncError(async (req, res, next) => {
  console.log(req.params)
  const leads = await Lead.find({ "assigned.user": req.params.userId })
    .populate({
      path: "assigned.user",
      select: "userName userEmail role"
    })
    .populate({
      path: "comments.postedBy",
      // select: "companyName", // Only select the companyName field});
    });
  if (!leads) {
    return next(new ErrorHandler("Leads Not Found", 404));
  }
  res.status(200).json({
    success: true,
    leads,
  });
});

// exports.bulkDataEntry = cathAsyncError(async (req, res, next) => {
//   const file = req.file;
//   if (!file) {
//     return res.status(400).send('No file uploaded.');
//   }

//   const workbook = xlsx.readFile(file.path);
//   const sheetName = workbook.SheetNames[0];
//   const worksheet = workbook.Sheets[sheetName];
//   const jsonData = xlsx.utils.sheet_to_json(worksheet);

//   // console.log(jsonData);

//   jsonData.forEach(async (data, index) => {
//     // jsonData.forEach(async (data, index) => {
//     const formData = {};

//     // Rename specific fields
//     for (const key in data) {
//       if (key === "Customer") {
//         formData["name"] = data[key];
//       } else if (key === "Email") {
//         formData["email"] = data[key];
//       } else if (key === "Phone") {
//         formData["phone"] = data[key];
//       } else {
//         formData[key] = data[key]; // keep other fields as-is
//       }
//     }

//     await OldLead.create({
//       companyName: "Sheet Data", // or data["Product"] if dynamic
//       formData,
//     });
//     // });

//     // console.log('form', index + 1 , data)

//     // const salesPerson = await userModel.create({
//     //   userName: data.salesPerson,
//     //   userEmail: `${data.salesPerson.split(" ")[0].join("").lowerCase()}@bellevuepublishers.com`,
//     //   userPassword: "Madcom@123!",
//     //   role: "user",

//     // })

//     // const companyName = data['Product']; // or whatever column you're mapping as companyName

//     // Clone the data and remove `Product` (to keep rest as formData)
//     // const { ...restdata } = data;

//     // const form = await OldLead.create({
//     //   companyName: "Book Publishings",
//     //   formData: restdata,
//     // });

//     ///////////////////////////////////

//     // const form = await OldLead.create({
//     //   name: data['Customer Name'],
//     //   email: data['Email'],
//     //   phone: data['Phone'],
//     //   Type: data['Medium'],
//     //   source: data['Source'],
//     //   companyName: data['Product'],
//     //   description: data['__EMPTY'] // correct key with double underscore
//     // });



//     // const sale = await Sales.create({
//     //   lead: form._id,
//     //   salesPerson: salesPerson._id,
//     //   amount: data.Paid,
//     //   packageName: data.Package,

//     // })
//   });
//   // const leads = await Lead.insertMany(req.body);
//   // if (!leads) {
//   //   return next(new ErrorHandler("Leads Not Found", 404));
//   // }
//   res.status(200).json({
//     success: true,
//     jsonData,
//     sheetName
//   });
// });

exports.bulkDataEntry = cathAsyncError(async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }

  // Read the first sheet as JSON
  const workbook = xlsx.readFile(file.path);
  const sheetName = workbook.SheetNames[1];
  const worksheet = workbook.Sheets[sheetName];

  // defval ensures empty cells become null instead of being skipped
  const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: null });

  // Map rows -> OldLead documents
  const docs = jsonData
    .map((row) => {
      const name = (row["Name"] || row["Customer"] || "").toString().trim();
      const email = (row["Email"] || "").toString().trim();
      const phone = (row["Phone Number"] || row["Phone"] || "").toString().trim();

      // Only include rows that have at least a name (schema requires userName)
      if (!name) return null;

      return {
        companyName: "Data Sheet", // static since your sheet only has 3 columns
        userName: name,
        userEmail: email || undefined,
        userPhone: phone || undefined,
        // assigned: [], // optional
        // status: undefined, // optional
      };
    })
    .filter(Boolean);

  if (!docs.length) {
    return res.status(400).json({
      success: false,
      message: "No valid rows found. Make sure columns are: Name, Email, Phone Number.",
    });
  }

  try {
    // Bulk insert; ordered:false continues past validation errors
    const inserted = await OldLead.insertMany(docs, { ordered: false });

    return res.status(200).json({
      success: true,
      sheetName,
      totalRows: jsonData.length,
      insertedCount: inserted.length,
      message: "Leads imported successfully.",
    });
  } catch (err) {
    // insertMany may throw with partial success
    // err.result?.result?.nInserted is available on some drivers, otherwise fall back
    const insertedCount = Array.isArray(err.insertedDocs) ? err.insertedDocs.length : 0;

    return res.status(207).json({
      success: false,
      sheetName,
      totalRows: jsonData.length,
      insertedCount,
      error: "Some rows failed to insert due to validation or data issues.",
      details: err.message,
    });
  }
});

exports.deleteLead = cathAsyncError(async (req, res, next) => {
  const leads = await Lead.findByIdAndDelete(req.params.id);
  if (!leads) {
    return next(new ErrorHandler("Lead can not be deleted", 400));
  }
  res.status(200).json({
    success: true,
    Lead,
  });
});
