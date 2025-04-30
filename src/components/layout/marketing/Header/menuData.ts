import { Menu } from '@/components/layout/marketing/Header/Menu';

export const menuData: Menu[] = [
  {
    id: 1,
    title: 'Home',
    newTab: false,
    path: '/'
  },
  // {
  //   id: 2,
  //   title: "Shop",
  //   newTab: false,
  //   path: "/shop-with-sidebar",
  // },
  {
    id: 3,
    title: 'Contact',
    newTab: false,
    path: '/contact'
  },
  {
    id: 6,
    title: 'pages',
    newTab: false,
    path: '/',
    submenu: [
      // {
      //   id: 61,
      //   title: "Shop",
      //   newTab: false,
      //   path: "/shop-with-sidebar",
      // },
      // {
      //   id: 69,
      //   title: "My Account",
      //   newTab: false,
      //   path: "/my-account",
      // },
      // {
      //   id: 70,
      //   title: "Contact",
      //   newTab: false,
      //   path: "/contact",
      // },
      {
        id: 71,
        title: 'Privacy Policy',
        newTab: false,
        path: '/privacy-policy'
      },
      {
        id: 72,
        title: 'Refund Policy',
        newTab: false,
        path: '/refund-policy'
      },
      {
        id: 73,
        title: 'Terms of Use',
        newTab: false,
        path: '/terms'
      },
      {
        id: 70,
        title: 'FAQs',
        newTab: false,
        path: '/faqs'
      }
      // {
      //   id: 63,
      //   title: "Mail Success",
      //   newTab: false,
      //   path: "/mail-success",
      // },
      // {
      //   id: 64,
      //   title: "Bid Requests",
      //   newTab: false,
      //   path: "/bid-requests",
      // },
    ]
  }
  // {
  //   id: 5,
  //   title: "Request Bid",
  //   newTab: false,
  //   path: "/item-request",
  //   icon: {
  //     src: "/images/icons/hammer.svg",
  //     alt: "Hammer Icon",
  //     className: "w-6 h-6 mr-2",
  //   },
  // },
];
