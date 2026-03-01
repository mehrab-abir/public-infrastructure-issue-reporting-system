const router = require("express").Router();
const controller = require("./staff.controller");
const { verifyToken, verifyStaff } = require("../../middlewares/auth.middleware");

router.get("/staff/assigned-issues/:email", verifyToken, verifyStaff, controller.getAssignedIssues);
router.patch("/staff/update-issue-status", verifyToken, verifyStaff, controller.updateIssueStatus);
router.get("/staff/resolved-issues/:email", verifyToken, verifyStaff, controller.getResolvedIssues);

module.exports = router;