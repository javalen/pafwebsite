import React, { useEffect, useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import pb from "../../../api/pocketbase";
import useAuth from "../../../auth/useAuth";
import { systemMenuItems } from "../../../config/systems";
import useSystems from "../../../data/systems";

const clazz = "AddEditSystem";

const fields = {
  name: {
    value: "",
    initialValue: "Name",
    missing: "Name is required",
    minLen: 5,
    lenErr: "Name is short",
    valid: false,
    required: true,
    type: "string",
  },
  make: {
    value: "",
    initialValue: "Name",
    missing: "Make is required",
    minLen: 5,
    lenErr: "Make is too short",
    valid: false,
    required: true,
    type: "string",
  },
  model: {
    value: "",
    initialValue: "Name",
    missing: "Model is required",
    minLen: 5,
    lenErr: "Model is too short",
    valid: false,
    required: true,
    type: "string",
  },
  serial: {
    value: "",
    initialValue: "Name",
    missing: "Serial # is required",
    minLen: 1,
    lenErr: "Serial # is too short",
    valid: false,
    required: true,
    type: "string",
  },
  condition: {
    value: "",
    initialValue: "Name",
    missing: "Condition is required",
    minLen: 3,
    valid: false,
    required: true,
    type: "string",
  },
  type: {
    value: "",
    initialValue: "Name",
    missing: "Type is required",
    minLen: 5,
    valid: false,
    required: true,
    type: "string",
  },
  subtype: {
    value: "",
    initialValue: "Name",
    missing: "Sub-type is required",
    minLen: 1,
    valid: false,
    required: true,
    type: "string",
    typeErr: "Sub-type of Units must be a number",
  },
  desc: {
    value: "",
    initialValue: "Name",
    missing: "Description is required",
    minLen: 5,
    lenErr: "Description is too short",
    valid: false,
    type: "string",
    required: true,
  },
  image: {
    value: "",
    initialValue: "Name",
    missing: "Image is required",
    minLen: 1,
    valid: false,
    required: true,
    type: "image",
  },
};

const conditions = [
  { label: "Select Condition", value: "none" },
  { label: "New", value: "new" },
  { label: "Good Condition", value: "good" },
  { label: "Fair (replace soon)", value: "fair" },
  { label: "Needs Replacing", value: "replace" },
];

export function AddEditSystem({
  isOpen,
  setIsOpen,
  systemType,
  system,
  faciltiyId,
  setReRender,
  mode,
}) {
  console.log(clazz, "systemType", system, mode);
  const [facImages, setFacImages] = useState();
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [validationErr, setValidationErr] = useState("");
  const [btnTitle, setBtnTitle] = useState("Save");
  const [inputs, setInputs] = useState({});
  const [condition, setCondition] = useState(system?.condition || []);
  const [sysType, setSysType] = useState(system?.sys_type);
  const [subSysType, setSubSysType] = useState(system?.sub_sys_type);
  const [types, setTypes] = useState([]);
  const [subtypes, setSubtypes] = useState([]);
  const sysData = useSystems();

  const { user, logOut } = useAuth();

  const handleSubmit = async (event) => {
    console.log(clazz, "inputs", inputs);
    event.preventDefault();
    try {
      const data = new FormData();
      data.append("fac_id", faciltiyId);
      data.append("sub_sys_type", subSysType);
      data.append("condition", condition);
      data.append("make", inputs.make);
      data.append("model", inputs.model);
      data.append("desc", inputs.desc);
      data.append("sys_type", sysType);
      data.append("added_by_id", user.id);
      data.append("name", inputs.name);
      data.append("sn", inputs.serial);

      if (mode != "edit") {
        images.forEach((image, index) => data.append("image", files[index]));
        const record = await pb.collection("subsys").create(data);
      } else {
        const record = await pb.collection("subsys").update(system.id, data);
      }

      localStorage.removeItem("subsys");
      clear();
      setIsOpen(false);
      await sysData.addSystem();
      setReRender("" + Math.random());
    } catch (error) {
      console.log("Error creating facility", error);
    }
  };

  const validateForm = (e) => {
    e.preventDefault();
    console.log(clazz, "fieldRules", fields);
    let valid = true;
    if (!fields.name.valid) {
      setValidationErr("Problem with Name field");
      return;
    }
    if (!fields.make.valid) {
      setValidationErr("Problem with Make field");
      return;
    }
    if (!fields.model.valid) {
      setValidationErr("Problem with Model field");
      return;
    }
    if (!fields.serial.valid) {
      setValidationErr("Problem with Serial field");
      return;
    }
    if (!fields.condition.valid) {
      setValidationErr("Problem with Condition field");
      return;
    }
    if (!fields.type.valid) {
      setValidationErr("Problem with Type field");
      return;
    }
    if (!fields.subtype.valid) {
      setValidationErr("Problem with Sub Type field");
      return;
    }
    if (!fields.desc.valid) {
      setValidationErr("Problem with Description field");
      return;
    }
    if (mode !== "edit" && !hasImages()) {
      setValidationErr("Problem with Image please update and resubmit");
      return;
    }

    handleSubmit(e);
  };

  const handleSystemTypeChange = (e) => {
    const name = e.target.options[e.target.selectedIndex].value;
    const id = e.target.id;
    const fieldRules = fields[id];
    fieldRules.valid = false;
    if (name === "none") {
      setValidationErr("Please Select Type");
    } else {
      const type = types.find((element) => element.name === name);
      setSubtypes(type.sublist);
      fieldRules.valid = true;
    }
  };

  const handleSubSysTypeChange = (e) => {
    const name = e.target.options[e.target.selectedIndex].value;
    const id = e.target.id;
    const fieldRules = fields[id];
    fieldRules.valid = false;
    if (name === "none") {
      setValidationErr("Please Select Sub Type");
    } else {
      const type = types.find((element) => element.name === name);
      setSubSysType(name);
      fieldRules.valid = true;
    }
  };

  const handleConditionChange = (e) => {
    const name = e.target.options[e.target.selectedIndex].value;
    const id = e.target.id;
    const fieldRules = fields[id];
    fieldRules.valid = false;
    if (name === "none") {
      setValidationErr("Please Select Condition");
    } else {
      const type = types.find((element) => element.name === name);
      setCondition(name);
      fieldRules.valid = true;
    }
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    setFiles(files);
    const imagesArray = [];
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imagesArray.push(e.target.result);
        if (imagesArray.length === files.length) {
          setImages([...imagesArray]);
        }
      };
      reader.readAsDataURL(files[i]);
    }
  };

  const hasImages = () => {
    return images.length > 0 || facImages?.length > 0;
  };

  const handleBlur = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    const fieldRules = fields[id];
    let valid = true;
    let errMessge = "";
    if (fieldRules.type === "string") {
      if (fieldRules.required && (value === "undefined" || value === "")) {
        valid = false;
        errMessge = fieldRules.missing;
      } else valid = true;
      if (valid && value.length < fieldRules.minLen) {
        valid = false;
        errMessge = fieldRules.lenErr;
      } else valid = true;
    } else if (fieldRules.type === "number") {
      if (value === "undefined" || value === "") {
        valid = false;
        errMessge = fieldRules.missing;
      } else if (isNaN(value)) {
        valid = false;
        errMessge = fieldRules.typeErr;
      } else valid = true;
    }
    fieldRules.valid = valid;
    fieldRules.value = value;
    setValidationErr(errMessge);
  };

  const removeImage = (index) => {
    let imgs = [];
    let fls = [];
    images.forEach((img, cnt) => {
      if (index != cnt) {
        imgs.push(img);
        fls.push(files[cnt]);
      }
    });
    setFiles(fls);
    setImages(imgs);
  };

  const removeFacImage = async (index) => {
    try {
      await pb.collection("facility").update(facility.id, {
        "image-": [facility.image[index]],
      });
    } catch (error) {
      console.log("Error deleting image");
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const clear = () => {
    setImages([]);
    setFiles([]);
    setCondition("");
    setFacImages([]);
    setInputs({});
    setSubSysType([]);
    setTypes([]);
  };

  const load = () => {
    let types = [];
    types.push({ name: "Select System Type", value: "none" });

    systemMenuItems.forEach((type, index) => {
      const sublist = type.sublist;
      let slist = [];
      if (systemType === type.title) {
        slist = loadSubtypes(type.sublist);
        setSubtypes(slist);
      }
      types.push({
        name: type.title,
        value: type.title,
        sublist: loadSubtypes(type.sublist),
      });
    });

    setTypes(types);
    fields.type.valid = true;
    setSysType(systemType);
    if (mode != "new") setBtnTitle(mode === "copy" ? "Create Copy" : "Update");

    if (mode != "new") {
      loadInputs();
      if (mode === "edit") fields.name.valid = true;
      fields.desc.valid = true;
      fields.make.valid = true;
      fields.model.valid = true;
      fields.serial.valid = true;
      fields.condition.valid = true;
      fields.type.valid = true;
      fields.subtype.valid = true;
    }
  };

  const loadInputs = () => {
    const sysObj = {
      make: system.make,
      model: system.model,
      name: system.name,
      sn: system.sn,
      desc: system.desc,
    };
    setInputs(sysObj);
  };

  const loadSubtypes = (list) => {
    console.log(clazz, "list", list);
    let types = [];
    types.push({ name: "Select Sub-Type", value: "none" });
    list.forEach((type) => {
      types.push({ name: type.title, value: type.title });
    });

    return types;
  };

  useEffect(() => {
    if (system) {
      console.log(clazz, "loading");
      setCondition(system.condition);
      setSysType(system.sys_type);
      setSubSysType(system.sub_sys_type);
    }
    load();
  }, [isOpen]);

  return (
    <>
      {isOpen ? (
        <>
          <div className="p-5 mt justify-center drop-shadow-2xl items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none -mt-40">
            <div className="relative h-1/2 my-4 mx-auto w-1/3">
              <div className=" border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="bg-slate-100  flex  p-3 border-b border-solid border-blueGray-200 rounded-t ">
                  <h3 className="bg-slate-100 text-1xl font-semibold bg-sky-100">
                    Add {systemType} System
                  </h3>
                  {validationErr && (
                    <div className="ml-5 text-red-400">{validationErr}</div>
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
                  onSubmit={validateForm}
                  enctype="multipart/form-data"
                  className="p-5"
                >
                  <div className="sm:col-span-1 p-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder={"System Name"}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        defaultValue={mode === "edit" ? system?.name : ""}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 w-full">
                    <div className="p-2">
                      <label
                        htmlFor="type"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        System Type
                      </label>
                      <div className="mt-2 col-span-full w-full">
                        <select
                          id="type"
                          name="type"
                          onChange={handleSystemTypeChange}
                          onBlur={handleBlur}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                          {types.map((type) =>
                            type?.value === systemType ? (
                              <option selected value={type.value}>
                                {type.name}
                              </option>
                            ) : (
                              <option value={type.value}>{type.name}</option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                    <div className="p-2">
                      <label
                        htmlFor="subtype"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        SubSystem Type
                      </label>
                      <div className="mt-2 col-span-full w-full">
                        <select
                          id="subtype"
                          name="subtype"
                          onChange={handleSubSysTypeChange}
                          onBlur={handleBlur}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                          {subtypes?.map((type) =>
                            type.value === system?.sub_sys_type ? (
                              <option selected value={type.value}>
                                {type.name}
                              </option>
                            ) : (
                              <option value={type.value}>{type.name}</option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                    <div className="p-2">
                      <label
                        htmlFor="condition"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Condition
                      </label>
                      <div className="mt-2 col-span-full w-full">
                        <select
                          id="condition"
                          name="condition"
                          onChange={handleConditionChange}
                          onBlur={handleBlur}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                          {conditions.map((cond) =>
                            cond.value === system?.condition ? (
                              <option selected value={cond.value}>
                                {cond.label}
                              </option>
                            ) : (
                              <option value={cond.value}>{cond.label}</option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                    <div className="sm:col-span-1 p-2">
                      <label
                        htmlFor="make"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Make
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="make"
                          id="make"
                          placeholder={"Make"}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          defaultValue={system?.make}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-1 p-2">
                      <label
                        htmlFor="model"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Model
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="model"
                          id="model"
                          placeholder={"Model"}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          defaultValue={system?.model}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-1 p-2">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Serial Number
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="serial"
                          id="serial"
                          placeholder={"Serial #"}
                          autoComplete="given-name"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          defaultValue={system?.sn}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="p-2">
                      <div className="col-span-full">
                        <label
                          htmlFor="desc"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Facility Description
                        </label>
                        <div className="mt-2">
                          <textarea
                            id="desc"
                            name="desc"
                            rows={4}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="Description"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            defaultValue={system?.desc}
                          />
                        </div>
                        <p className="mt-3 text-sm leading-6 text-gray-600">
                          Write a few sentences about the system.
                        </p>
                      </div>
                    </div>
                    <div className="p-2">
                      <div className="col-span-full">
                        <label
                          htmlFor="cover-photo"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Images
                        </label>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-5">
                          <div className="col-span-full text-center">
                            <div className="grid grid-cols-5">
                              {images.map((image, index) => (
                                <div>
                                  <img
                                    key={index}
                                    src={image}
                                    alt={`Image ${index}`}
                                    className="h-20 w-20 rounded"
                                  />
                                  <div
                                    onClick={() => removeImage(index)}
                                    className="opacity-50 text-center text-black cursor-pointer focus:outline-none"
                                  >
                                    x
                                  </div>
                                </div>
                              ))}
                              {facImages?.map((image, index) => (
                                <div>
                                  <img
                                    key={index}
                                    src={pb.files.getUrl(
                                      system,
                                      system.image[index],
                                      { thumb: "100x250" }
                                    )}
                                    alt={`Image ${index}`}
                                    className="h-20 w-20 rounded"
                                  />
                                  <div
                                    onClick={() => removeFacImage(index)}
                                    className="opacity-50 text-center text-black cursor-pointer focus:outline-none"
                                  >
                                    x
                                  </div>
                                </div>
                              ))}
                            </div>
                            {!hasImages() && (
                              <PhotoIcon
                                className="mx-auto h-12 w-12 text-gray-300"
                                aria-hidden="true"
                              />
                            )}

                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                              >
                                <span>Upload Image Files</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  multiple
                                  type="file"
                                  onChange={handleImageChange}
                                  className="sr-only"
                                />
                              </label>
                              <p className="pl-1">(PNG, JPG, GIF up to 10MB)</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="rounded-lg text-white bg-pmp_secondary background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="submit"
                    >
                      {btnTitle}
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
