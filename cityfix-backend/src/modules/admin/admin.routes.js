const router = require("express").Router();
const controller = require("./admin.controller");
const { verifyToken, verifyAdmin } = require("../../middlewares/auth.middleware");

router.get("/users", verifyToken, verifyAdmin, controller.getAllUsers);

router.patch("/admin/reject-issue", verifyToken, verifyAdmin, controller.rejectIssue);

router.get("/all-staffs", verifyToken, verifyAdmin, controller.getAllStaffs);
router.patch("/assign-staff", verifyToken, verifyAdmin, controller.assignStaff);

router.delete("/admin/delete-issue/:issueId", verifyToken, verifyAdmin, controller.deleteIssue);

router.post("/admin/register-staff", verifyToken, verifyAdmin, controller.registerStaff);
router.patch("/admin/update-staff/:uid", verifyToken, verifyAdmin, controller.updateStaff);
router.delete("/admin/delete-staff/:uid", verifyToken, verifyAdmin, controller.deleteStaff);

router.patch("/admin/toggle-block-user/:email", verifyToken, verifyAdmin, controller.toggleBlockUser);

router.get("/admin/all-payments", verifyToken, verifyAdmin, controller.allPayments);
router.get("/admin/subscription-payments", verifyToken, verifyAdmin, controller.subscriptionPayments);

module.exports = router;