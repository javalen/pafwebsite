import { useEffect, useState } from "react";
import useCompliance from "../../../data/compliance";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import pb from "../../../api/pocketbase";
import { AddEditDoc } from "../AddEditDoc/AddEditDoc";

const clazz = "ComplianceDetails";

const complianceDocs = [
  { type: "UPS System", docs: [] },
  { type: "Reg 4/ STitle 19", docs: [] },
  { type: "Emergency Generator Permit", docs: [] },
  { type: "Boiler Permits", docs: [] },
  { type: "5 Year Fire Inspection", docs: [] },
];

const safeDocs = [
  { type: "Safety Inspection", docs: [] },
  { type: "Safety Calendar", docs: [] },
  { type: "Safety Meeting Sign in Sheets", docs: [] },
  { type: "Injury Reports", docs: [] },
];
export default function ComplianceDetails({ facility }) {
  const [compDocs, setCompDocs] = useState([]);
  const [safetyDocs, setSafetyDocs] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isCompliance, setIsCompliance] = useState(false);
  const [docType, setDocType] = useState("");
  const [loading, setLoading] = useState(false);
  const [dummy, setDummy] = useState("");
  const docData = useCompliance();

  const loadDocs = async () => {
    clearDocs();
    setLoading(true);
    try {
      complianceDocs.forEach(async (doc) => {
        doc.docs = await docData.getCompDocsByTypeAndFacId(
          facility.id,
          doc.type
        );
      });

      safeDocs.forEach(async (doc) => {
        doc.docs = await docData.getSafetyDocsByTypeAndFacId(
          facility.id,
          doc.type
        );
      });

      setCompDocs(complianceDocs);

      setSafetyDocs(safeDocs);

      //Required for refresh
      setDummy("done" + Math.random());
    } catch (error) {
      console.log("Error loading Documents", error);
    }
    setLoading(false);
  };

  const clearDocs = () => {
    complianceDocs.forEach((doc) => {
      doc.docs = [];
    });

    safeDocs.forEach((doc) => {
      doc.docs = [];
    });
  };

  const addNewDoc = (isCompliance, docType) => {
    setIsCompliance(isCompliance);
    setDocType(docType);
    setShowAddForm(true);
  };

  const load = async () => await loadDocs();

  useEffect(() => {
    load();
  }, [facility]);
  return (
    <>
      {loading ? (
        <div>Loading</div>
      ) : (
        <div className="px-4">
          <div className="">
            <dl className="grid grid-cols-1 sm:grid-cols-2">
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  About
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2 dark:text-white">
                  <p>
                    Compliance documentation for machinery and fire equipment is
                    crucial for property management companies to ensure the
                    safety and well-being of tenants, visitors, and assets
                    within their managed properties. First and foremost, such
                    documentation serves as a legal requirement to adhere to
                    local, national, and international regulations and standards
                    pertaining to building safety and fire prevention.
                  </p>
                  <br />
                  <p>
                    By meticulously maintaining compliance documentation,
                    property management companies demonstrate their commitment
                    to fulfilling their duty of care towards occupants and
                    stakeholders. It helps in mitigating risks associated with
                    accidents, injuries, or property damage caused by
                    malfunctioning machinery or inadequate fire safety measures.
                    Failure to comply with regulations could result in hefty
                    fines, legal liabilities, and reputational damage. Moreover,
                    having comprehensive compliance documentation streamlines
                    property management operations. It facilitates efficient
                    inspections, audits, and maintenance scheduling, ensuring
                    that machinery and fire equipment are regularly serviced,
                    inspected, and kept in optimal working condition.
                  </p>
                  <br />
                  <p>
                    This proactive approach minimizes downtime, prevents
                    unexpected failures, and enhances the overall reliability of
                    essential building systems. Ultimately, compliance
                    documentation not only safeguards lives and properties but
                    also enhances the overall reputation and trustworthiness of
                    property management companies, fostering a safer and more
                    secure environment for all stakeholders involved.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
          <div className="font-medium text-gray-600 text-sm text-center mt-8 mb-8 dark:text-white">
            Compliance Documents for {facility.name}
          </div>
          {complianceDocs.map((doc) => (
            <div key={doc.type} className="py-2">
              <div className="grid grid-cols-2">
                <div className="font-medium text-gray-600 text-sm dark:text-white">
                  {doc.type} {` (${doc?.docs?.length})`}
                </div>
                <div>
                  <a
                    className="font-xs text-xs text-indigo-600 hover:text-indigo-300 dark:text-white cursor-pointer"
                    onClick={() => addNewDoc(true, doc.type)}
                  >
                    {`Add New ${doc.type}`}
                  </a>
                </div>
              </div>
              <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <ul
                  role="list"
                  className="divide-y divide-gray-100 rounded-md border border-gray-200"
                >
                  {doc?.docs?.map((cDoc) => (
                    <li
                      key={cDoc.file}
                      className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
                    >
                      <div className="flex w-0 flex-1 items-center text-sm">
                        <div className="ml-4 flex min-w-0 flex-1 gap-1">
                          <span className="w-80 truncate text-sm text-gray-500 dark:text-white">
                            {cDoc.file}
                          </span>

                          <span className="w-30  text-sm text-gray-500 dark:text-white">
                            Effective Date:
                          </span>
                          <span className="w-40  text-sm text-gray-500 dark:text-white">
                            {new Date(cDoc.effective_date).toLocaleDateString()}
                          </span>
                          <span className="w-30  text-sm text-gray-500 dark:text-white">
                            Expiration Date:
                          </span>
                          <span className="w-40  text-sm text-gray-500 dark:text-white">
                            {new Date(cDoc.expire_date).toLocaleDateString()}
                          </span>
                          <span className="w-30  text-sm text-gray-500 dark:text-white">
                            Contact:
                          </span>
                          <span className="w-40  text-sm text-gray-500 dark:text-white">
                            {cDoc.contact_name}
                          </span>
                          <span className="w-30  text-sm text-gray-500 dark:text-white">
                            Contact #:
                          </span>
                          <span className="w-40  text-sm text-gray-500 dark:text-white">
                            {cDoc.contact_number}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 dark:text-white">
                        <a
                          href={pb.files.getUrl(cDoc, cDoc.file, {})}
                          className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-white"
                          target="downloasWin"
                        >
                          Download
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
          <div className="font-medium text-gray-600 text-sm text-center mt-14 dark:text-white">
            Safety Documents for {facility.name}
          </div>
          {safeDocs.map((doc) => (
            <div key={doc.type} className="py-5">
              <div className="grid grid-cols-2">
                <div className="font-medium text-gray-600 text-sm dark:text-white">
                  {doc.type} {` (${doc?.docs?.length})`}
                </div>
                <div>
                  <a
                    className="font-xs text-xs text-indigo-600 hover:text-indigo-300 dark:text-white cursor-pointer"
                    onClick={() => addNewDoc(false, doc.type)}
                  >
                    {`Add New ${doc.type}`}
                  </a>
                </div>
              </div>
              <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <ul
                  role="list"
                  className="divide-y divide-gray-100 rounded-md border border-gray-200"
                >
                  {doc.docs.map((cDoc) => (
                    <li
                      key={cDoc.file}
                      className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
                    >
                      <div className="flex w-0 flex-1 items-center text-sm">
                        <div className="ml-4 flex min-w-0 flex-1 gap-1">
                          <span className="w-80 truncate text-sm text-gray-500 dark:text-white">
                            {cDoc.file}
                          </span>
                          <span className="w-30 font-medium text-sm text-gray-500 dark:text-white">
                            Effective Date:
                          </span>
                          <span className="w-40  text-sm text-gray-500 dark:text-white">
                            {new Date(cDoc.effective_date).toLocaleDateString()}
                          </span>
                          <span className="w-30  text-sm text-gray-500 dark:text-white">
                            Expiration Date:
                          </span>
                          <span className="w-40  text-sm text-gray-500 dark:text-white">
                            {new Date(cDoc.expire_date).toLocaleDateString()}
                          </span>
                          <span className="w-30  text-sm text-gray-500 dark:text-white">
                            Contact:
                          </span>
                          <span className="w-40  text-sm text-gray-500 dark:text-white">
                            {cDoc.contact_name}
                          </span>
                          <span className="w-30  text-sm text-gray-500 dark:text-white">
                            Contact #:
                          </span>
                          <span className="w-40  text-sm text-gray-500 dark:text-white">
                            {cDoc.contact_number}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 dark:text-white">
                        <a
                          href={pb.files.getUrl(cDoc, cDoc.file, {})}
                          className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-white"
                          target="downloasWin"
                        >
                          Download
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </div>
      )}
      <AddEditDoc
        isOpen={showAddForm}
        isCompliance={isCompliance}
        docType={docType}
        setIsOpen={setShowAddForm}
        faciltiyId={facility.id}
        setDoc={isCompliance ? setCompDocs : setSafetyDocs}
        docs={isCompliance ? compDocs : safetyDocs}
      />
    </>
  );
}
