import { useEffect, useState } from "react";
import pb from "../api/pocketbase";
import useSystems from "./systems";
import useCompliance from "./compliance";

const clazz = "useFacility()";
const useFacility = () => {
  pb.autoCancellation(false);
  const LAST_UPATE = "lastUpdated";
  const FACILITIES = "facilities";
  const timeOut = import.meta.env.VITE_FACILITY_TIMEOUT;
  const systemData = useSystems();
  const compData = useCompliance();

  //Returns all of the facilities stored in local storage
  const getLocalFacilities = async () => {
    let facs = await JSON.parse(localStorage.getItem(FACILITIES));
    if (facs === null || facs?.length === 0) {
      const newFacs = await reloadAllFaciilities();
    }
    return JSON.parse(localStorage.getItem(FACILITIES));
  };

  const deleteFacility = async (facility) => {
    try {
      // Delete all the systems first (this will also delete the service records and warranty)
      await systemData.deleteFacilitySystems(facility.id);

      // Delete compliance docs
      await compData.deleteFacilityCompDocs(facility.id);

      // Delete safety docs
      await compData.deleteFacilitySafetyDocs(facility.id);

      //Delete the personel records for the facilty
      const resultList = await pb.collection("personel").getList(1, 5000, {
        filter: `fac_id="${facility.id}"`,
      });

      console.log(clazz, "Deleting users for ", facility.id);
      resultList.items.forEach(async (person) => {
        await pb.collection("personel").delete(person.id);
      });

      // Delete the facility
      console.log(clazz, "Deleting facility ", facility.id);
      await pb.collection("facility").delete(facility.id);

      localStorage.removeItem(FACILITIES);
    } catch (error) {
      console.log(clazz, "Error deleting ", facility.name, error);
    }
  };

  const reloadData = async () => {
    const facs = await getLocalFacilities();
    const lastUpdated = new Date(localStorage.getItem(LAST_UPATE));
    if (!lastUpdated) reloadAllFaciilities();
    const now = new Date();
    const elapsed = now - lastUpdated;
    let seconds = Math.round(elapsed);
    seconds /= 1000;
    if (facs.length === 0 || seconds > timeOut) {
      reloadAllFaciilities();
    }
  };

  // useEffect(() => {
  //   reloadData();
  // });

  const reloadAllFaciilities = async () => {
    console.log(clazz, "reloadAllFaciilities");
    try {
      const records = await pb.collection("facility").getList(1, 5000, {
        //filter: "hide=false",
      });

      const jsonFac = JSON.stringify(records.items);
      localStorage.setItem(FACILITIES, jsonFac);
      localStorage.setItem(LAST_UPATE, new Date());
      console.log(clazz, "All Facilities", records);
      return records;
    } catch (error) {
      console.log(error);
    }
  };

  const getFacility = async (id) => {
    const facilities = await getLocalFacilities();
    const facility = facilities.find((element) => element.id === id);
    return facility;
  };

  const getFacilityUsers = async (id, type) => {
    const all = `fac_id ="${id}"`;
    const byType = `fac_id ="${id}" && role="${type}"`;
    let query = type === "all" ? all : byType;
    try {
      const resultList = await pb.collection("personel").getList(1, 50, {
        filter: query,
        expand: "user",
      });
      return resultList.items;
    } catch (error) {
      console.log(error, query);
    }
  };

  const getFacilityExceptions = (id) => {};

  const getFacilityByDivisions = async (division) => {
    const facilities = await getLocalFacilities();
    const facs = facilities.filter(
      (facility) => facility.division === division
    );

    return facs;
  };

  const setFacility = async (facility) => {
    const facs = await getLocalFacilities();
    const newFacs = facs.filter((fac) => facility != fac.id);
    newFacs.push(facility);

    const jsonFac = JSON.stringify(newFacs);
    localStorage.setItem(FACILITIES, jsonFac);
    localStorage.setItem(LAST_UPATE, new Date());
  };

  const getFacilityNameAndId = async () => {
    const list = [];
    const facilities = await getLocalFacilities();
    facilities.forEach((fac) => {
      list.push({ name: fac.name, value: fac.id });
    });
    return list;
  };

  return {
    setFacility,
    getFacilityByDivisions,
    getLocalFacilities,
    getFacility,
    getFacilityUsers,
    getFacilityExceptions,
    getFacilityNameAndId,
    reloadAllFaciilities,
    deleteFacility,
  };
};
export default useFacility;
