const express = require("express");
const router = express.Router();
const { isAuthenticated, authorizeRole } = require("../middleWare/auth");

const {
  createTeam,
  getTeam,
  getAllTeams,
  updateTeam,
  deleteTeam,
  getTeamMembers,
  getMembersLead,
} = require("../controllers/teamController");
router
  .route("/team")
  .post(isAuthenticated, authorizeRole("admin", "superAdmin", "manager", "upsellManager", "frontsell", "upsell", "upFront", "pmManager", "pm"), createTeam)
  .get(getAllTeams);

router
  .route("/team/:teamId")
  .get(isAuthenticated, authorizeRole("admin", "superAdmin", "manager", "upsellManager", "frontsell", "upsell", "upFront", "pmManager", "pm"), getTeam)
  .put(isAuthenticated, authorizeRole("admin", "superAdmin", "manager", "upsellManager", "frontsell", "upsell", "upFront", "pmManager", "pm"), updateTeam)
  .delete(isAuthenticated, authorizeRole("admin", "superAdmin", "manager", "upsellManager", "frontsell", "upsell", "upFront", "pmManager", "pm"), deleteTeam);

router
  .route("/getTeam/:teamId")
  .get(isAuthenticated, authorizeRole("admin", "superAdmin", "manager", "upsellManager", "frontsell", "upsell", "upFront", "pmManager", "pm"), getTeamMembers);

// router
//   .route("/getMembersLead/:userId")
//   .get(isAuthenticated, authorizeRole("admin", "superAdmin"), getMembersLead);

module.exports = router;
