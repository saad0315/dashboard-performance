// const mongoose = require("mongoose");
// const Lead = require("./models/leadModel");
// const Sales = require("./models/salesModel");

// async function migrateAssignedTo() {
//     await mongoose.connect("mongodb://localhost:27017/ebook-sales-dashboard");
//     const leads = await Lead.find({ assignedTo: { $type: "objectId" } }); // fetch only old-format leads

//     console.log(`:rocket: Found ${leads.length} leads to migrate.\n`);
//     for (const lead of leads) {
//         const leadStatus = lead.status || "New";
//         const leadDate = lead.date || new Date();
//         const leadId = lead._id.toString();
//         // Get related sales for this lead
//         const sales = await Sales.find({ lead: lead._id });
//         // Build a map of userId => role based on saleType
//         const roleMap = sales.reduce((map, sale) => {
//             const uid = sale.salesPerson?.toString();
//             const role =
//                 sale.saleType?.toLowerCase() === "frontsell" ? "frontsell" :
//                     sale.saleType?.toLowerCase() === "upsell" ? "upsell" :
//                         sale.saleType?.toLowerCase() === "crosssell" ? "crosssell" : "";
//             if (uid) map[uid] = role;
//             return map;
//         }, {});
//            // Convert existing ObjectId array to string IDs
//         const oldUserIds = lead.assignedTo
//             .filter(item => mongoose.isValidObjectId(item))
//             .map(item => item.toString());

//         // Merge user IDs from assignedTo + sales
//         const allUserIds = [...new Set([...oldUserIds, ...Object.keys(roleMap)])];
//         const newAssignedTo = allUserIds.map(uid => ({
//             user: mongoose.Types.ObjectId(uid),
//             role: roleMap[uid] || "frontsell", // from sales, or empty if unknown
//             status: leadStatus,
//             assignedAt: leadDate,
//             updatedAt: new Date(),
//             followUp: {
//                 isActive: false
//             }
//         }));
//         lead.assignedTo = newAssignedTo;
//         await lead.save();
//         console.log(`:white_check_mark: Lead "${lead.userName}" (${leadId}) migrated.`);
//     }
//     console.log("\n:tada: All matching leads migrated successfully.");
//     // await mongoose.disconnect();
// }
// migrateAssignedTo().catch(err => {
//     console.error(":x: Migration error:", err);
//     mongoose.disconnect();
// });




// const mongoose = require("mongoose");
// const Lead = require("./models/leadModel");
// const Sales = require("./models/salesModel");

// async function migrateAssignedTo() {
//     await mongoose.connect("mongodb://localhost:27017/ebook-sales-dashboard");
//     const leads = await Lead.find({ assignedTo: { $type: "objectId" } }); // fetch only old-format leads
//     console.log(`:rocket: Found ${leads.length} leads to migrate.\n`);

//     for (const lead of leads) {
//         try {
//             const leadStatus = lead.status || "New";
//             const leadDate = lead.date || new Date();
//             const leadId = lead._id.toString();

//             // Get related sales for this lead
//             const sales = await Sales.find({ lead: lead._id });

//             // Build a map of userId => role based on saleType
//             const roleMap = sales.reduce((map, sale) => {
//                 const uid = sale.salesPerson?.toString();
//                 const role =
//                     sale.saleType?.toLowerCase() === "frontsell" ? "frontsell" :
//                         sale.saleType?.toLowerCase() === "upsell" ? "upsell" :
//                             sale.saleType?.toLowerCase() === "crosssell" ? "crosssell" : "";
//                 if (uid && mongoose.isValidObjectId(uid)) {
//                     map[uid] = role;
//                 }
//                 return map;
//             }, {});

//             // Convert existing ObjectId array to string IDs with validation
//             const oldUserIds = [];
//             if (Array.isArray(lead.assignedTo)) {
//                 // Handle array case
//                 for (const item of lead.assignedTo) {
//                     if (mongoose.isValidObjectId(item)) {
//                         oldUserIds.push(item.toString());
//                     } else {
//                         console.log(`⚠️  Skipping invalid ObjectId in assignedTo array: ${item}`);
//                     }
//                 }
//             } else if (mongoose.isValidObjectId(lead.assignedTo)) {
//                 // Handle single ObjectId case
//                 oldUserIds.push(lead.assignedTo.toString());
//             } else {
//                 console.log(`⚠️  Invalid assignedTo format for lead ${leadId}: ${lead.assignedTo}`);
//             }

//             // Merge user IDs from assignedTo + sales, ensuring all are valid ObjectIds
//             const allUserIds = [...new Set([...oldUserIds, ...Object.keys(roleMap)])];
//             const validUserIds = allUserIds.filter(uid => mongoose.isValidObjectId(uid));

//             if (validUserIds.length === 0) {
//                 console.log(`⚠️  No valid user IDs found for lead "${lead.userName}" (${leadId}), skipping...`);
//                 continue;
//             }

//             const newAssignedTo = validUserIds.map(uid => ({
//                 user: new mongoose.Types.ObjectId(uid), // Use 'new' keyword for better compatibility
//                 role: roleMap[uid] || "frontsell", // from sales, or frontsell if unknown
//                 status: leadStatus,
//                 assignedAt: leadDate,
//                 updatedAt: new Date(),
//                 followUp: {
//                     isActive: false
//                 }
//             }));

//             lead.assignedTo = newAssignedTo;
//             await lead.save();

//             console.log(`:white_check_mark: Lead "${lead.userName}" (${leadId}) migrated with ${newAssignedTo.length} users.`);

//         } catch (error) {
//             console.error(`:x: Error migrating lead ${lead._id}:`, error.message);
//             console.log(`Lead data:`, JSON.stringify(lead.assignedTo, null, 2));
//             // Continue with next lead instead of stopping the entire migration
//             continue;
//         }
//     }

//     console.log("\n:tada: Migration completed.");
//     // await mongoose.disconnect();
// }

// migrateAssignedTo().catch(err => {
//     console.error(":x: Migration error:", err);
//     mongoose.disconnect();
// });


// .///////////////////////////////////////////////////////////////////////



// // const mongoose = require('mongoose');
// const { default: mongoose } = require('mongoose');
// const Lead = require('./models/leadModel');

// // mongoose.connect('mongodb+srv://saif:saif1234@cluster0.fooju1w.mongodb.net/ebook-sales');

// (async () => {
//   try {
//     // const leads = await Lead.find({ 'assignedTo.0': { $type: 'objectId' } });
//     const leads = await Lead.find();

//     console.log(`🚀 Found ${leads.length} leads to migrate.`);

//     // console.log("leadsss" , leads)

//     for (const lead of leads) {
//         console.log(`lead ${lead.userName} :`, lead.assignedTo);
//         const oldAssignedTo = lead.assignedTo;

//       // validate that each entry is ObjectId
//       if (!Array.isArray(oldAssignedTo)) continue;
//         console.log(`Migrating lead ${lead.userName} with old assignedTo:`, oldAssignedTo);
//       const updatedAssignedTo = oldAssignedTo.map((userId) => {
//         if (!mongoose.Types.ObjectId.isValid(userId)) {
//           console.warn(`❗ Skipping invalid userId in lead ${lead._id}:`, userId);
//           return null;
//         }
//         console.log(`Migrating lead ${lead.userName} with old assignedTo:`, userId);
//         return {
//           user: userId,
//           role: 'frontsell',
//           status: lead.status || 'New',
//           assignedAt: lead.createdAt,
//           updatedAt: lead.updatedAt,
//           followUp: {
//             isActive: lead.followUp?.isActive || false,
//             startDate: lead.followUp?.startDate || null,
//             endDate: lead.followUp?.endDate || null
//           }
//         };
//       }).filter(Boolean); // remove nulls

//       lead.assigned = updatedAssignedTo;
//       console.log("updated assigned To ", updatedAssignedTo)
//       try {
//         await lead.save();
//         console.log(`✅ Migrated lead ${lead._id}`);
//       } catch (err) {
//         console.error(`❌ Failed to save lead ${lead._id}:`, err.message);
//       }
//     }

//     console.log('✅ Migration complete.');
//   } catch (err) {
//     console.error('❌ Migration failed:', err.message);
//   } finally {
//     // mongoose.disconnect();
//   }
// })();

/////////////////////////////////////////////


// const mongoose = require("mongoose");
// const Lead = require("./models/leadModel");
// const User = require("./models/userModel");

// async function migrateLeadAssignedTeams() {
//   const leads = await Lead.find({ "assigned.user": { $exists: true } });

//     console.log(`:rocket: Found ${leads.length} leads to migrate.`);
//   let updatedCount = 0;

//   for (const lead of leads) {
//     let modified = false;

//     for (const assignment of lead.assigned) {
//       if (!assignment.team && assignment.user) {
//         const user = await User.findById(assignment.user).lean();

//         if (user && user.teams && user.teams.length > 0) {
//           assignment.team = user.teams[0].team;
//           modified = true;
//         }
//       }
//     }

//     if (modified) {
//       await lead.save();
//       updatedCount++;
//     }
//   }

//   console.log(`✅ Updated ${updatedCount} leads with team info.`);
//   process.exit();
// }

// migrateLeadAssignedTeams()


///////////////////////////////////////////////////


// const mongoose = require("mongoose");
// const User = require("./models/userModel"); // adjust path as needed

// async function migrateUsersToTeams() {
//     // const users = await User.find({ team: { $exists: true, $ne: null } });

//     const users = await User.find({
//         $and: [
//             { $or: [{ team: { $exists: false } }, { team: null }] },
//             { $or: [{ teams: { $exists: false } }, { teams: { $size: 0 } }] }
//         ]
//     }).sort({ createdAt: 1 }); // Ensure consistent ordering (oldest to newest)

//     console.log(`🔍 Found ${users.length} users without team or teams.`);

//     const last6Users = users.slice(-6); // Get last 6 users

//     console.log("Last 6 users to migrate:", last6Users.map(user => user.userName || user._id));

//     let updated = 0;

//     for (const user of last6Users) {
//         console.log("mmmmmmmmmm", user.userName, user.team)
//         console.log(`Migrating user ${user._id} to teams array...`);
//         user.teams = [{
//             team: "687129b11d16efedcea8785c",
//             role: "member",
//             permissions: {
//                 canViewLeads: true,
//                 canAssignLeads: false,
//                 canEditLeads: true,
//                 canDeleteLeads: false
//             },
//             joinedAt: new Date()
//         }];
//         await user.save();
//         updated++;
//     }

//     console.log(`✅ Updated ${updated} users to have teams array.`);
//     process.exit();
// }

// migrateUsersToTeams()


///////////////////////////////

// const mongoose = require("mongoose");
// const { db1 } = require("./config/db"); // Import db1 connection
// const Sales = require("./models/salesModel");
// const Lead = require("./models/leadModel");
// const User = require("./models/userModel");

// // Ensure models are registered with db1
// const SalesModel = db1.model("Sales", Sales.schema);
// const LeadModel = db1.model("Lead", Lead.schema);
// const UserModel = db1.model("User", User.schema);

// async function migrateSales() {
//   try {


//     // Find Sales documents missing team field
//     const sales = await SalesModel.find({ team: { $exists: false } })
//       .populate([
//         { path: "lead", model: LeadModel },
//         { path: "salesPerson", model: UserModel },
//       ])
//       .exec();

//     let updatedCount = 0;
//     let skippedCount = 0;

//     for (const sale of sales) {
//       // Check if lead and salesPerson are populated
//       if (!sale.lead || !sale.salesPerson) {
//         console.log(`Skipping sale ${sale._id}: Missing lead or salesPerson`);
//         skippedCount++;
//         continue;
//       }

//       // Find matching assignment in lead.assigned
//       const assignment = sale.lead.assigned.find(
//         a => a.user && a.user.toString() === sale.salesPerson._id.toString()
//       );

//       if (assignment && assignment.team) {
//         sale.team = assignment.team;
//         await sale.save();
//         updatedCount++;
//         console.log(`Updated sale ${sale._id} with team ${assignment.team}`);
//       } else {
//         console.log(`No team found for sale ${sale._id}`);
//         skippedCount++;
//       }
//     }

//     console.log(`Migration completed. Updated ${updatedCount} sales, skipped ${skippedCount} sales.`);
//   } catch (error) {
//     console.error("Migration failed:", error);
//     throw error;
//   }
// }

// migrateSales().catch(error => {
//   console.error("Migration failed:", error);
//   process.exit(1);
// });

// const mongoose = require("mongoose");
// const { db1 } = require("./config/db"); // Import db1 connection
// const Sales = require("./models/salesModel");
// const Lead = require("./models/leadModel");
// const User = require("./models/userModel");

// // Ensure models are registered with db1
// const SalesModel = db1.model("Sales", Sales.schema);
// const LeadModel = db1.model("Lead", Lead.schema);
// const UserModel = db1.model("User", User.schema);

// async function migrateSales() {
//   try {
    

//     // Find Sales documents missing team field
//     const sales = await SalesModel.find({ team: { $exists: false } })
//       .populate([
//         { path: "lead", model: LeadModel },
//         { path: "salesPerson", model: UserModel },
//       ])
//       .exec();

//     let updatedCount = 0;
//     let skippedCount = 0;
//     const skippedSalesPersons = []; // Store salesPerson IDs and reasons for skipped sales

//     for (const sale of sales) {
//       // Check if lead and salesPerson are populated
//       if (!sale.lead) {
//         console.log(`Skipping sale ${sale._id}: Missing lead reference (salesPerson: ${sale.salesPerson?._id})`);
//         skippedSalesPersons.push({ salesPersonId: sale.salesPerson?._id?.toString() || "unknown", reason: "Missing lead reference" });
//         skippedCount++;
//         continue;
//       }
//       if (!sale.salesPerson) {
//         console.log(`Skipping sale ${sale._id}: Missing salesPerson reference`);
//         skippedSalesPersons.push({ salesPersonId: "unknown", reason: "Missing salesPerson reference" });
//         skippedCount++;
//         continue;
//       }

//       // Find matching assignment in lead.assigned
//       const assignment = sale.lead.assigned.find(
//         a => a.user && a.user.toString() === sale.salesPerson._id.toString()
//       );

//       if (assignment && assignment.team) {
//         // Team found in lead.assigned
//         sale.team = assignment.team;
//         await sale.save();
//         updatedCount++;
//         console.log(`Updated sale ${sale._id} with team ${assignment.team} (salesPerson: ${sale.salesPerson._id})`);
//       } else {
//         // Fallback: Try to get team from User.teams
//         const user = sale.salesPerson;
//         const userTeam = user.teams && user.teams.length > 0 ? user.teams[0].team : null;

//         if (userTeam) {
//           sale.team = userTeam;
//           await sale.save();
//           updatedCount++;
//           console.log(`Updated sale ${sale._id} with team ${userTeam} from User.teams (salesPerson: ${sale.salesPerson._id})`);
//         } else {
//           const reason = assignment
//             ? "No team in lead.assigned for salesPerson"
//             : "No matching user in lead.assigned";
//           console.log(`Skipping sale ${sale._id}: ${reason} (salesPerson: ${sale.salesPerson._id})`);
//           skippedSalesPersons.push({ salesPersonId: sale.salesPerson._id.toString(), reason });
//           skippedCount++;
//         }
//       }
//     }

//     // Log skipped salesPersons
//     console.log("\nSkipped SalesPersons:");
//     if (skippedSalesPersons.length > 0) {
//       skippedSalesPersons.forEach(({ salesPersonId, reason }) => {
//         console.log(`SalesPerson ID: ${salesPersonId}, Reason: ${reason}`);
//       });
//     } else {
//       console.log("No sales were skipped.");
//     }

//     console.log(`\nMigration completed. Updated ${updatedCount} sales, skipped ${skippedCount} sales.`);
//   } catch (error) {
//     console.error("Migration failed:", error);
//     throw error;
//   }
// }

// migrateSales().catch(error => {
//   console.error("Migration failed:", error);
//   process.exit(1);
// });


////////////////////////////////////////////

// async function migrateSales() {
//   // Migrate Sales
//   const sales = await Sales.find({ team: { $exists: false } }).populate("lead salesPerson");
//   let updatedCount = 0;
//   let skippedCount = 0;

//   for (const sale of sales) {
//     if (!sale.lead || !sale.salesPerson) {
//       console.log(`Skipping sale ${sale._id}: Missing lead or salesPerson`);
//       skippedCount++;
//       continue;
//     }

//     const assignment = sale.lead.assigned.find(a => a.user.toString() === sale.salesPerson.toString());
//     if (assignment && assignment.team) {
//       sale.team = assignment.team;
//       await sale.save();
//       updatedCount++;
//       console.log(`Updated sale ${sale._id} with team ${assignment.team}`);
//     } else {
//       console.log(`No team found for sale ${sale._id}`);
//       skippedCount++;
//     }
//   }

//   console.log(`Migration completed. Updated ${updatedCount} sales, skipped ${skippedCount} sales.`);
// }

// migrateSales().catch(error => {
//   console.error("Migration failed:", error);
// });

//////////////////////////////////////


// const mongoose = require("mongoose");
// const Lead = require("./models/leadModel");

// async function migrateLeadAssignments() {
//   try {
//     // Find all leads assigned to the specific user
//     const leads = await Lead.find({ 
//       "assigned.user": "683dc2837ad891a1d55c5de9"
//     });

//     console.log(`:rocket: Found ${leads.length} leads assigned to user 683dc2837ad891a1d55c5de9`);
    
//     // Log details of each lead
//     console.log("\nLead Details:");
//     leads.forEach((lead, index) => {
//       console.log(`Lead ${index + 1}:`);
//     //   console.log(`- ID: ${lead._id}`);
//     //   console.log(`- User Name: ${lead.userName}`);
//     //   console.log(`- Email: ${lead.userEmail}`);
//     //   console.log(`- Company: ${lead.companyName}`);
//     //   console.log(`- Current Assignments:`, lead.assigned);
//     //   console.log("---");
//     });

//     let updatedCount = 0;

//     // Add new user assignment to each lead
//     for (const lead of leads) {
//       // Check if the new user is already assigned to avoid duplicates
//       const isUserAlreadyAssigned = lead.assigned.some(
//         assignment => assignment.user.toString() === "68b734b192d0435ac362979f"
//       );

//       if (!isUserAlreadyAssigned) {
//         lead.assigned.push({
//           user: "68b734b192d0435ac362979f",
//           team: "68b73a1a92d0435ac362b750",
//           role: "frontSales",
//           status: "New",
//           assignedAt: new Date(),
//         });

//         await lead.save();
//         updatedCount++;
//         console.log(`Updated lead ${lead._id} with new user assignment`);
//       } else {
//         console.log(`Skipped lead ${lead._id} - user already assigned`);
//       }
//     }

//     console.log(`✅ Updated ${updatedCount} leads with new user assignment`);
//   } catch (error) {
//     console.error("❌ Migration failed:", error);
//   } finally {
//     process.exit();
//   }
// }

// migrateLeadAssignments();