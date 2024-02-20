import { useEffect, useState } from "react";
import pb from "../api/pocketbase";
import useFacility from "./facility";

const useSystems = () => {
  pb.autoCancellation(false);
  const SYSTEMS = "subsys";
  const facilities = useFacility();

  const getFacilitySystems = async (id) => {
    try {
      const resultList = await pb.collection(SYSTEMS).getList(1, 500, {
        filter: `fac_id="${id}"`,
      });
      return resultList.items;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    getFacilitySystems,
  };
};
export default useSystems;
