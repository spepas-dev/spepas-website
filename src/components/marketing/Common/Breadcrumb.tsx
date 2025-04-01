import { Link } from 'react-router-dom';

const Breadcrumb = ({ title, pages }: { title: string; pages: string[] }) => {
  return (
    <div className="overflow-hidden shadow-breadcrumb pt-[35px] sm:pt-[45px] lg:pt-[45px] xl:pt-[65px]">
      <div className="">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 py-5 xl:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="font-semibold text-dark text-xl sm:text-2xl xl:text-custom-2">{title}</h1>

            <ul className="flex items-center gap-2">
              <li className="text-custom-sm hover:text-blue">
                <Link to="/">Home /</Link>
              </li>

              {pages.length > 0 &&
                pages.map((page: string, key: number) => (
                  <li className="text-custom-sm last:text-blue capitalize" key={key}>
                    {page}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
