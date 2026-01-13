// const mongoose = require("mongoose");

// const con = () => {
//   mongoose.set("strictQuery", true);
//   // mongoose.connect('mongodb+srv://saif:deltacom@cluster0.l2nnmnu.mongodb.net/internalPortal').then((data)=>{
//   mongoose
//     .connect(
//       "mongodb+srv://saif:saif1234@cluster0.fooju1w.mongodb.net/sales-dashboard",
//     )
//     .then((data) => {
//     // .connect(
//     //   "mongodb://localhost:27017/sales",
//     // )
//     // .then((data) => {
//       console.log(`MongoDB connected with Server Host ${data.connection.host}`);
//       // mongoose.connection.db.collection('chats').createIndex({ conversationId: 1 }).then(()=>{
//       //     console.log("Indexes created successfully");

//       // })
//     });
// };

// module.exports = con;

const mongoose = require("mongoose");

const connectDatabases = () => {
  mongoose.set("strictQuery", true);

  // Connect to the first database (sales-dashboard)
  const db1 = mongoose.createConnection(
    "mongodb+srv://saif:saif1234@cluster0.fooju1w.mongodb.net/ebook-sales-v3"
    // "mongodb://localhost:27017/ebook-sales-dashboard"
  );

  db1.on("connected", () => {
    console.log("Connected to ebook-sales");
  });

  db1.on("error", (err) => {
    console.error("Error connecting to ebook-sales:", err);
  });

  // Connect to the second database (signup-forms)
  const db2 = mongoose.createConnection(
    "mongodb+srv://saif:saif1234@cluster0.fooju1w.mongodb.net/signup-forms"
  );

  db2.on("connected", () => {
    console.log("Connected to signup database");
  });

  db2.on("error", (err) => {
    console.error("Error connecting to signup-forms:", err);
  });

  return { db1, db2 };
};

// ✅ Call the function and export db1 & db2
const { db1, db2 } = connectDatabases();

module.exports = { db1, db2 };
