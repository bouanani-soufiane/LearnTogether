import { createBrowserRouter, RouteObject } from "react-router-dom";
import Home from "../src/pages/home/Home";
import Login from "../src/pages/auth/Login";
import App from "../src/App";
import AboutUs from "../src/pages/about/AboutUs";
import Register from "../src/pages/auth/Register";
import AskQuestionPage from "@/pages/home/AskQuestionPage";
import QuestionDetailPage from "@/pages/home/QuestionDetailPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import TagsPage from "@/pages/tags/TagsPage";
import TagDetailPage from "@/pages/tags/TagDetailPage";

const router = createBrowserRouter([
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
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/questions/ask",
                element: <AskQuestionPage />
            },
            {
                path: "/questions/:id",
                element: <QuestionDetailPage />
            },
            {
                path: "/about",
                element: <AboutUs />
            },
            {
                path: '/profile',
                element: <ProfilePage />,
            } ,
            {
                path: "/tags",
                element: <TagsPage />,
            },
            {
                path: "/tags/:tagName",
                element: <TagDetailPage />,
            },
            {
                path: "/questions/tagged/:tagName",
                element: <TagDetailPage />,
            },
        ]
    }
] as RouteObject[]);

export default router;