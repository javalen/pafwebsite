import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Footer from "../components/Footer/Footer";
import LogoutPopup from "../components/Popup/LogoutPopup";
import AOS from "aos";
import "aos/dist/aos.css";
import useAuth from "../auth/useAuth";
import UsersHero from "../components/Users/UsersHero";

const Users = () => {
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
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
      <Navbar handleLogoutPopup={handleLogoutPopup} />
      <UsersHero />
      <Footer />
      <LogoutPopup logoutPopup={logoutPopup} setLogoutPopup={setLogoutPopup} />
    </div>
  );
};

export default Users;
