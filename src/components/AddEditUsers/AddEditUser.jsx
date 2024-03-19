import React, { useEffect, useState } from "react";
import pb from "../../api/pocketbase";
import usePersonnel from "../../data/users";
import userImage from "../../assets/user.png";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";

const clazz = "AddEditUser";
const tempPassword = "12345";
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
  email: {
    value: "",
    initialValue: "Name",
    missing: "Email is required",
    minLen: 5,
    lenErr: "Email is too short",
    valid: false,
    required: true,
    type: "string",
  },
  phone: {
    value: "",
    initialValue: "Name",
    missing: "Phone is required",
    minLen: 5,
    lenErr: "Phone is too short",
    valid: false,
    required: true,
    type: "string",
  },
  role: {
    value: "",
    initialValue: "Name",
    missing: "Role # is required",
    minLen: 1,
    lenErr: "Role # is too short",
    valid: false,
    required: true,
    type: "string",
  },
};

const roles = [
  { label: "Select Role", value: "none" },
  { label: "Manager", value: "manager" },
  { label: "Cheif Eng.", value: "cheng" },
  { label: "Maintenance Team", value: "mm" },
  { label: "Reviewer", value: "view" },
];

export function AddEditUser({
  isOpen,
  setIsOpen,
  faciltiyId,
  setReRender,
  user,
  mode,
}) {
  const [validationErr, setValidationErr] = useState("");
  const [btnTitle, setBtnTitle] = useState("Save");
  const [inputs, setInputs] = useState({});
  const [role, setRole] = useState();
  const userData = usePersonnel();
  const [facImages, setFacImages] = useState([]);
  const [images, setImages] = useState([userImage]);
  const [files, setFiles] = useState([]);

  const handleSubmit = async (event) => {
    console.log(clazz, "inputs", inputs);
    event.preventDefault();
    try {
      const data = new FormData();
      data.append("email", inputs.email);
      data.append("name", inputs.name);
      data.append("phone", inputs.phone);
      data.append("password", tempPassword);

      await assignPerson(inputs, role);

      localStorage.removeItem("users");
      userData.getAllUsersFromDb();
      setReRender("" + Math.random());
      setIsOpen(false);
    } catch (error) {
      console.log("Error creating facility", error);
    }
  };

  const checkIfUserExist = async (email) => {
    try {
      const record = await pb.collection("users").getList(1, 50, {
        filter: 'email="' + email + '"',
      });
      return record.items[0];
    } catch (error) {
      setLoading(false);
      return null;
    }
  };

  const assignPerson = async (userInfo, facility) => {
    let user = await checkIfUserExist(userInfo.email);
    try {
      if (typeof user === "undefined") {
        const data = new FormData();
        data.append("email", inputs.email);
        data.append("name", inputs.name);
        data.append("phone", inputs.phone);
        data.append("password", tempPassword);
        data.append("passwordConfirm", tempPassword);
        data.append("emailVisibility", true);
        console.log(clazz, "Files", files);
        images.forEach((image, index) => data.append("image", files[index]));

        user = await pb.collection("users").create(data);
      }

      const newPersonel = await pb.collection("personel").create({
        fac_id: faciltiyId,
        user_id: user.id,
        full_name: user.name,
        role: role,
        user: user.id,
      });
    } catch (error) {
      console.log(clazz, "Error Creating user", error);
      setLoading(false);
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
    if (!fields.email.valid) {
      setValidationErr("Problem with Email field");
      return;
    }
    if (!fields.phone.valid) {
      setValidationErr("Problem with Phone field");
      return;
    }
    if (!fields.role.valid) {
      setValidationErr("Problem with Role field");
      return;
    }

    if (!hasImages()) {
      setValidationErr("An image is required");
      return;
    }

    handleSubmit(e);
  };

  const handleRoleChange = (e) => {
    const name = e.target.options[e.target.selectedIndex].value;
    const id = e.target.id;
    const fieldRules = fields[id];
    fieldRules.valid = false;
    if (name === "none") {
      setValidationErr("Please Select a Role");
    } else {
      const type = roles.find((element) => element.name === name);
      setRole(name);
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
      await pb.collection("facility").update(faciltiyId, {
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
    setImages([userImage]);

    setRole("");
    setFacImages([]);
    setInputs({});
  };

  const load = async () => {
    await createFile("../../assets/user.png", "iAmAFile.png", "image/png").then(
      (file) => {
        //do something with ur file.
        console.log(clazz, "IMG", file);
        setFiles([file]);
      }
    );

    setImages([userImage]);
  };

  const createFile = async (path, name, type) => {
    let response = await fetch(path);
    let data = await response.blob();
    let metadata = {
      type: type,
    };
    return new File([data], name, metadata);
  };

  const loadInputs = () => {
    // const sysObj = {
    //   make: system.make,
    //   model: system.model,
    //   name: system.name,
    //   sn: system.sn,
    //   desc: system.desc,
    // };
    // setInputs(sysObj);
  };

  useEffect(() => {
    load();
  }, [isOpen]);

  return (
    <>
      {isOpen ? (
        <>
          <div className="p-5 mt justify-center drop-shadow-2xl items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none -mt-40">
            <div className="relative h-1/2 my-4 mx-auto w-1/4">
              <div className=" border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="bg-slate-100  flex  p-3 border-b border-solid border-blueGray-200 rounded-t ">
                  <h3 className="bg-slate-100 text-1xl font-semibold bg-sky-100">
                    Add User
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
                                    facility,
                                    facility.image[index],
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
                              <span>Upload Image</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                multiple
                                type="file"
                                onChange={handleImageChange}
                                className="sr-only"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                        //defaultValue={mode === "edit" ? system?.name : ""}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-1 p-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email
                    </label>
                    <div className="mt-2">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder={"Email"}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        defaultValue={mode === "edit" ? user?.name : ""}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-1 p-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Phone Number
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        placeholder={"Phone Number"}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        defaultValue={mode === "edit" ? user?.phone : ""}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 w-full">
                    <div className="p-2">
                      <label
                        htmlFor="role"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Role
                      </label>
                      <div className="mt-2 col-span-full w-full">
                        <select
                          id="role"
                          name="role"
                          onChange={handleRoleChange}
                          onBlur={handleBlur}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                          {roles.map((role) =>
                            role.value === user?.role ? (
                              <option selected value={role.value}>
                                {role.label}
                              </option>
                            ) : (
                              <option value={role.value}>{role.label}</option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2"></div>
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
