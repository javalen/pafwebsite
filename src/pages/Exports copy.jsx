import React, { useEffect, useState } from "react";
import pb from "../api/pocketbase";
import {
  SpreadsheetComponent,
  SheetDirective,
  SheetsDirective,
  RangesDirective,
  RangeDirective,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-spreadsheet";

const Exportsa = () => {
  pb.autoCancellation(false);
  const [data, setData] = useState([]);

  const orderFIelds = async (records) => {
    let recs = [];
    records.forEach((rec) => {
      recs.push({
        name: rec.name,
        address: rec.address,
        city: rec.city,
        state: rec.state,
        zip: rec.zipcode,
        division: rec.division_name,
      });
    });
    return recs;
  };

  const getFacilityData = async () => {
    try {
      const records = await pb.collection("facility").getFullList({
        fields: "name, address,city,state,zipcode,division_name",
      });

      const data = await orderFIelds(records);
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFacilityData();
  }, []);

  return (
    <SpreadsheetComponent
      allowSave={true}
      saveUrl="http://localhost:5000/uploads"
    >
      <SheetsDirective>
        <SheetDirective>
          <RangesDirective>
            <RangeDirective dataSource={data}></RangeDirective>
          </RangesDirective>
          <ColumnsDirective>
            <ColumnDirective
              field="Name"
              width={250}
              headerText="Order ID"
            ></ColumnDirective>
            <ColumnDirective field="Address" width={200}></ColumnDirective>
            <ColumnDirective field="Cty" width={150}></ColumnDirective>
            <ColumnDirective field="State" width={70}></ColumnDirective>
            <ColumnDirective
              field="Zip"
              width={70}
              textAlign="Left"
            ></ColumnDirective>
            <ColumnDirective field="Division" width={200}></ColumnDirective>
          </ColumnsDirective>
        </SheetDirective>
      </SheetsDirective>
    </SpreadsheetComponent>
  );
};

export default Exportsa;
