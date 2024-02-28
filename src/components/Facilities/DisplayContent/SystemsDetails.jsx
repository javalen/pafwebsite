import { useEffect, useState } from "react";
import useSystems from "../../../data/systems";
import useMaintenance from "../../../data/maintenance";
import { SystemDialog } from "./systems/SystemDialog";

const clazz = "SystemsDetails";
export default function SystemsDetails({ facility }) {
  console.log(clazz, "Facility", facility);
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState();
  const [dummy, setDummy] = useState("");
  const systemsData = useSystems();
  const maintData = useMaintenance();
  const [openSysDialog, setOpenSysDialog] = useState(false);
  const [selectedSys, setSelectedSys] = useState();

  const loadSystems = async () => {
    setLoading(true);
    try {
      const records = await systemsData.getFacilitySystems(facility.id);

      const list = await maintData.getRecordsForFacilityAsList(records);

      setSystems(list);

      setDummy("" + Math.random());
    } catch (error) {
      console.log("Error loading systems", error);
      setLoading(false);
    }
    setLoading(false);
  };

  const load = async () => {
    await loadSystems();
  };

  const showSysDetails = (e) => {
    console.log(clazz, "showSysDetails", e);
    setSelectedSys(e.sys.system);
    setOpenSysDialog(!openSysDialog);
  };

  useEffect(() => {
    load();
  }, [facility, openSysDialog]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 ">
      {systems.map((sys) => (
        <div
          key={sys.system.id}
          className="dark:bg-gray-900 dark:text-white relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
        >
          <div className="flex-shrink-0">
            <img className="h-20 w-20" src={sys.img} alt="" />
          </div>
          <a
            href="#"
            onClick={() => showSysDetails({ sys })}
            className="focus:outline-none"
          >
            <div className="grid grid-cols-2">
              <div>
                <div>Name:</div>
              </div>
              <div>
                <div>{sys.name}</div>
              </div>
              <div>
                <div>Make:</div>
              </div>
              <div>
                <div>{sys.make}</div>
              </div>
              <div>
                <div>Model:</div>
              </div>
              <div>
                <div>{sys.model}</div>
              </div>
              <div>
                <div>SN#:</div>
              </div>
              <div>
                <div>{sys.sn}</div>
              </div>
            </div>
          </a>
        </div>
      ))}
      <SystemDialog
        iSopen={openSysDialog}
        setIsOpen={setOpenSysDialog}
        system={selectedSys}
      />
    </div>
  );
}
