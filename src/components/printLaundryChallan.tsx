import moment from "moment";
import logo from "/logo.png";
import { showTwoDecimal } from "utils/helper";

const PrintLaundryChallan = (challanData: any) => {
    const date = moment(challanData.date || new Date()).format('DD/MM/YYYY');
    const time = moment(challanData.date || new Date()).format('hh:mm:ss A');
    
    return `<html>
    <head>
      <title>Laundry Challan</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
      <style>
        * {
          font-family: 'Poppins', sans-serif;
          font-weight: bold;
        }
        @media print {
          @page {
            size: 80mm auto;
            margin: 0;
          }
          body {
            margin: 0;
          }
        }
        body {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          -o-user-select: none;
          margin: 0;
          padding: 0;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .info-table {
          width: 100%;
          font-size: 16px;
          margin-bottom: 15px;
        }
        .info-table td {
          padding: 5px 0;
        }
        .items-table {
          width: 100%;
          font-size: 14px;
          border-collapse: collapse;
          margin-top: 15px;
        }
        .items-table th {
          border-top: 1px dashed black;
          border-bottom: 1px dashed black;
          padding: 10px 0;
          text-align: left;
        }
        .items-table td {
          padding: 8px 0;
        }
        .summary-table {
          width: 100%;
          font-size: 16px;
          margin-top: 20px;
          border-top: 1px dashed black;
          padding-top: 10px;
        }
        .summary-table td {
          padding: 5px 0;
        }
      </style>
    </head>
    <body>
      <div style="padding: 0mm; margin: 0 auto; width: 80mm;">
        <div style="page-break-inside: avoid; height: max-content; border: 0px solid black;">
          
          <div class="header">
            <img src="${logo}" style="width: 150px; height: auto; margin-bottom: 10px;" />
            <h2 style="margin: 0;">LAUNDRY CHALLAN</h2>
            <h3 style="margin: 5px 0 0 0;">Code: ${challanData.challanCode || 'N/A'}</h3>
          </div>

          <table class="info-table">
            <tbody>
              <tr>
                <td>Date</td>
                <td>:</td>
                <td>${date}</td>
              </tr>
              <tr>
                <td>Time</td>
                <td>:</td>
                <td>${time}</td>
              </tr>
              <tr>
                <td>Vendor</td>
                <td>:</td>
                <td>${challanData.vendorName || '-'}</td>
              </tr>
              ${challanData.shopName ? `
              <tr>
                <td>Shop</td>
                <td>:</td>
                <td>${challanData.shopName}</td>
              </tr>
              ` : ''}
              ${challanData.managerName ? `
              <tr>
                <td>Sent By</td>
                <td>:</td>
                <td>${challanData.managerName}</td>
              </tr>
              ` : ''}
            </tbody>
          </table>

          <table class="items-table">
            <thead>
              <tr>
                <th>Sr.</th>
                <th>Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${challanData.items?.map((item: any, index: number) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.itemName}</td>
                  <td style="text-align: center;">${item.givenQty} ${item.unitName || ''}</td>
                  <td style="text-align: right;">${showTwoDecimal(item.price)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <table class="summary-table">
            <tbody>
              <tr>
                <td>Total Items:</td>
                <td style="text-align: right;">${challanData.totalItems || challanData.items?.length || 0}</td>
              </tr>
              <tr>
                <td>Total Qty:</td>
                <td style="text-align: right;">${challanData.items?.reduce((acc: number, val: any) => acc + parseInt(val.givenQty || 0), 0) || 0}</td>
              </tr>
              <tr>
                <td>Total Amount:</td>
                <td style="text-align: right;">${showTwoDecimal(challanData.items?.reduce((acc: number, val: any) => acc + (parseFloat(val.price || 0) * parseInt(val.givenQty || 0)), 0) || 0)}</td>
              </tr>
            </tbody>
          </table>

          <div style="text-align: center; margin-top: 30px; font-size: 14px; border-top: 1px dashed black; padding-top: 15px;">
            <p style="margin: 0;">Keep this challan for returns.</p>
          </div>
          
        </div>
      </div>
      <script>
        window.onload = function() {
            window.print();
        }
      </script>
    </body>
    </html>`;
};

export default PrintLaundryChallan;
