export interface FetchProps {
    list: any[],
    count: number,
    error: any,
}

export interface ActionProps {
    type: string;
    payload?: any;
}

export interface TableData {
    billNo: string;
    paymentId: number | string;
    item: string;
    hsnCode: number | string;
    quantity: number | string;
    total: number | string;
    grandTotal: number;
    subTotal: number | string;
    cgst: number | string;
    sgst: number | string;
    payment: string;
    cardNo?: string;
}

export interface Branch {
    title: string;
    address: string;
    phone1: string;
    phone2: string;
    reviewUrl: string;
}

export interface Bill {
    date: Date | string;
    tableData: TableData[];
    grandTotal: number | string;
    isShowGst: boolean;
    gstNo: string;
    cgstPercentage: number | string;
    sgstPercentage: number | string;
    customer: string;
    roomNo?: string;
    staff?: string;
}