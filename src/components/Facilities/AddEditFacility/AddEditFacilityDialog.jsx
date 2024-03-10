import React, { useEffect, useState } from "react";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import pb from "../../../api/pocketbase";
import useAuth from "../../../auth/useAuth";
import useDivisions from "../../../data/divisions";
import useFacility from "../../../data/facility";

const clazz = "AddEditFacilityDialog";

const facTypes = [
  { label: "Select Facility Type", value: "" },
  { label: "Residential", value: "Residential" },
  { label: "Commercial", value: "Commercial" },
  { label: "Residential/Commercial", value: "Residential/Commercial" },
];

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
  address: {
    value: "",
    initialValue: "Name",
    missing: "Address is required",
    minLen: 5,
    lenErr: "Address is too short",
    valid: false,
    required: true,
    type: "string",
  },
  city: {
    value: "",
    initialValue: "Name",
    missing: "City is required",
    minLen: 5,
    lenErr: "City is too short",
    valid: false,
    required: true,
    type: "string",
  },
  state: {
    value: "",
    initialValue: "Name",
    missing: "State is too required",
    minLen: 1,
    valid: false,
    required: true,
    type: "string",
  },
  zipcode: {
    value: "",
    initialValue: "Name",
    missing: "Zipcode is required",
    minLen: 5,
    lenErr: "Zipcode is too short",
    valid: false,
    required: true,
    type: "string",
  },
  fac_type: {
    value: "",
    initialValue: "Name",
    missing: "Facility Type is required",
    minLen: 5,
    valid: false,
    required: true,
    type: "string",
  },
  numOfUnits: {
    value: "",
    initialValue: "Name",
    missing: "Number of Units is required",
    minLen: 1,
    valid: false,
    required: true,
    type: "number",
    typeErr: "Number of Units must be a number",
  },
  division: {
    value: "",
    initialValue: "Name",
    missing: "Division is required",
    minLen: 5,
    valid: false,
    type: "string",
    required: true,
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

const states = [
  {
    label: "Select State",
    value: "",
  },
  {
    label: "Alabama",
    value: "AL",
  },
  {
    label: "Alaska",
    value: "AK",
  },
  {
    label: "American Samoa",
    value: "AS",
  },
  {
    label: "Arizona",
    value: "AZ",
  },
  {
    label: "Arkansas",
    value: "AR",
  },
  {
    label: "California",
    value: "CA",
  },
  {
    label: "Colorado",
    value: "CO",
  },
  {
    label: "Connecticut",
    value: "CT",
  },
  {
    label: "Delaware",
    value: "DE",
  },
  {
    label: "District Of Columbia",
    value: "DC",
  },
  {
    label: "Federated States Of Micronesia",
    value: "FM",
  },
  {
    label: "Florida",
    value: "FL",
  },
  {
    label: "Georgia",
    value: "GA",
  },
  {
    label: "Guam",
    value: "GU",
  },
  {
    label: "Hawaii",
    value: "HI",
  },
  {
    label: "Idaho",
    value: "ID",
  },
  {
    label: "Illinois",
    value: "IL",
  },
  {
    label: "Indiana",
    value: "IN",
  },
  {
    label: "Iowa",
    value: "IA",
  },
  {
    label: "Kansas",
    value: "KS",
  },
  {
    label: "Kentucky",
    value: "KY",
  },
  {
    label: "Louisiana",
    value: "LA",
  },
  {
    label: "Maine",
    value: "ME",
  },
  {
    label: "Marshall Islands",
    value: "MH",
  },
  {
    label: "Maryland",
    value: "MD",
  },
  {
    label: "Massachusetts",
    value: "MA",
  },
  {
    label: "Michigan",
    value: "MI",
  },
  {
    label: "Minnesota",
    value: "MN",
  },
  {
    label: "Mississippi",
    value: "MS",
  },
  {
    label: "Missouri",
    value: "MO",
  },
  {
    label: "Montana",
    value: "MT",
  },
  {
    label: "Nebraska",
    value: "NE",
  },
  {
    label: "Nevada",
    value: "NV",
  },
  {
    label: "New Hampshire",
    value: "NH",
  },
  {
    label: "New Jersey",
    value: "NJ",
  },
  {
    label: "New Mexico",
    value: "NM",
  },
  {
    label: "New York",
    value: "NY",
  },
  {
    label: "North Carolina",
    value: "NC",
  },
  {
    label: "North Dakota",
    value: "ND",
  },
  {
    label: "Northern Mariana Islands",
    value: "MP",
  },
  {
    label: "Ohio",
    value: "OH",
  },
  {
    label: "Oklahoma",
    value: "OK",
  },
  {
    label: "Oregon",
    value: "OR",
  },
  {
    label: "Palau",
    value: "PW",
  },
  {
    label: "Pennsylvania",
    value: "PA",
  },
  {
    label: "Puerto Rico",
    value: "PR",
  },
  {
    label: "Rhode Island",
    value: "RI",
  },
  {
    label: "South Carolina",
    value: "SC",
  },
  {
    label: "South Dakota",
    value: "SD",
  },
  {
    label: "Tennessee",
    value: "TN",
  },
  {
    label: "Texas",
    value: "TX",
  },
  {
    label: "Utah",
    value: "UT",
  },
  {
    label: "Vermont",
    value: "VT",
  },
  {
    label: "Virgin Islands",
    value: "VI",
  },
  {
    label: "Virginia",
    value: "VA",
  },
  {
    label: "Washington",
    value: "WA",
  },
  {
    label: "West Virginia",
    value: "WV",
  },
  {
    label: "Wisconsin",
    value: "WI",
  },
  {
    label: "Wyoming",
    value: "WY",
  },
];
export function AddEditFacilityDialog({
  isOpen,
  setIsOpen,
  facility,
  setReRender,
}) {
  const divData = useDivisions();
  const facilityData = useFacility();
  const [facImages, setFacImages] = useState(facility?.image);
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [divisionId, setDivisionId] = facility
    ? useState(facility.division)
    : useState("");
  const [divisionName, setDivisionName] = facility
    ? useState(facility.division_name)
    : useState("");
  const [facType, setFacType] = facility
    ? useState(facility.fac_type)
    : useState("");
  const [state, setState] = facility ? useState(facility.state) : useState("");
  const [validationErr, setValidationErr] = useState("");
  const [desc, setDesc] = facility
    ? useState(facility.description)
    : useState("");
  const [inputs, setInputs] = useState({});
  const { user, logOut } = useAuth();

  const handleSubmit = async (event) => {
    try {
      const data = new FormData();

      data.append("name", inputs.name);
      event.preventDefault();
      data.append("address", inputs.address);
      data.append("city", inputs.city);
      data.append("state", state);
      data.append("zipcode", inputs.zipcode);
      data.append("acct_mgr", user.id);
      data.append("fac_type", facType);
      data.append("num_of_units", inputs.numOfUnits);
      data.append("location", {});
      data.append("status", "good");
      data.append("added_by_id", user.id);
      data.append("division", divisionId);
      data.append("division_name", divisionName);
      data.append("description", desc);
      data.append("hide", true);

      images.forEach((image, index) => data.append("image", files[index]));
      let record = {};
      event.preventDefault();
      facility
        ? (record = await pb.collection("facility").update(facility.id, data))
        : (record = await pb.collection("facility").create(data));
      await facilityData.reloadAllFaciilities();

      clear();
      setIsOpen(false);
      setReRender("" + Math.random());
    } catch (error) {
      console.log("Error creating facility", error);
    }
  };

  const validateForm = (e) => {
    e.preventDefault();
    let valid = true;
    if (!fields.name.valid) {
      setValidationErr("Problem with Name field");
      return;
    }
    if (!fields.division.valid) {
      setValidationErr("Problem with Division field");
      return;
    }
    if (!fields.address.valid) {
      setValidationErr("Problem with Address field");
      return;
    }
    if (!fields.city.valid) {
      setValidationErr("Problem with City field");
      return;
    }
    if (!fields.state.valid) {
      setValidationErr("Problem with State field");
      return;
    }
    if (!fields.numOfUnits.valid) {
      setValidationErr("Problem with Number of Units field");
      return;
    }
    if (!fields.zipcode.valid) {
      setValidationErr("Problem with Zipcode field");
      return;
    }
    if (!fields.desc.valid) {
      setValidationErr("Problem with Description field");
      return;
    }
    if (!hasImages()) {
      setValidationErr("Problem with Image please update and resubmit");
      return;
    }

    handleSubmit(e);
  };

  const clear = () => {
    setDesc("");
    setDivisionId("");
    setDivisionName("");
    setFacType("");
    setFiles([]);
    setImages([]);
    setInputs({});
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

  const handleDivChange = (event) => {
    setDivisionId(event.target.value);
    setDivisionName(
      event.target.options[event.target.options.selectedIndex].label
    );
  };

  const handleStateChange = (event) => {
    setState(event.target.value);
  };

  const handleFacTypeChange = (event) => {
    setFacType(event.target.value);
  };
  const handleDescChange = (event) => {
    setDesc(event.target.value);
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
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

  const loadDivisions = async () => {
    const divs = await divData.getLocalDivisions();
    divs.unshift({ name: "Select Division", id: "" });
    setDivisions(divs);

    if (facility) {
      setInputs((values) => ({ ...values, ["name"]: facility.name }));
      setInputs((values) => ({ ...values, ["address"]: facility.address }));
      setInputs((values) => ({ ...values, ["city"]: facility.city }));
      setInputs((values) => ({ ...values, ["zipcode"]: facility.zipcode }));
      setInputs((values) => ({
        ...values,
        ["numOfUnits"]: facility.num_of_units,
      }));
    }

    Object.entries(fields).forEach((field) => {
      field[1].valid = true;
    });
  };
  const load = async () => {
    loadDivisions();
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
                  <h3 className="text-1xl font-semibold">Add Facility</h3>
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
                    {/* Facility name */}
                    <div className="sm:col-span-1 p-2">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Facility name
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          placeholder={"Facility Name"}
                          autoComplete="given-name"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          defaultValue={facility?.name}
                        />
                      </div>
                    </div>
                    {/* Facility Division */}
                    <div className="p-2">
                      <label
                        htmlFor="division"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Division
                      </label>
                      <div className="mt-2 col-span-full w-full">
                        <select
                          id="division"
                          name="division"
                          autoComplete="division"
                          onChange={handleDivChange}
                          onBlur={handleBlur}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                          {divisions.map((div) =>
                            div.id === facility?.division ? (
                              <option selected value={div.id}>
                                {div.name}
                              </option>
                            ) : (
                              <option value={div.id}>{div.name}</option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                  {/* Row 2 */}
                  <div className=" border-gray-900/10 pb-5">
                    <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="grid grid-cols-3 col-span-full">
                        <div className="col-span-1">
                          <div className="pr-5">
                            <label
                              htmlFor="fac_type"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Facility Type
                            </label>
                            <div className="mt-2 col-span-full w-full">
                              <select
                                id="fac_type"
                                name="fac_type"
                                autoComplete="fac_type"
                                placeholder="Facility Type"
                                onChange={handleFacTypeChange}
                                onBlur={handleBlur}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              >
                                {facTypes.map((type) =>
                                  type.value === facility?.fac_type ? (
                                    <option selected value={type.value}>
                                      {type.label}
                                    </option>
                                  ) : (
                                    <option selected value={type.value}>
                                      {type.label}
                                    </option>
                                  )
                                )}
                              </select>
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
                              Number of Units
                            </label>
                            <div className="mt-2">
                              <input
                                type="text"
                                name="numOfUnits"
                                id="numOfUnits"
                                placeholder="Number Of Units"
                                autoComplete="numOfUnits"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                defaultValue={facility?.num_of_units}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="">
                          <label
                            htmlFor="address"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Street address
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="address"
                              id="address"
                              placeholder="Address"
                              autoComplete="address"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              defaultValue={facility?.address}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="sm:col-span-2 sm:col-start-1">
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          City
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="city"
                            id="city"
                            placeholder="City"
                            autoComplete="city"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            defaultValue={facility?.city}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          State
                        </label>
                        <div className="mt-2 col-span-full w-full">
                          <select
                            id="state"
                            name="state"
                            autoComplete="state"
                            placeholder="State"
                            onChange={handleStateChange}
                            onBlur={handleBlur}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          >
                            {states.map((st) =>
                              st.value === facility?.state ? (
                                <option selected value={st.value}>
                                  {st.label}
                                </option>
                              ) : (
                                <option value={st.value}>{st.label}</option>
                              )
                            )}
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="zipcode"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          ZIP / Postal code
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="zipcode"
                            id="zipcode"
                            autoComplete="zipcode"
                            placeholder="Zip Code"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            defaultValue={facility?.zipcode}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 w-full p-1">
                    {/* Description */}
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
                            onChange={handleDescChange}
                            onBlur={handleBlur}
                            defaultValue={facility?.description}
                          />
                        </div>
                        <p className="mt-3 text-sm leading-6 text-gray-600">
                          Write a few sentences about the faciliy.
                        </p>
                      </div>
                    </div>
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
