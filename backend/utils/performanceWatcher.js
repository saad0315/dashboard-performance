// module.exports.startPerformanceWatchers = (db1) => {
//   const Lead = db1.model("Lead");
//   const Sales = db1.model("Sales");
//   const Invoice = db1.model("invoices");

//   const { updateUserPerformance } = require("../utils/performanceUpdater");

//   // Watch Leads
//   Lead.watch().on("change", async (change) => {
//     console.log("🔄 Lead Change:", change);
//     const lead = await Lead.findById(change.documentKey._id);
//     for (const assignment of lead.assigned || []) {
//       if (assignment.user) {
//         await updateUserPerformance(assignment.user);
//       }
//     }
//   });

//   // Watch Sales
//   Sales.watch().on("change", async (change) => {
//     const sale = await Sales.findById(change.documentKey._id);
//     if (sale?.salesPerson) {
//       await updateUserPerformance(sale.salesPerson);
//     }
//   });

//   // Watch Invoices
//   Invoice.watch().on("change", async (change) => {
//     const invoice = await Invoice.findById(change.documentKey._id);
//     if (invoice?.salesPerson) {
//       await updateUserPerformance(invoice.salesPerson);
//     }
//   });

//   console.log("✅ Performance watchers started using db1 connection.");
// };



module.exports.startPerformanceWatchers = (db1) => {
  const Lead = db1.model("Lead");
  const Sales = db1.model("Sales");
  const Invoice = db1.model("invoices");

  const { updateUserPerformance } = require("../utils/performanceUpdater");

  // Watch Leads
  Lead.watch().on("change", async (change) => {
    try {
      const lead = await Lead.findById(change.documentKey._id);
      if (lead?.assigned?.length) {
        for (const assignment of lead.assigned) {
          if (assignment.user) {
            await updateUserPerformance(assignment.user);
          }
        }
      }
    } catch (error) {
      console.error("❌ Lead Watch Error:", error);
    }
  });

  // Watch Sales
  Sales.watch().on("change", async (change) => {
    try {
      const sale = await Sales.findById(change.documentKey._id);
      if (sale?.salesPerson) {
        await updateUserPerformance(sale.salesPerson);
      }
    } catch (error) {
      console.error("❌ Sales Watch Error:", error);
    }
  });

  // Watch Invoices
  Invoice.watch().on("change", async (change) => {
    try {
      const invoice = await Invoice.findById(change.documentKey._id);
      if (invoice?.salesPerson) {
        await updateUserPerformance(invoice.salesPerson);
      }
    } catch (error) {
      console.error("❌ Invoice Watch Error:", error);
    }
  });

  console.log("✅ Real-time performance watchers started using db1");
};
