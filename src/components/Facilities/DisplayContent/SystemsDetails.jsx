import { useEffect, useState } from "react";
import useSystems from "../../../data/systems";
import pb from "../../../api/pocketbase";
import useMaintenance from "../../../data/maintenance";

export default function SystemsDetails({ facility }) {
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState();
  const [dummy, setDummy] = useState("");
  const systemsData = useSystems();
  const maintData = useMaintenance();

  const loadSystems = async () => {
    setLoading(true);
    try {
      const records = await systemsData.getFacilitySystems(facility.id);
      setDummy("hello");
      setSystems([]);
      setSystems(await maintData.getRecordsForFacilityAsList(records));
      setDummy("GoodBye");
      // records.forEach(async (system) => {
      //   let maintRec = null;
      //   try {
      //     maintRec = await pb
      //       .collection("maint_record")
      //       .getFirstListItem(`subsys_id="${system.id}"`, {
      //         sort: "created",
      //       });
      //   } catch (error) {
      //     console.log("No maint record for ", system.name);
      //   }
      //   console.log("adding", system);
      //   sys.push({
      //     name: system.name,
      //     make: system.make,
      //     model: system.model,
      //     sn: system.sn,
      //     img: pb.files.getUrl(system, system.image[0], { thumb: "100x250" }),
      //     desc: system.desc,
      //     location: system.location,
      //     lastService:
      //       maintRec != null
      //         ? new Date(maintRec.created).toLocaleDateString
      //         : "",
      //     system: system,
      //     rec: maintRec,
      //   });
      // });
      // console.log("Sys", sys);
      // return sys;
    } catch (error) {
      console.log("Error loading systems", error);
      setLoading(false);
    }
    setLoading(false);
  };

  const load = async () => {
    await loadSystems();
    // setSystems(sys);
    // setLoading(false);
  };

  useEffect(() => {
    load();
  }, [facility]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {systems.map((sys) => (
        <div
          key={sys.system.id}
          className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
        >
          <div className="flex-shrink-0">
            <img className="h-20 w-20" src={sys.img} alt="" />
          </div>
          <div className="min-w-0 flex-1">
            <a href="#" className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">{sys.make}</p>
              <p className="truncate text-sm text-gray-500">{sys.model}</p>
              <p className="truncate text-sm text-gray-500">{sys.sn}</p>
              <p className="truncate text-sm text-gray-500">
                {sys.lastService}
              </p>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
