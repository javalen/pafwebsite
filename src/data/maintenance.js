import { useEffect, useState } from "react";
import pb from "../api/pocketbase";
import { json } from "react-router-dom";

const useMaintenance = () => {
  pb.autoCancellation(false);
  const LAST_MAINT_UPATE = "lastUpdated";
  const MAINT = "maint_record";
  const MAINT_SCHED = "maint_sched";
  const timeOut = import.meta.env.VITE;

  //Returns all of the facilities stored in local storage
  const getLocalMaintRecs = async () => {
    let recs = await JSON.parse(localStorage.getItem(MAINT));

    if (recs === null || recs?.length === 0) {
      const newFacs = await getAllMaintRecs();
    }
    return JSON.parse(localStorage.getItem(MAINT));
  };

  const reloadData = async () => {
    const recs = await getLocalMaintRecs();
    const lastUpdated = new Date(localStorage.getItem(LAST_MAINT_UPATE));
    if (!lastUpdated) getFacs();
    const now = new Date();
    const elapsed = now - lastUpdated;
    let seconds = Math.round(elapsed);
    seconds /= 1000;
    if (recs.length === 0 || seconds > timeOut) {
      getAllMaintRecs();
    }
  };

  useEffect(() => {
    reloadData();
  });

  const getRecordsForFacilityAsList = async (records) => {
    const sys = [];
    try {
      //const mrecords = await getLocalMaintRecs();

      records.forEach(async (system) => {
        let maintRec = null;

        maintRec = await getMaintRec(system.id);
        //console.log("maintRec", maintRec);
        sys.push({
          name: system.name,
          make: system.make,
          model: system.model,
          sn: system.sn,
          img: pb.files.getUrl(system, system.image[0], { thumb: "100x250" }),
          desc: system.desc,
          location: system.location,
          lastService:
            maintRec != null
              ? new Date(maintRec.created).toLocaleDateString
              : "",
          system: system,
          rec: maintRec,
        });
      });
      console.log("Systems", sys);
      return await sys;
    } catch (error) {
      console.log("Error loading Facility Records", error);
    }
    return null;
  };

  const getAllMaintRecs = async () => {
    try {
      const records = await pb.collection(MAINT).getFullList({});
      const jsonFac = JSON.stringify(records);
      localStorage.setItem(MAINT, jsonFac);
      localStorage.setItem(LAST_MAINT_UPATE, new Date());
      return records;
    } catch (error) {
      console.log(error);
    }
  };

  const getMaintRec = async (id) => {
    const records = await getLocalMaintRecs();
    const rec = records.find((element) => element.subsys_id === id);
    return rec;
  };

  //------------------------------------ Maintenance Schedules --------------------------------------
  const getLocalMaintScheds = async () => {
    let recs = await JSON.parse(localStorage.getItem(MAINT_SCHED));

    if (recs === null || recs?.length === 0) {
      const newFacs = await getAllMaintSchedules();
    }
    return JSON.parse(localStorage.getItem(MAINT_SCHED));
  };

  const getSystemSchedule = async (id) => {
    try {
      const schedules = await getLocalMaintScheds();
      const schedule = schedules.find((sched) => sched.subsys_id === id);
      return schedule;
    } catch (error) {
      console.log("Error getting system schedule");
    }
    return null;
  };

  const getAllMaintSchedules = async () => {
    try {
      const records = await pb.collection(MAINT_SCHED).getFullList({});
      const jsonFac = JSON.stringify(records);
      localStorage.setItem(MAINT_SCHED, jsonFac);
      localStorage.setItem(LAST_MAINT_UPATE, new Date());
      return records;
    } catch (error) {
      console.log(error);
    }
  };

  const getMaintSchedForSys = async (id) => {
    const records = await getLocalMaintScheds();
    const rec = records.find((element) => element.id === id);
    return rec;
  };

  return {
    getLocalMaintRecs,
    getMaintRec,
    getMaintSchedForSys,
    getLocalMaintScheds,
    getRecordsForFacilityAsList,
  };
};
export default useMaintenance;
