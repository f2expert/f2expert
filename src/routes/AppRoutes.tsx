import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../core/pages/Home";
import Dashboard from "../core/templates/dashboard";
import Login from "../core/pages/Login";
import About from "../core/pages/About";
import Courses from "../core/pages/Courses";
import Contact from "../core/pages/Contact";
import Tutorials from "../core/pages/Tutorials";
import ErrorHandler from "../core/atoms/ErrorHandler";
import Public from "../core/templates/public";
import Tutorial from "../core/pages/Tutorial";

export default function AppRoutes() {
  const router = createBrowserRouter([
  {
    path: "/",
    element: <Public />,
    errorElement: <ErrorHandler />,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "courses", element: <Courses /> },
      { path: "tutorials", element: <Tutorials /> },
      { path: "login", element: <Login /> },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <ErrorHandler />,
    children: [
      { index: true, element: <Tutorial /> },
      { path: "up", element: <Tutorial /> },
      // Add protected children here
      //<RouteProtection isAuthenticated={false}><Mp /></RouteProtection>
    ],
  },
]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}


