import { useEffect, useState } from "react";
import pb from "../api/pocketbase";
import { json } from "react-router-dom";

const useSystems = () => {
  pb.autoCancellation(false);
  const LAST_SYSTEM_UPATE = "lastUserUpdated";
  const SYSTEMS = "subsys";
  const timeOut = import.meta.env.VITE;

  //Returns all of the facilities stored in local storage
  const getLocalSystems = async () => {
    let systems = await JSON.parse(localStorage.getItem(SYSTEMS));

    if (systems === null || systems?.length === 0) {
      const newSystems = await getAllSystems();
    }
    return JSON.parse(localStorage.getItem(SYSTEMS));
  };

  //Pulls all of the systems
  const getAllSystems = async () => {
    try {
      const records = await pb.collection(SYSTEMS).getFullList({});
      const jsonFac = JSON.stringify(records);
      localStorage.setItem(SYSTEMS, jsonFac);
      localStorage.setItem(LAST_SYSTEM_UPATE, new Date());
    } catch (error) {
      console.log("Error retrieving subsys", error);
    }
  };

  const getFacilitySystems = async (id) => {
    let systems = await getLocalSystems();
    //console.log("Systems", systems);
    const results = systems.filter((sys) => sys.fac_id === id);
    console.log(results.length, " systems for ", id);
    return results;
  };

  const reloadData = async () => {
    const systems = await getLocalSystems();

    const lastUpdated = new Date(localStorage.getItem(LAST_SYSTEM_UPATE));
    if (!lastUpdated) getAllSystems();
    const now = new Date();
    const elapsed = now - lastUpdated;
    let seconds = Math.round(elapsed);
    seconds /= 1000;
    if (systems.length === 0 || seconds > timeOut) {
      getAllSystems();
    }
  };

  const loadSystems = async () => {
    await reloadData();
  };

  // useEffect(() => {
  //   //console.log("Loading Systems");
  //   //loadSystems();
  // },[]);

  return { getFacilitySystems };
};
export default useSystems;
