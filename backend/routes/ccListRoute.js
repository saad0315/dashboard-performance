// routes/ccListRoutes.js

const express = require("express");
const router = express.Router();
const { addToCCList, updateCCList, removeFromCCList, getAllCCList} = require("../controllers/ccListController");

// Add an email to the CC list
router.post("/addToCCList", addToCCList);
router.get("/getAllCCList", getAllCCList);

// Update an email in the CC list
router.put("/updateCCList", updateCCList);

// Remove an email from the CC list
router.delete("/removeFromCCList/:email", removeFromCCList);

module.exports = router;
