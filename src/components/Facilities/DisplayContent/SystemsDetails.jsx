import { useEffect, useState } from "react";
import useSystems from "../../../data/systems";
import useMaintenance from "../../../data/maintenance";
import { SystemDialog } from "./systems/SystemDialog";

import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

const clazz = "SystemsDetails";
export default function SystemsDetails({ facility }) {
  const [open, setOpen] = useState(1);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  console.log(clazz, "Facility", facility);
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState();
  const [dummy, setDummy] = useState("");
  const systemsData = useSystems();
  const maintData = useMaintenance();
  const [openSysDialog, setOpenSysDialog] = useState(false);
  const [selectedSys, setSelectedSys] = useState();
  const [groups, setGroups] = useState([]);

  const loadSystems = async () => {
    setLoading(true);
    try {
      const records = await systemsData.getFacilitySystems(facility.id);

      const list = await maintData.getRecordsForFacilityAsList(records);

      groupSystems(list);
      setSystems(list);

      setDummy("" + Math.random());
    } catch (error) {
      console.log("Error loading systems", error);
      setLoading(false);
    }
    setLoading(false);
  };

  const groupSystems = async (list) => {
    let groups = [];

    list.forEach((item) => {
      const sysObj = groups.filter((g) => g.name === item.system.sys_type);
      sysObj.length === 0
        ? groups.push({ name: item.system.sys_type, sys: [item] })
        : sysObj[0].sys?.push(item);
    });
    setGroups(groups);
  };

  const load = async () => {
    await loadSystems();
  };

  const showSysDetails = (e) => {
    console.log(clazz, "showSysDetails", e);
    setSelectedSys(e.system.system);
    setOpenSysDialog(!openSysDialog);
  };

  useEffect(() => {
    load();
  }, [facility, openSysDialog]);

  return (
    <div className="bg-gray-500/50 p-5 rounded-lg">
      {groups.map((group, index) => (
        <Accordion open={open === index}>
          <AccordionHeader onClick={() => handleOpen(index)}>
            {group.name}
          </AccordionHeader>
          <AccordionBody>
            <div className=" grid grid-cols-1 gap-4 sm:grid-cols-3">
              {group.sys.map((system) => (
                <div
                  key={system.system.id}
                  className="dark:bg-gray-900 dark:text-white text-black relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-4 py-4 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                >
                  <div className="flex-shrink-0">
                    <img className="h-20 w-20" src={system.img} alt="" />
                  </div>
                  <a
                    href="#"
                    onClick={() => showSysDetails({ system })}
                    className="focus:outline-none"
                  >
                    <div className="grid grid-cols-2 text-xs">
                      <div>
                        <div>Name:</div>
                      </div>
                      <div>
                        <div>{system.name}</div>
                      </div>
                      <div>
                        <div>Make:</div>
                      </div>
                      <div>
                        <div>{system.make}</div>
                      </div>
                      <div>
                        <div>Model:</div>
                      </div>
                      <div>
                        <div>{system.model}</div>
                      </div>
                      <div>
                        <div>SN#:</div>
                      </div>
                      <div>
                        <div>{system.sn}</div>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </AccordionBody>
        </Accordion>
      ))}
      <SystemDialog
        iSopen={openSysDialog}
        setIsOpen={setOpenSysDialog}
        system={selectedSys}
      />
    </div>
  );
}
