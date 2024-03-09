import { PaperClipIcon } from "@heroicons/react/20/solid";
//import { Carousel } from "react-responsive-carousel";
import { Carousel, IconButton } from "@material-tailwind/react";
import pb from "../../../api/pocketbase";
import { useEffect, useState } from "react";
import { AddEditFacilityDialog } from "../AddEditFacility/AddEditFacilityDialog";
import { Switch } from "@headlessui/react";
import ConfirmHideFacility from "./Dialogs/ConfirmHideFacility";
import useFacility from "../../../data/facility";
import ConfirmDeleteFacility from "./Dialogs/ConfirmDeleteFacility";
import { useNavigate } from "react-router-dom";
import routes from "../../../navigate/routes";

const clazz = "FacilityDetails";
export default function FacilityDetails({ facility }) {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [hide, setHide] = useState(facility.hide);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contDelete, setContDelete] = useState(false);
  const [cont, setCont] = useState(false);
  const [dummy, setDummy] = useState("");
  const facilityData = useFacility();
  const navigate = useNavigate();

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const hideMsg = hide
    ? "This facility is not shown in the mobile app. Toggle to have it show."
    : "This facility is currently shown in the mobile app. Toggle to hide it.";

  let class1 = hide
    ? "bg-red-500 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-00 focus:ring-offset-2"
    : "bg-pmp_primary relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-00 focus:ring-offset-2";

  let class2 = hide
    ? "translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
    : "translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out";

  const updateHideFacility = async () => {
    try {
      const data = {
        hide: !facility.hide,
      };

      const record = await pb.collection("facility").update(facility.id, data);
      await facilityData.reloadAllFaciilities();
      console.log(clazz, "record", record);
      setCont(false);
      await facilityData.setFacility(record);
      setHide(record.hide);
      //setDummy("" + Math.random());
    } catch (error) {
      console.log("Error updating show/hide facility", error);
    }
  };

  const deleteFacility = async () => {
    try {
      console.log(clazz, "Deleting Facility");
      navigate(routes.PROPERTIES);
    } catch (error) {
      console.log(clazz, "Error deleting Facility", error);
    }
  };

  const handleHideFacility = async () => {
    setShowConfirm(true);
  };

  const handleDeleteFacility = async () => {
    setOpenDeleteDialog(true);
    //setContDelete(true);
  };

  const load = async () => {
    setHide(facility.hide);
    console.log(clazz, "Loading ");
    if (cont) await updateHideFacility();
    if (contDelete) await deleteFacility();
  };

  useEffect(() => {
    load();
  }, [cont, facility, hide]);
  return (
    <div className="px-4">
      <div className="grid grid-cols-2">
        <div>
          <Carousel
            className="rounded-xl h-3/4 w-3/4"
            prevArrow={({ handlePrev }) => (
              <IconButton
                variant="text"
                color="white"
                size="lg"
                onClick={handlePrev}
                className="!absolute top-2/4 left-4 -translate-y-2/4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
              </IconButton>
            )}
            nextArrow={({ handleNext }) => (
              <IconButton
                variant="text"
                color="white"
                size="lg"
                onClick={handleNext}
                className="!absolute top-2/4 !right-4 -translate-y-2/4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </IconButton>
            )}
          >
            {facility.image.map((image, index) => (
              <img
                src={pb.files.getUrl(facility, facility.image[index])}
                alt="image 1"
                className="h-full w-full object-cover"
              />
            ))}
          </Carousel>
        </div>
        <div className="p-4">
          <dl className="grid grid-cols-1 sm:grid-cols-2">
            <div className="grid col-span-2">
              {" "}
              <Switch.Group as="div" className="flex items-center">
                <Switch
                  checked={facility.hide}
                  onChange={handleHideFacility}
                  className={`${class1}`}
                >
                  <span aria-hidden="true" className={`${class2}`} />
                </Switch>
                <Switch.Label as="span" className="grid col-span-3 ml-5 text-m">
                  <div className="grid col-span-2">
                    <span className="grid col-span-3 font-medium text-gray-700">
                      {hideMsg}
                    </span>
                  </div>
                </Switch.Label>
              </Switch.Group>
            </div>
            <div className="border-t border-gray-100 px-4 py-5 sm:col-span-2 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                About
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {facility.description}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-5 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Name
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {facility.name}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-5 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Address
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {facility.address}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-5 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                City
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {facility.city}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-5 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                State
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {facility.state}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-5 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Zipcode
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {facility.zipcode}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-5 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Division
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {facility.division_name}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="">
          <button
            type="button"
            className="mr-5 inline-flex items-center rounded-md bg-pmp_primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pmp_primary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            onClick={() => setOpenAddDialog(!openAddDialog)}
          >
            Edit Facility
          </button>
        </div>
        <div className="content-evenly">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-red-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            onClick={handleDeleteFacility}
          >
            Delete Facility
          </button>
        </div>
      </div>

      <AddEditFacilityDialog
        isOpen={openAddDialog}
        setIsOpen={setOpenAddDialog}
        facility={facility}
      />
      <ConfirmHideFacility
        open={showConfirm}
        setOpen={setShowConfirm}
        hide={hide}
        setContinue={setCont}
      />
      <ConfirmDeleteFacility
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        setContinue={setContDelete}
      />
    </div>
  );
}
