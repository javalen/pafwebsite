import React, { useEffect, useState } from "react";
import useMaintenance from "../../../../../data/maintenance";

const frequencies = [
  { label: "Daily", value: "1" },
  { label: "Weekly", value: "7" },
  { label: "Monthly", value: "30" },
  { label: "Quarterly", value: "91" },
  { label: "Biannually", value: "182" },
  { label: "Annually", value: "365" },
];

const clazz = "MaintScheduleContent";

const MaintScheduleContent = ({ system }) => {
  console.log(clazz, "The System", system);
  const [schedule, setSchedule] = useState(null);
  const maintData = useMaintenance();

  const loadSchedule = async () => {
    try {
      const sched = await maintData.getMaintSchedForSys(system.id);
      setSchedule(sched);
    } catch (error) {
      console.log("Error loading s");
    }
  };

  const load = async () => await loadSchedule();

  const getFrequency = (days) => {
    switch (days) {
      case 1:
        return "Daily";
      case 7:
        return "Weekly";
      case 30:
        return "Monthly";
      case 91:
        return "Quarterly";
      case 182:
        return "Biannually";
      default:
        return "Annually";
    }
  };
  useEffect(() => {
    load();
  }, []);
  return (
    <>
      {schedule ? (
        <div className="dark:bg-gray-900 dark:text-white">
          <div className="font-medium text-gray-600 text-sm text-center">
            Maintence Schedule for {system.name}
          </div>
          <div className="grid grid-cols-2 p-5">
            <div className="font-medium text-gray-600 text-sm">
              <div>Creation Date:</div>
              <div>Created By:</div>
              <div>Frequecy:</div>
              <div>Serial #:</div>
            </div>
            <div className="font-normal text-gray-500 text-sm">
              <div>{new Date(schedule.created).toLocaleDateString()}</div>
              <div>{schedule.user_name}</div>
              <div>{getFrequency(schedule.frequency)}</div>
            </div>
          </div>
          <div className="font-medium text-gray-600 text-sm text-center">
            Required Checks
          </div>
          {schedule.checks.checks.map((check, index) => (
            <div key={index}>
              {`${index + 1}) `}
              {check}
            </div>
          ))}
        </div>
      ) : (
        <div>No Schedule</div>
      )}
    </>
  );
};

export default MaintScheduleContent;
