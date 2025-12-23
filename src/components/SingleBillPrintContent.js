import moment from 'moment';
import reviewImg from '../assets/images/review_image.png'
import { showTwoDecimal, convertAmountToWords } from '../utils/helper';

const SingleBillPrintContent = (bill) => {
  const date = bill.date;//moment(bill.date ? new Date(bill.date) : new Date()).format('DD/MM/yyyy');
  // const time = moment(billData.date || new Date()).format('hh:mm:ss A');
  
  return `
      <div style="padding: 0mm; margin: 0 auto; width: 78mm;">
          <div style="page-break-after: always; border: 0px solid black; min-height: max-content;">
            <p style="text-transform: capitalize;font-size: 16px; font-weight: 600; margin: 0px;text-align: center; margin-bottom: 0px">${
              bill.title
            }</p>
            <p style="text-transform: capitalize; font-size: 12px; margin: 0px; text-align: center;">
              ${bill.address}
            </p>
            ${bill.isShowGst ?
            `<p style="text-transform: capitalize; font-size: 12px; margin: 0px; text-align: center;">
              GST NO: ${bill.gstNo}
            </p>`
            : ''}
            <div style="display: flex; justify-content: space-between;margin-top: 7px;">
              <div>
                <p style="text-align: start; margin: 0px; font-size: 14px;">Ph: ${
                  bill.phone1
                }</p>
                <p style="text-align: start; margin: 0px; font-size: 14px;">Bill No: ${
                  bill.billNo
                }</p>
              </div>
              <div>
                <p style="text-align: start; margin: 0px; font-size: 14px;">Date: ${date}</p>
                <p style="text-align: start; margin: 0px; font-size: 14px;"></p>
              </div>
            </div>
            <div>
              <p style="text-align: start; margin: 0px; font-size: 14px;">
                Customer Name : Cash Customer
              </p>
            </div>
            <div style="width: 100%;display: flex;justify-content: space-between;margin-top: 7px;">
              
              <div>
                <p style="text-align: start; margin: 0px; font-size: 14px;"></p>
                <p style="text-align: start; margin: 0px; font-size: 14px;"></p>
              </div>
            </div>
            <div style="width: 100%; border-top: 1px dashed black;margin: 0;margin-top: 7px;"></div>
            <table style="width: 100%;">
              <thead>
                <tr style="text-align:center;font-size: 14px;border: 1px solid black;">
                  <td>SR</td>
                  <td>Item Name</td>
                  <td>HSN</td>
                  <td>Qty</td>
                  <td>Rate</td>
                  <td>Value</td>
                </tr>
              </thead>
              <tbody>
                <tr style="text-align:center;font-size: 14px;">
                  <td>1</td>
                  <td>${bill.item}</td>
                  <td>${bill.hsn}</td>
                  <td>${bill.quantity}</td>
                  <td>${showTwoDecimal(bill.total)}</td>
                  <td>${showTwoDecimal(bill.total)}</td>
                </tr>
              </tbody>
            </table>
            <div style="width: 100%; border-top: 1px dashed black;border-bottom: 1px dashed black; display: flex; justify-content: end;font-size: 14px;">
              <p style="margin: 5px 0px; margin-right: 10px; font-weight: 600;">Sub Total: </p>
              <p style="margin: 5px 0px; margin-right: 4px; font-weight: 600; text-align: end;">${
                showTwoDecimal(bill.subTotal)
              }</p>
            </div>
            ${bill.isShowGst ? 
              `<div style="width: 100%; border-top: 1px dashed black;border-bottom: 1px dashed black; display: flex; justify-content: end;font-size: 14px;">
                ${bill.cgst &&
                  `<p style="margin: 5px 0px; margin-right: 10px; font-weight: 600;">CGST (${bill.cgstPercentage}%): </p>
                  <p style="margin: 5px 0px; margin-right: 4px; font-weight: 600; text-align: end;">${
                    showTwoDecimal(bill.cgst)
                  },</p>`
                }
                ${bill.sgst &&
                  `<p style="margin: 5px 0px; margin-right: 10px; font-weight: 600;">SGST (${bill.sgstPercentage}%): </p>
                  <p style="margin: 5px 0px; margin-right: 4px; font-weight: 600; text-align: end;">${
                    showTwoDecimal(bill.sgst)
                  }</p>`
                }
              </div>`
            : ''}
            <div style="width: 100%;border-bottom: 1px dashed black; display: flex; justify-content: end;font-size: 20px;">
              <p style="margin: 5px 0px; margin-right: 14px; font-weight: 600;">Grand Total : </p>
              <p style="margin: 5px 0px; margin-right: 4px; font-weight: 600; text-align: end;">${
                showTwoDecimal(bill.grandTotal)
              }</p>
            </div>
            <div style="width: 100%;border-bottom: 1px dashed black; display: flex; justify-content: start;font-size: 10px;">
              <p style="margin: 5px 0px;">Amount in Words: </p>
              <p style="margin: 5px 0px; margin-left: 10px;">${
                convertAmountToWords(showTwoDecimal(bill.grandTotal)).toUpperCase()
              } RUPEES</p>
            </div>
            <div style="width: 100%;border-bottom: 1px dashed black; display: flex; justify-content: start; flex-direction: column; font-size: 14px;">
              <div style="display: flex;">
                <p style="margin: 5px 0px; ">${bill.paymentMode}: </p>
                <p style="margin: 5px 0px; margin-left: 10px;">${
                  showTwoDecimal(bill.grandTotal)
                }</p>
              </div>
            </div>
            <div style="width: 100%;border-bottom: 1px dashed black; display: flex; justify-content: start; flex-direction: column; font-size: 14px;">
              <p style="text-align: center; margin: 5px;font-size: 12px;">
                * Terms and Conditions Apply
              </p>
            </div>
              <p style="text-align: center; margin: 0;font-size: 12px;margin-top: 7px;">
              * AFTER PAID AMOUNT CANNOT BE REFUND
              </p>
              <p style="text-align: center; margin: 0;font-size: 12px;">Thank You.... Visit Again....</p>
          </div>
      </div>
  `;
};

export default SingleBillPrintContent;
