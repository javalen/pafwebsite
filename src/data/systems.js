import pb from "../api/pocketbase";
import useService from "./service";
import useMaintenance from "./maintenance";

const clazz = "useSystems()";
const useSystems = () => {
  pb.autoCancellation(false);
  const LAST_SYSTEM_UPATE = "lastUserUpdated";
  const SYSTEMS = "subsys";
  const timeOut = import.meta.env.VITE_FACILITY_TIMEOUT;
  const svcData = useService();
  const maintData = useMaintenance();

  //Returns all of the facilities stored in local storage
  const getLocalSystems = async () => {
    let systems = await JSON.parse(localStorage.getItem(SYSTEMS));

    if (systems === null || systems?.length === 0) {
      const newSystems = await reloadAllSystems();
    }
    return JSON.parse(localStorage.getItem(SYSTEMS));
  };

  //Pulls all of the systems
  const reloadAllSystems = async () => {
    try {
      const records = await pb.collection(SYSTEMS).getFullList({});
      const jsonFac = JSON.stringify(records);
      localStorage.setItem(SYSTEMS, jsonFac);
      localStorage.setItem(LAST_SYSTEM_UPATE, new Date());
    } catch (error) {
      console.log("Error retrieving subsys", error);
    }
  };

  const addSystem = async (system) => {
    console.log(clazz, "Reloading Systems");
    await reloadAllSystems();
  };

  const getFacilitySystems = async (id) => {
    let systems = await getLocalSystems();
    const results = systems.filter((sys) => sys.fac_id === id);
    return results;
  };

  const deleteFacilitySystems = async (id) => {
    try {
      const systems = await getFacilitySystems(id);
      systems.forEach(async (sys) => {
        // Delete the maint records
        await maintData.deleteMaintRecordsForSys(id);

        //Delete maint scheds for system
        await maintData.deleteMaintScheduleForSys(id);

        //Delete any service Records
        await svcData.deleteServiceForSystem(sys.id);

        //Delete the system
        await pb.collection("subsys").delete(sys.id);
      });
    } catch (error) {
      console.log(clazz, "Error deleting systems for ", id);
    }
  };

  const deleteSystem = async (sys) => {
    try {
      // Delete the maint records
      await maintData.deleteMaintRecordsForSys(sys.id);

      //Delete maint scheds for system
      await maintData.deleteMaintScheduleForSys(sys.id);

      //Delete any service Records
      await svcData.deleteServiceForSystem(sys.id);

      //Delete the system
      await pb.collection("subsys").delete(sys.id);
    } catch (error) {
      console.log(clazz, "Error deleting systems for ", sys.id, error);
    }
    localStorage.removeItem(SYSTEMS);
    await reloadAllSystems();
  };

  const reloadData = async () => {
    const systems = await getLocalSystems();

    const lastUpdated = new Date(localStorage.getItem(LAST_SYSTEM_UPATE));
    if (!lastUpdated) reloadAllSystems();
    const now = new Date();
    const elapsed = now - lastUpdated;
    let seconds = Math.round(elapsed);
    seconds /= 1000;
    if (systems.length === 0 || seconds > timeOut) {
      reloadAllSystems();
    }
  };

  const loadSystems = async () => {
    await reloadData();
  };

  return {
    getFacilitySystems,
    reloadAllSystems,
    deleteFacilitySystems,
    addSystem,
    deleteSystem,
  };
};
export default useSystems;
