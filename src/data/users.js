import { useEffect, useState } from "react";
import pb from "../api/pocketbase";
import { json } from "react-router-dom";
import useFacility from "./facility";

const clazz = "usePersonel()";
const usePersonnel = () => {
  const facilityData = useFacility();
  pb.autoCancellation(false);
  const LAST_USER_UPATE = "lastUserUpdated";
  const USERS = "users";
  const timeOut = import.meta.env.VITE_FACILITY_TIMEOUT;

  //Returns all of the facilities stored in local storage
  const getLocalUsers = async () => {
    //return getUsersFromDb();
    let usrs = await JSON.parse(localStorage.getItem(USERS));

    if (usrs === null || usrs?.length === 0) {
      const newUsers = await getAllUsersFromDb();
    }
    return JSON.parse(localStorage.getItem(USERS));
  };

  //Pulls all of the users from the personel table
  const getUsersFromDb = async () => {
    try {
      const records = await pb.collection("personel").getFullList({
        expand: "user",
      });
      return records;
    } catch (error) {
      console.log("Error retrieving users", error);
    }
  };

  //Pulls all of the users from the personel table
  const getAllUsersFromDb = async () => {
    try {
      const records = await pb.collection("personel").getFullList({
        expand: "user",
      });
      console.log(clazz, "users", records);
      const jsonFac = JSON.stringify(records);
      localStorage.setItem(USERS, jsonFac);
      localStorage.setItem(LAST_USER_UPATE, new Date());
    } catch (error) {
      console.log("Error retrieving users", error);
    }
  };

  const getFacilityUsers = async (id) => {
    let users = await getLocalUsers();
    const facUsers = await users.filter((usr) => usr.fac_id === id);

    console.log("FAcUsers", facUsers);
    return facUsers;
  };

  const deleteFacilityUsers = async (id) => {
    let users = await getFacilityUsers(id);
    users.forEach(async (user) => {
      await pb.collection("personel").delete(user.id);
    });

    console.log("FAcUsers", facUsers);
    return facUsers;
  };

  //Returns users in the specified role for the specified facility
  const getUsersInRoleForFacility = async (id, role) => {
    let users = await getLocalUsers();
    const results = users.filter(
      (usr) => usr.fac_id === id && usr.role === role
    );
    return results;
  };

  // Returns all users with the facility id and name attached
  const getUsersWithFacilities = async () => {
    try {
      const allUsers = await getLocalUsers();

      const userFacs = [];
      await allUsers.forEach(async (user) => {
        user.facility = await facilityData.getFacility(user.fac_id);
        userFacs.push(user);
      });
      return userFacs;
    } catch (error) {
      console.log("Error loading UsersWithFacilities", error);
    }
  };

  const reloadData = async () => {
    const users = await getLocalUsers();

    const lastUpdated = new Date(localStorage.getItem(LAST_USER_UPATE));
    if (!lastUpdated) getAllUsersFromDb();
    const now = new Date();
    const elapsed = now - lastUpdated;
    let seconds = Math.round(elapsed);
    seconds /= 1000;
    if (users?.length === 0 || seconds > timeOut) {
      getAllUsersFromDb();
    }
  };

  const loadUsers = async () => {
    await reloadData();
  };

  const setUser = async (user) => {};

  return {
    getLocalUsers,
    getUsersInRoleForFacility,
    getFacilityUsers,
    getUsersWithFacilities,
    getAllUsersFromDb,
    deleteFacilityUsers,
  };
};
export default usePersonnel;
