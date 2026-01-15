import { createBrowserRouter } from "react-router";
import Root from "../Layouts/RootLayout/Root";
import Home from "../Pages/Home/Home";
import ErrorPage from "../Components/ErrorPage";
import About from "../Pages/About";
import All_Issues from "../Pages/All_Issues";

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
            }
        ]
    },
    {
        path : '*',
        Component : ErrorPage
    }
])

export default router;