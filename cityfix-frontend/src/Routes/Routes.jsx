import { createBrowserRouter } from "react-router";
import Root from "../Layouts/RootLayout/Root";
import Home from "../Pages/Home/Home";
import ErrorPage from "../Components/ErrorPage";
import About from "../Pages/About";
import All_Issues from "../Pages/All_Issues";
import Auth from "../Layouts/AuthLayout/Auth";
import SignIn from "../Pages/Auth/SignIn";
import Register from "../Pages/Auth/Register";
import ContactUs from "../Pages/ContactUs";
import ReportIssue from "../Pages/ReportIssue";
import DashboardLayout from "../Layouts/DashboardLayout.jsx/DashboardLayout";
import MyIssues from "../Pages/Dashboard/CitizenDashboard/MyIssues";
import DashboardHome from "../Pages/Dashboard/DashboardHome";
import ManageIssues from "../Pages/Dashboard/AdminDashboard/ManageIssues";
import ManageUsers from "../Pages/Dashboard/AdminDashboard/ManageUsers";
import ManageStaffs from "../Pages/Dashboard/AdminDashboard/ManageStaffs";
import AllPayments from "../Pages/Dashboard/AdminDashboard/AllPayments";
import PaymentHistory from "../Pages/Dashboard/CitizenDashboard/PaymentHistory";
import AssignedIssues from "../Pages/Dashboard/StaffDashboard.jsx/AssignedIssues";
import ManageProfile from "../Pages/Dashboard/ManageProfile";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/all-issues",
        Component: All_Issues,
      },
      {
        path: "/about",
        Component: About,
      },
      {
        path: "/contact",
        Component: ContactUs,
      },
      {
        path: "/report-issue",
        Component: ReportIssue,
      },
    ],
  },
  {
    path: "/auth",
    Component: Auth,
    children: [
      {
        index: true,
        Component: SignIn,
      },
      {
        path: "/auth/signin",
        Component: SignIn,
      },
      {
        path: "/auth/register",
        Component: Register,
      },
    ],
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      {
        path: "/dashboard/manage-issues",
        Component: ManageIssues,
      },
      {
        path: "/dashboard/manage-users",
        Component: ManageUsers,
      },
      {
        path: "/dashboard/manage-staffs",
        Component: ManageStaffs,
      },
      {
        path: "/dashboard/my-issues", //user's reported issues
        Component: MyIssues,
      },
      {
        path: "/dashboard/all-payments",
        Component: AllPayments,
      },
      {
        path: "/dashboard/payment-history",
        Component: PaymentHistory,
      },
      {
        path : '/dashboard/assigned-issues',
        Component : AssignedIssues
      },
      {
        path : '/dashboard/manage-profile',
        Component : ManageProfile
      }
    ],
  },
  {
    path: "*",
    Component: ErrorPage,
  },
]);

export default router;