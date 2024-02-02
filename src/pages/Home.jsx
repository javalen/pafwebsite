import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Products from "../components/Products/Products";
import Footer from "../components/Footer/Footer";
import LogoutPopup from "../components/Popup/LogoutPopup";
import AOS from "aos";
import "aos/dist/aos.css";
import { useParams } from "react-router-dom";
import useAuth from "../auth/useAuth";

const Home = () => {
  const [logoutPopup, setLogoutPopup] = React.useState(false);
  const auth = useAuth();
  const handleLogoutPopup = () => {
    console.log("Logout", !logoutPopup);
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
      <Hero handleLogoutPopup={handleLogoutPopup} />
      <Products />
      {/* 
      <TopProducts handleLogoutPopup={handleLogoutPopup} />
      <Banner />
      <Subscribe />
      <Products />
      <Testimonials /> */}
      <Footer />
      <LogoutPopup logoutPopup={logoutPopup} setLogoutPopup={setLogoutPopup} />
    </div>
  );
};

export default Home;
