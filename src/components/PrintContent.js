const PrintContent = (billData, branchData) => {
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

  return `
  <html>
    <head>
      <title>G${billData.billNo}</title>
      <style>
        @media print {
          @page {
            size: ${billData.detail.length < 4 ? "120mm " : "140mm"};
          }
        }
      </style>
    </head>
    <body>
      <div style="padding: 0mm; margin: 0 auto; width: 88mm;">
       
          <div style="page-break-after: always; height: 'auto';">
            <p style="text-transform: capitalize;font-size: 24px; font-weight: 600; margin: 0pxl;text-align: center;">${
              branchData.title
            }</p>
            <p style="text-transform: capitalize;font-size: 16px; margin: 2px 0px 0px 18px; text-align: center;">${
              branchData.address
            }</p>
            <div style="display: flex; justify-content: space-between;margin-top: 7px;">
              <div>
                <p style="text-align: start; margin: 0px; font-size: 12px;">Ph :${
                  branchData.phone1
                }, ${branchData.phone2}  </p>
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
                <p style="text-align: start; margin: 0px; font-size: 12px;">Name :${
                  billData.customer
                }</p>
                <p style="text-align: start; margin: 0px; font-size: 12px;">Ph :${
                  billData.phone
                }</p>
              </div>
            </div>
            <div style="width: 100%; border-top: 1px dashed black;margin: 0;margin-top: 7px;"></div>
            <table style="width: 100%;">
              <thead>
                <tr style="text-align:center;font-size: 12px;border: 1px solid black;">
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
                    `<tr style="text-align:center;font-size: 12px;">
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
            <div style="width: 100%;border-bottom: 1px dashed black; display: flex; justify-content: start; flex-direction: column; font-size: 12px;">
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
          
          <div style="height: max-content;">
            <table style="font-size: 12px;">
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
          </div>
      
      </div>
    </body>
  </html>
  `;
};

export default PrintContent;
