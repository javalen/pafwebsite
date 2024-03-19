import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import pb from "../../api/pocketbase";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import usePersonnel from "../../data/users";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";
import ChangePassword from "./ChangePassword";
import LockUser from "./LockUser";

const clazz = "UsersHero";
let sortObj = [
  { field: "name", asc: true },
  { field: "facility", asc: true },
  { field: "email", asc: true },
  { field: "role", asc: true },
  { field: "lli", asc: true },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const UsersHero = () => {
  const personelData = usePersonnel();
  const [people, setPeople] = useState();
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [openLockOut, setOpenLockOut] = useState(false);
  const [dummy, setDummy] = useState("");
  const [user, setUser] = useState({});

  const loadAllUsers = async () => {
    try {
      console.log(clazz, "Loading Users");
      const allUsers = await personelData.getUsersWithFacilities();
      console.log(clazz, "AllUsers", allUsers);
      setPeople(allUsers);
    } catch (error) {
      console.log(clazz, "Error loading all users", error);
    }
  };

  const changeUserPassword = (user) => {
    setUser(user);
    setOpenChangePassword(true);
  };

  const lockUser = (user) => {
    setUser(user);
    setOpenLockOut(true);
  };

  const sort = (e) => {
    console.log(clazz, "sort", e);
    let arr = people;
    let asc = false;
    sortObj = sortObj.map((obj) => {
      if (obj.field === e) {
        asc = obj.asc;
        obj.asc = !asc;
      }
      return obj;
    });
    switch (e) {
      case "name":
        if (asc) {
          arr.sort((a, b) => {
            if (a.full_name.toLowerCase() < b.full_name.toLowerCase())
              return -1;
            if (a.full_name.toLowerCase() > b.full_name.toLowerCase()) return 1;
            return 0;
          });
        } else {
          arr.sort((a, b) => {
            if (a.full_name.toLowerCase() > b.full_name.toLowerCase())
              return -1;
            if (a.full_name.toLowerCase() < b.full_name.toLowerCase()) return 1;
            return 0;
          });
        }
        break;
      case "facility":
        if (asc) {
          arr.sort((a, b) => {
            if (a.facility?.name.toLowerCase() < b.facility?.name.toLowerCase())
              return -1;
            if (a.facility?.name.toLowerCase() > b.facility?.name.toLowerCase())
              return 1;
            return 0;
          });
        } else {
          arr.sort((a, b) => {
            if (a.facility?.name.toLowerCase() > b.facility?.name.toLowerCase())
              return -1;
            if (a.facility?.name.toLowerCase() < b.facility?.name.toLowerCase())
              return 1;
            return 0;
          });
        }
        break;
      case "email":
        if (asc) {
          arr.sort((a, b) => {
            const c = a.expand.user.email
              .substring(0, a.expand.user.email.indexOf("@"))
              .toLowerCase();
            const d = b.expand.user.email
              .substring(0, b.expand.user.email.indexOf("@"))
              .toLowerCase();
            console.log("email", c);
            if (c < d) return -1;
            if (c > d) return 1;
            return 0;
          });
        } else {
          arr.sort((a, b) => {
            if (
              a.expand.user.email.toLowerCase() >
              b.expand.user.email.toLowerCase()
            )
              return -1;
            if (
              a.expand.user.email.toLowerCase() <
              b.expand.user.email.toLowerCase()
            )
              return 1;
            return 0;
          });
        }
        break;
      case "role":
        if (asc) {
          arr.sort((a, b) => {
            if (a.role.toLowerCase() < b.role.toLowerCase()) return -1;
            if (a.role.toLowerCase() > b.role.toLowerCase()) return 1;
            return 0;
          });
        } else {
          arr.sort((a, b) => {
            if (a.role.toLowerCase() > b.role.toLowerCase()) return -1;
            if (a.role.toLowerCase() < b.role.toLowerCase()) return 1;
            return 0;
          });
        }
        break;
      case "lli":
        if (asc) {
          arr.sort((a, b) => {
            if (a.expand?.user?.lst_login < b.expand?.user?.lst_login)
              return -1;
            if (a.expand?.user?.lst_login > b.role.expand?.user.lst_login)
              return 1;
            return 0;
          });
        } else {
          arr.sort((a, b) => {
            if (a.expand.user?.lst_login > b.expand?.user.lst_login) return -1;
            if (a.expand.user?.lst_login < b.expand?.user.lst_login) return 1;
            return 0;
          });
        }
        break;
      default:
        break;
    }
    setPeople(arr);
    setDummy("" + Math.random());
  };

  const load = async () => await loadAllUsers();

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container w-full mt-20 mb-20">
      {!people && <div>Loading</div>}
      {people && (
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3">
                  <div class="flex items-center">
                    Name
                    <a href="#" onClick={() => sort("name")}>
                      <svg
                        class="w-3 h-3 ms-1.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </a>
                  </div>
                </th>
                <th scope="col" class="px-6 py-3">
                  <div class="flex items-center">
                    Facility
                    <a href="#" onClick={() => sort("facility")}>
                      <svg
                        class="w-3 h-3 ms-1.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </a>
                  </div>
                </th>
                <th scope="col" class="px-6 py-3">
                  <div class="flex items-center">
                    Email
                    <a href="#" onClick={() => sort("email")}>
                      <svg
                        class="w-3 h-3 ms-1.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </a>
                  </div>
                </th>
                <th scope="col" class="px-6 py-3">
                  <div class="flex items-center">
                    Role
                    <a href="#" onClick={() => sort("role")}>
                      <svg
                        class="w-3 h-3 ms-1.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </a>
                  </div>
                </th>
                <th scope="col" class="px-6 py-3">
                  <div class="flex items-center">
                    Last Login
                    <a href="#" onClick={() => sort("lli")}>
                      <svg
                        class="w-3 h-3 ms-1.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </a>
                  </div>
                </th>
                <th scope="col" class="px-6 py-3">
                  <div class="flex items-center">
                    Blocked Access
                    <a href="#" onClick={() => sort("lli")}>
                      <svg
                        class="w-3 h-3 ms-1.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </a>
                  </div>
                </th>
                <th scope="col" class="px-6 py-3">
                  <span class="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {person.full_name}
                  </th>
                  <td class="px-6 py-4">{person.facility?.name}</td>
                  <td class="px-6 py-4">{person.expand.user.email}</td>
                  <td class="px-6 py-4">{person.role}</td>
                  <td class="px-6 py-4">{person.expand.user.lst_login}</td>
                  <td class="px-6 py-4">
                    {person.expand.user.lock_out ? "Yes" : "No"}
                  </td>
                  <td class="px-6 py-4 text-right">
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
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-3 py-1 text-xs leading-6 text-gray-900"
                                )}
                                onClick={() =>
                                  changeUserPassword(person.expand.user)
                                }
                              >
                                Change Password
                                <span className="sr-only">, {person.name}</span>
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-3 py-1 text-xs leading-6 text-gray-900"
                                )}
                                onClick={() => lockUser(person.expand.user)}
                              >
                                Block from App
                                <span className="sr-only">, {person.name}</span>
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ChangePassword
        open={openChangePassword}
        setOpen={setOpenChangePassword}
        user={user}
      />
      <LockUser
        user={user}
        open={openLockOut}
        setOpen={setOpenLockOut}
        setRender={setDummy}
      />
    </div>
  );
};

export default UsersHero;
