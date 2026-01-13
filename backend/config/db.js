

const mongoose = require("mongoose");

const connectDatabases = () => {
  mongoose.set("strictQuery", true);

  // Connect to the first database (sales-dashboard)
  const db1 = mongoose.createConnection(
    "mongodb://localhost:27017/ebook-sales-dashboard"
  );

  db1.on("connected", () => {
    console.log("Connected to ebook-sales");
  });

  db1.on("error", (err) => {
    console.error("Error connecting to ebook-sales:", err);
  });

  // Connect to the second database (signup-forms)
  const db2 = mongoose.createConnection(
    "mongodb://localhost:27017/signup-forms"
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
