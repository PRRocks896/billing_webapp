// project-imports
// import adminPanel from './admin-panel';
// import applications from './applications';
// import chartsMap from './charts-map';
// import formsTables from './forms-tables';
// import pages from './pages';
// import samplePage from './sample-page';
// import support from './support';
// import widget from './widget';

import {
  Book1,
  ProfileCircle,
  Profile2User,
  KyberNetwork,
  Bill,
  Medal,
  UserOctagon,
  Receipt,
  Ticket
} from 'iconsax-reactjs';

// types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  // items: [widget, adminPanel, applications, formsTables, chartsMap, samplePage, pages, support]
  items: [
    {
      id: 'group-admin-panel',
      title: 'admin-panel',
      icon: Book1,
      type: 'group',
      children: [
        {
          id: 'dashboard1',
          title: 'dashboard',
          type: 'item',
          url: '/dashboard',
          icon: Book1,
          breadcrumbs: false
        },
        {
          id: 'User',
          title: 'User Management',
          type: 'collapse',
          icon: Profile2User,
          children: [
            {
              id: 'role',
              title: 'Role',
              type: 'item',
              url: '/role',
              breadcrumbs: false
            },
            {
              id: 'module',
              title: 'Module',
              type: 'item',
              url: '/module',
              breadcrumbs: false
            },
            {
              id: 'right',
              title: 'Right',
              type: 'item',
              url: '/right',
              breadcrumbs: false
            }
          ]
        },
        {
          id: 'service-management',
          title: 'Service Management',
          type: 'collapse',
          icon: KyberNetwork,
          children: [
            {
              id: 'service-category',
              title: 'Service Category',
              type: 'item',
              url: '/service-category',
              breadcrumbs: false
            },
            {
              id: 'service',
              title: 'Service',
              type: 'item',
              url: '/service',
              breadcrumbs: false
            }
          ]
        },
        {
          id: 'master',
          title: 'Master Management',
          type: 'collapse',
          icon: KyberNetwork,
          children: [
            {
              id: 'purchase-gift-card',
              title: 'Purchase Gift Card',
              type: 'item',
              url: '/purchase-gift-card',
              breadcrumbs: false
            },
            {
              id: 'gift-category',
              title: 'Gift Category',
              type: 'item',
              url: '/gift-category',
              breadcrumbs: false
            },
            {
              id: 'membership-plan',
              title: 'Membership Plan',
              type: 'item',
              url: '/membership-plan',
              breadcrumbs: false
            },
            {
              id: 'salary',
              title: 'Salary',
              type: 'item',
              url: '/salary',
              breadcrumbs: false
            },
            {
              id: 'payment-bank',
              title: 'Payment Bank',
              type: 'item',
              url: '/payment-bank',
              breadcrumbs: false
            },
            {
              id: 'advance',
              title: 'Advance',
              type: 'item',
              url: '/advance',
              breadcrumbs: false
            },
            {
              id: 'room',
              title: 'Room',
              type: 'item',
              url: '/room',
              breadcrumbs: false
            },
            {
              id: 'employee-type',
              title: 'Employee Type',
              type: 'item',
              url: '/employee-type',
              breadcrumbs: false
            },
            {
              id: 'payment-type',
              title: 'Payment Type',
              type: 'item',
              url: '/payment-type',
              breadcrumbs: false
            },
            {
              id: 'state',
              title: 'State',
              type: 'item',
              url: '/state',
              breadcrumbs: false
            },
            {
              id: 'city',
              title: 'City',
              type: 'item',
              url: '/city',
              breadcrumbs: false
            },
            {
              id: 'company',
              title: 'Company',
              type: 'item',
              url: '/company',
              breadcrumbs: false
            }
          ]
        },
        {
          id: 'website-management',
          title: 'Website Management',
          type: 'collapse',
          icon: KyberNetwork,
          children: [
            {
              id: 'promo-code',
              title: 'Promo Code',
              type: 'item',
              url: '/website-management/promo-code',
              breadcrumbs: false
            },
            {
              id: 'purchased-gift-card',
              title: 'Purchased Gift Card',
              type: 'item',
              url: '/purchased-gift-card',
              breadcrumbs: false
            },
            {
              id: 'employee-wellness-plan',
              title: 'Employee Wellness Plan',
              type: 'item',
              url: '/employee-wellness-plan',
              breadcrumbs: false
            },
            {
              id: 'web-setting',
              title: 'Web Setting',
              type: 'item',
              url: '/website-management/web-setting',
              breadcrumbs: false
            },
            {
              id: 'home-page',
              title: 'Home Page',
              type: 'item',
              url: '/website-management/home-page',
              breadcrumbs: false
            },
            {
              id: 'seo',
              title: 'SEO',
              type: 'item',
              url: '/website-management/seo',
              breadcrumbs: false
            },
            {
              id: 'blog',
              title: 'Blog',
              type: 'item',
              url: '/website-management/blog',
              breadcrumbs: false
            },
            {
              id: 'faq',
              title: 'FAQ',
              type: 'item',
              url: '/website-management/faq',
              breadcrumbs: false
            },
            {
              id: 'whatsapp',
              title: 'Whatsapp',
              type: 'item',
              url: '/website-management/whatsapp',
              breadcrumbs: false
            }
          ]
        },
        {
          id: 'laundry-management',
          title: 'Laundry Management',
          type: 'collapse',
          icon: KyberNetwork,
          children: [
            {
              id: 'report',
              title: 'Laundry Report',
              type: 'item',
              url: '/laundry-management/laundry-report',
              breadcrumbs: false
            },
            {
              id: 'stock',
              title: 'Laundry Stock',
              url: '/laundry-management/laundry-stock',
              type: 'item',
              breadcrumbs: false
            },
            {
              id: 'stock-history',
              title: 'Laundry Stock History',
              url: '/laundry-management/laundry-stock-history',
              type: 'item',
              breadcrumbs: false
            },
            {
              id: 'management',
              title: 'Laundry Management',
              url: '/laundry-management/laundry-management',
              type: 'item',
              breadcrumbs: false
            },
            {
              id: 'item',
              title: 'Laundry Item',
              type: 'item',
              url: '/laundry-management/laundry-item',
              breadcrumbs: false
            },
            {
              id: 'receiver',
              title: 'Laundry Receiver',
              type: 'item',
              url: '/laundry-management/laundry-receiver',
              breadcrumbs: false
            },
            {
              id: 'washer',
              title: 'Laundry Washer',
              type: 'item',
              url: '/laundry-management/laundry-washer',
              breadcrumbs: false
            }
          ]
        },
        {
          id: 'reports',
          title: 'Reports',
          type: 'collapse',
          icon: Receipt,
          children: [
            {
              id: 'staff-report',
              title: 'Staff Report',
              type: 'item',
              url: '/staff-report',
              breadcrumbs: false
            },
            {
              id: 'sales-report',
              title: 'Sales Report',
              type: 'item',
              url: '/sales-report',
              breadcrumbs: false
            }
          ]
        },
        {
          id: 'staff-management',
          title: 'Staff Management',
          type: 'collapse',
          icon: KyberNetwork,
          children: [
            {
              id: 'staff',
              title: 'Staff',
              type: 'item',
              url: '/staff',
              breadcrumbs: false
            },
            {
              id: 'salary-report',
              title: 'Salary report',
              type: 'item',
              url: '/salary-report',
              breadcrumbs: false,
            },
            {
              id: 'face-register',
              title: 'Face Registration',
              type: 'item',
              url: '/face-register',
              breadcrumbs: false
            },
            {
              id: 'face-attendance',
              title: 'Face Attendance',
              type: 'item',
              url: '/face-attendance',
              breadcrumbs: false
            }
          ]
        },

        {
          id: 'rent-management',
          title: 'Rent Management',
          type: 'collapse',
          icon: KyberNetwork,
          children: [
            {
              id: 'rent',
              title: 'Rent',
              type: 'item',
              url: '/rent-management/rent',
              breadcrumbs: false
            }
          ]
        },
        {
          id: 'contact-us',
          title: 'Contact Us',
          type: 'item',
          url: '/contact-us',
          icon: KyberNetwork,
          breadcrumbs: false
        },
        {
          id: 'daily-report',
          title: 'Daily Report',
          type: 'item',
          url: '/daily-report',
          breadcrumbs: false,
          icon: Bill,
        },
        {
          id: 'branch',
          title: 'Branch Management',
          type: 'item',
          url: '/branch',
          breadcrumbs: false,
          icon: ProfileCircle
        },
        {
          id: 'customer',
          title: 'Customer',
          type: 'item',
          url: '/customer',
          breadcrumbs: false,
          icon: ProfileCircle
        },
        {
          id: 'membership',
          title: 'Membership',
          type: 'item',
          url: '/membership',
          breadcrumbs: false,
          icon: UserOctagon
        },
        {
          id: 'booking-service',
          title: 'Booking Service',
          type: 'item',
          url: '/booking-service',
          breadcrumbs: false,
          icon: Ticket
        },
        {
          id: 'redeem-booking',
          title: 'Redeem Booking',
          type: 'item',
          url: '/redeem-booking',
          breadcrumbs: false,
          icon: Ticket
        },
        {
          id: 'bill',
          title: 'Bill',
          type: 'item',
          url: '/bill',
          breadcrumbs: false,
          icon: Bill
        },
        {
          id: 'inquiry-management',
          title: 'Inquiry Management',
          type: 'collapse',
          breadcrumbs: false,
          icon: Ticket,
          children: [
            {
              id: 'Inquiry',
              title: 'Website Inquiry',
              type: 'item',
              url: '/inquiry-management/inquiry',
              breadcrumbs: false
            },
            {
              id: 'franchise-inquiry',
              title: 'Franchise Inquiry',
              type: 'item',
              url: '/inquiry-management/franchise-inquiry',
              breadcrumbs: false
            },
            {
              id: 'employee-wellness-inquiry',
              title: 'Employee Wellness Inquiry',
              type: 'item',
              url: '/inquiry-management/employee-wellness-inquiry',
              breadcrumbs: false
            },
          ]
        }
      ]
    }
  ]
};

export default menuItems;
