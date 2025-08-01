// src/components/layout/marketing/Header/Dropdown.tsx
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
// import { Menu } from '@/components/layout/marketing/Header/Menu';
import { DropdownProps } from './DropdownProps';

const Dropdown: React.FC<DropdownProps> = ({ menuItem, stickyMenu }) => {
  // If somehow someone calls this without a submenu, bail out early
  if (!menuItem.submenu) return null;

  const [dropdownToggler, setDropdownToggler] = useState(false);
  const pathUrl = useLocation().pathname;

  return (
    <li
      onClick={() => setDropdownToggler(!dropdownToggler)}
      className={`
        group relative
        before:w-0 before:h-[3px] before:bg-blue before:absolute before:left-0 before:top-0
        before:rounded-b-[3px] before:ease-out before:duration-200 hover:before:w-full
        ${pathUrl.includes(menuItem.title) ? 'before:!w-full' : ''}
      `}
    >
      <a
        href="#"
        className={`
          hover:text-blue text-custom-sm font-medium text-dark flex items-center gap-1.5 capitalize
          ${stickyMenu ? 'xl:py-4' : 'xl:py-6'}
          ${pathUrl.includes(menuItem.title) ? '!text-blue' : ''}
        `}
      >
        {menuItem.title}
        {/* Chevron icon */}
        <svg
          className="fill-current cursor-pointer"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.95363 5.67461C3.13334 5.46495 3.44899 5.44067 3.65866 5.62038L7.99993 9.34147L12.3412 5.62038C12.5509 5.44067 12.8665 5.46495 13.0462 5.67461C13.2259 5.88428 13.2017 6.19993 12.992 6.37964L8.32532 10.3796C8.13808 10.5401 7.86178 10.5401 7.67453 10.3796L3.00787 6.37964C2.7982 6.19993 2.77392 5.88428 2.95363 5.67461Z"
          />
        </svg>
      </a>

      {/* Dropdown list */}
      <ul
        className={`
          dropdown
          ${dropdownToggler ? 'flex' : 'hidden'}
          ${stickyMenu ? 'xl:group-hover:translate-y-0' : 'xl:group-hover:translate-y-0'}
        `}
      >
        {menuItem.submenu.map(sub => (
          <li key={sub.id}>
            <Link
              to={sub.path!}
              className={`
                flex text-custom-sm hover:text-blue hover:bg-gray-1
                py-[7px] px-4.5
                ${pathUrl === sub.path ? 'text-blue bg-gray-1' : ''}
              `}
            >
              {sub.title}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
};

export default Dropdown;
