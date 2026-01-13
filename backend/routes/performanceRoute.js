const express = require("express");
const { refreshPerformance, getPerformanceSummary, getTeamPerformance, getUserPerformance, getUserOverallPerformance, backfillAllPerformance, getTeamPerformanceWithUsers, getAllTeamsPerformance, getUserTeamPerformance, getTeamOverallPerformance, getTeamPerformanceFallback, getCompleteDashboard } = require("../controllers/performanceController");
const router = express.Router();

router.get("/userPerf/:userId", getUserPerformance);
router.get("/teamPerformance/:teamId", getTeamPerformance);
router.get("/summary", getPerformanceSummary);
router.get("/refresh", refreshPerformance); // protect this route
router.get("/backfill", backfillAllPerformance); // protect this route
router.get("/userPerformance/:userId/overall", getUserOverallPerformance);
router.get("/teamPerformancewithUser/:teamId", getTeamPerformanceWithUsers);
router.get("/allTeamsPerformance", getAllTeamsPerformance);



// Individual user performance in specific team
router.get("/user/:userId/team/:teamId", getUserTeamPerformance);

// Team overall performance  
router.get("/team/:teamId/overall", getTeamOverallPerformance);

// Team performance (fallback method)
router.get("/team/:teamId/fallback", getTeamPerformanceFallback);

// Complete dashboard
router.get("/dashboard",  getCompleteDashboard);


module.exports = router;