const ErrorHandler = require("../utils/errorHandler");
const cathAsyncError = require("../middleWare/asyncErrors");
require("dotenv");
const Team = require("../models/teamModel");
const User = require("../models/userModel");
const Lead = require("../models/leadModel");
const mongoose = require("mongoose");

exports.createTeam = cathAsyncError(async (req, res, next) => {
    const team = await Team.create(req.body);
    if (!team) {
        return next(new ErrorHandler("Team Not Created", 400));
    }
    res.status(200).json({
        success: true,
        message: "Team Created Successfully",
    });
});

exports.deleteTeam = cathAsyncError(async (req, res, next) => {
    const team = await Team.findByIdAndDelete(req.params.teamId);
    if (!team) {
        return next(new ErrorHandler("Team Not Found", 400));
    }
    res.status(200).json({
        success: true,
        message: "Team Deleted Successfully",
    });
});

exports.getTeam = cathAsyncError(async (req, res, next) => {
    const team = await Team.findById(req.params.teamId);
    if (!team) {
        return next(new ErrorHandler("Team Not Found", 400));
    }
    res.status(200).json({
        success: true,
        team,
    });
});

exports.updateTeam = cathAsyncError(async (req, res, next) => {
    const team = await Team.findByIdAndUpdate(req.params.teamId, req.body, {
        new: true, // Return the updated user document
        runValidators: true, // Run validation on the updated data
    });

    console.log("Updated Team:", team);

    if (!team) {
        return next(new ErrorHandler("Team Not Found", 400));
    }
    res.status(200).json({
        success: true,
        team,
    });
});

// exports.getAllTeams = cathAsyncError(async (req, res, next) => {
//     const teams = await Team.aggregate([{
//         $lookup: {
//             from: "users",
//             localField: "_id",
//             foreignField: "teams",
//             as: "users"
//         }
//     },
//     {
//         $lookup: {
//             from: "users",
//             localField: "manager",
//             foreignField: "_id",
//             as: "managerDetails"
//         }
//     },
//     {
//         $addFields: {
//             manager: { $arrayElemAt: ["$managerDetails", 0] }
//         }
//     },
//     {
//         $project: {
//             "manager.password": 0, // Password hide karne ke liye
//             "manager.__v": 0,
//             "managerDetails": 0 // Isko remove kar dete hain kyunki ab ye field redundant hai
//         }
//     }
//     ]);

//     res.status(200).json({
//         success: true,
//         teams,
//     });
// });

exports.getAllTeams = cathAsyncError(async (req, res, next) => {
  const teams = await Team.aggregate([
    {
      $lookup: {
        from: "users",
        let: { teamId: "$_id" },
        pipeline: [
          {
            // Match users where any teams[].team equals the current team _id
            $match: {
              $expr: {
                $in: [
                  "$$teamId",
                  {
                    $map: {
                      input: { $ifNull: ["$teams", []] }, // <— guard
                      as: "t",
                      in: "$$t.team",
                    },
                  },
                ],
              },
            },
          },
          {
            // Extract this team's membership object
            $addFields: {
              teamMembership: {
                $first: {
                  $filter: {
                    input: { $ifNull: ["$teams", []] }, // <— guard
                    as: "tm",
                    cond: { $eq: ["$$tm.team", "$$teamId"] },
                  },
                },
              },
            },
          },
          {
            // Hide sensitive/noisy fields
            $project: {
              userPassword: 0,
              resetPasswordToken: 0,
              resetPasswordExpire: 0,
              FTLToken: 0,
              __v: 0,
              teams: 0, // we keep only teamMembership
            },
          },
        ],
        as: "users",
      },
    },
    {
      $addFields: {
        membersCount: { $size: { $ifNull: ["$users", []] } },
        managersCount: {
          $size: {
            $filter: {
              input: { $ifNull: ["$users", []] },
              as: "u",
              cond: { $eq: ["$$u.teamMembership.role", "manager"] },
            },
          },
        },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    teams,
  });
});

exports.getTeamMembers = cathAsyncError(async (req, res, next) => {
  const { teamId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(teamId)) {
    return next(new ErrorHandler("Invalid Team ID", 400));
  }

  const teamMembers = await User.aggregate([
    {
      $match: {
        $expr: {
          $in: [
            mongoose.Types.ObjectId(teamId),
            {
              $ifNull: [
                {
                  $map: {
                    input: "$teams",
                    as: "t",
                    in: "$$t.team"
                  }
                },
                [] // fallback to avoid null error
              ]
            }
          ]
        }
      }
    },
    {
      $lookup: {
        from: "leads",
        localField: "_id",
        foreignField: "assigned.user",
        as: "leads"
      }
    },
    {
      $addFields: {
        leadsCount: { $size: "$leads" },
        convertedLeadsCount: {
          $size: {
            $filter: {
              input: "$leads",
              as: "lead",
              cond: { $eq: ["$$lead.status", "Converted"] }
            }
          }
        },
        lostLeadsCount: {
          $size: {
            $filter: {
              input: "$leads",
              as: "lead",
              cond: { $eq: ["$$lead.status", "Lost"] }
            }
          }
        },
        newLeadsCount: {
          $size: {
            $filter: {
              input: "$leads",
              as: "lead",
              cond: { $eq: ["$$lead.status", "New"] }
            }
          }
        },
        qualifiedLeadsCount: {
          $size: {
            $filter: {
              input: "$leads",
              as: "lead",
              cond: { $eq: ["$$lead.status", "Qualified"] }
            }
          }
        },
        contactedLeadsCount: {
          $size: {
            $filter: {
              input: "$leads",
              as: "lead",
              cond: { $eq: ["$$lead.status", "Contacted"] }
            }
          }
        }
      }
    }
  ]);

  if (!teamMembers || teamMembers.length === 0) {
    return next(new ErrorHandler("No users found for this team", 404));
  }

  res.status(200).json({
    success: true,
    members: teamMembers,
  });
});




// exports.getTeamMembers = cathAsyncError(async (req, res, next) => {
//     const team = await User.aggregate([{
//         $match: {
//             // teams: {
//             //     $in: [mongoose.Types.ObjectId(req.params.teamId)] // Assuming req.params.teamId is the value you want to match against the 'teams' array
//             // }
//             // role : "user"

//         }
//     },
//     {
//         $lookup: {
//             from: "leads",
//             localField: "_id",
//             foreignField: "assigned.user",
//             as: "leads"
//         }
//     },
//     {
//         $addFields: {
//             leadsCount: {
//                 $size: "$leads"
//             },
//             convertedLeadsCount: {
//                 $size: {
//                     $filter: {
//                         input: "$leads",
//                         as: "lead",
//                         cond: {
//                             $eq: ["$$lead.status", "Converted"]
//                         }
//                     }
//                 }
//             },
//             lostLeadsCount: {
//                 $size: {
//                     $filter: {
//                         input: "$leads",
//                         as: "lead",
//                         cond: {
//                             $eq: ["$$lead.status", "Lost"]
//                         }
//                     }
//                 }
//             },
//             newLeadsCount: {
//                 $size: {
//                     $filter: {
//                         input: "$leads",
//                         as: "lead",
//                         cond: {
//                             $eq: ["$$lead.status", "New"]
//                         }
//                     }
//                 }
//             },
//             qualifiedLeadsCount: {
//                 $size: {
//                     $filter: {
//                         input: "$leads",
//                         as: "lead",
//                         cond: {
//                             $eq: ["$$lead.status", "Qualified"]
//                         }
//                     }
//                 }
//             },
//             contactedLeadsCount: {
//                 $size: {
//                     $filter: {
//                         input: "$leads",
//                         as: "lead",
//                         cond: {
//                             $eq: ["$$lead.status", "Contacted"]
//                         }
//                     }
//                 }
//             }
//         }
//     },
//     ])
//     if (!team) {
//         return next(new ErrorHandler("Team Not Found", 400));
//     }
//     res.status(200).json({
//         success: true,
//         team,
//     });
// });


// exports.getMembersLead = cathAsyncError(async (req, res, next) => {
//     // const team = await Lead.find({ assignedTo: req.params.userId });
//     const membersLeads = await User.aggregate([
//         {
//             $match: {
//                 team: req.params.teamId
//             }
//         },
//         {
//             $lookup: {
//                 from: "leads",
//                 localField: "_id",
//                 foreignField: "assignedTo",
//                 as: "leads"
//             }
//         }
//     ])
//     if (!membersLeads) {
//         return next(new ErrorHandler("Team Not Found", 400));
//     }
//     res.status(200).json({
//         success: true,
//         membersLeads,
//     });
// });