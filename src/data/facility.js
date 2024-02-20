import { useEffect, useState } from "react";
import pb from "../api/pocketbase";
import { json } from "react-router-dom";

const useFacility = () => {
  pb.autoCancellation(false);
  const LAST_UPATE = "lastUpdated";
  const FACILITIES = "facilities";
  const timeOut = import.meta.env.VITE;

  //Returns all of the facilities stored in local storage
  const getLocalFacilities = async () => {
    let facs = await JSON.parse(localStorage.getItem(FACILITIES));

    if (facs === null || facs?.length === 0) {
      const newFacs = await getAllFacilities();
    }
    return JSON.parse(localStorage.getItem(FACILITIES));
  };

  const reloadData = async () => {
    const facs = await getLocalFacilities();
    const lastUpdated = new Date(localStorage.getItem(LAST_UPATE));
    if (!lastUpdated) getFacs();
    const now = new Date();
    const elapsed = now - lastUpdated;
    let seconds = Math.round(elapsed);
    seconds /= 1000;
    if (facs.length === 0 || seconds > timeOut) {
      getAllFacilities();
    }
  };

  const getAllFacilities1 = () => {
    reloadData();
  };

  useEffect(() => {
    reloadData();
  });

  const getAllFacilities = async () => {
    try {
      const records = await pb.collection("facility").getFullList({});
      const jsonFac = JSON.stringify(records);
      localStorage.setItem(FACILITIES, jsonFac);
      localStorage.setItem(LAST_UPATE, new Date());
      return records;
    } catch (error) {
      console.log(error);
    }
  };

  const getFacility = async (id) => {
    const facilities = await getLocalFacilities();
    console.log("Facilities", facilities);
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
    console.log("FACILITIES", facilities);
    const facs = facilities.filter(
      (facility) => facility.division === division
    );

    return facs;
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
    getFacilityByDivisions,
    getLocalFacilities,
    getFacility,
    getFacilityUsers,
    getFacilityExceptions,
    getFacilityNameAndId,
  };
};
export default useFacility;
