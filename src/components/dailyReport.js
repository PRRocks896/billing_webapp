
const DailyReportPrint = (data) => {
    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          * {
            margin: 0;
            padding: 0;
            text-indent: 0;
          }
          .s1 {
            color: black;
            font-family: Calibri, sans-serif;
            font-style: normal;
            font-weight: bold;
            text-decoration: none;
            font-size: 12.5pt;
            padding-top: 4pt !important;
          }

          .s2 {
            color: black;
            font-family: Calibri, sans-serif;
            font-style: normal;
            font-weight: bold;
            text-decoration: none;
            font-size: 11.5pt;
            padding-top: 2pt !important;
          }

          .s3 {
            color: black;
            font-family: Calibri, sans-serif;
            font-style: normal;
            font-weight: bold;
            text-decoration: none;
            font-size: 14.5pt;
          }

          table,
          tbody {
            vertical-align: top;
            overflow: visible;
          }
        </style>
      </head>
    <body>
      <table style="border-collapse:collapse;margin-left:7.465pt" cellspacing="0">
        <tr style="height:22pt">
          <td style="width:444pt;border-top-style:solid;border-top-width:3pt;border-left-style:solid;border-left-width:3pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:2pt" colspan="2">
            <p class="s1" style="padding-top: 2pt;text-indent: 0pt;text-align: center;">
              ${data?.branchName}
            </p>
          </td>
          <td style="width:354pt;border-top-style:solid;border-top-width:3pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:3pt" colspan="3">
            <p class="s1" style="padding-top: 3pt;text-indent: 0pt;text-align: center;">
              EXPENSES LIST
            </p>
          </td>
        </tr>
        <tr style="height:23pt">
          <td style="width:253pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:3pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
            <p class="s1" style="padding-top: 4pt;padding-left: 4pt;text-indent: 0pt;text-align: left;">DATE</p>
          </td>
          <td style="width:191pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:2pt">
            <p class="s1" style="padding-top: 4pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">${data.date}
            </p>
          </td>
          <td style="width:354pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:3pt" colspan="3" rowspan="16">
            ${data.expense && data.expense.length > 0 && data.expense.map((item) => (
              `
                <div style="padding: 0px 16px;">
                  <p class="s1" style="text-transform: capitalize;color: black;
                  font-family: Calibri, sans-serif;
                  font-style: normal;
                  font-weight: bold;
                  text-decoration: none;
                  font-size: 12.5pt;">${item.description} &nbsp; &nbsp; = &nbsp; &nbsp; ${item.amount}/-</p>
                </div>
              `
            ))}
          </td>
      </tr>
      <tr style="height:23pt">
        <td style="width:253pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:3pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
          <p class="s1" style="padding-top: 3pt;padding-left: 4pt;text-indent: 0pt;text-align: left;">MANAGER NAME</p>
        </td>
        <td style="width:191pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:2pt">
          <p class="s1" style="padding-top: 3pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">${data.managerName}</p>
        </td>
      </tr>
      <tr style="height:23pt">
        <td style="width:253pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:3pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
          <p class="s1" style="padding-top: 3pt;padding-left: 4pt;text-indent: 0pt;text-align: left;">TOTAL STAFF PRENSET</p>
        </td>
        <td style="width:191pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:2pt">
          <p class="s1" style="padding-top: 3pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">${data.totalStaffPresent}</p>
        </td>
      </tr>
      <tr style="height:23pt">
        <td style="width:253pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:3pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
          <p class="s1" style="padding-top: 3pt;padding-left: 4pt;text-indent: 0pt;text-align: left;">TOTAL NO OF CUSTOMERS</p>
        </td>
        <td style="width:191pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:2pt">
          <p class="s1" style="padding-top: 3pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">${data.totalCustomer}</p>
        </td>
      </tr>
      <tr style="height:23pt">
        <td style="width:253pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:3pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
          <p class="s1" style="padding-top: 3pt;padding-left: 4pt;text-indent: 0pt;text-align: left;">TOTAL NO OF MEMBER GUEST</p>
          </td>
          <td
              style="width:191pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:2pt">
              <p class="s1" style="padding-top: 3pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">${data.totalMemberGuest}</p>
          </td>
      </tr>
      <tr style="height:5pt">
          <td
              style="width:253pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:3pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
              <p style="text-indent: 0pt;text-align: left;"><br /></p>
          </td>
          <td
              style="width:191pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:2pt">
              <p style="text-indent: 0pt;text-align: left;"><br /></p>
          </td>
      </tr>
      <tr style="height:21pt">
          <td
              style="width:253pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:3pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
              <p class="s2" style="padding-top: 2pt;padding-left: 4pt;text-indent: 0pt;text-align: left;">OPENING
                  BALANCE</p>
          </td>
          <td
              style="width:191pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:2pt">
              <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">${data.openBalance}</p>
          </td>
      </tr>
      <tr style="height:21pt">
          <td
              style="width:253pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:3pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
              <p class="s3" style="padding-top: 1pt;padding-left: 4pt;text-indent: 0pt;text-align: left;">CASH SALE
              </p>
          </td>
          <td
              style="width:191pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:2pt">
              <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">${data.cashSale}</p>
          </td>
      </tr>
      <tr style="height:21pt">
          <td
              style="width:253pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:3pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
              <p class="s3" style="padding-top: 1pt;padding-left: 4pt;text-indent: 0pt;text-align: left;">CARD SALE
              </p>
          </td>
          <td
              style="width:191pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:2pt">
              <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">${data.cardSale}</p>
          </td>
      </tr>
      <tr style="height:21pt">
          <td
              style="width:253pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:3pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
              <p class="s3" style="padding-top: 1pt;padding-left: 4pt;text-indent: 0pt;text-align: left;">GPAY</p>
          </td>
          <td
              style="width:191pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:2pt">
              <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">${data.upiSale}</p>
          </td>
      </tr>
      <tr style="height:21pt">
          <td
              style="width:253pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:3pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
              <p class="s3" style="padding-top: 1pt;padding-left: 4pt;text-indent: 0pt;text-align: left;">DEALS APP
                  SALE</p>
          </td>
          <td
              style="width:191pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:2pt">
              <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">${data.dealsAppSale}</p>
          </td>
      </tr>
      <tr style="height:28pt">
          <td
              style="width:253pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:3pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
              <p class="s3" style="padding-top: 4pt;padding-left: 4pt;text-indent: 0pt;text-align: left;">TOTAL SALE
              </p>
          </td>
          <td
              style="width:191pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:2pt">
              <p class="s3" style="padding-top: 4pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">${data.totalSales}</p>
          </td>
      </tr>
      <tr style="height:5pt">
          <td
              style="width:253pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:3pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
              <p style="text-indent: 0pt;text-align: left;"><br /></p>
          </td>
          <td
              style="width:191pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:2pt">
              <p style="text-indent: 0pt;text-align: left;"><br /></p>
          </td>
      </tr>
      <tr style="height:21pt">
          <td
              style="width:253pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:3pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
              <p class="s1" style="padding-top: 2pt;padding-left: 4pt;text-indent: 0pt;text-align: left;">TOTAL CASH
                  SALE + OPENING BLNC</p>
          </td>
          <td
              style="width:191pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:2pt">
              <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">${data.totalCash}</p>
          </td>
      </tr>
      <tr style="height:5pt">
          <td
              style="width:253pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:3pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
              <p style="text-indent: 0pt;text-align: left;"><br /></p>
          </td>
          <td
              style="width:191pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:2pt">
              <p style="text-indent: 0pt;text-align: left;"><br /></p>
          </td>
      </tr>
      <tr style="height:18pt">
          <td
              style="width:253pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:3pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
              <p class="s2" style="padding-top: 2pt;padding-left: 4pt;text-indent: 0pt;text-align: left;">EXPENSES</p>
          </td>
          <td
              style="width:191pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:2pt">
              <p class="s2" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">${data.totalExpenses}</p>
          </td>
      </tr>
      <tr style="height:16pt">
          <td
              style="width:253pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:3pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
              <p style="text-indent: 0pt;text-align: left;"><br /></p>
          </td>
          <td
              style="width:191pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:2pt">
              <p style="text-indent: 0pt;text-align: left;"><br /></p>
          </td>
          <td style="width:354pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:3pt"
              colspan="3">
              <p class="s2" style="padding-left: 2pt;text-indent: 0pt;text-align: left;">TOTAL EXPENSES:- ${data.totalExpenses}</p>
          </td>
      </tr>
      <tr style="height:16pt">
          <td
              style="width:253pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:3pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
              <p class="s2" style="padding-left: 4pt;text-indent: 0pt;text-align: left;">NEXT DAY PETTY CASH</p>
          </td>
          <td
              style="width:191pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:2pt">
              <p class="s2" style="padding-left: 2pt;text-indent: 0pt;text-align: left;">${data.nextDayCash}</p>
          </td>
          <td style="width:354pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:3pt"
              colspan="3">
              <p class="s2" style="text-indent: 0pt;text-align: center;">CASH
                  IN COVER</p>
          </td>
      </tr>
      <tr style="height:22pt">
          <td
              style="width:253pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:3pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
              <p class="s2" style="padding-top: 3pt;padding-left: 4pt;text-indent: 0pt;text-align: left;">TIPS CARD
                  AMOUNT</p>
          </td>
          <td
              style="width:191pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:2pt">
              <p class="s2" style="padding-top: 3pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">${data.tipsCard}</p>
          </td>
          <td
              style="width:77pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:1pt">
              <p class="s2" style="padding-top: 3pt;padding-left: 3pt;text-indent: 0pt;text-align: left;">500 X ${data.fiveHundred}</p>
          </td>
          <td
              style="width:83pt;border-top-style:solid;border-top-width:1pt;border-bottom-style:solid;border-bottom-width:1pt">
              <p class="s2" style="padding-top: 3pt;padding-left: 28pt;text-indent: 0pt;text-align: left;">-</p>
          </td>
          <td
              style="width:194pt;border-top-style:solid;border-top-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:3pt">
              <p class="s2"
                  style="padding-top: 3pt;padding-right: 5pt;text-indent: 0pt;text-align: right;">
                  ${500 * parseFloat(data.fiveHundred || 0)}</p>
          </td>
      </tr>
      <tr style="height:22pt">
          <td
              style="width:253pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:3pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
              <p class="s2" style="padding-top: 3pt;padding-left: 4pt;text-indent: 0pt;text-align: left;">AFTER-25%
                  PAID CASH TO THERAPIST</p>
          </td>
          <td
              style="width:191pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:2pt">
              <p class="s2" style="padding-top: 3pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">${data.totalCard}</p>
          </td>
          <td
              style="width:77pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:1pt">
              <p class="s2" style="padding-top: 3pt;padding-left: 3pt;text-indent: 0pt;text-align: left;">200 X ${data.twoHundred}</p>
          </td>
          <td
              style="width:83pt;border-top-style:solid;border-top-width:1pt;border-bottom-style:solid;border-bottom-width:1pt">
              <p class="s2" style="padding-top: 3pt;padding-left: 28pt;text-indent: 0pt;text-align: left;">-</p>
          </td>
          <td
              style="width:194pt;border-top-style:solid;border-top-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:3pt">
              <p class="s2"
                  style="padding-top: 3pt;padding-right: 5pt;text-indent: 0pt;text-align: right;">
                  ${200 * parseFloat(data.twoHundred || 0)}</p>
          </td>
      </tr>
      <tr style="height:22pt">
          <td
              style="width:253pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:3pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
              <p class="s2" style="padding-top: 3pt;padding-left: 4pt;text-indent: 0pt;text-align: left;">TOTAL CARD
              </p>
          </td>
          <td
              style="width:191pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:2pt">
              <p class="s2" style="padding-top: 3pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">${data.totalCard}</p>
          </td>
          <td
              style="width:77pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:1pt">
              <p class="s2" style="padding-top: 3pt;padding-left: 3pt;text-indent: 0pt;text-align: left;">100 X ${data.oneHundred}</p>
          </td>
          <td
              style="width:83pt;border-top-style:solid;border-top-width:1pt;border-bottom-style:solid;border-bottom-width:1pt">
              <p class="s2" style="padding-top: 3pt;padding-left: 28pt;text-indent: 0pt;text-align: left;">-</p>
          </td>
          <td
              style="width:194pt;border-top-style:solid;border-top-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:3pt">
              <p class="s2"
                  style="padding-top: 3pt;padding-right: 5pt;text-indent: 0pt;text-align: right;">
                  ${100 * parseFloat(data.oneHundred || 0)}</p>
          </td>
      </tr>
      <tr style="height:21pt">
          <td
              style="width:253pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:3pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
              <p style="text-indent: 0pt;text-align: left;"><br /></p>
          </td>
          <td
              style="width:191pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:2pt">
              <p style="text-indent: 0pt;text-align: left;"><br /></p>
          </td>
          <td
              style="width:77pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt">
              <p class="s2" style="padding-top: 3pt;padding-left: 3pt;text-indent: 0pt;text-align: left;">50 X ${data.fifty}</p>
          </td>
          <td
              style="width:83pt;border-top-style:solid;border-top-width:1pt;border-bottom-style:solid;border-bottom-width:2pt">
              <p class="s2" style="padding-top: 3pt;padding-left: 28pt;text-indent: 0pt;text-align: left;">-</p>
          </td>
          <td
              style="width:194pt;border-top-style:solid;border-top-width:1pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:3pt">
              <p class="s2"
                  style="padding-top: 3pt;padding-right: 5pt;text-indent: 0pt;text-align: right;">
                  ${50 * parseFloat(data.oneHundred || 0)}</p>
          </td>
      </tr>
      <tr style="height:21pt">
          <td
              style="width:253pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:3pt;border-bottom-style:solid;border-bottom-width:3pt;border-right-style:solid;border-right-width:1pt">
              <p class="s2" style="padding-top: 3pt;padding-left: 4pt;text-indent: 0pt;text-align: left;">SALON
                  CUSTOMER SALES</p>
          </td>
          <td
              style="width:191pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:3pt;border-right-style:solid;border-right-width:2pt">
              <p class="s2" style="padding-top: 3pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">${data.salonCustomerCash}
              </p>
          </td>
          <td
              style="width:77pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:3pt">
              <p class="s2" style="padding-top: 3pt;padding-left: 3pt;text-indent: 0pt;text-align: left;">TOTAL</p>
          </td>
          <td
              style="width:83pt;border-top-style:solid;border-top-width:2pt;border-bottom-style:solid;border-bottom-width:3pt">
              <p class="s2" style="padding-top: 3pt;padding-left: 28pt;text-indent: 0pt;text-align: left;">-</p>
          </td>
          <td
              style="width:194pt;border-top-style:solid;border-top-width:2pt;border-bottom-style:solid;border-bottom-width:3pt;border-right-style:solid;border-right-width:3pt">
              <p class="s2"
                  style="padding-top: 3pt;padding-right: 5pt;text-indent: 0pt;text-align: right;">
                  ${data.cashInCover}</p>
          </td>
      </tr>
  </table>
</body>

</html>
    `
};

export default DailyReportPrint;