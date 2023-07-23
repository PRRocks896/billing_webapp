const PrintContent = ({ billData }) => {
  const date = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const time = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const contentToPrint = `
  <div style="width: 300px; padding: 12px; border: 1px solid black;">
    <p style="text-transform: capitalize;font-size: 24px;margin: 0px;">green health spa and saloon</p>
    <p style="text-transform: capitalize;font-size: 14px; text-align: center;margin: 0px; margin-top: 5px; ">NO, 52
        HUDA COLONY, MANIKONDA
        HYDERABAD, TELANGANA - 500089</p>
    <div style="width: 100%;display: flex; justify-content: space-between;margin-top: 7px;">
        <div>
            <p style="text-align: start; margin: 0px; font-size: 12px;">Ph :${
              billData.phone
            }</p>
            <p style="text-align: start; margin: 0px; font-size: 12px;">Bill No :${
              billData.billNo
            }</p>
        </div>
        <div>
            <p style="text-align: start; margin: 0px; font-size: 12px;">Date :${date}</p>
            <p style="text-align: start; margin: 0px; font-size: 12px;">Time :${time}</p>
        </div>
    </div>
    <div style="width: 100%;display: flex;margin-top: 7px;">
        <div>
            <p style="text-align: start; margin: 0px; font-size: 12px;">NAME :${
              billData.customer
            }</p>
            <p style="text-align: start; margin: 0px; font-size: 12px;">Ph :${
              billData.phone
            }</p>
        </div>
    </div>
    <table>
        <tbody>
            <div style="width: 100%; border-top: 1px dashed black;margin: 0;margin-top: 7px;""></div>
            <tr style=" text-align:center;font-size: 12px;border: 1px solid black;">
                <td style="padding:0px 14.3px;">s1</td>
                <td style="padding:0px 14.3px;">Item Name</td>
                <td style="padding:0px 14.3px;">Qty</td>
                <td style="padding:0px 14.3px;">Rate</td>
                <td style="padding:0px 14.3px;">Value</td>
                </tr>
                ${billData.detail.map((row, index) => {
                  return `<tr style="text-align:center;font-size: 12px;">
                  <td>${index + 1}</td>
                  <td>${row.item}</td>
                  <td>${row.quantity}</td>
                  <td>${row.rate}</td>
                  <td>${row.total}</td>
              </tr>`;
                })}
        </tbody>
    </table>
    <div
        style="width: 100%; border-top: 1px dashed black;border-bottom: 1px dashed black; display: flex; justify-content: end;font-size: 14px;">
        <p style="margin: 5px 0px; margin-right: 10px; font-weight: 600;">sub Total : </p>
        <p style="margin: 5px 0px; margin-right: 19px; font-weight: 600;">${
          billData.subTotal
        }</p>
    </div>
    <div style="width: 100%;border-bottom: 1px dashed black; display: flex; justify-content: end;font-size: 20px;">
        <p style="margin: 5px 0px; margin-right: 14px; font-weight: 600;">Total : </p>
        <p style="margin: 5px 0px; margin-right: 22px; font-weight: 600;">${
          billData.total
        }</p>
    </div>
    <div
        style="width: 100%;border-bottom: 1px dashed black; display: flex; justify-content: start; flex-direction: column; font-size: 12px;">
        <div>
          
          ${
            billData.payment.toLowerCase().includes("card")
              ? `<p style={{ margin: "5px 0px" }}> CARD NO : ${billData.cardNo}</p>`
              : ""
          }
        </div>
        <div style="display: flex;">
            <p style="margin: 5px 0px; ">${billData.payment} : </p>
            <p style="margin: 5px 0px; margin-left: 10px;"> ${
              billData.total
            }</p>
        </div>
    </div>
    <p style="text-align: center; margin: 0;font-size: 12px;margin-top: 7px;">
        * AFTER PAID AMOUNT CANNOT BE REFUND
    </p>
    <p style="text-align: center; margin: 0;font-size: 12px;">
    Thank You.... Visit Agin....
    
    </p>
    <br>
    <br>

    <div>
      <p style="text-align: start; margin: 0px; font-size: 12px; padding: 10px 0;">Date &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; : &nbsp; &nbsp;${date}</p>
      <p style="text-align: start; margin: 0px; font-size: 12px; padding: 10px 0;">Time &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;: &nbsp; &nbsp;${time}</p>
      <p style="text-align: start; margin: 0px; font-size: 12px; padding: 10px 0;">Customer &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;:&nbsp; &nbsp; ${
        billData.customer
      }</p>
      <p style="text-align: start; margin: 0px; font-size: 12px; padding: 10px 0;">Service Name &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;: &nbsp; &nbsp;  ${billData.detail
        .map((row, index) => row.item)
        .join(", ")}</p>
      <p style="text-align: start; margin: 0px; font-size: 12px; padding: 10px 0;">Therapists Name &nbsp; &nbsp; &nbsp; &nbsp;: &nbsp; &nbsp;${
        billData.staff
      }</p>
    </div>
  </div>
  `;

  return <div dangerouslySetInnerHTML={{ __html: contentToPrint }} />;
};

export default PrintContent;
