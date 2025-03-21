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
import NewTagPage from "@/pages/tags/NewTagPage";
import AdminUsersPage from "@/pages/profile/users";
import LeaderboardPage from "@/pages/LeaderboardPage";

import AdminRoute from "@/components/auth/AdminRoute";
import BlogPage from "@/components/blog/BlogPage";
import BlogDetailPage from "@/components/blog/BlogDetailPage";
import CreateBlogPage from "@/components/blog/CreateBlogPage";
import EditBlogPage from "@/components/blog/EditBlogPage";
import Unauthorized from "@/components/auth/Unauthorized";
import NotFound from "@/pages/NotFound";

const router = createBrowserRouter([
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/unauthorized",
        element: <Unauthorized />
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
                path: "/blog",
                element: <BlogPage />
            },
            {
                path: "/blog/:id",
                element: <BlogDetailPage />
            },
            {
                path: "/blog/new",
                element: <CreateBlogPage />
            },
            {
                path: "/blog/:id/edit",
                element: <EditBlogPage />
            },
            {
                path: "/leaderboard",
                element: <LeaderboardPage />
            },
            {
                path: '/profile',
                element: <ProfilePage />
            },
            // Protected admin routes
            {
                element: <AdminRoute />,
                children: [
                    {
                        path: '/users',
                        element: <AdminUsersPage />
                    },
                    {
                        path: "/tags",
                        element: <TagsPage />
                    },
                    {
                        path: "/tags/new",
                        element: <NewTagPage />
                    }
                ]
            },
            {
                path: "/tags/:tagName",
                element: <TagDetailPage />
            },
            {
                path: "/questions/tagged/:tagName",
                element: <Home />
            },
            {
                path: "*",
                element: <NotFound />
            }
        ]
    },
    {
        path: "*",
        element: <NotFound />
    }
] as RouteObject[]);

export default router;