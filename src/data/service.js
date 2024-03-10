import { useEffect, useState } from "react";
import pb from "../api/pocketbase";
import { json } from "react-router-dom";

const clazz = "useService()";

const useService = () => {
  pb.autoCancellation(false);
  const LAST_SVC_UPATE = "lastSvcUpdated";
  const SVC_CO = "service_company";
  const SVCS = "service_history";
  const SYS_WRNTY = "sys_warranty";
  const timeOut = import.meta.env.VITE_FACILITY_TIMEOUT;

  //Returns all of the services stored in local storage
  const getLocalSvcRecs = async () => {
    let recs = await JSON.parse(localStorage.getItem(SVCS));

    if (recs === null || recs?.length === 0) {
      const newFacs = await reloadAllSvcRecs();
    }
    return JSON.parse(localStorage.getItem(SVCS));
  };

  const reloadSvcData = async () => {
    const recs = await getLocalSvcRecs();
    const lastUpdated = new Date(localStorage.getItem(LAST_SVC_UPATE));
    if (!lastUpdated) reloadAllSvcRecs();
    const now = new Date();
    const elapsed = now - lastUpdated;
    let seconds = Math.round(elapsed);
    seconds /= 1000;
    if (recs?.length === 0 || seconds > timeOut) {
      reloadAllSvcRecs();
    }
  };

  const deleteServiceForSystem = async (id) => {
    try {
      const services = await getSvcRecsForSysId(id);
      services.forEach(async (service) => {
        //Delete the warranty
        if (service.warranty)
          await deleteWarrantyForService(service.warranty_id);

        //Delete the service
        await pb.collection("service_history").delete(id);
      });
    } catch (error) {
      console.log(clazz, "Error deleting service for ", id);
    }
  };

  // useEffect(() => {
  //   reloadSvcData();
  // });

  const reloadAllSvcRecs = async () => {
    try {
      const records = await pb.collection(SVCS).getFullList({});
      const jsonFac = JSON.stringify(records);
      localStorage.setItem(SVCS, jsonFac);
      localStorage.setItem(LAST_SVC_UPATE, new Date());
      return records;
    } catch (error) {
      console.log(error);
    }
  };

  const getSvcRecsForSysId = async (id) => {
    const records = await getLocalSvcRecs();
    const recs = records.filter((element) => element.system_id === id);
    recs.forEach(async (rec) => {
      rec.serviceCo = await getSvcCoById(rec.servicer_id);
      rec.warranty = await getWrntyById(rec.warranty_id);
    });
    return recs;
  };

  //------------------------------------ Warranty --------------------------------------
  const getLocalWrntyRecords = async () => {
    let recs = await JSON.parse(localStorage.getItem(SYS_WRNTY));

    if (recs === null || recs?.length === 0) {
      const newFacs = await reloadAllWrntyRecords();
    }
    return JSON.parse(localStorage.getItem(SYS_WRNTY));
  };

  const getWarrantyForService = async (id) => {
    try {
      const warranties = await getLocalWrntyRecords();
      const rec = warranties.filter((element) => element.id === id);
      return rec;
    } catch (error) {
      console.log(clazz, "Error getting warranties for service", id);
    }
  };

  const deleteWarrantyForService = async (id) => {
    try {
      const warranties = await getLocalWrntyRecords();
      const rec = warranties.filter((element) => element.id === id);
      rec.forEach(async (warr) => {
        await pb.collection("sys_warranty").delete(warr.id);
      });
    } catch (error) {
      console.log(clazz, "Error deleting warranties for service", id);
    }
  };

  const reloadAllWrntyRecords = async () => {
    try {
      const records = await pb.collection(SYS_WRNTY).getFullList({});
      const jsonFac = JSON.stringify(records);
      localStorage.setItem(SYS_WRNTY, jsonFac);
      localStorage.setItem(LAST_SVC_UPATE, new Date());
      return records;
    } catch (error) {
      console.log(error);
    }
  };

  const getWrntyById = async (id) => {
    const records = await getLocalWrntyRecords();
    const rec = records.find((element) => element.id === id);
    return rec;
  };

  //------------------------------------ Service Company --------------------------------------
  const getLocalSvcCos = async () => {
    let recs = await JSON.parse(localStorage.getItem(SVC_CO));

    if (recs === null || recs?.length === 0) {
      const newFacs = await reloadAllSvcCompanies();
    }
    return JSON.parse(localStorage.getItem(SVC_CO));
  };

  const reloadAllSvcCompanies = async () => {
    try {
      const records = await pb.collection(SVC_CO).getFullList({});
      const jsonFac = JSON.stringify(records);
      localStorage.setItem(SVC_CO, jsonFac);
      localStorage.setItem(LAST_SVC_UPATE, new Date());
      return records;
    } catch (error) {
      console.log(error);
    }
  };

  const getSvcCoById = async (id) => {
    const records = await getLocalSvcCos();
    const rec = records.find((element) => element.id === id);
    return rec;
  };
  return {
    getLocalSvcRecs,
    getSvcRecsForSysId,
    getLocalWrntyRecords,
    reloadAllSvcRecs,
    reloadAllSvcCompanies,
    reloadAllWrntyRecords,
    deleteServiceForSystem,
  };
};
export default useService;
