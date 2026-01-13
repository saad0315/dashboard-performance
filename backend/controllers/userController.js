const mongoose = require("mongoose");
const ErrorHandler = require("../utils/errorHandler");
const cathAsyncError = require("../middleWare/asyncErrors");
const User = require("../models/userModel");
const Team = require("../models/teamModel");
require("dotenv");
const crypto = require("crypto");
const jwtToken = require("../utils/getJWToken");
const emailSend = require("../utils/EmailSend");

exports.registerUser = cathAsyncError(async (req, res, next) => {
  const user = await User.create(req.body);
  if (!user) {
    return next(new ErrorHandler("User Not Created", 400));
  }
  res.status(200).json({
    success: true,
    message: "Account Creation Successful.",
  });
});

exports.loginUser = cathAsyncError(async (req, res, next) => {
  const { userEmail, userPassword } = req.body;
  // const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  // const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // console.log("IP Address:ssss", ip);


  if (!userEmail || !userPassword) {
    return next(new ErrorHandler("Enter username and password", 400));
  }
  const user = await User.findOne({ userEmail }).select("+userPassword");
  // .populate("organizations");
  if (!user) {
    return next(new ErrorHandler("Invalid username or Password", 401));
  }

  // Check if account is suspended
  if (user.status === 'suspended') {
    return next(new ErrorHandler("Your account has been suspended. Please contact administrator.", 403));
  }
  ////////////////////////////
  const matchPassword = await user.isPasswordMatch(userPassword);
  if (!matchPassword) {
    return next(new ErrorHandler("Invalid username or Password", 401));
  }
  ///////////////////////////
  // ✅ Check role and remote access
  // if (user.role === 'admin' || user.isRemoteAccessAllowed === true) {
  //   return jwtToken(user, 200, res);
  // }

  // // ✅ Check if IP is allowed
  // const ipListDoc = await IPList.findOne();
  // const allowedIPs = ipListDoc?.ips || [];

  // if (allowedIPs.includes(ip)) {
  //   return jwtToken(user, 200, res);
  // }


  jwtToken(user, 200, res);
  // return next(new ErrorHandler("Access denied from this IP", 403));

});

exports.logoutUser = cathAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
});

exports.updateUser = cathAsyncError(async (req, res, next) => {
  const userId = req.params.id;
  const updates = req.body;

  console.log("updateees.", updates)

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true, // Return the updated user document
    runValidators: true, // Run validation on the updated data
  });
  if (!user) {
    return next(new ErrorHandler("User not updated ", 400));
  }
  res.status(200).json({
    success: true,
    user,
  });
});


exports.forgotPassword = cathAsyncError(async (req, res, next) => {
  const user = await User.findOne({ userEmail: req.body.userEmail });
  
  if (!user) {
    return next(new ErrorHandler("User Doesn't Exists", 404));
  }
  const resetToken = user.getResetPasswordToken();
  await user.save();
  const resetUrl = `${req.protocol}://ebook.madcomdigital.com/password/reset/${resetToken}`;
  const message = `Your password reset token is :- \n\n ${resetUrl} \n\nIf you have not requested this email then, please ignore it`;
  try {
    await emailSend({
      email: user.userEmail,
      subject: `Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.userEmail} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

module.exports.resetPassword = cathAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password and conform password does not match", 400)
    );
  }
  user.verified = true;
  user.userPassword = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save({ validateBeforeSave: false });

  jwtToken(user, 200, res);
});

//Admin
exports.updateAccountStatus = cathAsyncError(async (req, res, next) => {
  const { status } = req.body;
  console.log("status", req.body);
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User Doesn't Exist"));
  }

  // Validate status value
  if (!['active', 'suspended'].includes(status)) {
    return next(new ErrorHandler("Invalid status value. Use 'active' or 'suspended'", 400));
  }

  user.status = status;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User account has been ${status === 'suspended' ? 'suspended' : 'activated'} successfully`,
  });
});


exports.suspendAccount = cathAsyncError(async (req, res, next) => {
  const { status } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User Doesn't Exists"));
  }
  user.status = status;
  await user.save();
  res.status(201).json({
    success: "true",
    message: `User Status Change to ${status} successfully`,
  });

});

// exports.getAllUsers = cathAsyncError(async (req, res, next) => {
//   const users = await User.find();
//   res.status(200).json({
//     success: true,
//     investors: users,
//   });
// });

//Admin
exports.findUser = cathAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User Doesn't Exists"));
  }
  res.status(200).json({
    user,
  });
});

//Admin
exports.deleteUser = cathAsyncError(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User Doesn't Exists"));
  }
  res.status(201).json({
    success: true,
    message: "User has been deleted successfully",
  });
});

//Admin
exports.getAllUsers = cathAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(201).json({
    success: true,
    users,
  });
});


exports.getAllTeamMembers = cathAsyncError(async (req, res, next) => {
  // Get the current user's info
  const currentUser = await User.findById(req.user.id).select('teams role');

  // Agar admin hai → saare users return karo
  if (currentUser.role === 'admin') {
    const allUsers = await User.find()
      .populate('teams.team', 'teamName department description status')
      .select('-userPassword -resetPasswordToken -FTLToken');

    return res.status(200).json({
      success: true,
      message: "All users retrieved successfully (admin access)",
      totalMembers: allUsers.length,
      teamMembers: allUsers,  // yahan teamMembers me hi all users bhej diye
      usersByTeam: {},        // agar admin ke liye grouping chahiye to yahan logic add kar sakte ho
      allUsers: allUsers
    });
  }

  // Agar admin nahi hai → normal team filter apply karo
  if (!currentUser || !currentUser.teams || currentUser.teams.length === 0) {
    return res.status(400).json({
      success: false,
      message: "User is not part of any team"
    });
  }

  // Extract team IDs from current user's teams
  const userTeamIds = currentUser.teams.map(team => team.team);

  // Find all users who belong to any of the same teams as the current user
  const teamMembers = await User.find({
    'teams.team': { $in: userTeamIds }
  })
    .populate('teams.team', 'teamName department description status')
    .select('-userPassword -resetPasswordToken -FTLToken');

  const allUsers = await User.find()
    .select('_id userName userEmail role profileImg status')
    .lean();

  // Group users by team
  const usersByTeam = {};
  teamMembers.forEach(user => {
    user.teams.forEach(userTeam => {
      if (userTeamIds.some(teamId => teamId.toString() === userTeam.team._id.toString())) {
        const teamId = userTeam.team._id.toString();
        if (!usersByTeam[teamId]) {
          usersByTeam[teamId] = {
            teamInfo: userTeam.team,
            members: []
          };
        }
        const existingUser = usersByTeam[teamId].members.find(
          member => member._id.toString() === user._id.toString()
        );
        if (!existingUser) {
          usersByTeam[teamId].members.push({
            _id: user._id,
            userName: user.userName,
            userEmail: user.userEmail,
            role: user.role,
            designation: user.designation,
            profileImg: user.profileImg,
            verified: user.verified,
            status: user.status,
            teamRole: userTeam.role,
            permissions: userTeam.permissions,
            joinedAt: userTeam.joinedAt
          });
        }
      }
    });
  });

  res.status(200).json({
    success: true,
    message: "Team members retrieved successfully",
    totalMembers: teamMembers.length,
    teamMembers: teamMembers,
    usersByTeam: usersByTeam,
    allUsers: allUsers
  });
});


// Alternative simpler version - just returns all team members without grouping
// exports.getTeamMembersSimple = cathAsyncError(async (req, res, next) => {
//   try {
//     // Get the current user's team IDs
//     const currentUser = await User.findById(req.user.id).select('teams');

//     if (!currentUser || !currentUser.teams || currentUser.teams.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "User is not part of any team"
//       });
//     }

//     // Extract team IDs from current user's teams
//     const userTeamIds = currentUser.teams.map(team => team.team);

//     // Find all users who belong to any of the same teams as the current user
//     const teamMembers = await User.find({
//       'teams.team': { $in: userTeamIds }
//     })
//     .populate('teams.team', 'teamName department description status')
//     .select('-userPassword -resetPasswordToken -FTLToken');

//     res.status(200).json({
//       success: true,
//       message: "Team members retrieved successfully",
//       totalMembers: teamMembers.length,
//       users: teamMembers
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error retrieving team members",
//       error: error.message
//     });
//   }
// });

//Admin
exports.updateRole = cathAsyncError(async (req, res, next) => {
  const userId = req.params.id;
  const { role } = req.body;
  let user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User Doesn't Exists"));
  }

  await User.findByIdAndUpdate(userId, { role }, { new: true }).catch(() => {
    return next(new ErrorHandler("User Can not be updated"));
  });

  res.status(200).json({
    user,
  });
});


exports.assignTeam = cathAsyncError(async (req, res, next) => {
  const { userId, teamAssignments } = req.body;

  // Validate inputs
  if (!userId || !mongoose.isValidObjectId(userId)) {
    return next(new ErrorHandler("Invalid or missing userId", 400));
  }
  if (!teamAssignments || !Array.isArray(teamAssignments) || teamAssignments.length === 0) {
    return next(new ErrorHandler("teamAssignments must be a non-empty array", 400));
  }

  // Find user
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Validate team assignments
  const newTeamIds = [];
  const newTeams = [];
  for (const assignment of teamAssignments) {
    if (!assignment.teamId || !mongoose.isValidObjectId(assignment.teamId)) {
      return next(new ErrorHandler(`Invalid teamId in assignment: ${JSON.stringify(assignment)}`, 400));
    }
    const team = await Team.findById(assignment.teamId);
    if (!team) {
      return next(new ErrorHandler(`Team with ID ${assignment.teamId} not found`, 404));
    }
    if (newTeamIds.includes(assignment.teamId)) {
      return next(new ErrorHandler(`Duplicate teamId ${assignment.teamId} in teamAssignments`, 400));
    }
    newTeamIds.push(assignment.teamId);
    newTeams.push({
      team: assignment.teamId,
      role: assignment.role || "member",
      permissions: assignment.permissions || {
        canViewLeads: true,
        canAssignLeads: assignment.role === "manager",
        canEditLeads: true,
        canDeleteLeads: false,
      },
      joinedAt: new Date(),
    });
  }

  // Preserve existing teams not in teamAssignments
  const existingTeams = user.teams.filter(
    t => !newTeamIds.includes(t.team.toString())
  );

  // Combine new teams (at top) and existing teams (at bottom)
  user.teams = [...newTeams, ...existingTeams];

  // Save updated user
  await user.save();

  // Return user with populated teams
  const updatedUser = await User.findById(userId).populate("teams.team");

  res.status(200).json({
    success: true,
    message: "User assigned to teams successfully",
    user: updatedUser,
  });
});

// exports.assignTeam = cathAsyncError(async (req, res, next) => {
//   const { userId, teamAssignments } = req.body;
//   // teamAssignments: [{ teamId, role, permissions }]

//   const user = await User.findById(userId);
//   if (!user) {
//     return next(new ErrorHandler("User not found", 404));
//   }

//   // Clear existing teams or merge based on requirement
//   user.teams = [];

//   for (const assignment of teamAssignments) {
//     const team = await Team.findById(assignment.teamId);
//     if (!team) {
//       return next(new ErrorHandler(`Team with ID ${assignment.teamId} not found`, 404));
//     }

//     user.teams.push({
//       team: assignment.teamId,
//       role: assignment.role || 'member',
//       permissions: assignment.permissions || {
//         canViewLeads: true,
//         canAssignLeads: assignment.role === 'manager',
//         canEditLeads: true,
//         canDeleteLeads: false
//       }
//     });
//   }

//   await user.save();

//   res.status(200).json({
//     success: true,
//     message: "User assigned to teams successfully",
//     user: await User.findById(userId).populate('teams.team')
//   });
// });

exports.removeTeam = cathAsyncError(async (req, res, next) => {
  const userId = req.params.id;

  // Remove the team field
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $unset: { team: 1 }, // Remove the team field
    },
    {
      new: true, // Return the updated user document
      runValidators: true, // Run validation on the updated data
    }
  );

  if (!user) {
    return next(new ErrorHandler("User not updated", 400));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// exports.FTLCreatePassword = cathAsyncError(async(req,res,next)=>{
//     const {token , password} = req.body
//     if(!password && !token){
//         return next(new ErrorHandler("Fill all the details", 400));
//     }
//     const user  = await User.findOne({FTLToken : token})
//     if(!user || user.FTLToken !== token){
//         return next(new ErrorHandler("Token Expired", 400));
//     }
//     user.userPassword = password
//     user.FTLToken = ""
//     await user.save({validateBeforeSave:true})
//     console.log(user);
//     jwtToken(user, 200, res);
// })

// exports.verifyOTP = cathAsyncError(async(req,res,next)=>{
//     const { otp } = req.body;
//     console.log(otp);
//         const user = await User.findOne({phoneOTP : otp});
//         if (!user) {
//            return next(new ErrorHandler("Wrong OTP", 404));
//         }
//         if(user.phoneOTP !== otp) {
//             return next(new ErrorHandler("Invalid OTP", 404));
//         }
//         user.phoneOTP = "";
//         user.userVerified= true
//         await user.save();

//         // jwtToken(user , 200, res)

//         jwtToken(user, 200, res);

// })
