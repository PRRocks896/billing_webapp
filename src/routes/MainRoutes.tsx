import { lazy } from 'react';

// project-imports
import ErrorBoundary from './ErrorBoundary';
import { loader as productsLoader, productLoader } from 'api/products';
import Loadable from 'components/Loadable';
import { SimpleLayoutType } from 'config';
import DashboardLayout from 'layout/Dashboard';
import PagesLayout from 'layout/Pages';
import SimpleLayout from 'layout/Simple';

// render - dashboard
const Dashboard = Loadable(lazy(() => import('pages/dashboard')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));
const DashboardAnalytics = Loadable(lazy(() => import('pages/dashboard/analytics')));
const DashboardFinance = Loadable(lazy(() => import('pages/dashboard/finance')));

// render - widget
const WidgetStatistics = Loadable(lazy(() => import('pages/widget/statistics')));
const WidgetData = Loadable(lazy(() => import('pages/widget/data')));
const WidgetChart = Loadable(lazy(() => import('pages/widget/chart')));

// render - admin panel
const OnlineCoursesDashboard = Loadable(lazy(() => import('pages/admin-panel/online-courses/dashboard/online-dashboard')));
const OnlineCoursesTeacherList = Loadable(lazy(() => import('pages/admin-panel/online-courses/teacher/list')));
const OnlineCoursesAppliedTeacher = Loadable(lazy(() => import('pages/admin-panel/online-courses/teacher/applied')));
const OnlineCoursesAddTeacher = Loadable(lazy(() => import('pages/admin-panel/online-courses/teacher/add')));
const OnlineCoursesStudentList = Loadable(lazy(() => import('pages/admin-panel/online-courses/student/list')));
const OnlineCoursesAppliedStudent = Loadable(lazy(() => import('pages/admin-panel/online-courses/student/applied')));
const OnlineCoursesAddStudent = Loadable(lazy(() => import('pages/admin-panel/online-courses/student/add')));
const OnlineCoursesCoursesView = Loadable(lazy(() => import('pages/admin-panel/online-courses/courses/view')));
const OnlineCoursesAddCourses = Loadable(lazy(() => import('pages/admin-panel/online-courses/courses/add')));
const OnlineCoursesPricing = Loadable(lazy(() => import('pages/admin-panel/online-courses/pricing/online-pricing')));
const OnlineCoursesSite = Loadable(lazy(() => import('pages/admin-panel/online-courses/site/online-site')));
const OnlineCoursesSettingPayment = Loadable(lazy(() => import('pages/admin-panel/online-courses/setting/payment')));
const OnlineCoursesSettingPricing = Loadable(lazy(() => import('pages/admin-panel/online-courses/setting/pricing')));
const OnlineCoursesSettingNotification = Loadable(lazy(() => import('pages/admin-panel/online-courses/setting/notification')));

const AdminMembershipDashbord = Loadable(lazy(() => import('pages/admin-panel/membership/dashboard')));
const AdminMembershipList = Loadable(lazy(() => import('pages/admin-panel/membership/list')));
const AdminMembershipPricing = Loadable(lazy(() => import('pages/admin-panel/membership/pricing')));
const AdminMembershipSetting = Loadable(lazy(() => import('pages/admin-panel/membership/setting')));

const AdminHelpdeskDashbord = Loadable(lazy(() => import('pages/admin-panel/helpdesk/dashboard')));
const AdminHelpdeskCreateTicket = Loadable(lazy(() => import('pages/admin-panel/helpdesk/ticket/create-ticket')));
const AdminHelpdeskTicketList = Loadable(lazy(() => import('pages/admin-panel/helpdesk/ticket/ticket-list')));
const AdminHelpdeskTicketDetails = Loadable(lazy(() => import('pages/admin-panel/helpdesk/ticket/ticket-details')));
const AdminHelpdeskCustomer = Loadable(lazy(() => import('pages/admin-panel/helpdesk/customer')));

// render - applications
const AppChat = Loadable(lazy(() => import('pages/apps/chat')));
const AppCalendar = Loadable(lazy(() => import('pages/apps/calendar')));

const AppKanban = Loadable(lazy(() => import('pages/apps/kanban')));
const AppKanbanBacklogs = Loadable(lazy(() => import('sections/apps/kanban/Backlogs')));
const AppKanbanBoard = Loadable(lazy(() => import('sections/apps/kanban/Board')));

const AppCustomerList = Loadable(lazy(() => import('pages/apps/customer/list')));
const AppCustomerCard = Loadable(lazy(() => import('pages/apps/customer/card')));

const AppInvoiceCreate = Loadable(lazy(() => import('pages/apps/invoice/create')));
const AppInvoiceDashboard = Loadable(lazy(() => import('pages/apps/invoice/dashboard')));
const AppInvoiceList = Loadable(lazy(() => import('pages/apps/invoice/list')));
const AppInvoiceDetails = Loadable(lazy(() => import('pages/apps/invoice/details')));
const AppInvoiceEdit = Loadable(lazy(() => import('pages/apps/invoice/edit')));

const UserProfile = Loadable(lazy(() => import('pages/apps/profiles/user')));
const UserTabPersonal = Loadable(lazy(() => import('sections/apps/profiles/user/TabPersonal')));
const UserTabPayment = Loadable(lazy(() => import('sections/apps/profiles/user/TabPayment')));
const UserTabPassword = Loadable(lazy(() => import('sections/apps/profiles/user/TabPassword')));
const UserTabSettings = Loadable(lazy(() => import('sections/apps/profiles/user/TabSettings')));

const AccountProfile = Loadable(lazy(() => import('pages/apps/profiles/account')));
const AccountTabProfile = Loadable(lazy(() => import('sections/apps/profiles/account/TabProfile')));
const AccountTabPersonal = Loadable(lazy(() => import('sections/apps/profiles/account/TabPersonal')));
const AccountTabAccount = Loadable(lazy(() => import('sections/apps/profiles/account/TabAccount')));
const AccountTabPassword = Loadable(lazy(() => import('sections/apps/profiles/account/TabPassword')));
const AccountTabRole = Loadable(lazy(() => import('sections/apps/profiles/account/TabRole')));
const AccountTabSettings = Loadable(lazy(() => import('sections/apps/profiles/account/TabSettings')));

const SocialProfile = Loadable(lazy(() => import('pages/apps/profiles/social-profile')));
const SocialTabProfile = Loadable(lazy(() => import('sections/apps/profiles/social-profile/TabProfile')));
const SocialTabFriends = Loadable(lazy(() => import('sections/apps/profiles/social-profile/TabFriends')));
const SocialTabFriendRequest = Loadable(lazy(() => import('sections/apps/profiles/social-profile/TabFriendRequest')));
const SocialTabGallery = Loadable(lazy(() => import('sections/apps/profiles/social-profile/TabGallery')));

const AppECommProducts = Loadable(lazy(() => import('pages/apps/e-commerce/product')));
const AppECommProductDetails = Loadable(lazy(() => import('pages/apps/e-commerce/product-details')));
const AppECommProductList = Loadable(lazy(() => import('pages/apps/e-commerce/products-list')));
const AppECommCheckout = Loadable(lazy(() => import('pages/apps/e-commerce/checkout')));
const AppECommAddProduct = Loadable(lazy(() => import('pages/apps/e-commerce/add-product')));

const AppFileManager = Loadable(lazy(() => import('pages/apps/file-manager')));
const AppMail = Loadable(lazy(() => import('pages/apps/mail')));

// render - forms & tables
const FormsValidation = Loadable(lazy(() => import('pages/forms/validation')));
const FormsWizard = Loadable(lazy(() => import('pages/forms/wizard')));

const FormsLayoutBasic = Loadable(lazy(() => import('pages/forms/layouts/basic')));
const FormsLayoutMultiColumn = Loadable(lazy(() => import('pages/forms/layouts/multi-column')));
const FormsLayoutActionBar = Loadable(lazy(() => import('pages/forms/layouts/action-bar')));
const FormsLayoutStickyBar = Loadable(lazy(() => import('pages/forms/layouts/sticky-bar')));

const FormsPluginsMask = Loadable(lazy(() => import('pages/forms/plugins/mask')));
const FormsPluginsClipboard = Loadable(lazy(() => import('pages/forms/plugins/clipboard')));
const FormsPluginsRecaptcha = Loadable(lazy(() => import('pages/forms/plugins/re-captcha')));
const FormsPluginsEditor = Loadable(lazy(() => import('pages/forms/plugins/editor')));
const FormsPluginsDropzone = Loadable(lazy(() => import('pages/forms/plugins/dropzone')));

const ReactTableBasic = Loadable(lazy(() => import('pages/tables/react-table/basic')));
const ReactDenseTable = Loadable(lazy(() => import('pages/tables/react-table/dense')));
const ReactTableSorting = Loadable(lazy(() => import('pages/tables/react-table/sorting')));
const ReactTableFiltering = Loadable(lazy(() => import('pages/tables/react-table/filtering')));
const ReactTableGrouping = Loadable(lazy(() => import('pages/tables/react-table/grouping')));
const ReactTablePagination = Loadable(lazy(() => import('pages/tables/react-table/pagination')));
const ReactTableRowSelection = Loadable(lazy(() => import('pages/tables/react-table/row-selection')));
const ReactTableExpanding = Loadable(lazy(() => import('pages/tables/react-table/expanding')));
const ReactTableEditable = Loadable(lazy(() => import('pages/tables/react-table/editable')));
const ReactTableDragDrop = Loadable(lazy(() => import('pages/tables/react-table/drag-drop')));
const ReactTableColumnVisibility = Loadable(lazy(() => import('pages/tables/react-table/column-visibility')));
const ReactTableColumnResizing = Loadable(lazy(() => import('pages/tables/react-table/column-resizing')));
const ReactTableStickyTable = Loadable(lazy(() => import('pages/tables/react-table/sticky')));
const ReactTableUmbrella = Loadable(lazy(() => import('pages/tables/react-table/umbrella')));
const ReactTableEmpty = Loadable(lazy(() => import('pages/tables/react-table/empty')));
const ReactTableVirtualized = Loadable(lazy(() => import('pages/tables/react-table/virtualized')));

// render - charts & map
const ChartApexchart = Loadable(lazy(() => import('pages/charts/apexchart')));
const ChartOrganization = Loadable(lazy(() => import('pages/charts/org-chart')));
const Map = Loadable(lazy(() => import('pages/map')));

// table routing
const MuiTableBasic = Loadable(lazy(() => import('pages/tables/mui-table/basic')));
const MuiTableDense = Loadable(lazy(() => import('pages/tables/mui-table/dense')));
const MuiTableEnhanced = Loadable(lazy(() => import('pages/tables/mui-table/enhanced')));
const MuiTableDatatable = Loadable(lazy(() => import('pages/tables/mui-table/datatable')));
const MuiTableCustom = Loadable(lazy(() => import('pages/tables/mui-table/custom')));
const MuiTableFixedHeader = Loadable(lazy(() => import('pages/tables/mui-table/fixed-header')));
const MuiTableCollapse = Loadable(lazy(() => import('pages/tables/mui-table/collapse')));

// pages routing
const AuthLogin = Loadable(lazy(() => import('pages/auth/auth1/login')));
const AuthRegister = Loadable(lazy(() => import('pages/auth/auth1/register')));
const AuthForgotPassword = Loadable(lazy(() => import('pages/auth/auth1/forgot-password')));
const AuthResetPassword = Loadable(lazy(() => import('pages/auth/auth1/reset-password')));
const AuthCheckMail = Loadable(lazy(() => import('pages/auth/auth1/check-mail')));
const AuthCodeVerification = Loadable(lazy(() => import('pages/auth/auth1/code-verification')));

const AuthLogin2 = Loadable(lazy(() => import('pages/auth/auth2/login2')));
const AuthRegister2 = Loadable(lazy(() => import('pages/auth/auth2/register2')));
const AuthForgotPassword2 = Loadable(lazy(() => import('pages/auth/auth2/forgot-password2')));
const AuthResetPassword2 = Loadable(lazy(() => import('pages/auth/auth2/reset-password2')));
const AuthCheckMail2 = Loadable(lazy(() => import('pages/auth/auth2/check-mail2')));
const AuthCodeVerification2 = Loadable(lazy(() => import('pages/auth/auth2/code-verification2')));

const AuthLogin3 = Loadable(lazy(() => import('pages/auth/auth3/login3')));

const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/error/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/error/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction/under-construction')));
const MaintenanceUnderConstruction2 = Loadable(lazy(() => import('pages/maintenance/under-construction/under-construction2')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon/coming-soon')));
const MaintenanceComingSoon2 = Loadable(lazy(() => import('pages/maintenance/coming-soon/coming-soon2')));
const MaintenanceJoinWaitlist = Loadable(lazy(() => import('pages/maintenance/join-waitlist')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));
const Landing = Loadable(lazy(() => import('pages/landing')));
// const ContactUS = Loadable(lazy(() => import('pages/contact-us')));
const ChangeLog = Loadable(lazy(() => import('pages/change-log')));
const FaqPage = Loadable(lazy(() => import('pages/faqs')));
const PricingPage = Loadable(lazy(() => import('pages/extra-pages/price/price1')));
const PricingPage2 = Loadable(lazy(() => import('pages/extra-pages/price/price2')));

// User Management
const Role = Loadable(lazy(() => import('pages/user-management/role')));
const AddEditRole = Loadable(lazy(() => import('pages/user-management/role/component/addEditRole')));
const Module = Loadable(lazy(() => import('pages/user-management/module')));
const AddEditModule = Loadable(lazy(() => import('pages/user-management/module/component/addEditModule')));
const Rights = Loadable(lazy(() => import('pages/user-management/rights')));
const ServiceCategory = Loadable(lazy(() => import('pages/service-management/service-cateogry')));
const AddEditServiceCategory = Loadable(lazy(() => import('pages/service-management/service-cateogry/component/addEditServiceCategory')));
const Service = Loadable(lazy(() => import('pages/service-management/service')));
const AddEditService = Loadable(lazy(() => import('pages/service-management/service/component/addEditService')));
const Room = Loadable(lazy(() => import('pages/master-management/room')));
const AddEditRoom = Loadable(lazy(() => import('pages/master-management/room/component/addEditRoom')));
const EmployeeType = Loadable(lazy(() => import('pages/master-management/employee-type')));
const AddEditEmployeeType = Loadable(lazy(() => import('pages/master-management/employee-type/component/addEditEmployeType')));
const PaymentType = Loadable(lazy(() => import('pages/master-management/payment-type')));
const AddEditPaymentType = Loadable(lazy(() => import('pages/master-management/payment-type/component/addEditPaymentType')));
const Branch = Loadable(lazy(() => import('pages/branch-management')));
const AddEditBranch = Loadable(lazy(() => import('pages/branch-management/component/addEditBranch')));
const State = Loadable(lazy(() => import('pages/master-management/state')));
const AddEditState = Loadable(lazy(() => import('pages/master-management/state/component/addEditState')));
const City = Loadable(lazy(() => import('pages/master-management/city')));
const AddEditCity = Loadable(lazy(() => import('pages/master-management/city/component/addEditCity')));
const Company = Loadable(lazy(() => import('pages/master-management/company')));
const AddEditCompany = Loadable(lazy(() => import('pages/master-management/company/component/addEditCompany')));
const Customer = Loadable(lazy(() => import('pages/customer')));
const AddEditCustomer = Loadable(lazy(() => import('pages/customer/component/addEditCustomer')));
const MembershipPlan = Loadable(lazy(() => import('pages/master-management/membership-plan')));
const AddEditMembershipPlan = Loadable(lazy(() => import('pages/master-management/membership-plan/component/addEditMembershipPlan')));
const Staff = Loadable(lazy(() => import('pages/staff-management/staff')));
const AddEditStaff = Loadable(lazy(() => import('pages/staff-management/staff/component/addEditStaff')));
const Bill = Loadable(lazy(() => import('pages/bill')));
const AddEditBill = Loadable(lazy(() => import('pages/bill/component/addEditBill')));
const Membership = Loadable(lazy(() => import('pages/membership')));
const DailyReport = Loadable(lazy(() => import('pages/daily-report')));
const AddEditDailyReport = Loadable(lazy(() => import('pages/daily-report/component/addEditDailyReport')));
const LaundryItem = Loadable(lazy(() => import('pages/laundry-management/item')));
const AddEditLaundryItem = Loadable(lazy(() => import('pages/laundry-management/item/component/addEditItem')));
const LaundryWasher = Loadable(lazy(() => import('pages/laundry-management/washer')));
const AddEditLaundryWasher = Loadable(lazy(() => import('pages/laundry-management/washer/addEditWasher')));
const LaundryManagement = Loadable(lazy(() => import('pages/laundry-management/management')));
const AddEditLaundryManagement = Loadable(lazy(() => import('pages/laundry-management/management/addEditManagement')));
const LaundryReceiver = Loadable(lazy(() => import('pages/laundry-management/receiver')));
const AddEditLaundryReceiver = Loadable(lazy(() => import('pages/laundry-management/receiver/addEditReceiver')));
const LaundryReport = Loadable(lazy(() => import('pages/report/laundry-report')));
const CompanyStaffSalaryReport = Loadable(lazy(() => import('pages/report/company-staff-salary-report')));
const StaffReport = Loadable(lazy(() => import('pages/report/staff-report')));
const SalesReport = Loadable(lazy(() => import('pages/report/sales-report')));
const WebSetting = Loadable(lazy(() => import('pages/website-management/web-setting')));
const AddEditWebSetting = Loadable(lazy(() => import('pages/website-management/web-setting/addEditWebSetting')));
const HomePage = Loadable(lazy(() => import('pages/website-management/home-page')));
const AddEditHomePage = Loadable(lazy(() => import('pages/website-management/home-page/addEditHomePage')));
const SeoPage = Loadable(lazy(() => import('pages/website-management/seo')));
const AddEditSeo = Loadable(lazy(() => import('pages/website-management/seo/addEditSeo')));
const Blog = Loadable(lazy(() => import('pages/website-management/blog')));
const AddEditBlog = Loadable(lazy(() => import('pages/website-management/blog/addEditBlog')));
const PaymentBank = Loadable(lazy(() => import('pages/master-management/payment-bank')));
const AddEditPaymentBank = Loadable(lazy(() => import('pages/master-management/payment-bank/addEditPaymentBank')));
const Advance = Loadable(lazy(() => import('pages/master-management/advance')));
const AddEditAdvance = Loadable(lazy(() => import('pages/master-management/advance/addEditAdvance')));
const Salary = Loadable(lazy(() => import('pages/master-management/salary')));
const Faq = Loadable(lazy(() => import('pages/website-management/faq')));
const AddEditFaq = Loadable(lazy(() => import('pages/website-management/faq/addEditFaq')));
const Enquiry = Loadable(lazy(() => import('pages/website-management/enquiry')));
const AddEditEnquiry = Loadable(lazy(() => import('pages/website-management/enquiry/addEditEnquiry')));
const Franchise = Loadable(lazy(() => import('pages/website-management/franchise')));
const Whatsapp = Loadable(lazy(() => import('pages/website-management/whatsapp')));
const AddEditWhatsapp = Loadable(lazy(() => import('pages/website-management/whatsapp/addEditWhatsapp')));
const ContactUs = Loadable(lazy(() => import('pages/website-management/contact-us')));
const Rent = Loadable(lazy(() => import('pages/rent-management/rent')));
const AddEditRent = Loadable(lazy(() => import('pages/rent-management/rent/compnent/addEditRent')));

// ==============================|| MAIN ROUTES ||============================== //

import { RoleProvider } from 'pages/user-management/role/context/roleContext';
import { ModuleProvider } from 'pages/user-management/module/context/moduleContext';
import { RouteObject } from 'react-router-dom';

const MainRoutes: RouteObject = {
  path: '/',
  // errorElement: <Error404 />,
  children: [
    {
      path: '',
      element: <DashboardLayout />,
      children: [
        {
          path: 'dashboard',
          children: [
            {
              path: '',
              element: <Dashboard />
            },
            {
              path: 'analytics',
              element: <DashboardAnalytics />
            },
            {
              path: 'finance',
              element: <DashboardFinance />
            }
          ]
        },
        {
          path: 'contact-us',
          element: <ContactUs />
        },
        {
          path: 'salary',
          element: <Salary />
        },
        {
          path: 'salary-report',
          element: <CompanyStaffSalaryReport />
        },
        {
          path: 'staff-report',
          element: <StaffReport />
        },
        {
          path: 'sales-report',
          element: <SalesReport />
        },
        {
          path: 'website-management',
          children: [
            {
              path: 'whatsapp',
              children: [
                {
                  path: '',
                  element: <Whatsapp />
                },
                {
                  path: ':mode',
                  element: <AddEditWhatsapp />
                },
                {
                  path: ':mode/:id',
                  element: <AddEditWhatsapp />
                }
              ]
            },
            {
              path: 'faq',
              children: [
                {
                  path: '',
                  element: <Faq />
                },
                {
                  path: ':mode',
                  element: <AddEditFaq />
                },
                {
                  path: ':mode/:id',
                  element: <AddEditFaq />
                }
              ]
            },
            {
              path: 'web-setting',
              children: [
                {
                  path: '',
                  element: <WebSetting />
                },
                {
                  path: ':mode',
                  element: <AddEditWebSetting />
                },
                {
                  path: ':mode/:id',
                  element: <AddEditWebSetting />
                }
              ]
            },
            {
              path: 'home-page',
              children: [
                {
                  path: '',
                  element: <HomePage />
                },
                {
                  path: ':mode',
                  element: <AddEditHomePage />
                },
                {
                  path: ':mode/:id',
                  element: <AddEditHomePage />
                }
              ]
            },
            {
              path: 'seo',
              children: [
                {
                  path: '',
                  element: <SeoPage />
                },
                {
                  path: ':mode',
                  element: <AddEditSeo />
                },
                {
                  path: ':mode/:id',
                  element: <AddEditSeo />
                }
              ]
            },
            {
              path: 'blog',
              children: [
                {
                  path: '',
                  element: <Blog />
                },
                {
                  path: ':mode',
                  element: <AddEditBlog />
                },
                {
                  path: ':mode/:id',
                  element: <AddEditBlog />
                }
              ]
            },
            {
              path: 'enquiry',
              children: [
                {
                  path: '',
                  element: <Enquiry />
                },
                {
                  path: ':mode',
                  element: <AddEditEnquiry />
                },
                {
                  path: ':mode/:id',
                  element: <AddEditEnquiry />
                }
              ]
            },
            {
              path: 'franchise-enquiry',
              children: [
                {
                  path: '',
                  element: <Franchise />
                }
              ]
            }
          ]
        },
        {
          path: 'advance',
          children: [
            {
              path: '',
              element: <Advance />
            },
            {
              path: ':mode',
              element: <AddEditAdvance />
            },
            {
              path: ':mode/:id',
              element: <AddEditAdvance />
            }
          ]
        },
        {
          path: 'payment-bank',
          children: [
            {
              path: '',
              element: <PaymentBank />
            },
            {
              path: ':mode',
              element: <AddEditPaymentBank />
            },
            {
              path: ':mode/:id',
              element: <AddEditPaymentBank />
            }
          ]
        },
        {
          path: 'role',
          children: [
            {
              path: '',
              element: <RoleProvider><Role /></RoleProvider>
            },
            {
              path: ':mode',
              element: <AddEditRole />
            },
            {
              path: ':mode/:id',
              element: <AddEditRole />
            }
          ]
        },
        {
          path: 'module',
          children: [
            {
              path: '',
              element: <ModuleProvider><Module /></ModuleProvider>
            },
            {
              path: ':mode',
              element: <AddEditModule />
            },
            {
              path: ':mode/:id',
              element: <AddEditModule />
            }
          ]
        },
        {
          path: 'right',
          element: <Rights />
        },
        {
          path: 'service-category',
          children: [
            {
              path: '',
              element: <ServiceCategory />
            },
            {
              path: ':mode',
              element: <AddEditServiceCategory />
            },
            {
              path: ':mode/:id',
              element: <AddEditServiceCategory />
            }
          ]
        },
        {
          path: 'service',
          children: [
            {
              path: '',
              element: <Service />
            },
            {
              path: ':mode',
              element: <AddEditService />
            },
            {
              path: ':mode/:id',
              element: <AddEditService />
            }
          ]
        },
        {
          path: 'daily-report',
          children: [
            {
              path: '',
              element: <DailyReport />
            },
            {
              path: ':mode',
              element: <AddEditDailyReport />
            },
            {
              path: ':mode/:id',
              element: <AddEditDailyReport />
            }
          ]
        },
        {
          path: 'rent-management',
          children: [
            {
              path: 'rent',
              element: <Rent />
            },
            {
              path: 'rent/:mode',
              element: <AddEditRent />
            },
            {
              path: 'rent/:mode/:id',
              element: <AddEditRent />
            }
          ]
        },
        {
          path: 'laundry-management',
          children: [
            {
              path: 'laundry-report',
              element: <LaundryReport />
            },
            {
              path: 'laundry-receiver',
              children: [
                {
                  path: '',
                  element: <AddEditLaundryReceiver />
                },
                {
                  path: ':mode',
                  element: <AddEditLaundryReceiver />
                },
                {
                  path: ':mode/:id',
                  element: <AddEditLaundryReceiver />
                }
              ]
            },
            {
              path: 'laundry-management',
              children: [
                {
                  path: '',
                  element: <LaundryManagement />
                },
                {
                  path: ':mode',
                  element: <AddEditLaundryManagement />
                },
                {
                  path: ':mode/:id',
                  element: <AddEditLaundryManagement />
                }
              ]
            },
            {
              path: 'laundry-item',
              children: [
                {
                  path: '',
                  element: <LaundryItem />
                },
                {
                  path: ':mode',
                  element: <AddEditLaundryItem />
                },
                {
                  path: ':mode/:id',
                  element: <AddEditLaundryItem />
                }
              ]
            },
            {
              path: 'laundry-washer',
              children: [
                {
                  path: '',
                  element: <LaundryWasher />
                },
                {
                  path: ':mode',
                  element: <AddEditLaundryWasher />
                },
                {
                  path: ':mode/:id',
                  element: <AddEditLaundryWasher />
                }
              ]
            }
          ]
        },
        {
          path: 'room',
          children: [
            {
              path: '',
              element: <Room />
            },
            {
              path: ':mode',
              element: <AddEditRoom />
            },
            {
              path: ':mode/:id',
              element: <AddEditRoom />
            }
          ]
        },
        {
          path: 'employee-type',
          children: [
            {
              path: '',
              element: <EmployeeType />
            },
            {
              path: ':mode',
              element: <AddEditEmployeeType />
            },
            {
              path: ':mode/:id',
              element: <AddEditEmployeeType />
            }
          ]
        },
        {
          path: 'payment-type',
          children: [
            {
              path: '',
              element: <PaymentType />
            },
            {
              path: ':mode',
              element: <AddEditPaymentType />
            },
            {
              path: ':mode/:id',
              element: <AddEditPaymentType />
            }
          ]
        },
        {
          path: 'branch',
          children: [
            {
              path: '',
              element: <Branch />
            },
            {
              path: ':mode',
              element: <AddEditBranch />
            },
            {
              path: ':mode/:id',
              element: <AddEditBranch />
            }
          ]
        },
        {
          path: 'state',
          children: [
            {
              path: '',
              element: <State />
            },
            {
              path: ':mode',
              element: <AddEditState />
            },
            {
              path: ':mode/:id',
              element: <AddEditState />
            }
          ]
        },
        {
          path: 'city',
          children: [
            {
              path: '',
              element: <City />
            },
            {
              path: ':mode',
              element: <AddEditCity />
            },
            {
              path: ':mode/:id',
              element: <AddEditCity />
            }
          ]
        },
        {
          path: 'company',
          children: [
            {
              path: '',
              element: <Company />
            },
            {
              path: ':mode',
              element: <AddEditCompany />
            },
            {
              path: ':mode/:id',
              element: <AddEditCompany />
            }
          ]
        },
        {
          path: 'customer',
          children: [
            {
              path: '',
              element: <Customer />
            },
            {
              path: ':mode',
              element: <AddEditCustomer />
            },
            {
              path: ':mode/:id',
              element: <AddEditCustomer />
            }
          ]
        },
        {
          path: 'membership-plan',
          children: [
            {
              path: '',
              element: <MembershipPlan />
            },
            {
              path: ':mode',
              element: <AddEditMembershipPlan />
            },
            {
              path: ':mode/:id',
              element: <AddEditMembershipPlan />
            }
          ]
        },
        {
          path: 'staff',
          children: [
            {
              path: '',
              element: <Staff />
            },
            {
              path: ':mode',
              element: <AddEditStaff />
            },
            {
              path: ':mode/:id',
              element: <AddEditStaff />
            }
          ]
        },
        {
          path: 'bill',
          children: [
            {
              path: '',
              element: <Bill />
            },
            {
              path: ':mode',
              element: <AddEditBill />
            },
            {
              path: ':mode/:id',
              element: <AddEditBill />
            }
          ]
        },
        {
          path: 'membership',
          children: [
            {
              path: '',
              element: <Membership />
            }
          ]
        },
        {
          path: 'widget',
          children: [
            {
              path: 'statistics',
              element: <WidgetStatistics />
            },
            {
              path: 'data',
              element: <WidgetData />
            },
            {
              path: 'chart',
              element: <WidgetChart />
            }
          ]
        },
        {
          path: 'admin-panel',
          children: [
            {
              path: 'online-course',
              children: [
                {
                  path: 'dashboard',
                  element: <OnlineCoursesDashboard />
                },
                {
                  path: 'teacher/list',
                  element: <OnlineCoursesTeacherList />
                },
                {
                  path: 'teacher/applied',
                  element: <OnlineCoursesAppliedTeacher />
                },
                {
                  path: 'teacher/add',
                  element: <OnlineCoursesAddTeacher />
                },
                {
                  path: 'student/list',
                  element: <OnlineCoursesStudentList />
                },
                {
                  path: 'student/applied',
                  element: <OnlineCoursesAppliedStudent />
                },
                {
                  path: 'student/add',
                  element: <OnlineCoursesAddStudent />
                },
                {
                  path: 'courses/view',
                  element: <OnlineCoursesCoursesView />
                },
                {
                  path: 'courses/add',
                  element: <OnlineCoursesAddCourses />
                },
                {
                  path: 'pricing',
                  element: <OnlineCoursesPricing />
                },
                {
                  path: 'site',
                  element: <OnlineCoursesSite />
                },
                {
                  path: 'setting/payment',
                  element: <OnlineCoursesSettingPayment />
                },
                {
                  path: 'setting/pricing',
                  element: <OnlineCoursesSettingPricing />
                },
                {
                  path: 'setting/notification',
                  element: <OnlineCoursesSettingNotification />
                }
              ]
            },
            {
              path: 'membership',
              children: [
                {
                  path: 'dashboard',
                  element: <AdminMembershipDashbord />
                },
                {
                  path: 'list',
                  element: <AdminMembershipList />
                },
                {
                  path: 'pricing',
                  element: <AdminMembershipPricing />
                },
                {
                  path: 'setting',
                  element: <AdminMembershipSetting />
                }
              ]
            },
            {
              path: 'helpdesk',
              children: [
                {
                  path: 'dashboard',
                  element: <AdminHelpdeskDashbord />
                },
                {
                  path: 'create-ticket',
                  element: <AdminHelpdeskCreateTicket />
                },
                {
                  path: 'ticket-list',
                  element: <AdminHelpdeskTicketList />
                },
                {
                  path: 'ticket-details',
                  element: <AdminHelpdeskTicketDetails />
                },
                {
                  path: 'customer',
                  element: <AdminHelpdeskCustomer />
                }
              ]
            }
          ]
        },
        {
          path: 'apps',
          children: [
            {
              path: 'chat',
              element: <AppChat />
            },
            {
              path: 'calendar',
              element: <AppCalendar />
            },
            {
              path: 'kanban',
              element: <AppKanban />,
              children: [
                {
                  path: 'backlogs',
                  element: <AppKanbanBacklogs />
                },
                {
                  path: 'board',
                  element: <AppKanbanBoard />
                }
              ]
            },
            {
              path: 'customer',
              children: [
                {
                  path: 'customer-list',
                  element: <AppCustomerList />
                },
                {
                  path: 'customer-card',
                  element: <AppCustomerCard />
                }
              ]
            },
            {
              path: 'invoice',
              children: [
                {
                  path: 'dashboard',
                  element: <AppInvoiceDashboard />
                },
                {
                  path: 'create',
                  element: <AppInvoiceCreate />
                },
                {
                  path: 'details/:id',
                  element: <AppInvoiceDetails />
                },
                {
                  path: 'edit/:id',
                  element: <AppInvoiceEdit />
                },
                {
                  path: 'list',
                  element: <AppInvoiceList />
                }
              ]
            },
            {
              path: 'profiles',
              children: [
                {
                  path: 'account',
                  element: <AccountProfile />,
                  children: [
                    {
                      path: 'basic',
                      element: <AccountTabProfile />
                    },
                    {
                      path: 'personal',
                      element: <AccountTabPersonal />
                    },
                    {
                      path: 'my-account',
                      element: <AccountTabAccount />
                    },
                    {
                      path: 'password',
                      element: <AccountTabPassword />
                    },
                    {
                      path: 'role',
                      element: <AccountTabRole />
                    },
                    {
                      path: 'settings',
                      element: <AccountTabSettings />
                    }
                  ]
                },
                {
                  path: 'user',
                  element: <UserProfile />,
                  children: [
                    {
                      path: 'personal',
                      element: <UserTabPersonal />
                    },
                    {
                      path: 'payment',
                      element: <UserTabPayment />
                    },
                    {
                      path: 'password',
                      element: <UserTabPassword />
                    },
                    {
                      path: 'settings',
                      element: <UserTabSettings />
                    }
                  ]
                },
                {
                  path: 'social-profile',
                  element: <SocialProfile />,
                  children: [
                    {
                      path: 'profile',
                      element: <SocialTabProfile />
                    },
                    {
                      path: 'friends',
                      element: <SocialTabFriends />
                    },
                    {
                      path: 'friend-requests',
                      element: <SocialTabFriendRequest />
                    },
                    {
                      path: 'gallery',
                      element: <SocialTabGallery />
                    }
                  ]
                }
              ]
            },
            {
              path: 'e-commerce',
              children: [
                {
                  path: 'products',
                  element: <AppECommProducts />,
                  loader: productsLoader,
                  errorElement: <ErrorBoundary />
                },
                {
                  path: 'product-details/:id',
                  element: <AppECommProductDetails />,
                  loader: productLoader,
                  errorElement: <ErrorBoundary />
                },
                {
                  path: 'product-list',
                  element: <AppECommProductList />,
                  loader: productsLoader,
                  errorElement: <ErrorBoundary />
                },
                {
                  path: 'add-new-product',
                  element: <AppECommAddProduct />
                },
                {
                  path: 'checkout',
                  element: <AppECommCheckout />
                }
              ]
            },
            {
              path: 'file-manager',
              element: <AppFileManager />
            },
            {
              path: 'mail',
              element: <AppMail />
            }
          ]
        },
        {
          path: 'forms',
          children: [
            {
              path: 'validation',
              element: <FormsValidation />
            },
            {
              path: 'wizard',
              element: <FormsWizard />
            },
            {
              path: 'layout',
              children: [
                {
                  path: 'basic',
                  element: <FormsLayoutBasic />
                },
                {
                  path: 'multi-column',
                  element: <FormsLayoutMultiColumn />
                },
                {
                  path: 'action-bar',
                  element: <FormsLayoutActionBar />
                },
                {
                  path: 'sticky-bar',
                  element: <FormsLayoutStickyBar />
                }
              ]
            },
            {
              path: 'plugins',
              children: [
                {
                  path: 'mask',
                  element: <FormsPluginsMask />
                },
                {
                  path: 'clipboard',
                  element: <FormsPluginsClipboard />
                },
                {
                  path: 're-captcha',
                  element: <FormsPluginsRecaptcha />
                },
                {
                  path: 'editor',
                  element: <FormsPluginsEditor />
                },
                {
                  path: 'dropzone',
                  element: <FormsPluginsDropzone />
                }
              ]
            }
          ]
        },
        {
          path: 'tables',
          children: [
            {
              path: 'react-table',
              children: [
                {
                  path: 'basic',
                  element: <ReactTableBasic />
                },
                {
                  path: 'dense',
                  element: <ReactDenseTable />
                },
                {
                  path: 'sorting',
                  element: <ReactTableSorting />
                },
                {
                  path: 'filtering',
                  element: <ReactTableFiltering />
                },
                {
                  path: 'grouping',
                  element: <ReactTableGrouping />
                },
                {
                  path: 'pagination',
                  element: <ReactTablePagination />
                },
                {
                  path: 'row-selection',
                  element: <ReactTableRowSelection />
                },
                {
                  path: 'expanding',
                  element: <ReactTableExpanding />
                },
                {
                  path: 'editable',
                  element: <ReactTableEditable />
                },
                {
                  path: 'drag-drop',
                  element: <ReactTableDragDrop />
                },
                {
                  path: 'column-visibility',
                  element: <ReactTableColumnVisibility />
                },
                {
                  path: 'column-resizing',
                  element: <ReactTableColumnResizing />
                },
                {
                  path: 'sticky-table',
                  element: <ReactTableStickyTable />
                },
                {
                  path: 'umbrella',
                  element: <ReactTableUmbrella />
                },
                {
                  path: 'empty',
                  element: <ReactTableEmpty />
                },
                {
                  path: 'virtualized',
                  element: <ReactTableVirtualized />
                }
              ]
            },
            {
              path: 'mui-table',
              children: [
                {
                  path: 'basic',
                  element: <MuiTableBasic />
                },
                {
                  path: 'dense',
                  element: <MuiTableDense />
                },
                {
                  path: 'enhanced',
                  element: <MuiTableEnhanced />
                },
                {
                  path: 'datatable',
                  element: <MuiTableDatatable />
                },
                {
                  path: 'custom',
                  element: <MuiTableCustom />
                },
                {
                  path: 'fixed-header',
                  element: <MuiTableFixedHeader />
                },
                {
                  path: 'collapse',
                  element: <MuiTableCollapse />
                }
              ]
            }
          ]
        },
        {
          path: 'charts',
          children: [
            {
              path: 'apexchart',
              element: <ChartApexchart />
            },
            {
              path: 'org-chart',
              element: <ChartOrganization />
            }
          ]
        },
        {
          path: 'map',
          element: <Map />
        },
        {
          path: 'sample-page',
          element: <SamplePage />
        },
        {
          path: 'price',
          children: [
            {
              path: 'price1',
              element: <PricingPage />
            },
            {
              path: 'price2',
              element: <PricingPage2 />
            }
          ]
        }
      ]
    },
    {
      path: '/',
      element: <SimpleLayout layout={SimpleLayoutType.LANDING} />,
      children: [
        {
          path: 'landing',
          element: <Landing />
        }
      ]
    },
    // {
    //   path: '/',
    //   element: <SimpleLayout />,
    //   children: [
    //     {
    //       path: 'contact-us',
    //       element: <ContactUS />
    //     }
    //   ]
    // },

    {
      path: '/',
      element: <SimpleLayout />,
      children: [
        {
          path: 'change-log',
          element: <ChangeLog />
        }
      ]
    },
    {
      path: '/',
      element: <SimpleLayout />,
      children: [
        {
          path: 'faqs',
          element: <FaqPage />
        }
      ]
    },
    {
      path: '/maintenance',
      element: <PagesLayout />,
      children: [
        {
          path: '404',
          element: <MaintenanceError />
        },
        {
          path: '500',
          element: <MaintenanceError500 />
        },
        {
          path: 'under-construction',
          element: <MaintenanceUnderConstruction />
        },
        {
          path: 'under-construction2',
          element: <MaintenanceUnderConstruction2 />
        },
        {
          path: 'coming-soon',
          element: <MaintenanceComingSoon />
        },
        {
          path: 'coming-soon2',
          element: <MaintenanceComingSoon2 />
        },
        {
          path: 'join-waitlist',
          element: <MaintenanceJoinWaitlist />
        }
      ]
    },
    {
      path: '/auth',
      element: <PagesLayout />,
      children: [
        {
          path: 'login',
          element: <AuthLogin />
        },
        {
          path: 'register',
          element: <AuthRegister />
        },
        {
          path: 'forgot-password',
          element: <AuthForgotPassword />
        },
        {
          path: 'reset-password',
          element: <AuthResetPassword />
        },
        {
          path: 'check-mail',
          element: <AuthCheckMail />
        },
        {
          path: 'code-verification',
          element: <AuthCodeVerification />
        },
        {
          path: 'login2',
          element: <AuthLogin2 />
        },
        {
          path: 'register2',
          element: <AuthRegister2 />
        },
        {
          path: 'forgot-password2',
          element: <AuthForgotPassword2 />
        },
        {
          path: 'reset-password2',
          element: <AuthResetPassword2 />
        },
        {
          path: 'check-mail2',
          element: <AuthCheckMail2 />
        },
        {
          path: 'code-verification2',
          element: <AuthCodeVerification2 />
        },
        {
          path: 'login3',
          element: <AuthLogin3 />
        }
      ]
    },
    { path: '*', element: <MaintenanceError /> }
  ]
};

export default MainRoutes;
