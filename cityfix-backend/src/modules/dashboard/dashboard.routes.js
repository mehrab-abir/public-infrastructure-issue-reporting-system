const router = require("express").Router();
const controller = require("./dashboard.controller");
const { verifyToken, verifyAdmin } = require("../../middlewares/auth.middleware");

router.get("/issue-count", verifyToken, controller.issueCount);
router.get("/citizen-count", verifyToken, controller.citizenCount);
router.get("/staff-count", verifyToken, controller.staffCount);

router.get("/total-revenue", verifyToken, verifyAdmin, controller.totalRevenue);

router.get("/group-issues-by-status", verifyToken, controller.groupIssuesByStatus);
router.get("/group-issue-by-months", verifyToken, controller.groupIssuesByMonths);

router.get("/citizen/issue-count-by-status/:email", verifyToken, controller.citizenIssueCountByStatus);

module.exports = router;