import PerfectScrollbar from "react-perfect-scrollbar";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { toggleSidebar } from "../../store/themeConfigSlice";
import AnimateHeight from "react-animate-height";
import { useState, useEffect } from "react";
import DarkLogo from "/sentraLogo.png";
import LightLogo from "/sentraLogoWhite.png";
import logo from "../../assets/favicon.png";
import { routes } from "../../router/routes";

const Sidebar = () => {
  const [currentMenu, setCurrentMenu] = useState("");
  const [errorSubMenu, setErrorSubMenu] = useState(false);
  const themeConfig = useSelector((state) => state.themeConfig);
  const { user } = useSelector((state) => state.user);
  const semidark = useSelector((state) => state.themeConfig.semidark);
  const darkMode = useSelector((state) => state.themeConfig.isDarkMode);
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const toggleMenu = (value) => {
    setCurrentMenu((oldValue) => {
      return oldValue === value ? "" : value;
    });
  };

  useEffect(() => {
    const selector = document.querySelector(
      '.sidebar ul a[href="' + window.location.pathname + '"]'
    );
    if (selector) {
      selector.classList.add("active");
      const ul = selector.closest("ul.sub-menu");
      if (ul) {
        let ele = ul.closest("li.menu").querySelectorAll(".nav-link") || [];
        if (ele.length) {
          ele = ele[0];
          setTimeout(() => {
            ele.click();
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1024 && themeConfig.sidebar) {
      dispatch(toggleSidebar());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // const filteredRoutes = routes?.filter((route) => {
  //   if (!route.role) return false;
  //   if (!route.lable) return false;
  //   return route?.role?.includes(user?.role) ||  ;
  // });

  const filterRoutesByRole = (routes, userRole) => {
    return routes
      .filter(route => route.role?.includes(userRole) && route.lable)
      .map(route => {
        const newRoute = { ...route };

        // If subRoutes exist, filter them too
        if (newRoute.subRoutes?.length) {
          newRoute.subRoutes = newRoute.subRoutes.filter(sub =>
            sub.role?.includes(userRole) && sub.label
          );
        }

        return newRoute;
      })
      // Only include top-level routes if they have subRoutes (or don't have subRoutes at all)
      .filter(route => !route.subRoutes || route.subRoutes.length > 0);
  };

  // Usage:
  const filteredRoutes = filterRoutesByRole(routes, user?.role);


  // console.log('filtered routes', filteredRoutes)

  return (
    <div className={semidark ? "dark" : ""}>
      <nav
        className={` sidebar  fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${semidark ? "text-white-dark" : ""
          }`}
      >
        {/* <div className="bg-white dark:bg-black h-full"> */}
        {/* <div className="bg-white dark:bg-[#0D1B2A] h-full"> */}
        <div className="bg-white dark:bg-gradient-to-b dark:from-[#1E1B4B] dark:to-[#3B1E54] h-full">
          <div className="flex justify-between items-center px-4 py-3">
            <NavLink to="/" className="main-logo flex items-center shrink-0">
              <img
                className="w-[180px] ml-[5px] flex-none dark:none"
                src={darkMode || semidark ? LightLogo : DarkLogo}
                alt="logo"
              />
              {/* <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white-light">{t('BELLEVUE')}</span> */}
            </NavLink>

            {/* <NavLink to="/" className="main-logo flex items-center shrink-0">
              <img
                className="w-[30px] ml-[5px] flex-none dark:none"
                src={logo}
                alt="logo"
              />
              <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5  font-extrabold  align-middle hidden md:inline text-[#000] dark:text-white-light transition-all duration-300">
                MADCOM
              </span>
            </NavLink> */}

            <button
              type="button"
              className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
              onClick={() => dispatch(toggleSidebar())}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 m-auto"
              >
                <path
                  d="M13 19L7 12L13 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  opacity="0.5"
                  d="M16.9998 19L10.9998 12L16.9998 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
            {filteredRoutes?.map((item, index) => (
              <ul
                key={index}
                className="relative font-semibold space-y-0.5 p-4 py-0"
              >
                {item?.subRoutes ? (
                  <li className="menu nav-item">
                    <button
                      type="button"
                      className={`${currentMenu === item.lable ? "active" : ""
                        } nav-link group w-full`}
                      onClick={() => toggleMenu(item.lable)}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#AEB9E1] dark:group-hover:text-[#AEB9E1]">
                          {t(item.lable)}
                        </span>
                      </div>
                      <div
                        className={
                          currentMenu === item.lable
                            ? "rotate-90"
                            : "rtl:rotate-180"
                        }
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 5L15 12L9 19"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </button>
                    <AnimateHeight
                      duration={300}
                      height={currentMenu === item.lable ? "auto" : 0}
                    >
                      <ul className="sub-menu text-[#AEB9E1]">
                        {item?.subRoutes?.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <NavLink to={`${subItem.path}`}>
                              {t(subItem.label)}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </AnimateHeight>
                  </li>
                ) : <li className="nav-item">
                  <NavLink to={`${item.path}`} className="group">
                    <div className="flex items-center">
                      {item.icon}
                      <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#AEB9E1] dark:group-hover:text-[#AEB9E1]">
                        {t(item.lable)}
                      </span>
                    </div>
                  </NavLink>
                </li>}
                {item?.isHeader && (
                  <h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                    <svg
                      className="w-4 h-5 flex-none hidden"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <span>{t(item.lable)}</span>
                  </h2>
                )}
              </ul>
            ))}
          </PerfectScrollbar>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
