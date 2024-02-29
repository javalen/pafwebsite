import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Exports/Exports";
import Products from "../components/Products/Products";
import Footer from "../components/Footer/Footer";
import LogoutPopup from "../components/Popup/LogoutPopup";
import AOS from "aos";
import "aos/dist/aos.css";
import useAuth from "../auth/useAuth";

const Exports = () => {
  const [logoutPopup, setLogoutPopup] = React.useState(false);
  const auth = useAuth();
  const handleLogoutPopup = () => {
    setLogoutPopup(!logoutPopup);
  };
  React.useEffect(() => {
    auth.checkAuthentication();
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <div className="grid w-full h-full bg-white dark:bg-gray-900 dark:text-white duration-200">
      <Navbar handleLogoutPopup={handleLogoutPopup} />
      {/* <Hero handleLogoutPopup={handleLogoutPopup} /> */}
      <div className="relative overflow-hidden text-blue-700 min-h-[550px] sm:min-h-[650px] bg-gray-100 flex justify-center items-center dark:bg-gray-950 dark:text-white duration-200 ">
        Exports Coming Soon
      </div>
      <Footer />
      <LogoutPopup logoutPopup={logoutPopup} setLogoutPopup={setLogoutPopup} />
    </div>
  );
};

export default Exports;
