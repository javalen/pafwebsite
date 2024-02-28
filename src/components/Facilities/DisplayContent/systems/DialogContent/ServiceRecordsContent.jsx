import React, { useEffect, useState } from "react";
import useService from "../../../../../data/service";
import { ImageViewer } from "../../../../Image/ImageViewer";
import pb from "../../../../../api/pocketbase";

const clazz = "ServiceRecordsContent";

const ServiceRecordsContent = ({ system }) => {
  console.log(clazz, "The System", system);
  const [records, setRecords] = useState();
  const [totalCost, setTotalCost] = useState();
  const svcData = useService();

  const loadSRecords = async () => {
    try {
      const srecs = await svcData.getSvcRecsForSysId(system.id);
      setTotalCost(sumServices(srecs));
      setRecords(srecs.reverse());
    } catch (error) {
      console.log("Error loading s");
    }
  };

  const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const sumServices = (svcs) => {
    let total = 0;
    svcs.forEach((svc) => {
      total += getAmount(svc.cost);
    });
    return USDollar.format(total);
  };

  const getAmount = (amount) => {
    return parseFloat(amount.replace(/[$,]/g, ""));
  };
  const hasImage = (record) => {
    return record.images?.length > 0;
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
            Service Records for {system.name}
          </div>
          <div className="grid grid-cols-3 p-3">
            <div className="font-medium text-gray-600 text-sm max-w-32">
              <div>Service Summary: </div>
            </div>
            <div className="font-normal text-gray-500 text-sm col-span-2">
              <div>{`${system.name} has had ${records.length} service calls totaling ${totalCost}`}</div>
            </div>
          </div>
          <div className="grid divide-y divide-neutral-200 max-w-xl mx-auto mt-8">
            {records.map((record) => (
              <div className="py-5">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span>
                      {" "}
                      {new Date(record.created).toLocaleDateString()} Completed
                      by {record.servicer}
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
                    {hasImage(record) && (
                      <ImageViewer
                        url={pb.files.getUrl(record, record.images[0])}
                      />
                    )}
                    <div className="grid grid-cols-2 p-3">
                      <div className="font-medium text-gray-600 text-sm max-w-32">
                        <div>Service Type: </div>
                      </div>
                      <div className="font-normal text-gray-500 text-sm">
                        <div>{record.service_type}</div>
                      </div>
                      <div className="font-medium text-gray-600 text-sm max-w-32">
                        <div>Technician: </div>
                      </div>
                      <div className="font-normal text-gray-500 text-sm">
                        <div>{record.technician_name}</div>
                      </div>
                      <div className="font-medium text-gray-600 text-sm max-w-32">
                        <div>Cost: </div>
                      </div>
                      <div className="font-normal text-gray-500 text-sm">
                        <div>{record.cost}</div>
                      </div>
                      <div className="font-medium text-gray-600 text-sm max-w-32">
                        <div>Warranty Y/N: </div>
                      </div>
                      <div className="font-normal text-gray-500 text-sm">
                        <div>{record.warranty ? "Yes" : "No"}</div>
                      </div>
                      <div className="font-medium text-gray-600 text-sm max-w-32">
                        <div>Description: </div>
                      </div>
                      <div className="font-normal text-gray-500 text-sm">
                        <div>{record.desc}</div>
                      </div>
                    </div>
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

export default ServiceRecordsContent;
