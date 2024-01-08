import moment from 'moment';

const PrintContent = (billData, branchData, isShowSecondPage = true) => {
  const date = moment(billData.date || new Date()).format('DD/MM/yyyy');
  /*new Date(billData?.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });*/
  const time = moment(billData.date || new Date()).format('hh:mm:ss A');
  /*new Date(billData?.date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });*/

  return `
  <html>
    <head>
      <title>G${billData.billNo}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
      <style>
        *{
          font-family: 'Poppins', sans-serif;
         font-weight: bold;
        }
        @media print {
          @page {
            size: ${billData.detail.length < 4 ? "120mm " : "140mm"};
          }
        }
      </style>
    </head>
    <body>
      <div style="padding: 0mm; margin: 0 auto; width: 88mm;">

          <div style="page-break-after: always; border: 0px solid black; min-height: max-content;">
            <p style="text-transform: capitalize;font-size: 20px; font-weight: 600; margin: 0px;text-align: center; margin-bottom: 0px">${
              branchData.title
            }</p>
            <p style="text-transform: capitalize; font-size: 12px; margin: 0px; text-align: center;">
              ${branchData.address}
            </p>
            <div style="display: flex; justify-content: space-between;margin-top: 7px;">
              <div>
                <p style="text-align: start; margin: 0px; font-size: 14px;">Ph :${
                  branchData.phone1
                }, ${branchData.phone2}  </p>
                <p style="text-align: start; margin: 0px; font-size: 14px;">Bill No :${
                  billData.billNo
                }</p>
              </div>
              <div>
                <p style="text-align: start; margin: 0px; font-size: 14px;">Date :${date}</p>
                <p style="text-align: start; margin: 0px; font-size: 14px;">Time :${time}</p>
              </div>
            </div>
            <div style="width: 100%;display: flex;justify-content: space-between;margin-top: 7px;">
              <div>
                <p style="text-align: start; margin: 0px; font-size: 14px;">Name :${
                  billData.customer
                }</p>
                <p style="text-align: start; margin: 0px; font-size: 14px;">Ph :${
                  billData.phone
                }</p>
              </div>
              ${billData.isShowGst ?
                `<div>
                  <p style="text-align: start; margin: 0px; font-size: 14px;">Gst: <br/>${billData.gstNo}</p>
                </div>`
              : ''}
            </div>
            <div style="width: 100%; border-top: 1px dashed black;margin: 0;margin-top: 7px;"></div>
            <table style="width: 100%;">
              <thead>
                <tr style="text-align:center;font-size: 14px;border: 1px solid black;">
                  <td>SR</td>
                  <td>Item Name</td>
                  <td>Qty</td>
                  <td>Rate</td>
                  <td>Value</td>
                </tr>
              </thead>
              <tbody>
                ${billData.detail?.map(
                  (row, index) =>
                    `<tr style="text-align:center;font-size: 14px;">
                      <td>${index + 1}</td>
                      <td>${row.item}</td>
                      <td>${row.quantity}</td>
                      <td>${row.rate}</td>
                      <td>${row.total}</td>
                    </tr>`
                )}
              </tbody>
            </table>
            <div style="width: 100%; border-top: 1px dashed black;border-bottom: 1px dashed black; display: flex; justify-content: end;font-size: 14px;">
              <p style="margin: 5px 0px; margin-right: 10px; font-weight: 600;">Sub Total : </p>
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
            <div style="width: 100%;border-bottom: 1px dashed black; display: flex; justify-content: start; flex-direction: column; font-size: 14px;">
              <div>
                ${
                  billData.payment.toLowerCase().includes("card")
                    ? `<p style={{margin: "5px 0px"}}> CARD NO : ${billData.cardNo}</p>`
                    : ""
                }
              </div>
              <div style="display: flex;">
                <p style="margin: 5px 0px; ">${billData.payment}: </p>
                <p style="margin: 5px 0px; margin-left: 10px;">${
                  billData.total
                }</p>
              </div>
            </div>
            <p style="text-align: center; margin: 0;font-size: 12px;margin-top: 7px;">
              * AFTER PAID AMOUNT CANNOT BE REFUND
            </p>
            <p style="text-align: center; margin: 0;font-size: 12px;">Thank You.... Visit Again....</p>
          </div>
          ${isShowSecondPage ?
            `<div style="height: max-content; border: 0px solid black;">
              <table style="font-size: 20px;">
                <tbody>
                  <tr>
                    <td style="padding: 10px 0;">Date</td>
                    <td style="padding: 0px 18px;">:</td>
                    <td>${date}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;">Time</td>
                    <td style="padding: 0px 18px;">:</td>
                    <td>${time}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;">Customer</td>
                    <td style="padding: 0px 18px;">:</td>
                    <td>${billData.customer}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;">Room No</td>
                    <td style="padding: 0px 18px;">:</td>
                    <td>${billData.roomNo}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;">Service Name</td>
                    <td style="padding: 0px 18px;">:</td>
                    <td>${billData.detail
                      ?.map((row, index) => row.item)
                      .join(", ")}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;">Therapists Name</td>
                    <td style="padding: 0px 18px;">:</td>
                    <td>${billData.staff}</td>
                  </tr>
                </tbody>
              </table>
            </div>`
          : ''}
      </div>
    </body>
  </html>
  `;
};

export default PrintContent;
