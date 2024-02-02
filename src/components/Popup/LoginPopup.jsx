import React, { useState } from "react";
import Logo from "../../assets/logo.png";
import pb from "../../api/pocketbase";
import useAuth from "../../auth/useAuth";
import { IoCloseOutline } from "react-icons/io5";

const LoginPopup = ({ orderPopup, setOrderPopup }) => {
  pb.autoCancellation(false);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const [loginFailed, setLoginFailed] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("email", email, "password", password);
    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(email, password);
      const user = authData.record;
      console.log("Login Success");
      //useAuth.logIn(user);
      auth.logIn(user);
    } catch (error) {
      setLoading(false);
      setLoginFailed(true);
      console.log(" 24 Error logging in [" + error);
    }
    setLoading(false);
  };

  return (
    <>
      {orderPopup && (
        <div className="popup">
          <div className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm">
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 shadow-md bg-white dark:bg-gray-900 rounded-md duration-200 w-[300px]">
              {/* header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1>Login</h1>
                </div>
                <div>
                  <img src={Logo} alt="Logo" className="w-20" />
                </div>
                <div>
                  <IoCloseOutline
                    className="text-2xl cursor-pointer "
                    onClick={() => setOrderPopup(false)}
                  />
                </div>
              </div>
              {/* form section */}
              <div className="mt-4">
                <input
                  type="email"
                  placeholder="Email"
                  id="email"
                  className=" w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-2 py-1 mb-4"
                />
                <input
                  type="text"
                  placeholder="Password"
                  id="password"
                  className=" w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-2 py-1 mb-4"
                />
                <div className="flex justify-center">
                  <button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-1 px-4 rounded-full "
                  >
                    Login
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

export default LoginPopup;
