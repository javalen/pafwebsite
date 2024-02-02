import { useEffect, useState } from "react";
import pb from "../api/pocketbase";

const useDivisions = () => {
  pb.autoCancellation(false);
  const DIVS_LAST_UPATE = "divsLastUpdated";
  const DIVISIONS = "divisions";
  const timeOut = import.meta.env.VITE;

  const getLocalDivisions = async () => {
    let divs = await JSON.parse(localStorage.getItem(DIVISIONS));

    if (divs === null || divs?.length === 0) {
      const newDivs = await getDivs();
    }
    return JSON.parse(localStorage.getItem(DIVISIONS));
  };

  const reloadData = async () => {
    const divs = await getLocalDivisions();
    const lastUpdated = new Date(localStorage.getItem(DIVS_LAST_UPATE));
    if (!lastUpdated) getDivs();
    const now = new Date();
    const elapsed = now - lastUpdated;
    let seconds = Math.round(elapsed);
    seconds /= 1000;
    if (divs.length === 0 || seconds > timeOut) {
      getDivs();
    }
  };

  const getAllDivisions = () => {
    reloadData();
  };

  useEffect(() => {
    reloadData();
  });

  const getDivs = async () => {
    try {
      const records = await pb.collection(DIVISIONS).getFullList({});
      const jsonDivs = JSON.stringify(records);
      localStorage.setItem(DIVISIONS, jsonDivs);
      localStorage.setItem(DIVS_LAST_UPATE, new Date());
      return records;
    } catch (error) {
      console.log(error);
    }
  };

  const getDivision = (id) => {
    const divisions = getLocalDivisions();
    const division = divisions.find((element) => element.id === id);
    return division;
  };

  const getDivisionNameAndId = async () => {
    const list = [];
    const divisions = await getLocalDivisions();
    divisions.forEach((div) => {
      list.push({ name: "By Division: " + div.name, value: div.id });
    });
    return list;
  };

  return {
    getAllDivisions,
    getDivision,
    getDivisionNameAndId,
  };
};
export default useDivisions;