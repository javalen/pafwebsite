import { useEffect, useState } from "react";
import pb from "../api/pocketbase";
import { json } from "react-router-dom";

const useCompliance = () => {
  pb.autoCancellation(false);
  const LAST_COMP_UPATE = "lastMaintUpdated";
  const COMPLIANCE = "facility_compliance";
  const SAFETY = "facility_safety_doc";
  const timeOut = import.meta.env.VITE_FACILITY_TIMEOUT;

  //Returns all of the facilities stored in local storage
  const getLocalCompDocs = async () => {
    let recs = await JSON.parse(localStorage.getItem(COMPLIANCE));

    if (recs === null || recs?.length === 0) {
      const newFacs = await reloadAllCompDocs();
    }
    return JSON.parse(localStorage.getItem(COMPLIANCE));
  };

  const reloadData = async () => {
    const recs = await getLocalCompDocs();
    const lastUpdated = new Date(localStorage.getItem(LAST_COMP_UPATE));
    if (!lastUpdated) reloadAllCompDocs();
    const now = new Date();
    const elapsed = now - lastUpdated;
    let seconds = Math.round(elapsed);
    seconds /= 1000;
    if (recs.length === 0 || seconds > timeOut) {
      reloadAllCompDocs();
    }
  };

  useEffect(() => {
    reloadData();
  });

  const reloadAllCompDocs = async () => {
    try {
      const records = await pb.collection(COMPLIANCE).getFullList({});
      const jsonFac = JSON.stringify(records);
      localStorage.setItem(COMPLIANCE, jsonFac);
      localStorage.setItem(LAST_COMP_UPATE, new Date());
      return records;
    } catch (error) {
      console.log(error);
    }
  };

  const getCompDocsByFacId = async (id) => {
    const records = await getLocalCompDocs();
    const rec = records.filter((element) => element.fac_id === id);
    return rec;
  };

  const getCompDocsByTypeAndFacId = async (id, type) => {
    const records = await getLocalCompDocs();
    const rec = records.filter(
      (element) => element.fac_id === id && element.type === type
    );
    return rec;
  };

  //------------------------------------Safety Docs --------------------------------------
  const getLocalSafetyDocs = async () => {
    let recs = await JSON.parse(localStorage.getItem(SAFETY));

    if (recs === null || recs?.length === 0) {
      const newFacs = await reloadAllSafetyDocs();
    }
    return JSON.parse(localStorage.getItem(SAFETY));
  };

  const reloadAllSafetyDocs = async () => {
    try {
      const records = await pb.collection(SAFETY).getFullList({});
      const jsonFac = JSON.stringify(records);
      localStorage.setItem(SAFETY, jsonFac);
      localStorage.setItem(LAST_COMP_UPATE, new Date());
      return records;
    } catch (error) {
      console.log(error);
    }
  };

  const getSafetyDocsForFacility = async (id) => {
    const records = await getLocalSafetyDocs();
    const rec = records.filter((element) => element.fac_id === id);
    return rec;
  };

  const getSafetyDocsByTypeAndFacId = async (id, type) => {
    const records = await getLocalSafetyDocs();
    const rec = records.filter(
      (element) => element.fac_id === id && element.type === type
    );
    return rec;
  };

  return {
    getLocalCompDocs,
    getSafetyDocsForFacility,
    getLocalSafetyDocs,
    getSafetyDocsByTypeAndFacId,
    getCompDocsByFacId,
    getCompDocsByTypeAndFacId,
    reloadAllSafetyDocs,
    reloadAllCompDocs,
  };
};
export default useCompliance;
