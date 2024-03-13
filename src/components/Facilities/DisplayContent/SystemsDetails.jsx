import { useEffect, useState } from "react";
import useSystems from "../../../data/systems";
import useMaintenance from "../../../data/maintenance";
import { SystemDialog } from "./systems/SystemDialog";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";

import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { AddEditSystem } from "../AddEditSystem/AddEditSystem";
import ConfirmDeleteSystem from "./systems/DialogContent/ConfirmDeleteSystem";
import { DefaultSpinner } from "../../Loading/DefaultSpinner";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const clazz = "SystemsDetails";
export default function SystemsDetails({ facility }) {
  const [open, setOpen] = useState("Mechanical");
  const [active, setActive] = useState(false);
  const [openMode, setOpenMode] = useState("new");
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState();
  const [dummy, setDummy] = useState("");
  const systemsData = useSystems();
  const maintData = useMaintenance();
  const [openSysDialog, setOpenSysDialog] = useState(false);
  const [openNewSys, seteOpenNewSys] = useState(false);
  const [selectedSys, setSelectedSys] = useState();
  const [groups, setGroups] = useState([]);
  const [systemType, setSystemType] = useState("");
  const [reRender, setReRender] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [contDelete, setContDelete] = useState(false);

  const loadSystems = async () => {
    setLoading(true);
    try {
      const records = await systemsData.getFacilitySystems(facility.id);
      console.log(clazz, "systems", records);
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

  const handleDeleteSystem = async (sys) => {
    setSelectedSys(sys.system);
    setOpenDeleteDialog(true);
  };

  const deleteSystem = async () => {
    console.log(clazz, "system to delete", selectedSys);
    await systemsData.deleteSystem(selectedSys);
    await loadSystems();
    setContDelete(false);
  };

  const handleOpen = (value) => {
    console.log(clazz, "Value", value);
    setOpen(open === value ? 0 : value);
  };

  const showEdit = (mode, sys) => {
    console.log(clazz, "showEdit", sys);
    setOpenMode(mode);
    setSelectedSys(sys.system);
    setSystemType(sys.system.sys_type);
    seteOpenNewSys(true);
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
    console.log(clazz, "loading", contDelete);
    if (contDelete) await deleteSystem();
    await loadSystems();
  };

  const showSysDetails = (e) => {
    console.log(clazz, "showSysDetails", e);
    setSelectedSys(e.system.system);
    setOpenSysDialog(!openSysDialog);
  };

  const handleNewSystem = (type) => {
    setSystemType(type);
    seteOpenNewSys(true);
  };

  useEffect(() => {
    load();
  }, [facility, openSysDialog, openNewSys, contDelete]);

  return (
    <div className="bg-gray-500/60 p-5 rounded-lg">
      {loading ? (
        <DefaultSpinner />
      ) : (
        <>
          {groups.map((group, index) => (
            <Accordion open={open === group.name}>
              <AccordionHeader onClick={() => handleOpen(group.name)}>
                {group.name}
              </AccordionHeader>
              <AccordionBody>
                <div className=" grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {group.sys.map((system) => (
                    <div>
                      <div
                        key={system.system.id}
                        className="flex dark:bg-gray-900 dark:text-white text-black relative items-center space-x-3 rounded-lg border border-gray-300 bg-white px-4 py-4 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                      >
                        <div className="flex w-1/6">
                          <img className="w-20" src={system.img} alt="" />
                        </div>
                        <a
                          href="#"
                          onClick={() => showSysDetails({ system })}
                          className="flex w-full"
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
                        <div className="flex w-5 self-baseline">
                          <Menu as="div" className="relative flex-none">
                            <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                              <span className="sr-only">Open options</span>
                              <EllipsisVerticalIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </Menu.Button>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                <Menu.Item>
                                  <a
                                    href="#"
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-3 py-1 text-xs leading-6 text-gray-900"
                                    )}
                                    onClick={() => showEdit("edit", system)}
                                  >
                                    Edit
                                    <span className="sr-only">{"hello"}</span>
                                  </a>
                                </Menu.Item>
                                <Menu.Item>
                                  <a
                                    href="#"
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-3 py-1 text-xs leading-6 text-gray-900"
                                    )}
                                    onClick={() => showEdit("copy", system)}
                                  >
                                    Copy
                                  </a>
                                </Menu.Item>
                                <Menu.Item>
                                  <a
                                    href="#"
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-3 py-1 text-xs leading-6 text-gray-900"
                                    )}
                                    onClick={() => handleDeleteSystem(system)}
                                  >
                                    Delete
                                  </a>
                                </Menu.Item>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-pmp_primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pmp_primary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    onClick={() => handleNewSystem(group.name)}
                  >
                    Add new {group.name}
                  </button>
                </div>
              </AccordionBody>
            </Accordion>
          ))}
        </>
      )}

      <AddEditSystem
        isOpen={openNewSys}
        setIsOpen={seteOpenNewSys}
        faciltiyId={facility.id}
        systemType={systemType}
        setReRender={setReRender}
        system={selectedSys}
        mode={openMode}
      />
      <SystemDialog
        iSopen={openSysDialog}
        setIsOpen={setOpenSysDialog}
        system={selectedSys}
      />
      <ConfirmDeleteSystem
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        setContinue={setContDelete}
      />
    </div>
  );
}
