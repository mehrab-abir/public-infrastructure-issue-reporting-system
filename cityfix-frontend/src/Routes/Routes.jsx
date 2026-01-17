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
import Dashboard from "../Pages/Dashboard/Dashboard";
import MyIssues from "../Pages/Dashboard/CitizenDashboard/MyIssues";

const router = createBrowserRouter([
    {
        path : '/',
        Component : Root,
        children : [
            {
                index : true,
                Component : Home
            },
            {
                path : '/all-issues',
                Component : All_Issues
            },
            {
                path : '/about',
                Component : About
            },
            {
                path : '/contact',
                Component : ContactUs
            },
            {
                path : '/report-issue',
                Component : ReportIssue
            }
        ]
    },
    {
        path : '/auth',
        Component : Auth,
        children : [
            {
                index : true,
                Component : SignIn
            },
            {
                path : '/auth/signin',
                Component : SignIn
            },
            {
                path : '/auth/register',
                Component : Register
            }
        ]
    },
    {
        path : "/dashboard",
        Component : DashboardLayout,
        children : [
            {
                index : true,
                Component : Dashboard
            },
            {
                path : '/dashboard/my-issues',
                Component : MyIssues
            }
        ]
    },
    {
        path : '*',
        Component : ErrorPage
    }
])

export default router;