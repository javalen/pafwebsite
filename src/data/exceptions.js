import pb from "../api/pocketbase";

const clazz = "useExceptions()";

const useExceptions = () => {
  const getDefinedExceptions = async () => {
    try {
      const records = await pb.collection("all_exceptions").getFullList({});
      console.log(clazz, "definedExceptions", records);
      return records;
    } catch (error) {
      console.log(clazz, "Error fetching exceptions");
    }
  };

  const getFacilityExceptionList = async (fac_id) => {
    try {
      const record = await pb
        .collection("facility_exceptions")
        .getFirstListItem(`facility_id ="${fac_id}"`, {});
      return record;
    } catch (error) {
      console.log(clazz, "Error getting exceptionlist for ", fac_id, error);
    }
  };

  const getFacilityExceptions = async (fac_id) => {
    try {
      const records = await pb.collection("exceptions").getFullList({
        filter: `fac_id ="${fac_id}"`,
      });
      return records;
    } catch (error) {
      console.log(clazz, "Error getting facility exceptions", fac_id, error);
    }
  };

  return {
    getDefinedExceptions,
    getFacilityExceptionList,
    getFacilityExceptions,
  };
};
export default useExceptions;
