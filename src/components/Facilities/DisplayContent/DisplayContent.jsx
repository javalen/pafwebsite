import React from "react";
import Tabs from "../Tabs/Tabs";
import pb from "../../../api/pocketbase";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import TopTabs from "./TopTabs";
import FacilityDetails from "./FacilityDetails";

const DisplayContent = ({ selectedFac, ...props }) => {
  const imgUrl = pb.files.getUrl(selectedFac, selectedFac.image[0], {
    thumb: "100x250",
  });

  const changeHandler = (e) => {
    console.log("TopTab clicked", e);
    // const arr = tabs;
    // arr.forEach((tab, count) => {
    //   if (count == index) {
    //     tab.current = true;
    //     setSelectedFac(tab);
    //   } else tab.current = false;
    // });
    // setTabs(arr);
    // setDummy(index);
  };

  return (
    <div className="grid w-full h-full bg-slate-200 p-4 dark:bg-slate-200/40">
      <TopTabs onClick={changeHandler} />
      <div className="grid grid-cols-2">
        <div className="w-4/4">
          <Carousel>
            {selectedFac.image.map((imag, index) => (
              <div key={index}>
                <img
                  key={selectedFac.image[index]}
                  src={pb.files.getUrl(selectedFac, selectedFac.image[index])}
                  width={200}
                />
                <p className="legend">
                  {selectedFac.name} {index}
                </p>
              </div>
            ))}
          </Carousel>
        </div>
        <FacilityDetails facility={selectedFac} />
      </div>
    </div>
  );
};

export default DisplayContent;
