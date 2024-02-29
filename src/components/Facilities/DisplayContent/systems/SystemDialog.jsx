import React, { useEffect, useState } from "react";

import TopTabs from "../TopTabs";
import SystemsDetails from "../SystemsDetails";
import SystemDetailsContent from "./DialogContent/SystemDetailContent";
import MaintRecordsContent from "./DialogContent/MaintRecordsContent";
import MaintScheduleContent from "./DialogContent/MaintScheduleContent";
import ExceptionsContent from "./DialogContent/ExceptionsContent";
import ServiceRecordsContent from "./DialogContent/ServiceRecordsContent";

const sysTabs = [
  { name: "System Details", href: "#", current: true },
  { name: "Maintenance Schedule", href: "#", current: false },
  { name: "Maintenance Records", href: "#", current: false },
  { name: "Service Records", href: "#", current: false },
  { name: "Exceptions", href: "#", current: false },
];

const clazz = "SystemDialog";
export function SystemDialog({ iSopen, setIsOpen, system }) {
  console.log(clazz, "System", system);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleOpen = () => setIsOpen(!iSopen);

  const content = [
    <SystemDetailsContent system={system} />,
    <MaintScheduleContent system={system} />,
    <MaintRecordsContent system={system} />,
    <ServiceRecordsContent system={system} />,
    <ExceptionsContent system={system} />,
  ];

  const onSysTabClick = (index) => {
    sysTabs.forEach((tab, count) => {
      if (count == index) {
        tab.current = true;
      } else tab.current = false;
    });
    setSelectedTab(index);
  };

  useEffect(() => {}, [system, iSopen]);

  return (
    <>
      {iSopen ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className=" border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">{system.name}</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                <TopTabs tabs={sysTabs} onClick={onSysTabClick} />
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  {content[selectedTab]}
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="rounded-lg text-white bg-pmp_secondary background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-pmp_secondary"></div>
        </>
      ) : null}
    </>
  );
}
