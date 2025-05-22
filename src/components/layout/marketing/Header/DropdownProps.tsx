// src/components/layout/marketing/Header/DropdownProps.ts

import { Menu } from '@/components/layout/marketing/Header/Menu';

export interface DropdownProps {
  /**
   * We only require the full Menu here (submenu may be undefined);
   * inside Dropdown.tsx you’ll guard on menuItem.submenu yourself.
   */
  menuItem: Menu;
  stickyMenu: boolean;
}
