import { PaperClipIcon } from "@heroicons/react/20/solid";
//import { Carousel } from "react-responsive-carousel";
import { Carousel, IconButton } from "@material-tailwind/react";
import pb from "../../../api/pocketbase";

const clazz = "FacilityDetails";
export default function FacilityDetails({ facility }) {
  console.log(clazz, "Facility", facility);
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
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                About
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {facility.description}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Name
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {facility.name}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Address
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {facility.address}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                City
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {facility.city}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                State
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {facility.state}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Zipcode
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {facility.zipcode}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
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
    </div>
  );
}
