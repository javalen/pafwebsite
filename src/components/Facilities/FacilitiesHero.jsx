import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import FacNavBar from "./Navbar/FacNavBar";
import Hero from "./Hero/Hero";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const FacilitiesHero = () => {
  const [selectedLink, setSelectedLink] = useState();

  const click = (e) => {
    const selection = e.target.text;
    if (selection.startsWith("By Division")) {
      setSelectedLink({
        type: "division",
        id: e.target.id,
      });
    } else if (selection === "All") {
      setSelectedLink({
        type: "all",
        id: e.target.id,
      });
    } else {
      setSelectedLink({
        type: "facility",
        id: e.target.id,
      });
    }
    console.log("clicked:", e.target.text, e.target.id);
  };

  const buttonAddFacility = () => {
    setSelectedLink({
      type: "add",
      id: "",
    });
  };

  return (
    <div className="flex flex-row h-screen overflow-scroll">
      <FacNavBar onPress={click} buttonAdd={buttonAddFacility} />

      <Hero selectedLink={selectedLink} />
    </div>
  );
};

export default FacilitiesHero;
