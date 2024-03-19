import React, { useState } from "react";
import "aos/dist/aos.css";
import "./App.css";
import {
  createBrowserRouter,
  BrowserRouter,
  Routes,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import Users from "./pages/Users";
import LoginPage from "./pages/LoginPage";
import Exports from "./pages/Exports";
import AuthContext from "./auth/context";
import { registerLicense } from "@syncfusion/ej2-base";
import QRCodes from "./pages/QRCodes";
import Facilities from "./pages/Facilities";
import Broadcast from "./pages/Broadcast";
import ErrorPage from "./pages/ErrorPage";

const App = () => {
  const [user, setUser] = useState();
  registerLicense(
    "Ngo9BigBOggjHTQxAR8/V1NAaF5cWWRCfEx0Rnxbf1x0ZF1MZFxbRXJPIiBoS35RckViW3tccXRTQmhVVExx"
  );

  const router = createBrowserRouter([
    {
      path: "/qrcodes",
      element: <QRCodes />,
    },
    {
      path: "/auth",
      element: <LoginPage />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/exports",
      element: <Exports />,
    },
    {
      path: "/users",
      element: <Users />,
    },
    {
      path: "/properties",
      element: <Facilities />,
    },
    {
      path: "/broadcast",
      element: <Broadcast />,
    },
    {
      path: "*",
      element: <LoginPage />,
    },

    {
      path: "/",
      element: <Home />,
      errorElement: <ErrorPage />,
    },
  ]);
  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
      <AuthContext.Provider value={{ user, setUser }}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
    </div>
  );
};

export default App;
