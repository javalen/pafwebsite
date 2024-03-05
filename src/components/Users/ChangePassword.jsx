import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import pb from "../../api/pocketbase";

const clazz = "ChangePassword";
const fields = {
  password: {
    value: "",
    initialValue: "",
    missing: "Password is required",
    minLen: 5,
    lenErr: "Password is short",
    valid: false,
    required: true,
    type: "string",
  },
  conf_pass: {
    value: "",
    initialValue: "",
    missing: "Confirm Password is required",
    minLen: 5,
    lenErr: "Confirm Password is short",
    valid: false,
    required: true,
    type: "string",
  },
};

export default function ChangePassword({ open, setOpen, user }) {
  const cancelButtonRef = useRef(null);
  const [inputs, setInputs] = useState({});
  const [validationErr, setValidationErr] = useState("");

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
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

    if (id === "conf_pass" && value !== inputs.password)
      errMessge = "Passwords do not match!";
    setValidationErr(errMessge);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        password: inputs.conf_pass,
        passwordConfirm: inputs.password,
        //.oldPassword: user.password,
      };

      const record = await pb.collection("users").update(user.id, data);
      console.log(clazz, "record", record);
      setOpen(false);
    } catch (error) {
      console.log("Error updating passowrd", error);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <LockClosedIcon
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      {validationErr && (
                        <div className="text-red-400">{validationErr}</div>
                      )}
                      Change Password for {user.name} ?
                    </Dialog.Title>
                    <div className="mt-2">
                      <form
                        onSubmit={handleSubmit}
                        enctype="multipart/form-data"
                        className="p-5"
                      >
                        {/* Row 1 */}
                        <div className="grid w-full">
                          {/* Facility name */}
                          <div className="sm:col-span-1 p-2">
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Password
                            </label>
                            <div className="mt-2">
                              <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder={"password"}
                                autoComplete="given-name"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                onBlur={handleBlur}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          {/* Facility Division */}
                          <div className="sm:col-span-1 p-2">
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Comfirm Password
                            </label>
                            <div className="mt-2">
                              <input
                                type="password"
                                name="conf_pass"
                                id="conf_pass"
                                placeholder={"password"}
                                autoComplete="given-name"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                onBlur={handleBlur}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    onClick={handleSubmit}
                  >
                    Update Password
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
