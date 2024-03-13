import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/20/solid";
import usePersonnel from "../../../data/users";
import { useEffect, useState } from "react";
import pb from "../../../api/pocketbase";
import SlideOutUserForm from "./SlideOutUserForm";
import { AddEditUser } from "../../AddEditUsers/AddEditUser";

const clazz = "UserDetails";
export default function UserDetails({ facility }) {
  console.log(clazz, "Facility", facility);
  const [personnel, setPersonnel] = useState([]);
  const [openUserForm, setOpenUserForm] = useState(false);
  const [dummy, setDummy] = useState();
  const [mode, setMode] = useState("new");
  const userData = usePersonnel();

  const loadUsers = async () => {
    const users = await userData.getFacilityUsers(facility.id);
    console.log(clazz, "Users", users);
    const people = [];
    await users.forEach(async (usr) => {
      people.push({
        name: usr.expand.user.name,
        role: usr.role,
        email: usr.expand.user.email,
        telephone: usr.expand.user.phone,
        imageUrl: pb.files.getUrl(usr.expand.user, usr.expand.user.avatar, {
          thumb: "100x250",
        }),
      });
    });
    setPersonnel(people);
    setDummy("" + Math.random());
  };

  const buttonClick = () => {
    setOpenUserForm(!openUserForm);
  };

  useEffect(() => {
    loadUsers();
  }, [facility, openUserForm]);
  return (
    <div>
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {personnel.map((person) => (
          <li
            key={person.email}
            className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow dark:bg-gray-900 dark:text-white"
          >
            <div className="flex flex-1 flex-col p-8 dark:bg-gray-900 dark:text-white">
              <img
                className="mx-auto h-32 w-32 flex-shrink-0 rounded-full"
                src={person.imageUrl}
                alt=""
              />
              <h3 className="mt-6 text-sm font-medium text-gray-900 dark:bg-gray-900 dark:text-white">
                {person.name}
              </h3>
              <dl className="mt-1 flex flex-grow flex-col justify-between">
                <dt className="sr-only">Title</dt>
                {/* <dd className="text-sm text-gray-500">{person.title}</dd> */}
                <dt className="sr-only">Role</dt>
                <dd className="mt-3">
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    {person.role}
                  </span>
                </dd>
              </dl>
            </div>
            <div>
              <div className="-mt-px flex divide-x divide-gray-200">
                <div className="flex w-0 flex-1">
                  <a
                    href={`mailto:${person.email}`}
                    target="emailWin"
                    className=" dark:bg-gray-900 dark:text-white relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                  >
                    <EnvelopeIcon
                      className="h-5 w-5 text-gray-400 dark:bg-gray-900 dark:text-white"
                      aria-hidden="true"
                    />
                    Email
                  </a>
                </div>
                <div className="-ml-px flex w-0 flex-1">
                  <a
                    href={`tel:${person.telephone}`}
                    target="callWin"
                    className="dark:bg-gray-900 dark:text-white relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                  >
                    <PhoneIcon
                      className="h-5 w-5 text-gray-400 dark:bg-gray-900 dark:text-white"
                      aria-hidden="true"
                    />
                    Call
                  </a>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="grid mt-5 justify-center">
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-pmp_primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pmp_primary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={() => setOpenUserForm(!openUserForm)}
        >
          Add New User
        </button>
      </div>
      <AddEditUser
        isOpen={openUserForm}
        setIsOpen={setOpenUserForm}
        faciltiyId={facility.id}
        mode={mode}
        setReRender={setDummy}
      />
    </div>
  );
}
