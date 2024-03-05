import React, { useState } from "react";
import useDivisions from "../../../data/divisions";
import { useEffect } from "react";
import useFacility from "../../../data/facility";

const menuItems = [{ name: "All", value: "all", type: "all" }];
const clazz = "FacNavBar";

const FacNavBar = ({ onPress, buttonAdd, reRender }) => {
  const [loading, setLoading] = useState(false);
  const [navItems, setNavItems] = useState([]);
  const facilityData = useFacility();
  const divisionData = useDivisions();
  console.log(clazz, "Creating!");

  const loadNavItems = async () => {
    console.log(clazz, "loadNavItems");
    setLoading(true);
    const divList = await divisionData.getDivisionNameAndId();

    divList.forEach((div) => {
      div.type = "division";
    });

    const newList = menuItems.concat(divList);
    const list = await facilityData.getFacilityNameAndId();
    setNavItems(newList.concat(list));
  };

  const load = async () => {
    await loadNavItems();
  };

  useEffect(() => {
    load();
  }, [reRender]);

  return (
    <div className="py-8 px-4 w-1.5/12 bg-pmp_secondary dark:bg-pmp_secondary/40">
      <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3 text-green-200/90">
        View By:
      </h1>

      <ul className="flex flex-col gap-3">
        {navItems.map((link) => (
          <a
            className="cursor-pointer hover:text-primary hover:translate-x-1 duration-300 text-gray-200 visited:text-purple-600 active:text-orange-500"
            key={link.name}
            onClick={onPress}
            id={link.value}
          >
            {link.name}
          </a>
        ))}
      </ul>
      <div className="mt-5">
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-pmp_primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pmp_primary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={buttonAdd}
        >
          Add New Facility
        </button>
      </div>
    </div>
  );
};

export default FacNavBar;
