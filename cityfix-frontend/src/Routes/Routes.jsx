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
import AddNewStaff from "../Pages/Dashboard/AdminDashboard/AddNewStaff";
import IssueDetails from "../Pages/IssueDetails";
import StaffRoute from "./StaffRoute";
import CitizenRoute from "./CitizenRoute";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";
import PaymentSuccess from "../Pages/Dashboard/CitizenDashboard/PaymentSuccess";
import PaymentCancelled from "../Pages/Dashboard/CitizenDashboard/PaymentCancelled";
import ResolvedIssues from "../Pages/Dashboard/StaffDashboard.jsx/ResolvedIssues";
import SubscriptionPaymentSuccess from "../Pages/SubscriptionPaymentSuccess";
import SubscriptionPaymentCancelled from "../Pages/SubscriptionPaymentCancelled";

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
        path: "/issue-details/:issueId",
        element: <IssueDetails></IssueDetails>,
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
        element: (
          <PrivateRoute>
            <ReportIssue></ReportIssue>
          </PrivateRoute>
        ),
      },
      {
        path: "/subscription/payment-success",
        Component: SubscriptionPaymentSuccess,
      },
      {
        path: "/subscription/payment-cancelled",
        Component: SubscriptionPaymentCancelled,
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
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      {
        path: "/dashboard/manage-issues",
        element: (
          <AdminRoute>
            <ManageIssues></ManageIssues>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/manage-users",
        element: (
          <AdminRoute>
            <ManageUsers></ManageUsers>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/manage-staffs",
        element: (
          <AdminRoute>
            <ManageStaffs></ManageStaffs>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/add-new-staff",
        element: (
          <AdminRoute>
            <AddNewStaff></AddNewStaff>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/my-issues", //user's reported issues
        element: (
          <CitizenRoute>
            <MyIssues></MyIssues>
          </CitizenRoute>
        ),
      },
      {
        path: "/dashboard/all-payments",
        element: (
          <AdminRoute>
            <AllPayments></AllPayments>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/payment-history",
        element: (
          <CitizenRoute>
            <PaymentHistory></PaymentHistory>
          </CitizenRoute>
        ),
      },
      {
        path: "/dashboard/assigned-issues",
        element: (
          <StaffRoute>
            <AssignedIssues></AssignedIssues>
          </StaffRoute>
        ),
      },
      {
        path: "/dashboard/resolved-issues",
        element: (
          <StaffRoute>
            <ResolvedIssues></ResolvedIssues>
          </StaffRoute>
        ),
      },
      {
        path: "/dashboard/manage-profile",
        Component: ManageProfile,
      },
      {
        path: "/dashboard/payment-success",
        Component: PaymentSuccess,
      },
      {
        path: "/dashboard/payment-cancelled",
        Component: PaymentCancelled,
      },
    ],
  },
  {
    path: "*",
    Component: ErrorPage,
  },
]);

export default router;