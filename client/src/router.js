import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "./pages/Dashboard/Dashboard";
import Homepage from "./pages/HomePage/Homepage";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register"
import CreateOrJoinHouse from "./pages/CreateOrJoinHouse/CreateOrJoinHouse"
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import GuestRoute from "./components/GuestRoute/GuestRoute";
import Secret from "./pages/Secret/Secret";
import Expense from "./components/Expense/Expense";
import Shopping from "./components/Shopping/Shopping";
import Poll from "./components/Poll/Poll";
import Chat from "./components/Chat/Chat";
import Agenda from "./components/Agenda/Agenda";
import Report from "./components/Report/Report";
import Document from "./components/Document/Document";
import Profil from "./components/Profil/Profil";
import { DashboardComp } from "./components/Dashboard/Dashboard";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Homepage />,
                children: [
                    {
                        path: "login",
                        element: <GuestRoute component={<Login />} />
                    },
                    {
                        path: "register",
                        element: <GuestRoute component={<Register />} />
                    }
                ]
            },
            {
                path: "/dashboard",
                element: <ProtectedRoute component={<Dashboard />} />,
                children: [
                    {
                        path: "",
                        element: <DashboardComp />
                    },
                    {
                        path: "expenses",
                        element: <Expense />,
                        children: [
                            {
                                path: ":id?",
                                element: <Expense />
                            }
                        ]
                    },
                    {
                        path: "shoppinglist/:id?",
                        element: <Shopping />
                    },
                    {
                        path: "chat",
                        element: <Chat />
                    },
                    {
                        path: "agenda",
                        element: <Agenda />
                    },
                    {
                        path: "reports",
                        element: <Report />
                    },
                    {
                        path: "documents",
                        element: <Document />,
                        children: [
                            {
                                path: ":id?",
                                element: <Expense />
                            }
                        ]
                    },
                    {
                        path: "polls",
                        element: <Poll />,
                        children: [
                            {
                                path: ":id?",
                                element: <Poll />
                            }
                        ]
                    },
                    {
                        path: "profil",
                        element: <Profil />
                    }
                ]
            },
            {
                path: "/house",
                element: <ProtectedRoute component={<CreateOrJoinHouse />} />,

            },
            {
                path: "/secret",
                element: <ProtectedRoute component={<Secret />} />
            },
        ]
    }
])