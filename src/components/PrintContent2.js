import React from "react";
import { Br, Printer, Row, Text } from "react-thermal-printer";

const PrintContent2 = ({ billData }) => {
  const receipt = (
    <Printer type="epson" width={42} debug={true}>
      <Text size={{ width: 3, height: 3 }} bold={true} align="center">
        green health spa and saloon
      </Text>
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
    </Printer>
  );

  return receipt;
};

export default PrintContent2;
