const express = require("express")
const { logoutUser, loginUser, registerUser, getAllUsers, suspendAccount, updateUser, assignTeam, removeTeam, deleteUser, forgotPassword, updateRole, resetPassword, updateAccountStatus, getAllTeamMembers } = require("../controllers/userController")
const router = express.Router()
const { isAuthenticated, authorizeRole } = require('../middleWare/auth')
const upload = require("../middleWare/upload")

//USER ROUTES
router.route("/login").post(loginUser)
router.route('/logout').get(logoutUser)
router.route('/user/:id').put(isAuthenticated, updateUser).delete(isAuthenticated, authorizeRole("admin", "superAdmin", "manager"), deleteUser);
router.route('/updateRole/:id').post(isAuthenticated, authorizeRole("admin", "superAdmin", "manager"), updateRole);
router.route('/updateAccountStatus/:id').post(isAuthenticated, authorizeRole("admin"), updateAccountStatus);


//INVESTOR ROUTES

//ADMIN ROUTES
router.route("/sign-up").post(registerUser)
router.route('/getAllUsers').get(isAuthenticated, authorizeRole('admin', 'superAdmin', 'dataEntry', 'user', "ppc", "manager", "salesUser", "upsellManager", "frontsell", "upsell", "upFront", "pmManager", "pm"), getAllUsers)
router.route('/getAllMembers').get(isAuthenticated, authorizeRole('admin', 'superAdmin', 'dataEntry', 'user', "ppc", "manager", "salesUser", "upsellManager", "frontsell", "upsell", "upFront", "pmManager", "pm"), getAllTeamMembers)
router.route('/suspendAccount').post(isAuthenticated, authorizeRole('admin'), suspendAccount)
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").put(resetPassword);
router.route('/assignTeam').post(isAuthenticated, authorizeRole('admin', 'superAdmin', 'manager', "upsellManager","upFront", "pmManager"), upload.single('image'), assignTeam)
router.route('/removeTeam/:id').put(isAuthenticated, authorizeRole('admin', "manager", "upsellManager", "pmManager", "pm"), removeTeam)


module.exports = router
