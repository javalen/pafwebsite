import React from "react";
import { ImageViewer } from "../../../../Image/ImageViewer";
import pb from "../../../../../api/pocketbase";

const clazz = "SystemDetailsContent";

const SystemDetailsContent = ({ system }) => {
  console.log(clazz, "The System", system);
  return (
    <div className="grid grid-cols-2 dark:bg-gray-900 dark:text-white ">
      <ImageViewer
        url={pb.files.getUrl(system, system.image[0], {
          thumb: "100x250",
        })}
      />
      <div className="grid grid-cols-2 p-5">
        <div className="font-medium text-gray-600 text-sm">
          <div>Onboard Date:</div>
          <div>Make:</div>
          <div>Model:</div>
          <div>Serial #:</div>
          <div>Description:</div>
        </div>
        <div className="font-normal text-gray-500 text-sm">
          <div>{new Date(system.created).toLocaleDateString()}</div>
          <div>{system.make}</div>
          <div>{system.model}</div>
          <div>{system.sn}</div>
          <div>{system.desc}</div>
        </div>
      </div>
    </div>
  );
};

export default SystemDetailsContent;
