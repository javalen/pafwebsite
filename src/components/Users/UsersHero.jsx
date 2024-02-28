import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import pb from "../../api/pocketbase";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import usePersonnel from "../../data/users";

const clazz = "UsersHero";
let sortObj = [
  { field: "name", asc: true },
  { field: "facility", asc: true },
  { field: "email", asc: true },
  { field: "role", asc: true },
  { field: "lli", asc: true },
];
const UsersHero = () => {
  const personelData = usePersonnel();
  const [people, setPeople] = useState();
  const [dummy, setDummy] = useState("");

  const loadAllUsers = async () => {
    try {
      const allUsers = await personelData.getUsersWithFacilities();
      console.log(clazz, "AllUsers", allUsers);
      setPeople(allUsers);
      setDummy("" + Math.random());
      setDummy("" + Math.random());
    } catch (error) {
      console.log(clazz, "Error loading all users", error);
    }
  };

  const sort = (e) => {
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
    <div className="container mt-20 mb-20">
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
                  <td class="px-6 py-4 text-right">
                    <a
                      href="#"
                      class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Users
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the users in your account including their name,
              title, email and role.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add user
            </button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      <a href="#" className="group inline-flex">
                        Name
                        <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          <ChevronDownIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>
                      </a>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      <a href="#" className="group inline-flex">
                        Facility
                        <span className="ml-2 flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                          <ChevronDownIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>
                      </a>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      <a href="#" className="group inline-flex">
                        Email
                        <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          <ChevronDownIcon
                            className="invisible ml-2 h-5 w-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                            aria-hidden="true"
                          />
                        </span>
                      </a>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      <a href="#" className="group inline-flex">
                        Role
                        <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          <ChevronDownIcon
                            className="invisible ml-2 h-5 w-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                            aria-hidden="true"
                          />
                        </span>
                      </a>
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {people?.map((person) => (
                    <tr key={person.email}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {person.full_name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person.facility?.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person.expand.user.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person.role}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-0">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                          <span className="sr-only">, {person.user_id}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default UsersHero;
