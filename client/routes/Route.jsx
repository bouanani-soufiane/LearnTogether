import { createBrowserRouter } from "react-router-dom";
import Home from "../src/pages/home/Home";
import Login from "../src/pages/auth/Login";
import App from "../src/App";
import AboutUs from "../src/pages/about/AboutUs";
import Register from "../src/pages/auth/Register";
const router  = createBrowserRouter([
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "",
        element : <App />,
        children : [
            {
                path : "/",
                element : <Home />
            },
            {
                path : "/about",
                element : <AboutUs />
            }
        ]
    }
]);
export default router;