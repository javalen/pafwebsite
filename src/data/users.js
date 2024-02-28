import { useEffect, useState } from "react";
import pb from "../api/pocketbase";
import { json } from "react-router-dom";
import useFacility from "./facility";

const usePersonnel = () => {
  const facilityData = useFacility();
  pb.autoCancellation(false);
  const LAST_USER_UPATE = "lastUserUpdated";
  const USERS = "users";
  const timeOut = import.meta.env.VITE_FACILITY_TIMEOUT;

  //Returns all of the facilities stored in local storage
  const getLocalUsers = async () => {
    let usrs = await JSON.parse(localStorage.getItem(USERS));

    if (usrs === null || usrs?.length === 0) {
      const newUsers = await getAllUsers();
    }
    return JSON.parse(localStorage.getItem(USERS));
  };

  //Pulls all of the users from the personel table
  const getAllUsers = async () => {
    try {
      const records = await pb.collection("personel").getFullList({
        expand: "user",
      });
      //return records;
      const jsonFac = JSON.stringify(records);
      localStorage.setItem(USERS, jsonFac);
      localStorage.setItem(LAST_USER_UPATE, new Date());
    } catch (error) {
      console.log("Error retrieving users", users);
    }
  };

  const getFacilityUsers = async (id) => {
    let users = await getLocalUsers();
    const facUsers = await users.filter((usr) => usr.fac_id === id);

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
    if (!lastUpdated) getAllUsers();
    const now = new Date();
    const elapsed = now - lastUpdated;
    let seconds = Math.round(elapsed);
    seconds /= 1000;
    if (users?.length === 0 || seconds > timeOut) {
      getAllUsers();
    }
  };

  const loadUsers = async () => {
    await reloadData();
  };

  useEffect(() => {
    loadUsers();
  });

  return {
    getLocalUsers,
    getUsersInRoleForFacility,
    getFacilityUsers,
    getUsersWithFacilities,
  };
};
export default usePersonnel;
