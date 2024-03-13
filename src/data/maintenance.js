import { useEffect, useState } from "react";
import pb from "../api/pocketbase";
import { json } from "react-router-dom";

const clazz = "useMaintenance()";

const useMaintenance = () => {
  pb.autoCancellation(false);
  const LAST_MAINT_UPATE = "lastMaintUpdated";
  const MAINT = "maint_record";
  const MAINT_SCHED = "maint_sched";
  const timeOut = import.meta.env.VITE_FACILITY_TIMEOUT;

  //Returns all of the facilities stored in local storage
  const getLocalMaintRecs = async () => {
    let recs = await JSON.parse(localStorage.getItem(MAINT));

    if (recs === null || recs?.length === 0) {
      const newFacs = await reloadAllMaintRecs();
    }
    return JSON.parse(localStorage.getItem(MAINT));
  };

  const reloadData = async () => {
    const recs = await getLocalMaintRecs();
    const lastUpdated = new Date(localStorage.getItem(LAST_MAINT_UPATE));
    if (!lastUpdated) reloadAllMaintRecs();
    const now = new Date();
    const elapsed = now - lastUpdated;
    let seconds = Math.round(elapsed);
    seconds /= 1000;
    if (recs.length === 0 || seconds > timeOut) {
      reloadAllMaintRecs();
    }
  };

  // useEffect(() => {
  //   reloadData();
  // });

  const getRecordsForFacilityAsList = async (records) => {
    const sys = [];
    try {
      //const mrecords = await getLocalMaintRecs();

      await records.forEach(async (system) => {
        let maintRec = null;

        maintRec = await getMaintRec(system.id);
        //console.log("maintRec", maintRec);
        sys.push({
          id: system.id,
          name: system.name,
          make: system.make,
          model: system.model,
          sn: system.sn,
          img: pb.files.getUrl(system, system.image[0], { thumb: "100x250" }),
          desc: system.desc,
          location: system.location,
          lastService:
            maintRec != null
              ? new Date(maintRec.created).toLocaleDateString()
              : "",
          system: system,
          rec: maintRec,
        });
      });
      return await sys;
    } catch (error) {
      console.log("Error loading Facility Records", error);
    }
    return null;
  };

  const reloadAllMaintRecs = async () => {
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

  const getMaintRecsForSysId = async (id) => {
    const records = await getLocalMaintRecs();
    const rec = records.filter((element) => element.subsys_id === id);
    return rec;
  };

  const getMaintRec = async (id) => {
    const records = await getLocalMaintRecs();
    const rec = records.find((element) => element.subsys_id === id);
    return rec;
  };

  const deleteMaintRecordsForSys = async (id) => {
    console.log(clazz, "Deleting systems for ", id);
    const records = await getMaintRecsForSysId();
    records?.forEach(async (rec) => {
      try {
        await pb.collection("maint_record").delete(rec.id);
      } catch (error) {
        console.log(clazz, "Error deleting maint record for ", id);
      }
    });
  };
  //------------------------------------ Maintenance Schedules --------------------------------------
  const getLocalMaintScheds = async () => {
    let recs = await JSON.parse(localStorage.getItem(MAINT_SCHED));

    if (recs === null || recs?.length === 0) {
      const newFacs = await reloadAllMaintSchedules();
    }
    return JSON.parse(localStorage.getItem(MAINT_SCHED));
  };

  const reloadAllMaintSchedules = async () => {
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
    const rec = records.find((element) => element.subsys_id === id);
    return rec;
  };

  const deleteMaintScheduleForSys = async (id) => {
    const records = await getMaintSchedForSys();
    records?.forEach(async (rec) => {
      try {
        await pb.collection("maint_sched").delete(rec.id);
      } catch (error) {
        console.log(clazz, "Error deleting main sched for ", id);
      }
    });
  };

  return {
    reloadAllMaintRecs,
    getLocalMaintRecs,
    getMaintRec,
    getMaintSchedForSys,
    getLocalMaintScheds,
    getRecordsForFacilityAsList,
    getMaintRecsForSysId,
    reloadAllMaintSchedules,
    deleteMaintRecordsForSys,
    deleteMaintScheduleForSys,
  };
};
export default useMaintenance;
