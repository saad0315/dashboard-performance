const ErrorHandler = require("../utils/errorHandler");
const cathAsyncError = require("../middleWare/asyncErrors");
const OldLead = require("../models/oldLeadModel");


exports.updateLead = cathAsyncError(async (req, res, next) => {
  const oldLead = await OldLead.findById(req.params.id);
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