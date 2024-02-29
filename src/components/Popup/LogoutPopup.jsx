import React, { useState } from "react";
import Logo from "../../assets/logo.png";
import pb from "../../api/pocketbase";
import useAuth from "../../auth/useAuth";
import { IoCloseOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const LogoutPopup = ({ logoutPopup, setLogoutPopup }) => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    auth.logOut();
    setLogoutPopup(false);
    navigate("/auth");
  };

  return (
    <>
      {logoutPopup && (
        <div className="popup">
          <div className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm">
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 shadow-md bg-white dark:bg-gray-900 rounded-md duration-200 w-[300px]">
              {/* header */}
              <div className="flex items-center justify-between">
                {/* <div>
                  <h1>Logout?</h1>
                </div> */}
                <div className="flex items-center">
                  <img src={Logo} alt="Logo" className="w-20" />
                </div>
                <div>
                  <IoCloseOutline
                    className="text-2xl cursor-pointer "
                    onClick={() => setLogoutPopup(false)}
                  />
                </div>
              </div>
              {/* form section */}
              <div className="mt-4">
                <div className="flex justify-center">
                  <button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-pmp_primary to-pmp_secondary hover:scale-105 duration-200 text-white py-1 px-4 rounded-full "
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutPopup;
