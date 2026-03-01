const router = require("express").Router();
const controller = require("./users.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

// for useRole
router.get("/user/:email/role", controller.getUserRole);

// post user
router.post("/users", controller.createUser);

// update profile
router.patch("/update-profile/:email", controller.updateProfile);

// get one user for profile info
router.get("/users/:uid", verifyToken, controller.getUserByUid);

module.exports = router;