import React from "react";
import { Br, Printer, Row, Text, render } from "react-thermal-printer";

const PrintContent2 = ({ billData }) => {
  const receipt = (
    <Printer
      style={{ maxWidth: "320px", border: "1px solid black", padding: "15px" }}
      debug={false}
    >
      <Row
        left={""}
        center={<Text align="center">Green health spa and saloon</Text>}
        right={""}
      />

      <Text bold={true} align="center">
        NO, 52 HUDA COLONY, MANIKONDA HYDERABAD, TELANGANA - 500089
      </Text>

      <Br />
      <Row
        left={<Text>Ph : 9879854706</Text>}
        right={<Text>Date: 28/06/2023</Text>}
      />
      <Row
        left={<Text>Bill No: G0000005</Text>}
        right={<Text>Time: 07:01:21 AM</Text>}
      />

      <Br />
      <Text>Name: {billData.customer}</Text>
      <Text>Ph: {billData.phone}</Text>

      {/* <Row left={<Text>SR Item Name Qty Rate Value</Text>} /> */}
    </Printer>
  );
  const Uint8Array = render(receipt).then((response) => response);
  console.log(Uint8Array);
  return Uint8Array;
};

export default PrintContent2;
