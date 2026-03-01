const router = require("express").Router();
const controller = require("./issues.controller");
const { verifyToken, verifyCitizen } = require("../../middlewares/auth.middleware");

router.post("/issues", verifyToken, controller.createIssue);
router.patch("/edit-issue/:issueId", verifyToken, verifyCitizen, controller.editIssue);
router.get("/issues/:email", verifyToken, verifyCitizen, controller.getMyIssues);
router.delete("/citizen/delete-issue/:issueId", verifyToken, verifyCitizen, controller.deleteMyIssue);

router.patch("/upvote-issue", verifyToken, controller.upvoteIssue);

router.get("/all-issues", controller.getAllIssues);
router.get("/issue/details/:issueId", controller.getIssueDetails);
router.get("/timeline/:issueId", controller.getTimeline);
router.get("/issue-reporter", controller.getIssueReporterInfo);
router.get("/latest-resolved", controller.getLatestResolved);

module.exports = router;