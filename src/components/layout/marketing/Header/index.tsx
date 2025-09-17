'use client';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Dropdown from './Dropdown';
import { menuData } from './menuData';
// import { useAppSelector } from "@/redux/store";
// import { useSelector } from "react-redux";
// import { selectTotalPrice } from "@/redux/features/cart-slice";
// import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { useAuth } from '@/features/auth';
import { useAccountType } from '@/features/accountTypeContext';

const Header = () => {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [gopaMenuOpen, setGopaMenuOpen] = useState(false);
  const [requestsMenuOpen, setRequestsMenuOpen] = useState(false);

  const [stickyMenu, setStickyMenu] = useState(false);
  const navigate = useNavigate();
  // const { openCartModal } = useCartModalContext();

  // const product = useAppSelector((state) => state.cartReducer.items);
  // const totalPrice = useSelector(selectTotalPrice);

  // Authentication: get auth state and functions from our AuthProvider
  const { isAuthenticated, authData } = useAuth();
  const { accountType } = useAccountType();

  console.log('authData', authData);

    const sellerId = authData?.user?.sellerDetails?.Seller_ID;
    const gopaId   = authData?.user?.gopa?.Gopa_ID;

  // Sticky menu
  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleStickyMenu);
    return () => window.removeEventListener('scroll', handleStickyMenu);
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 w-full z-9999 bg-white transition-all ease-in-out duration-300 border-b border-gray-3 ${stickyMenu && 'shadow'}`}
    >
      <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
        <div className={`flex flex-row gap-5 items-center justify-between ease-out duration-200 ${stickyMenu ? 'py-4' : 'py-4'}`}>
          <div className="xl:w-auto flex-col sm:flex-row flex justify-between gap-5 sm:gap-10">
            <Link className="flex-shrink-0 max-[430px]:mx-auto" to="/95668339501103956045/home">
              <img src="/images/logo/logo.png" alt="Logo" width={119} height={36} />
            </Link>
          </div>

          <div className="flex lg:w-auto items-center gap-7.5">
            <div className="flex w-full lg:w-auto justify-between items-center gap-5">
              {/* Hamburger Toggle BTN */}
              <button
                id="Toggle"
                aria-label="Toggler"
                className="xl:hidden block"
                onClick={() => setNavigationOpen(!navigationOpen)}
              >
                <span className="block relative cursor-pointer w-5.5 h-5.5">
                  <span className="du-block absolute right-0 w-full h-full">
                    <span
                      className={`block relative top-0 left-0 bg-dark rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-[0] ${
                        !navigationOpen && '!w-full delay-300'
                      }`}
                    ></span>
                    <span
                      className={`block relative top-0 left-0 bg-dark rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-150 ${
                        !navigationOpen && '!w-full delay-400'
                      }`}
                    ></span>
                    <span
                      className={`block relative top-0 left-0 bg-dark rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-200 ${
                        !navigationOpen && '!w-full delay-500'
                      }`}
                    ></span>
                  </span>

                  <span className="block absolute right-0 w-full h-full rotate-45">
                    <span
                      className={`block bg-dark rounded-sm ease-in-out duration-200 delay-300 absolute left-2.5 top-0 w-0.5 h-full ${
                        !navigationOpen && '!h-0 delay-[0] '
                      }`}
                    ></span>
                    <span
                      className={`block bg-dark rounded-sm ease-in-out duration-200 delay-400 absolute left-0 top-2.5 w-full h-0.5 ${
                        !navigationOpen && '!h-0 dealy-200'
                      }`}
                    ></span>
                  </span>
                </span>
              </button>

              <div
                className={`w-[288px] absolute right-4 top-full xl:static xl:w-auto h-0 xl:h-auto invisible xl:visible xl:flex items-center justify-between ${
                  navigationOpen &&
                  '!visible bg-white shadow-lg border border-gray-3 !h-auto max-h-[400px] overflow-y-scroll rounded-md p-5'
                }`}
              >
                {/* Main Nav Start */}
                <nav>
                  <ul className="flex xl:items-center flex-col xl:flex-row gap-5 xl:gap-6">
                    {menuData.map((menuItem, i) =>
                      menuItem.submenu ? (
                        <Dropdown key={i} menuItem={menuItem} stickyMenu={stickyMenu} />
                      ) : (
                        <li
                          key={i}
                          className="group relative before:w-0 before:h-[3px] before:bg-blue before:absolute before:left-0 before:top-0 before:rounded-b-[3px] before:ease-out before:duration-200 hover:before:w-full "
                        >
                          <Link
                            to={menuItem.path || '#'}
                            className={`hover:text-blue text-custom-sm font-medium text-dark flex ${
                              stickyMenu ? 'xl:py-4' : 'xl:py-4'
                            }`}
                          >
                            {menuItem.icon && (
                              <img
                                src={menuItem.icon.src}
                                alt={menuItem.icon.alt}
                                className={menuItem.icon.className}
                              />
                            )}
                            {menuItem.title}
                          </Link>
                        </li>
                      )
                    )}
                  </ul>
                </nav>
                {/* Mobile only actions */}
                <div className={`flex flex-col gap-2 mt-4 ${navigationOpen ? 'block' : 'hidden'} xl:hidden`}>
                  {/* Account / Sign In */}
                  <div className="sm:hidden">
                    {isAuthenticated ? (
                      <button
                        onClick={() => {
                          navigate('/95668339501103956045/my-account');
                          setNavigationOpen(false);
                        }}
                        className="flex items-center bg-gradient-to-r from-blue to-blue-500 text-white text-xs font-medium py-1 px-2 rounded shadow hover:opacity-90 transition"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            d="M12 1.25C9.3766 1.25 7.25 3.3766 7.25 6s2.1266 4.75 4.75 4.75 4.75-2.1266 4.75-4.75S14.6234 1.25 12 1.25z"
                          />
                          <path
                            d="M12 12.25c-2.3136 0-4.4451.5259-6.0246 1.4143s-1.77 2.3261-1.77 3.96v1.102c0 1.1608.0014 2.619 1.2804 3.6605.6294.5126 1.509 1.1337 2.699 1.3746 1.193.2416 2.7482.369 4.7742.369 2.026 0 3.5812-.1271 4.7742-.3686 1.1907-.2409 2.0703-.862 2.6998-1.3746C22.7486 19.971 22.75 18.5128 22.75 17.3519v-1.102c0-1.6339-.1695-2.9614-1.7254-3.8367S14.3135 12.25 12 12.25z"
                          />
                        </svg>
                        <span className="text-custom-sm">{authData?.user?.name}</span>
                      </button>
                    ) : (
                      <div className="inline-block p-[1px] bg-gradient-to-r from-blue to-blue-500 rounded-md">
                        <Link
                          to="/95668339501103956045/auth/signin"
                          onClick={() => setNavigationOpen(false)}
                          className="flex items-center bg-gray-100 text-gray-800 text-xs font-medium py-1 px-2 rounded hover:bg-gray-200 transition"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              d="M12 1.25C9.3766 1.25 7.25 3.3766 7.25 6s2.1266 4.75 4.75 4.75 4.75-2.1266 4.75-4.75S14.6234 1.25 12 1.25z"
                            />
                            <path
                              d="M12 12.25c-2.3136 0-4.4451.5259-6.0246 1.4143s-1.77 2.3261-1.77 3.96v1.102c0 1.1608.0014 2.619 1.2804 3.6605.6294.5126 1.509 1.1337 2.699 1.3746 1.193.2416 2.7482.369 4.7742.369 2.026 0 3.5812-.1271 4.7742-.3686 1.1907-.2409 2.0703-.862 2.6998-1.3746C22.7486 19.971 22.75 18.5128 22.75 17.3519v-1.102c0-1.6339-.1695-2.9614-1.7254-3.8367S14.3135 12.25 12 12.25z"
                            />
                          </svg>
                          <span className="text-custom-sm">Sign In</span>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* GOPA Buttons (Mobile) */}
                  {accountType === 'GOPA' && gopaId && (
                    <>
                      <button
                        onClick={() => navigate(`/95668339501103956045/gopa/${gopaId}/assigned/active`)}
                        className="flex items-center bg-gray-100 text-gray-800 text-xs font-medium py-1 px-2 rounded hover:bg-gray-200 transition"
                      >
                        <img src="/public/gopa.jpg" className="w-4 h-4 mr-1" />
                        Assigned
                      </button>
                      <button
                        onClick={() => navigate(`/95668339501103956045/gopa/${gopaId}/assigned/history`)}
                        className="flex items-center bg-gray-100 text-gray-800 text-xs font-medium py-1 px-2 rounded hover:bg-gray-200 transition"
                      >
                        <img src="/public/gopa.jpg" className="w-4 h-4 mr-1" />
                        Assigned History
                      </button>
                      <button
                        onClick={() => navigate(`/95668339501103956045/gopa/${gopaId}/unassigned/active`)}
                        className="flex items-center bg-gray-100 text-gray-800 text-xs font-medium py-1 px-2 rounded hover:bg-gray-200 transition"
                      >
                        <img src="/public/gopa.jpg" className="w-4 h-4 mr-1" />
                        Unassigned Active
                      </button>
                      <button
                        onClick={() => navigate(`/95668339501103956045/gopa/${gopaId}/unassigned/history`)}
                        className="flex items-center bg-gray-100 text-gray-800 text-xs font-medium py-1 px-2 rounded hover:bg-gray-200 transition"
                      >
                        <img src="/public/gopa.jpg" className="w-4 h-4 mr-1" />
                        Unassigned History
                      </button>
                    </>
                  )}

                  {/* Seller’s Bids (Mobile) */}
                  {accountType === 'SELLER' && sellerId && (
                    <button
                      onClick={() => navigate(`/95668339501103956045/seller/${sellerId}/bids`)}
                      className="flex items-center bg-gray-100 text-gray-800 text-xs font-medium py-1 px-2 rounded shadow hover:opacity-90 transition"
                    >
                      <img src="/bid.svg" alt="Bids" className="w-4 h-4 mr-1" />
                      Bids
                    </button>
                  )}

                  {/* Buyer Actions (Mobile) */}
                  {accountType === 'BUYER' && (
                    <>
                      <button
                        onClick={() => navigate('/95668339501103956045/buyer/cart')}
                        className="flex items-center bg-gray-100 text-gray-800 text-xs font-medium py-1 px-2 rounded hover:bg-gray-200 transition"
                      >
                        <img src="/cart.svg" alt="Cart" className="w-4 h-4 mr-1" />
                        Cart
                      </button>
                      <button
                        onClick={() => navigate('/95668339501103956045/buyer/post-request')}
                        className="flex items-center bg-gray-100 text-gray-800 text-xs font-medium py-1 px-2 rounded hover:bg-gray-200 transition"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 5v14m-7-7h14" strokeLinecap="round" />
                        </svg>
                        Create Request
                      </button>
                      <button
                        onClick={() => navigate('/95668339501103956045/buyer/requests')}
                        className="flex items-center bg-gray-100 text-gray-800 text-xs font-medium py-1 px-2 rounded hover:bg-gray-200 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-4 h-4 mr-1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m-2-2h-4a2 2 0 00-2 2v1h10V5a2 2 0 00-2-2zM9 11h6M9 15h6"
                          />
                        </svg>
                        My Requests
                      </button>
                    </>
                  )}
                </div>
              </div>

            </div>

            <div className="flex items-center gap-5">
              <div className="hidden xl:flex items-center gap-5">
                {isAuthenticated && (
                  <div className="flex items-center space-x-2">
                    {/* Seller’s Bids (Desktop) */}
                    {accountType === 'SELLER' && sellerId && (
                      <button
                        onClick={() => navigate(`/95668339501103956045/seller/${sellerId}/bids`)}
                        className="flex items-center bg-gray-100 text-gray-800 text-xs font-medium py-1 px-2 rounded shadow hover:opacity-90 transition"
                      >
                        <img src="/bid.svg" alt="Bids" className="w-4 h-4 mr-1" />
                        Bids
                      </button>
                    )}

                    {/* Cart (Desktop) */}
                    {accountType === 'BUYER' && (
                      <button
                        onClick={() => navigate('/95668339501103956045/buyer/cart')}
                        className="flex items-center bg-gray-100 text-gray-800 text-xs font-medium py-1 px-2 rounded hover:bg-gray-200 transition"
                      >
                        <img src="/cart.svg" alt="Cart" className="w-4 h-4 mr-1" />
                        Cart
                      </button>
                    )}

                    {/* Requests Menu (Desktop) */}
                    {accountType === 'BUYER' && (
                      <div className="relative">
                        <button
                          onClick={() => setRequestsMenuOpen((prev) => !prev)}
                          className="flex items-center bg-gray-100 text-gray-800 text-xs font-medium py-1 px-2 rounded hover:bg-gray-200 transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-4 h-4 mr-1"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m-2-2h-4a2 2 0 00-2 2v1h10V5a2 2 0 00-2-2zM9 11h6M9 15h6"
                            />
                          </svg>
                          Requests
                          <svg
                            className="ml-1 w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </button>

                        {requestsMenuOpen && (
                          <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 z-50">
                            <button
                              onClick={() => {
                                navigate('/95668339501103956045/buyer/post-request');
                                setRequestsMenuOpen(false);
                              }}
                              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 5v14m-7-7h14" strokeLinecap="round" />
                              </svg>
                              Create Request
                            </button>
                            <button
                              onClick={() => {
                                navigate('/95668339501103956045/buyer/requests');
                                setRequestsMenuOpen(false);
                              }}
                              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-4 h-4 mr-1"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m-2-2h-4a2 2 0 00-2 2v1h10V5a2 2 0 00-2-2zM9 11h6M9 15h6"
                                />
                              </svg>
                              My Requests
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* GOPA Menu (Desktop) */}
                    {accountType === 'GOPA' && gopaId && (
                      <div className="relative">
                        <button
                          onClick={() => setGopaMenuOpen((prev) => !prev)}
                          className="flex items-center bg-gray-100 text-gray-800 text-xs font-medium py-1 px-2 rounded hover:bg-gray-200 transition"
                        >
                          <img src="/public/gopa.jpg" alt="Gopa" className="w-4 h-4 mr-2" />
                          GOPA Menu
                          <svg
                            className="ml-1 w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </button>

                        {gopaMenuOpen && (
                          <div className="absolute mt-2 w-56 bg-white shadow-lg rounded-md border border-gray-200 z-50">
                            <button
                              onClick={() => {
                                navigate(`/95668339501103956045/gopa/${gopaId}/assigned/active`);
                                setGopaMenuOpen(false);
                              }}
                              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <img src="/public/gopa.jpg" className="w-4 h-4 mr-2" />
                              Assigned
                            </button>
                            <button
                              onClick={() => {
                                navigate(`/95668339501103956045/gopa/${gopaId}/assigned/history`);
                                setGopaMenuOpen(false);
                              }}
                              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <img src="/public/gopa.jpg" className="w-4 h-4 mr-2" />
                              Assigned History
                            </button>
                            <button
                              onClick={() => {
                                navigate(`/95668339501103956045/gopa/${gopaId}/unassigned/active`);
                                setGopaMenuOpen(false);
                              }}
                              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <img src="/public/gopa.jpg" className="w-4 h-4 mr-2" />
                              Unassigned Active
                            </button>
                            <button
                              onClick={() => {
                                navigate(`/95668339501103956045/gopa/${gopaId}/unassigned/history`);
                                setGopaMenuOpen(false);
                              }}
                              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <img src="/public/gopa.jpg" className="w-4 h-4 mr-2" />
                              Unassigned History
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-5">
                  <button
                    onClick={() => navigate('/95668339501103956045/my-account')}
                    className="flex items-center border border-blue rounded-full gap-3 px-2 py-1 bg-white hover:bg-blue-50 transition-shadow shadow-sm"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 1.25C9.37666 1.25 7.25001 3.37665 7.25001 6C7.25001 8.62335 9.37666 10.75 12 10.75C14.6234 10.75 16.75 8.62335 16.75 6C16.75 3.37665 14.6234 1.25 12 1.25ZM8.75001 6C8.75001 4.20507 10.2051 2.75 12 2.75C13.7949 2.75 15.25 4.20507 15.25 6C15.25 7.79493 13.7949 9.25 12 9.25C10.2051 9.25 8.75001 7.79493 8.75001 6Z"
                        fill="#3C50E0"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 12.25C9.68646 12.25 7.55494 12.7759 5.97546 13.6643C4.4195 14.5396 3.25001 15.8661 3.25001 17.5L3.24995 17.602C3.24882 18.7638 3.2474 20.222 4.52642 21.2635C5.15589 21.7761 6.03649 22.1406 7.22622 22.3815C8.41927 22.6229 9.97424 22.75 12 22.75C14.0258 22.75 15.5808 22.6229 16.7738 22.3815C17.9635 22.1406 18.8441 21.7761 19.4736 21.2635C20.7526 20.222 20.7512 18.7638 20.7501 17.602L20.75 17.5C20.75 15.8661 19.5805 14.5396 18.0246 13.6643C16.4451 12.7759 14.3136 12.25 12 12.25Z"
                        fill="#3C50E0"
                      />
                    </svg>
                    <span className="text-sm font-medium text-dark-4">{authData?.user?.name}</span>
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-5">
                  <Link to="/95668339501103956045/auth/signin" className="flex items-center gap-2.5">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 1.25C9.37666 1.25 7.25001 3.37665 7.25001 6C7.25001 8.62335 9.37666 10.75 12 10.75C14.6234 10.75 16.75 8.62335 16.75 6C16.75 3.37665 14.6234 1.25 12 1.25ZM8.75001 6C8.75001 4.20507 10.2051 2.75 12 2.75C13.7949 2.75 15.25 4.20507 15.25 6C15.25 7.79493 13.7949 9.25 12 9.25C10.2051 9.25 8.75001 7.79493 8.75001 6Z"
                        fill="#3C50E0"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 12.25C9.68646 12.25 7.55494 12.7759 5.97546 13.6643C4.4195 14.5396 3.25001 15.8661 3.25001 17.5L3.24995 17.602C3.24882 18.7638 3.2474 20.222 4.52642 21.2635C5.15589 21.7761 6.03649 22.1406 7.22622 22.3815C8.41927 22.6229 9.97424 22.75 12 22.75C14.0258 22.75 15.5808 22.6229 16.7738 22.3815C17.9635 22.1406 18.8441 21.7761 19.4736 21.2635C20.7526 20.222 20.7512 18.7638 20.7501 17.602L20.75 17.5C20.75 15.8661 19.5805 14.5396 18.0246 13.6643C16.4451 12.7759 14.3136 12.25 12 12.25Z"
                        fill="#3C50E0"
                      />
                    </svg>
                    <div>
                      <span className="block text-2xs text-dark-4 uppercase">account</span>
                      <p className="font-medium text-custom-sm text-dark">Sign In</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
