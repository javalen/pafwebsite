import React, { useEffect, useState } from "react";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import pb from "../../../api/pocketbase";

const clazz = "AddEditUserDialog";

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
  phone: {
    value: "",
    initialValue: "Phone Number",
    missing: "Phone Number is required",
    minLen: 5,
    lenErr: "Phone Number is too short",
    valid: false,
    required: true,
    type: "string",
  },
  image: {
    value: "",
    initialValue: "Name",
    missing: "Image is required",
    minLen: 1,
    valid: false,
    required: false,
    type: "image",
  },
};

export function AddEditUserDialog({ isOpen, setIsOpen, user }) {
  const [avatar, setAvatar] = useState(user?.avatar);
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [validationErr, setValidationErr] = useState("");
  const [inputs, setInputs] = useState({});

  const handleSubmit = async (event) => {
    try {
      const data = new FormData();

      data.append("name", inputs.name);

      data.append("phone", inputs.address);

      images.forEach((image, index) => data.append("avatar", files[index]));
      let record = {};
      event.preventDefault();
      user
        ? (record = await pb.collection("users").update(user.id, data))
        : (record = await pb.collection("users").create(data));

      clear();
      setIsOpen(false);
      reRender("" + Math.random());
    } catch (error) {
      console.log("Error creating User", error);
    }
  };

  const validateForm = (e) => {
    e.preventDefault();
    let valid = true;
    console.log(clazz, fields);
    if (!fields.name.valid) {
      setValidationErr("Problem with Name field");
      return;
    }
    if (!fields.phone.valid) {
      setValidationErr("Problem with phone field");
      return;
    }

    console.log(clazz, "hasImage", hasImages());
    if (!hasImages()) {
      setValidationErr("Problem with Image please update and resubmit");
      return;
    }

    handleSubmit(e);
  };

  const clear = () => {};

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

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const hasImages = () => {
    console.log(clazz, "images lentch", images.length > 0 && avatar.length > 0);
    return images.length > 0 || avatar.length > 0;
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
    console.log(clazz, "removeImage", imgs, fls);
    setFiles(fls);
    setImages(imgs);
  };

  const removeFacImage = async (index) => {
    try {
      // await pb.collection("facility").update(facility.id, {
      //   "image-": [facility.image[index]],
      // });
    } catch (error) {
      console.log("Error deleting image");
    }
  };

  const load = async () => {
    if (user) {
      setInputs((values) => ({ ...values, ["name"]: user.name }));
      setInputs((values) => ({ ...values, ["phone"]: user.address }));
      Object.entries(fields).forEach((field) => {
        console.log(clazz, "field", field);
        field[1].valid = true;
      });
    }
  };

  useEffect(() => {
    load();
  }, [isOpen]);

  return (
    <>
      {isOpen ? (
        <>
          <div className="p-5 mt justify-center drop-shadow-2xl items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none -mt-40">
            <div className="relative h-1/2 my-4 mx-auto w-1/2">
              <div className=" border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-3 border-b border-solid border-blueGray-200 rounded-t space-x-6">
                  <h3 className="text-1xl font-semibold">Add/Edit User</h3>
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
                  onSubmit={validateForm}
                  enctype="multipart/form-data"
                  className="p-5"
                >
                  {/* Row 1 */}
                  <div className="grid grid-cols-2 w-full">
                    {/*  name */}
                    <div className="sm:col-span-1 p-2">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Full name
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          placeholder={"Full Name"}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          defaultValue={user?.name}
                        />
                      </div>
                    </div>
                    {/*  Division */}
                    <div className="sm:col-span-1 p-2">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Phone Nuber
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          name="phne"
                          id="phone"
                          placeholder={"Phone Number"}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          defaultValue={user?.phone}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Row 2 */}

                  <div className="grid grid-cols-2 w-full p-1">
                    {/*Images */}
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
                              {avatar.map((image, index) => (
                                <div>
                                  <img
                                    key={index}
                                    src={pb.files.getUrl(user, user.avatar, {
                                      thumb: "100x250",
                                    })}
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
          <div className="opacity-25 fixed inset-0 z-40 bg-pmp_secondary"></div>
        </>
      ) : null}
    </>
  );
}
