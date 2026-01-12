import { createBrowserRouter } from "react-router";
import Root from "../Layouts/RootLayout/Root";
import Home from "../Pages/Home/Home";
import ErrorPage from "../Components/ErrorPage";

const router = createBrowserRouter([
    {
        path : '/',
        Component : Root,
        children : [
            {
                index : true,
                Component : Home
            }
        ]
    },
    {
        path : '*',
        Component : ErrorPage
    }
])

export default router;