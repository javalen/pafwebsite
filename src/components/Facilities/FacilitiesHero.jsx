import { Fragment, useEffect, useState } from "react";
import FacNavBar from "./Navbar/FacNavBar";
import Hero from "./Hero/Hero";
import { AddEditFacilityDialog } from "./AddEditFacility/AddEditFacilityDialog";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const FacilitiesHero = () => {
  const [selectedLink, setSelectedLink] = useState();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [dummy, setDummy] = useState("");
  const [render, setRender] = useState("");

  const buttonClick = () => {
    setOpenAddDialog(!openAddDialog);
    setDummy("" + Math.random());
  };

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
  };

  useEffect(() => {}, [render]);
  return (
    <div className="flex flex-row h-screen overflow-scroll">
      <FacNavBar onPress={click} buttonAdd={buttonClick} reRender={render} />
      <Hero selectedLink={selectedLink} />
      <AddEditFacilityDialog
        isOpen={openAddDialog}
        setIsOpen={setOpenAddDialog}
        setReRender={setRender}
      />
    </div>
  );
};

export default FacilitiesHero;
