const express = require("express");
const { isAuthenticated, authorizeRole } = require("../middleWare/auth");
const { createOrganization, getOrganizations } = require("../controllers/organizationController");
const awsUpload = require("../middleWare/awsUpload");
const router = express.Router();

router
  .route("/organization")
  .post(
    isAuthenticated,
    authorizeRole("admin"),
    awsUpload.uploadAWSSingle("internal-portal/organizations/"),
    createOrganization
  ).get(isAuthenticated,getOrganizations);
// router.route("/messages/:id").get(isAuthentic`ated,allMessages)

module.exports = router;
