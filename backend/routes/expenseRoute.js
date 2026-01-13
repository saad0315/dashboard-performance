const express = require("express");
const router = express.Router();
const { isAuthenticated, authorizeRole } = require("../middleWare/auth");
const {
  deleteExpenses,
  createExpenses,
  updateExpenses,
  getExpensesByMonths,
  getExpense,
} = require("../controllers/expenseController");

router
  .route("/expense")
  .post(isAuthenticated, authorizeRole("admin", "superAdmin"), createExpenses)
  .get(getExpensesByMonths);


router
  .route("/expense/:id")
  .put(isAuthenticated, authorizeRole("admin", "superAdmin"), updateExpenses)
  .delete(
    isAuthenticated,
    authorizeRole("admin", "superAdmin"),
    deleteExpenses
  ).get(isAuthenticated, authorizeRole("admin", "superAdmin"), getExpense);

module.exports = router;
