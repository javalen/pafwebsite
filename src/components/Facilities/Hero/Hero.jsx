import React from "react";
import Tabs from "../Tabs/Tabs";

const Hero = ({ selectedLink, isAddFacOpen, setAddFacOpen }) => {
  return (
    <div className="grid w-10/12 justify-items-center p-4">
      <Tabs selection={selectedLink} />
    </div>
  );
};

export default Hero;
