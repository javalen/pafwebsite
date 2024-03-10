import React, { useEffect, useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import pb from "../../../api/pocketbase";
import useAuth from "../../../auth/useAuth";
import useDivisions from "../../../data/divisions";
import useFacility from "../../../data/facility";
import Datepicker from "react-tailwindcss-datepicker";
import useCompliance from "../../../data/compliance";

const clazz = "AddEditDoc";

export function AddEditDoc({
  isOpen,
  setIsOpen,
  isCompliance,
  doc,
  docType,
  faciltiyId,
  setReRender,
  setDoc,
  docs,
}) {
  const [files, setFiles] = useState([]);
  const [validationErr, setValidationErr] = useState("");
  const [inputs, setInputs] = useState({});
  const [effDate, setEffDate] = useState();
  const [expDate, setExpDate] = useState();
  const [contName, setContName] = useState();
  const [contNumber, setContNumber] = useState();
  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11),
  });
  const docData = useCompliance();

  const { user, logOut } = useAuth();

  const handleSubmit = async (event) => {
    try {
      const data = new FormData();
      data.append("type", docType);
      event.preventDefault();
      data.append("fac_id", faciltiyId);

      data.append(
        "effective_date",
        new Date(value.startDate).toLocaleDateString()
      );
      data.append("expire_date", new Date(value.endDate).toLocaleDateString());
      data.append("contact_name", inputs.contName);
      data.append("contact_number", inputs.contNumber);

      const uploads = [...files];

      uploads.forEach((f, index) => data.append("file", files[index]));

      let newDoc = {};
      isCompliance
        ? (newDoc = await pb.collection("facility_compliance").create(data))
        : (newDoc = await pb.collection("facility_safety_doc").create(data));

      const newDocs = docs;
      newDocs.forEach(async (docs) => {
        if (docs.type === docType) await docs.docs.push(newDoc);
      });

      await addDocToLocalStorage(newDoc);
      setDoc(newDocs);
      setIsOpen(false);
    } catch (error) {
      console.log("Error creating facility", error);
    }
  };

  const addDocToLocalStorage = async (doc) => {
    try {
      isCompliance
        ? docData.addCompDocToLocalStorage(doc)
        : docData.addSafetyDocToLocalStorage(doc);
    } catch (error) {
      console.log(clazz, "Error adding doc to local storage", error);
    }
  };

  const handleValueChange = (newValue) => {
    setValue(newValue);
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleFileChange = (e) => {
    const input = e.target.files;
    setFiles(input);
  };

  useEffect(() => {}, [isOpen]);

  return (
    <>
      {isOpen ? (
        <>
          <div className="p-5 mt justify-center drop-shadow-2xl items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none -mt-40">
            <div className="relative h-1/2 my-4 mx-auto w-1/4">
              <div className=" border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="bg-slate-100  flex  p-3 border-b border-solid border-blueGray-200 rounded-t ">
                  <h3 className="bg-slate-100 text-1xl font-semibold bg-sky-100">
                    Add {docType} Document
                  </h3>
                  {validationErr && (
                    <div className="text-red-400">{validationErr}</div>
                  )}
                  <button
                    className="p-1 ml-auto border-0 text-black opacity-20 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className=" text-black h-6 w-6 text-3xl block focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <form
                  onSubmit={handleSubmit}
                  enctype="multipart/form-data"
                  className="p-5"
                >
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 w-full">
                    {/* input file */}
                    <div className="sm:col-span-1 p-2">
                      <label
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        for="file_input"
                      >
                        Upload file
                      </label>
                      <div className="mt-2">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          class="block w-full text-sm text-slate-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-full file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-violet-50 file:text-violet-700
                                  hover:file:bg-violet-100
    "
                        />
                      </div>
                    </div>
                    {/* Facility Division */}
                    <div className="p-2">
                      <label
                        htmlFor="division"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Effective - Expire Dates
                      </label>
                      <div className="mt-2 col-span-full w-full">
                        <Datepicker
                          value={value}
                          onChange={handleValueChange}
                        />
                      </div>
                    </div>
                    <div className="col-span-1 mr-5">
                      {" "}
                      <div className="">
                        <label
                          htmlFor="numOfUnits"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Contact Name
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="contName"
                            id="contName"
                            placeholder="Contact Name"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1 mr-5">
                      {" "}
                      <div className="">
                        <label
                          htmlFor="numOfUnits"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Contact Number
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="contNumber"
                            id="contNumber"
                            placeholder="Contact Number"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="rounded-lg text-white bg-pmp_secondary background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="submit"
                    >
                      Save
                    </button>
                    <button
                      className="rounded-lg text-white bg-pmp_secondary background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
                {/*footer*/}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
