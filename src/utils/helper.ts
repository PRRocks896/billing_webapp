import { redirect } from "react-router-dom";
import { getBaseUrl } from "./axios";

export const formatCurrency = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined || isNaN(amount)) return "₹0";
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(amount);
};

export const imagePath = (path: string) => {
    const apiUrl = getBaseUrl();
    const modifiedapiUrl = apiUrl.replace(/\/api\/?$/, '');
    const formattedApiUrl = modifiedapiUrl
    return `${formattedApiUrl}${path}`;
}

export const getAuthToken = () => {
    const value = localStorage.getItem("serviceToken");
    if (value) {
        return value;
    } else {
        return null;
    }
};

export const removeStorageToken = () => {
    localStorage.removeItem("serviceToken");
};

export const checkIsAuthenticated = () => {
    const value = getAuthToken();
    // if (value === null) {
    //     return redirect("/");
    // }
    return null;
};

export const doUpperCase = (value: string) => {
    return value.trim().replace(/\s+/g, ' ').toUpperCase()
}

export const listPayload = (
    page: number,
    where: Record<string, any> = {},
    rows: number = 10,
    pagination: Record<string, any> = {},
    descending: boolean = true
) => {
    return {
        where: {
            isDeleted: false,
            ...where,
        },
        pagination: {
            sortBy: "createdAt",
            descending: descending,
            rows: rows,
            page: page + 1,
            ...pagination,
        },
    };
};

export const generateSlug = (value: string, replace: string = '-') => {
    return value.trim().toLowerCase().replace(/\s+/g, replace) || "";
}

export const convertToFormData = (data: Record<string, any>, isJsonStringfy: boolean = false): FormData => {
    const formData = new FormData();

    const appendFormData = (key: string, value: any) => {
        if (Array.isArray(value) && !isJsonStringfy) {
            value.forEach((v, i) => {
                formData.append(`${key}[${i}]`, v);
            });
        } else if (Array.isArray(value) && isJsonStringfy) {
            formData.append(key, JSON.stringify(value));
        } else if (typeof value === "object" && value !== null) {
            Object.keys(value).forEach((subKey) => {
                appendFormData(`${key}[${subKey}]`, value[subKey]);
            });
        } else if (value !== undefined && value !== null) {
            formData.append(key, value);
        }
    };

    Object.keys(data).forEach((key) => {
        appendFormData(key, data[key]);
    });

    return formData;
};

/**
 * Calculate GST breakup (CGST, SGST, Total)
 * 
 * @param {number} amount - Base amount or total amount
 * @param {number} gstPercent - GST percentage (5, 12, 18, 28)
 * @param {boolean} [isInclusive=false] - Whether the amount already includes GST
 * @returns {object} { baseAmount, cgst, sgst, totalAmount }
 */
export function calculateGSTDetails(amount: number, gstPercent: number, isInclusive: boolean = false): { baseAmount: number, cgst: number, sgst: number, totalAmount: number } {
    const amt: number = amount || 0;
    const gst: number = gstPercent || 0;

    if (amt === 0 || gst === 0) {
        return { baseAmount: amt, cgst: 0, sgst: 0, totalAmount: amt };
    }

    let baseAmount: number = 0, cgst: number = 0, sgst: number = 0, totalAmount: number = 0;

    if (isInclusive) {
        // When amount already includes GST
        totalAmount = amt;
        baseAmount = showTwoDecimal((amt / (100 + gst)) * 100);
        const gstTotal = showTwoDecimal(amt - baseAmount);
        cgst = showTwoDecimal(gstTotal / 2);
        sgst = showTwoDecimal(gstTotal - cgst);
    } else {
        // When amount is before GST
        baseAmount = amt;
        const gstTotal = showTwoDecimal((amt * gst) / 100);
        cgst = showTwoDecimal(gstTotal / 2);
        sgst = showTwoDecimal(gstTotal - cgst);
        totalAmount = showTwoDecimal(amt + gstTotal);
    }

    return {
        baseAmount: baseAmount,
        cgst: cgst,
        sgst: sgst,
        totalAmount: totalAmount,
    };
}

export const showTwoDecimalWithoutRound = (value: number) => {
    return Number(`${value.toString().split(".")[0]}.${value.toString().split(".")[1]?.slice(0, 2) || 0}`);
};

export const showTwoDecimal = (value: number) => {
    return Number((Math.round(value * 100) / 100).toFixed(2));
};

export const convertAmountToWords = (amount: number) => {
    const singleDigits = [
        "",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
    ];
    const teens = [
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "nineteen",
    ];
    const tens = [
        "",
        "",
        "twenty",
        "thirty",
        "forty",
        "fifty",
        "sixty",
        "seventy",
        "eighty",
        "ninety",
    ];
    const thousands = ["", "thousand", "lakh", "crore"];

    function convertTwoDigits(num: number) {
        if (num < 10) return singleDigits[num];
        if (num < 20) return teens[num - 10];
        let ten = Math.floor(num / 10);
        let one = num % 10;
        return tens[ten] + (one ? " " + singleDigits[one] : "");
    }

    function convertThreeDigits(num: number) {
        let hundred = Math.floor(num / 100);
        let remainder = num % 100;
        let result = "";
        if (hundred) {
            result += singleDigits[hundred] + " hundred";
            if (remainder) {
                result += " and ";
            }
        }
        if (remainder) {
            result += convertTwoDigits(remainder);
        }
        return result;
    }

    if (amount === 0) return "zero";

    let result = "";
    let parts = [];
    let i = 0;

    // Handle thousands separately
    while (amount > 0) {
        let part = amount % (i === 1 ? 100 : 1000);
        if (part > 0) {
            let partInWords = convertThreeDigits(part);
            if (thousands[i]) {
                partInWords += " " + thousands[i];
            }
            parts.unshift(partInWords);
        }
        amount = Math.floor(amount / (i === 1 ? 100 : 1000));
        i++;
    }

    result = parts.join(" ").trim();
    return result;
};