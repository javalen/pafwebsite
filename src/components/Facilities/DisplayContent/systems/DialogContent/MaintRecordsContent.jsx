import React, { useEffect, useState } from "react";
import useMaintenance from "../../../../../data/maintenance";
import { ImageViewer } from "../../../../Image/ImageViewer";
import pb from "../../../../../api/pocketbase";

const clazz = "MaintRecordsContent";

const MaintRecordsContent = ({ system }) => {
  console.log(clazz, "The System", system);
  const maintData = useMaintenance();
  const [records, setRecods] = useState();

  const loadSRecords = async () => {
    try {
      const mrecs = await maintData.getMaintRecsForSysId(system.id);

      setRecods(mrecs.reverse());
    } catch (error) {
      console.log("Error loading s");
    }
  };

  const load = async () => await loadSRecords();

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      {records ? (
        <div className="">
          <div className="font-medium text-gray-600 text-sm text-center">
            Maintence Records for {system.name}
          </div>
          <div className="grid divide-y divide-neutral-200 max-w-xl mx-auto mt-8">
            {records.map((record) => (
              <div className="py-5">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span>
                      {" "}
                      {new Date(record.created).toLocaleDateString()} Completed
                      by {record.technician}
                    </span>
                    <span className="transition group-open:rotate-180">
                      <svg
                        fill="none"
                        height="24"
                        shape-rendering="geometricPrecision"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <div className="w-fit h-fit">
                    <ImageViewer
                      url={pb.files.getUrl(record, record.image[0])}
                    />
                    <div className="font-normal text-gray-500 text-sm p-5">
                      {record.desc}
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="font-medium text-gray-600 text-sm">
                        <div>Status:</div>
                      </div>
                      <div className="font-normal text-gray-500 text-sm">
                        <div>{record.status}</div>
                      </div>
                    </div>
                    <div className="font-normal text-gray-500 text-sm p-5">
                      Completed Checks
                    </div>
                    {record?.required_checks?.checks.map((ck, index) => (
                      <div>
                        {index + 1}). {ck}
                      </div>
                    ))}

                    <div className="font-normal text-gray-500 text-sm p-5">
                      Checks not Completed
                    </div>
                    {record?.not_checked?.checks.map((ck, index) => (
                      <div>
                        {index + 1}).{ck}
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>No Maintenance Records</div>
      )}
    </>
  );
};

export default MaintRecordsContent;
