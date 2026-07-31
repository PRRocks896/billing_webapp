
export const ROWS = 10;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;
export const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
// login apis
export const LOGIN_API = "api/auth/login-via-email";
export const LOGIN_API_VIA_PHONE = 'api/auth/login-via-phone';
export const VERIFY_OTP = "api/auth/verify-otp";
export const GET_LOGGED_IN_USER_API = "api/user/get";
export const LOGOUT_API = 'api/auth/logout';

// home apis
export const FETCH_DASHBOARD_DETAILS_API = "api/dashboard";

// barcodemodule apis

export const CREATE_BARCODE_API = "api/barcode";
export const GET_SINGLE_BARCODE_API = "api/barcode/get";
export const BARCODE_LIST_API = "api/barcode/list";
export const UPDATE_BARCODE_API = "api/barcode/:id";
export const DELETE_BARCODE_API = "api/barcode";
export const BARCODE_FIND_API = "api/barcode/";

// customer apis
export const CUSTOMER_LIST_API = "api/customer/list";
export const CREATE_CUSTOMER_API = "api/customer";
export const GET_SINGLE_CUSTOMER_API = "api/customer/";
export const UPDATE_CUSTOMER_API = "api/customer/";
export const DELETE_CUSTOMER_API = "api/customer/";
export const CREATE_BULK_CUSTOMER_API = "api/customer/bulk-create";
export const SENT_MEMBERHSIP_OTP = "api/customer/membership-otp";
export const VERIFY_MEMBERSHIP_OTP = "api/customer/membership-verify-otp";
export const SEND_MEMBERHSIP_REDEEM_OTP = "api/customer/membership-redeem-otp";
export const VERIFY_MEMBERSHIP_REDEEM_OTP = "api/customer/membership-redeem-verify-otp";
export const EXPORT_CUSTOMER = 'api/customer/report';

// staff apis
export const STAFF_LIST_API = "api/staff/list";
export const CREATE_STAFF_API = "api/staff";
export const GET_SINGLE_STAFF_API = "api/staff/";
export const UPDATE_STAFF_API = "api/staff/";
export const DELETE_STAFF_API = "api/staff/";

// face recognition apis
export const FACE_REGISTER_API = "api/face/register";
export const FACE_VERIFY_API = "api/face/verify";
export const FACE_CACHE_STATS_API = "api/face/cache-stats";
export const FACE_REFRESH_CACHE_API = "api/face/refresh-cache";

// states apis
export const STATES_LIST_API = "api/state/list";
export const CREATE_STATES_API = "api/state";
export const GET_SINGLE_STATES_API = "api/state/";
export const UPDATE_STATES_API = "api/state/";
export const DELETE_STATES_API = "api/state/";

// city apis
export const CITY_LIST_API = "api/city/list";
export const CREATE_CITY_API = "api/city";
export const GET_SINGLE_CITY_API = "api/city/";
export const UPDATE_CITY_API = "api/city/";
export const DELETE_CITY_API = "api/city/";
export const CITY_FIND_API = "api/city/find";

// service category apis
export const SERVICE_CATEGORY_LIST_API = "api/service-category/list";
export const CREATE_SERVICE_CATEGORY_API = "api/service-category";
export const DELETE_SERVICE_CATEGORY_API = "api/service-category/";
export const GET_SINGLE_SERVICE_CATEGORY_API = "api/service-category/";
export const UPDATE_SERVICE_CATEGORY_API = "api/service-category/";

// service apis
export const SERVICE_LIST_API = "api/service/list";
export const CREATE_SERVICE_API = "api/service";
export const DELETE_SERVICE_API = "api/service/";
export const GET_SINGLE_SERVICE_API = "api/service/";
export const UPDATE_SERVICE_API = "api/service/";

// payment type apis
export const PAYMENT_TYPE_LIST_API = "api/payment-type/list";
export const CREATE_PAYMENT_TYPE_API = "api/payment-type";
export const DELETE_PAYMENT_TYPE_API = "api/payment-type/";
export const GET_SINGLE_PAYMENT_TYPE_API = "api/payment-type/";
export const UPDATE_PAYMENT_TYPE_API = "api/payment-type/";

// users apis
export const CREATE_USER_API = "api/user";
export const GET_SINGLE_USER_API = "api/user/";
export const USER_LIST_API = "api/user/list";
export const UPDATE_USER_API = "api/user/";
export const DELETE_USER_API = "api/user/";
export const GET_USER_API = "api/user/get";
export const CHANGE_PASSWORD_API = "api/auth/change-password";

// role apis
export const CREATE_ROLE_API = "api/role";
export const GET_SINGLE_ROLE_API = "api/role/";
export const ROLE_LIST_API = "api/role/list";
export const UPDATE_ROLE_API = "api/role/";
export const DELETE_ROLE_API = "api/role/";

// module apis
export const MODULE_LIST_API = "api/module/list";
export const CREATE_MODULE_API = "api/module";
export const DELETE_MODULE_API = "api/module/";
export const GET_SINGLE_MODULE_API = "api/module/";
export const UPDATE_MODULE_API = "api/module/";

// bill apis
export const BILL_LIST_API = "api/bill/list";
export const CREATE_BILL_API = "api/bill";
export const CREATE_BULK_BILL_API = "api/bill/bulk-create";
export const DELETE_BILL_API = "api/bill/";
export const GET_SINGLE_BILL_API = "api/bill/";
export const UPDATE_BILL_API = "api/bill/";

// rights apis
export const RIGHT_LIST_API = "api/right/list";
export const CREATE_BULK_RIGHT_API = "api/right/bulk-create";
export const CREATE_RIGHT_API = "api/right";
export const DELETE_RIGHT_API = "api/right/";
export const GET_SINGLE_RIGHT_API = "api/right/";
export const UPDATE_RIGHT_API = "api/right/";

// reports apis

export const REPORT_LIST_API = "api/report";
export const GST_REPORT_LIST_API = "api/report/gst-report";

// Membership Plan apis
export const MEMBERSHIP = 'api/membership'
export const MEMBERSHIP_PLAN = "api/membership-plan";
export const MEMBERSHIP_REDEEM = "api/membership-redeem";

export const RENEWPLAN = 'api/renew-plan';

export const DAILYREPORT = 'api/daily-report';

export const EXPENSE = 'api/expense';

export const EMPLOYEETYPE = 'api/employee-type';

export const SALARY = 'api/salary';

export const COMPANY = "api/company";

export const COMPANYMAPPING = "api/comapany-mapping";

export const ROOM = "api/room";

export const COUPON = "api/coupon";

export const SEO = "api/seo";

export const FAQ = "api/faq";

export const ENQUIRY = "api/enquiry";

export const BLOG = "api/blog";

export const WEBSITEBOOKING = "api/website-booking"

export const NewsLetter = "api/newsLetter";

export const ADVANCE = "api/advance"

export const HOMEPAGE = "api/v1/homepage"

export const MATERIAL = "api/material";

export const LAUNDRYITEM = "api/laundry-item";

export const LAUNDRYWASHER = "api/laundry-washer";

export const LAUNDARYMANAGEMENT = "api/laundry-management";

export const LAUNDRYSTOCK = "api/laundry-stock";

export const LAUNDRYSTOCKHISTORY = "api/laundry-stock-history";

export const STOCK = "api/stock";

export const LAUNDRYRECEIVER = "api/laundry-receiver";

export const PAYMENTBANK = "api/payment-banks";

export const WEBSETTING = "api/v1/settings";

export const FRANCHISE = "api/franchise";

export const WHATSAPP = "api/whatsapp";

export const CONTACTUS = "api/contactus";

export const RENT = "api/rent";

export const EMPWELLNESSPLAN = "api/employee-wellness-plan";

export const EMPWELLNESSENQUIRY = "api/employee-wellness-enquiry";

export const GIFTCATEGORY = "api/gift-category";

export const PURCHASEGIFTCARD = "api/purchase-gift-card";

export const PROMOCODE = "api/promo-code";

export const REDEEMBOOKING = "api/redeem-booking";

export const BOOKINGSERVICE = "api/booking-service";

export const MODULESECTION = "api/module-section";

export const SECTIONRIGHT = "api/section-right";