import {
  IconAperture, IconCopy, IconLayoutDashboard, IconLogin, IconMoodHappy, IconTypography, IconUserPlus, IconTicket, IconShoppingCart, IconBuilding, IconUsers, IconSettings, IconChartBar
} from '@tabler/icons-react';

import { uniqueId } from 'lodash';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },

  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconLayoutDashboard,
    href: '/dashboard',
  },
  {
    navlabel: true,
    subheader: 'Utilities',
  },
  {
    id: uniqueId(),
    title: 'Statistics',
    icon: IconChartBar,
    href: '/statistics',
  },
  // {
  //   id: uniqueId(),
  //   title: 'Menu',
  //   icon: IconCopy,
  //   href: '/menu',
  // },
  {
    id: uniqueId(),
    title: 'User Management',
    icon: IconUsers,
    href: '/user-management',
  },
  {
    id: uniqueId(),
    title: 'Restaurants',
    icon: IconBuilding,
    href: '/restaurants',
  },
  {
    id: uniqueId(),
    title: 'Vouchers',
    icon: IconTicket,
    href: '/vouchers',
  },
  {
    id: uniqueId(),
    title: 'Orders',
    icon: IconShoppingCart,
    href: '/orders',
  },
  {
    navlabel: true,
    subheader: 'Auth',
  },
  {
    id: uniqueId(),
    title: 'Logout',
    icon: IconLogin,
    href: '/auth/login',
  },
  {
    id: uniqueId(),
    title: 'Settings',
    icon: IconSettings,
    href: '/settings',
  },
];

export default Menuitems;
