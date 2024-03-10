import React from "react";
import FaciilityTabsContent from "../Tabs/FacilityTabsContent";

const clazz = "Hero";
const Hero = ({
  selectedLink,
  setSelectedLink,
  isAddFacOpen,
  setAddFacOpen,
  setReRender,
}) => {
  console.log(clazz, "Loading selectedLink=", selectedLink);
  return (
    <div className="grid w-10/12 justify-items-center p-4">
      <FaciilityTabsContent
        selection={selectedLink}
        setSelectedLink={setSelectedLink}
        setReRender={setReRender}
      />
    </div>
  );
};

export default Hero;
