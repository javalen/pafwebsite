import React, { useEffect, useState } from "react";
import FaciilityTabsContent from "../Tabs/FacilityTabsContent";
import pb from "../../../api/pocketbase";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import TopTabs from "./TopTabs";
import FacilityDetails from "./FacilityDetails";
import SystemsDetails from "./SystemsDetails";
import ExceptionDetails from "./ExceptionDetails";
import UserDetails from "./UserDetails";
import ComplianceDetails from "./ComplianceDetails";

const clazz = "DisplayContent";
const tabs = [
  { name: "Property Details", href: "#", current: true },
  { name: "Compliance", href: "#", current: false },
  { name: "Users", href: "#", current: false },
  { name: "Systems", href: "#", current: false },
  { name: "Exceptions", href: "#", current: false },
];

const DisplayContent = ({ selectedFac }) => {
  console.log(clazz, "Facility", selectedFac);
  const [pageSelection, setPageSelection] = useState("facilityDetails");
  const [selectedTab, setSelectedTab] = useState(0);
  const [facility, setFacility] = useState(selectedFac);

  const imgUrl = pb.files.getUrl(selectedFac, selectedFac.image[0], {
    thumb: "100x250",
  });
  const pages = [
    <FacilityDetails facility={selectedFac} />,
    <ComplianceDetails facility={selectedFac} />,
    <UserDetails facility={selectedFac} />,
    <SystemsDetails facility={selectedFac} />,
    <ExceptionDetails facility={selectedFac} />,
  ];

  const changeHandler = (index) => {
    tabs.forEach((tab, count) => {
      if (count == index) {
        tab.current = true;
        //setSelectedTab(tab);
      } else tab.current = false;
    });
    setSelectedTab(index);
  };

  useEffect(() => {}, [selectedFac]);

  return (
    <div className="grid w-full h-full bg-slate-200 p-4 dark:bg-slate-200/40">
      <TopTabs onClick={changeHandler} tabs={tabs} />
      {pages[selectedTab]}
    </div>
  );
};

export default DisplayContent;
