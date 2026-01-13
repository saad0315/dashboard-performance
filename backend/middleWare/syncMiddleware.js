// const Form = require("../models/formModel"); // db2 Model
// const Lead = require("../models/leadModel"); // db1 Model

// const syncFormToLead = async () => {
//     try {
//         console.log("🔄 Checking for new forms to sync...");

//         // Fetch all forms from db2
//         const forms = await Form.find({});
        
//         for (const form of forms) {

            
//             const userEmail = form.user_email || form.userEmail || form.Email || null;
//             // Check if this formId already exists in Lead collection
//             const existingLead = await Lead.findOne({ formId: form._id });

//             if (!existingLead) {
//                 // If lead does not exist, create a new one
//                 await Lead.create({
//                     formId: form._id, // Storing the original form ID from db2
//                     companyName: form.companyName,
//                     formData: form.formData, // Storing the complete form data
//                     userEmail,
//                     status: "New",
//                     source: "Website",
//                 });

//                 console.log(`✅ Synced Form ID: ${form._id} to Lead collection`);
//             } else {
//                 console.log(`⚠️ Form ID: ${form._id} already exists in Lead collection`);
//             }
//         }
//     } catch (error) {
//         if (error.code === 11000) {
//             console.log(`❌ Duplicate entry detected. Skipping this lead: ${error}`);
//         } else {
//             console.error(`❌ Error syncing form data:`, error);
//         }
//         // console.error("❌ Error syncing form data:", error);
//     }
// };

// module.exports = syncFormToLead;
