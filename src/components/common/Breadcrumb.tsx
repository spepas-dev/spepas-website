import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbProps {
  title: string;
  pages: string[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ title, pages }) => {
  const lastIndex = pages.length - 1;

  return (
    <div className="bg-white">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 py-5 xl:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="font-semibold text-dark text-xl sm:text-2xl xl:text-custom-2 truncate">{title}</h1>

          {/* make the list scrollable, no wrapping */}
          <ul className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <li className="flex-shrink-0 text-custom-sm hover:text-blue">
              <Link to="/">Home</Link>
            </li>
            {pages.map((page, i) => {
              const isLast = i === lastIndex;
              // show only first/last on mobile
              const hideOnMobile = i > 0 && i < lastIndex;
              return (
                <React.Fragment key={i}>
                  <li className="flex-shrink-0 text-gray-400">/</li>
                  <li
                    className={`
                      flex-shrink-0
                      text-custom-sm
                      capitalize
                      ${hideOnMobile ? 'hidden sm:inline-block' : ''}
                      ${isLast ? 'text-blue font-medium' : 'hover:text-blue'}
                    `}
                  >
                    {isLast ? (
                      // current page: truncate if too long
                      <span className="block max-w-xs truncate">{page}</span>
                    ) : (
                      <Link to={`/shop/${page}`}>{page}</Link>
                    )}
                  </li>
                </React.Fragment>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
