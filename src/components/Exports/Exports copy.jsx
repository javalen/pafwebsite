import React, { useState, useEffect } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import useFacility from "../../data/facility";
import useAuth from "../../auth/useAuth";
import useDivisions from "../../data/divisions";
import pb from "../../api/pocketbase";
import {
  SheetDirective,
  SheetsDirective,
  SpreadsheetComponent,
  ColumnsDirective,
  ColumnDirective,
  RangesDirective,
  RangeDirective,
  RowsDirective,
  RowDirective,
  CellsDirective,
  CellDirective,
  getCell,
  getRangeIndexes,
} from "@syncfusion/ej2-react-spreadsheet";

const menuItems = [{ name: "All", value: "all" }];
const userMenuItems = [
  { name: "All", value: "all" },
  { name: "Managers", value: "manager" },
  { name: "Chief Engineers", value: "cheng" },
  { name: "Maintenace Crew", value: "mm" },
  { name: "Reviewer", value: "view" },
];

const Exports = () => {
  const auth = useAuth();
  const facilityData = useFacility();
  const divisionData = useDivisions();
  const [facList, setFacList] = useState(); //List of options for the facility dropdown
  const [userList, setUserList] = useState([
    { name: "Select Facility first", value: "none" }, // List of options for the user dropdown. No options until user selects a facility
  ]);
  const [selectedUser, setSelectedUser] = useState(); // The selected user
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(""); //
  const [facQuery, setFacQuery] = useState(""); //
  const [userQuery, setUserQuery] = useState(""); //
  const [sysQuery, setSysQuery] = useState(""); //
  const [exceptionQuery, setExceptionQuery] = useState(""); //
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedFac, setSelectedFac] = useState(null);
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [facilityImg, setFacilityImage] = useState([]);
  let ssObj = SpreadsheetComponent | null;

  const people = [
    { id: 1, name: "Leslie Alexander" },
    // More users...
  ];

  const loadFacList = async () => {
    setLoading(true);
    const divList = await divisionData.getDivisionNameAndId();
    console.log("Divs", divList);
    const newList = menuItems.concat(divList);
    const list = await facilityData.getFacilityNameAndId();

    setFacList(newList.concat(list));

    setLoading(false);
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const filteredFacs =
    query === ""
      ? facList
      : facList.filter((facility) => {
          return facility.name.toLowerCase().includes(facQuery.toLowerCase());
        });

  const filteredUsers =
    query === ""
      ? userList
      : userList.filter((user) => {
          return user.name.toLowerCase().includes(userQuery.toLowerCase());
        });

  const filteredPeople =
    query === ""
      ? people
      : people.filter((person) => {
          return person.name.toLowerCase().includes(query.toLowerCase());
        });

  useEffect(() => {
    auth.checkAuthentication();
    loadFacList();
  }, []);

  const getImageUrl = async (obj, image) => {
    try {
      const url = await pb.files.getUrl(obj, image, {
        thumb: "100x250",
      });
      return url;
    } catch (error) {
      console.log(error);
    }
  };

  const onFacilityChange = async (event) => {
    setLoading(true);
    console.log(event);
    setSelectedFac(event);
    let facilities = [];
    if (event.value === "all") {
      facilities = await facilityData.getLocalFacilities();
    }

    const facility = await facilityData.getFacility(event.value);

    const imgUrl = await getImageUrl(facility, facility.image[0]);

    setFacilityImage([
      { src: imgUrl, height: 350, width: 680, top: 92, left: 70 },
    ]);

    setData(facility);
    //const data = await orderFIelds([facility]);
    //console.log("Data", data);
    //setData(data[0]);

    setUserList(userMenuItems);
    newSheet();
    setLoading(false);
  };

  const newSheet = () => {
    let spreadsheet = ssObj;
    if (spreadsheet) {
      spreadsheet.insertSheet([
        {
          index: 1,
          name: "new_sheet",
          ranges: [
            {
              dataSource: employeeData,
              startCell: "A1",
            },
          ],
        },
      ]);
      // Use the timeout function to wait until the sheet is inserted.
      setTimeout(() => {
        // Method for switching to a new sheet.
        spreadsheet.goTo("new_sheet!A1");
      });
    }
  };

  const onUserChange = async (event) => {
    setLoading(true);
    console.log(event);
    setSelectedFac(event);
    console.log("", data);
    const facUsers = await facilityData.getFacilityUsers(data.id, event.value);
    const newUsers = [];
    facUsers.forEach(async (u) => {
      console.log("UserObj", u);
      const imgUrl = await getImageUrl(u.expand.user, u.expand.user.avatar);
      u.imgSrc = { src: imgUrl, height: 350, width: 680, top: 92, left: 70 };
      newUsers.push(u);
    });
    setUsers(newUsers);
    setLoading(false);
  };

  const orderFIelds = async (records) => {
    console.log("Records", records);
    let recs = [];
    records.forEach((rec) => {
      recs.push({
        name: rec.name,
        address: rec.address,
        city: rec.city,
        state: rec.state,
        zip: rec.zipcode,
        division: rec.division_name,
        type: rec.fac_type,
        numOfUnits: rec.num_of_units,
      });
    });
    return recs;
  };

  const onCreated = () => {
    if (!selectedFac) return;
    ssObj?.merge("B2:I2");

    ssObj?.cellFormat(
      {
        fontWeight: "bold",
        textAlign: "center",
        verticalAlign: "middle",
        backgroundColor: "#80c157",
        color: "#ffffff",
      },
      "B2"
    );
    ssObj?.cellFormat({ textAlign: "left" }, "D6");
    ssObj?.cellFormat({ textAlign: "left" }, "D9");
    ssObj?.setBorder({ border: "1px solid #0093d0" }, "B2:I20", "Outer");

    ssObj?.insertImage(facilityImg, "B3");
    console.log("Sheet", ssObj);
  };
  return (
    <>
      {loading ? (
        <div> Loading....</div>
      ) : (
        <>
          <div className="bg-white ">
            <div className="mx-auto px-3 lg:px-5">
              <div
                key={data.name}
                className="grid gap-x-8 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-4"
              >
                <Combobox
                  as="div"
                  value={selectedFac}
                  onChange={onFacilityChange}
                >
                  <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
                    Facilities
                  </Combobox.Label>
                  <div className="relative mt-2">
                    <Combobox.Input
                      className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      onChange={(event) => setFacQuery(event.target.value)}
                      displayValue={(facility) => facility?.name}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>

                    {filteredFacs.length > 0 && (
                      <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredFacs.map((facility) => (
                          <Combobox.Option
                            key={facility.value}
                            value={facility}
                            className={({ active }) =>
                              classNames(
                                "relative cursor-default select-none py-2 pl-3 pr-9",
                                active
                                  ? "bg-indigo-600 text-white"
                                  : "text-gray-900"
                              )
                            }
                          >
                            {({ active, selected }) => (
                              <>
                                <span
                                  className={classNames(
                                    "block truncate",
                                    selected && "font-semibold"
                                  )}
                                >
                                  {facility.name}
                                </span>

                                {selected && (
                                  <span
                                    className={classNames(
                                      "absolute inset-y-0 right-0 flex items-center pr-4",
                                      active ? "text-white" : "text-indigo-600"
                                    )}
                                  >
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                )}
                              </>
                            )}
                          </Combobox.Option>
                        ))}
                      </Combobox.Options>
                    )}
                  </div>
                </Combobox>
                <Combobox as="div" value={selectedUser} onChange={onUserChange}>
                  <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
                    Users
                  </Combobox.Label>
                  <div className="relative mt-2">
                    <Combobox.Input
                      className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      onChange={(event) => setUserQuery(event.target.value)}
                      displayValue={(person) => person?.name}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>

                    {filteredUsers.length > 0 && (
                      <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredUsers.map((user) => (
                          <Combobox.Option
                            key={user.value}
                            value={user}
                            className={({ active }) =>
                              classNames(
                                "relative cursor-default select-none py-2 pl-3 pr-9",
                                active
                                  ? "bg-indigo-600 text-white"
                                  : "text-gray-900"
                              )
                            }
                          >
                            {({ active, selected }) => (
                              <>
                                <span
                                  className={classNames(
                                    "block truncate",
                                    selected && "font-semibold"
                                  )}
                                >
                                  {user.name}
                                </span>

                                {selected && (
                                  <span
                                    className={classNames(
                                      "absolute inset-y-0 right-0 flex items-center pr-4",
                                      active ? "text-white" : "text-indigo-600"
                                    )}
                                  >
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                )}
                              </>
                            )}
                          </Combobox.Option>
                        ))}
                      </Combobox.Options>
                    )}
                  </div>
                </Combobox>
                <Combobox
                  as="div"
                  value={selectedPerson}
                  onChange={setSelectedPerson}
                >
                  <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
                    Systems
                  </Combobox.Label>
                  <div className="relative mt-2">
                    <Combobox.Input
                      className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      onChange={(event) => setSysQuery(event.target.value)}
                      displayValue={(person) => person?.name}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>

                    {filteredPeople.length > 0 && (
                      <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredPeople.map((person) => (
                          <Combobox.Option
                            key={person.id}
                            value={person}
                            className={({ active }) =>
                              classNames(
                                "relative cursor-default select-none py-2 pl-3 pr-9",
                                active
                                  ? "bg-indigo-600 text-white"
                                  : "text-gray-900"
                              )
                            }
                          >
                            {({ active, selected }) => (
                              <>
                                <span
                                  className={classNames(
                                    "block truncate",
                                    selected && "font-semibold"
                                  )}
                                >
                                  {person.name}
                                </span>

                                {selected && (
                                  <span
                                    className={classNames(
                                      "absolute inset-y-0 right-0 flex items-center pr-4",
                                      active ? "text-white" : "text-indigo-600"
                                    )}
                                  >
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                )}
                              </>
                            )}
                          </Combobox.Option>
                        ))}
                      </Combobox.Options>
                    )}
                  </div>
                </Combobox>
                <Combobox
                  as="div"
                  value={selectedPerson}
                  onChange={setSelectedPerson}
                >
                  <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
                    Exceptions
                  </Combobox.Label>
                  <div className="relative mt-2">
                    <Combobox.Input
                      className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      onChange={(event) =>
                        setExceptionQuery(event.target.value)
                      }
                      displayValue={(person) => person?.name}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>

                    {filteredPeople.length > 0 && (
                      <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredPeople.map((person) => (
                          <Combobox.Option
                            key={person.id}
                            value={person}
                            className={({ active }) =>
                              classNames(
                                "relative cursor-default select-none py-2 pl-3 pr-9",
                                active
                                  ? "bg-indigo-600 text-white"
                                  : "text-gray-900"
                              )
                            }
                          >
                            {({ active, selected }) => (
                              <>
                                <span
                                  className={classNames(
                                    "block truncate",
                                    selected && "font-semibold"
                                  )}
                                >
                                  {person.name}
                                </span>

                                {selected && (
                                  <span
                                    className={classNames(
                                      "absolute inset-y-0 right-0 flex items-center pr-4",
                                      active ? "text-white" : "text-indigo-600"
                                    )}
                                  >
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                )}
                              </>
                            )}
                          </Combobox.Option>
                        ))}
                      </Combobox.Options>
                    )}
                  </div>
                </Combobox>
              </div>
            </div>
          </div>
          <div className="App">
            <SpreadsheetComponent
              ref={(s) => (ssObj = s)}
              height={700}
              created={onCreated}
              allowImage={true}
              allowSave={true}
              saveUrl="http://localhost:5000/uploads"
            >
              {selectedFac && (
                <SheetsDirective>
                  <SheetDirective name={data.name} showGridLines={false}>
                    <RowsDirective>
                      <RowDirective index={1} height={50}>
                        <CellsDirective>
                          <CellDirective
                            index={1}
                            value={data.name}
                          ></CellDirective>
                        </CellsDirective>
                      </RowDirective>
                      <RowDirective height={40}>
                        <CellsDirective>
                          <CellDirective
                            index={2}
                            value="Address"
                          ></CellDirective>
                          <CellDirective value={data.address}></CellDirective>
                        </CellsDirective>
                      </RowDirective>
                      <RowDirective>
                        <CellsDirective>
                          <CellDirective index={2} value="City"></CellDirective>
                          <CellDirective value={data.city}></CellDirective>
                        </CellsDirective>
                      </RowDirective>
                      <RowDirective>
                        <CellsDirective>
                          <CellDirective
                            index={2}
                            value="State"
                          ></CellDirective>
                          <CellDirective value={data.state}></CellDirective>
                        </CellsDirective>
                      </RowDirective>
                      <RowDirective>
                        <CellsDirective>
                          <CellDirective
                            index={2}
                            value="Zipcode"
                          ></CellDirective>
                          <CellDirective value={data.zip}></CellDirective>
                        </CellsDirective>
                      </RowDirective>
                      <RowDirective>
                        <CellsDirective>
                          <CellDirective
                            index={2}
                            value="Division"
                          ></CellDirective>
                          <CellDirective value={data.division}></CellDirective>
                        </CellsDirective>
                      </RowDirective>
                      <RowDirective>
                        <CellsDirective>
                          <CellDirective
                            index={2}
                            value="Property Usage"
                          ></CellDirective>
                          <CellDirective value={data.type}></CellDirective>
                        </CellsDirective>
                      </RowDirective>
                      <RowDirective height={40}>
                        <CellsDirective>
                          <CellDirective
                            index={2}
                            value="Number of units"
                            style={{ verticalAlign: "top" }}
                          ></CellDirective>
                          <CellDirective
                            value={data.numOfUnits}
                            style={{ verticalAlign: "top" }}
                          ></CellDirective>
                        </CellsDirective>
                      </RowDirective>
                    </RowsDirective>
                    <ColumnsDirective>
                      <ColumnDirective width={60}></ColumnDirective>
                      <ColumnDirective width={780}></ColumnDirective>
                      <ColumnDirective width={172}></ColumnDirective>
                      <ColumnDirective width={160}></ColumnDirective>
                    </ColumnsDirective>
                  </SheetDirective>
                  <SheetDirective name="Facility Users" showGridLines={false}>
                    <RowsDirective>
                      <RowDirective index={1} height={50}>
                        <CellsDirective>
                          <CellDirective
                            index={1}
                            value={data.name}
                          ></CellDirective>
                        </CellsDirective>
                      </RowDirective>
                      <RowDirective height={40}>
                        <CellsDirective>
                          <CellDirective
                            index={2}
                            value="Address"
                          ></CellDirective>
                          <CellDirective value={data.address}></CellDirective>
                        </CellsDirective>
                      </RowDirective>
                      <RowDirective>
                        <CellsDirective>
                          <CellDirective index={2} value="City"></CellDirective>
                          <CellDirective value={data.city}></CellDirective>
                        </CellsDirective>
                      </RowDirective>
                      <RowDirective>
                        <CellsDirective>
                          <CellDirective
                            index={2}
                            value="State"
                          ></CellDirective>
                          <CellDirective value={data.state}></CellDirective>
                        </CellsDirective>
                      </RowDirective>
                      <RowDirective>
                        <CellsDirective>
                          <CellDirective
                            index={2}
                            value="Zipcode"
                          ></CellDirective>
                          <CellDirective value={data.zipcode}></CellDirective>
                        </CellsDirective>
                      </RowDirective>
                      <RowDirective>
                        <CellsDirective>
                          <CellDirective
                            index={2}
                            value="Division"
                          ></CellDirective>
                          <CellDirective
                            value={data.division_name}
                          ></CellDirective>
                        </CellsDirective>
                      </RowDirective>
                      <RowDirective>
                        <CellsDirective>
                          <CellDirective
                            index={2}
                            value="Property Usage"
                          ></CellDirective>
                          <CellDirective value={data.fac_type}></CellDirective>
                        </CellsDirective>
                      </RowDirective>
                      <RowDirective height={40}>
                        <CellsDirective>
                          <CellDirective
                            index={2}
                            value="Number of units"
                            style={{ verticalAlign: "top" }}
                          ></CellDirective>
                          <CellDirective
                            value={data.num_of_units}
                            style={{ verticalAlign: "top" }}
                          ></CellDirective>
                        </CellsDirective>
                      </RowDirective>
                    </RowsDirective>
                    <ColumnsDirective>
                      <ColumnDirective width={60}></ColumnDirective>
                      <ColumnDirective width={780}></ColumnDirective>
                      <ColumnDirective width={172}></ColumnDirective>
                      <ColumnDirective width={160}></ColumnDirective>
                    </ColumnsDirective>
                  </SheetDirective>
                </SheetsDirective>
              )}
            </SpreadsheetComponent>
          </div>
        </>
      )}
    </>
  );
};

export default Exports;
