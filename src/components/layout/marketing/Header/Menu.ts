// /components/layout/marketing/Header/Menu

export type Menu = {
    id: number;
    title: string;
    path: string;
    newTab: boolean;
    icon?: {
      src: string;
      alt: string;
      className?: string;
    };
    submenu?: Menu[];
  };
  