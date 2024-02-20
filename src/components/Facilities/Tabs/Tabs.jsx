import { useEffect, useState } from "react";
import useFacility from "../../../data/facility";
import useDivisions from "../../../data/divisions";
import DisplayContent from "../DisplayContent/DisplayContent";
import AddFacility from "../AddEditFacility/AddFacility";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Tabs({ selection, ...props }) {
  const facilityData = useFacility();
  const divisionData = useDivisions();
  const [dummy, setDummy] = useState();
  const [tabs, setTabs] = useState([]);
  const [selectedFac, setSelectedFac] = useState();

  const changeHandler = (name, index) => {
    const arr = tabs;
    arr.forEach((tab, count) => {
      if (count == index) {
        tab.current = true;
        setSelectedFac(tab);
      } else tab.current = false;
    });
    setTabs(arr);
    setDummy(index);
  };

  const loadTabs = async () => {
    try {
      let data = [];
      if (!selection) return;
      if (selection.type === "all") {
        data = await facilityData.getLocalFacilities();
      } else if (selection.type === "division") {
        data = await facilityData.getFacilityByDivisions(selection.id);
      } else {
        const facility = await facilityData.getFacility(selection.id);
        data.push(facility);
      }
      setTabs(formatData(data));
    } catch (error) {
      console.log("Error loading Tabs", error);
    }
  };

  const formatData = (data) => {
    //console.log("data", data);
    const dataArray = [];
    data.forEach((element) => {
      dataArray.push({
        name: element.name,
        href: "#",
        current: false,
        facility: element,
      });
    });
    dataArray[0].current = true;
    setSelectedFac(dataArray[0]);
    return dataArray;
  };

  const load = async () => {
    await loadTabs();
  };

  useEffect(() => {
    load();
  }, [selection]);

  return (
    <div className="w-full h-full">
      {selection?.type === "add" ? (
        <AddFacility />
      ) : (
        <>
          {tabs?.length > 0 ? (
            <>
              <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                  Select a tab
                </label>

                <select
                  id="tabs"
                  name="tabs"
                  className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  defaultValue={tabs.find((tab) => tab.current).name}
                >
                  {tabs.map((tab) => (
                    <option key={tab.name}>{tab.name}</option>
                  ))}
                </select>
              </div>
              <div className="hidden sm:block">
                <nav className="flex space-x-4" aria-label="Tabs">
                  {tabs.map((tab, index) => (
                    <a
                      key={tab.name}
                      onClick={() => changeHandler(tab.name, index)}
                      href={tab.href}
                      className={classNames(
                        tab.current
                          ? "bg-indigo-100 text-indigo-700"
                          : "text-gray-500 hover:text-gray-700",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}
                      aria-current={tab.current ? "page" : undefined}
                    >
                      {tab.name}
                    </a>
                  ))}
                </nav>
              </div>
              <DisplayContent selectedFac={selectedFac.facility} />
            </>
          ) : (
            <div>Make a selection</div>
          )}
        </>
      )}
    </div>
  );
}
