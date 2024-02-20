import React, { useState } from "react";
import "aos/dist/aos.css";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Users from "./pages/Users";
import LoginPage from "./pages/LoginPage";
import Exports from "./pages/Exports";
import AuthContext from "./auth/context";
import { registerLicense } from "@syncfusion/ej2-base";
import QRCodes from "./pages/QRCodes";
import Facilities from "./pages/Facilities";
import Broadcast from "./pages/Broadcast";

const App = () => {
  const [user, setUser] = useState();
  registerLicense(
    "Ngo9BigBOggjHTQxAR8/V1NAaF5cWWRCfEx0Rnxbf1x0ZF1MZFxbRXJPIiBoS35RckViW3tccXRTQmhVVExx"
  );

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
      <AuthContext.Provider value={{ user, setUser }}>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<LoginPage />} />
            <Route path="home" element={<Home />} />
            <Route path="/exports" element={<Exports />} />
            <Route path="/users" element={<Users />} />
            <Route path="/properties" element={<Facilities />} />
            <Route path="/broadcast" element={<Broadcast />} />
            <Route path="*" element={<LoginPage />} />
            <Route path="qr" element={<QRCodes />} />
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  );
};

export default App;
