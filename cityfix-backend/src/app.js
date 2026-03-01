const express = require("express");
const cors = require("cors");

const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/error.middleware");
const paymentsRoutes = require("./modules/payments/payments.routes")
const issuesRoutes = require("./modules/issues/issues.routes")
const staffRoutes = require("./modules/staffs/staff.routes");
const adminRoutes = require("./modules/admin/admin.routes");
const usersRoutes = require("./modules/users/users.routes");
const dashboardRoutes = require("./modules/dashboard/dashboard.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("CityFix server is running"));

app.use("/", issuesRoutes);
app.use("/", staffRoutes);
app.use("/", adminRoutes);
app.use("/", usersRoutes);
app.use("/", paymentsRoutes);
app.use("/", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;