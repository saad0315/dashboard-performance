import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  toggleRTL,
  toggleTheme,
  toggleSidebar,
} from "../../store/themeConfigSlice";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import Dropdown from "../Dropdown";
import { lockedRequest } from "../../store/userSlice";
import { routes } from "../../router/routes";
import logo from "../../assets/favicon.png";
import { handleLogout } from "../../registerServiceWorker";
import { deleteNotification, getNotification, markAllAsRead } from "../../api/notifApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { coloredToast } from "../Alerts/SimpleAlert";
import { getNotificationLink } from "../../utils/Utils";

const Header = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  (() => {
    const selector = document.querySelector(
      'ul.horizontal-menu a[href="' + window.location.pathname + '"]'
    );
    if (selector) {
      selector.classList.add("active");
      const all = document.querySelectorAll(
        "ul.horizontal-menu .nav-link.active"
      );
      for (let i = 0; i < all.length; i++) {
        all[0]?.classList.remove("active");
      }
      const ul = selector.closest("ul.sub-menu");
      if (ul) {
        let ele = ul.closest("li.menu").querySelectorAll(".nav-link");
        if (ele) {
          ele = ele[0];
          setTimeout(() => {
            ele?.classList.add("active");
          });
        }
      }
    }
  }, [location]);

  const isRtl =
    useSelector((state) => state.themeConfig.rtlClass) === "rtl" ? true : false;
  const { user } = useSelector((state) => state.user);
  const [isEnabled, setIsEnabled] = useState(
    localStorage.getItem("notificationsEnabled") === "true"
  );
  const themeConfig = useSelector((state) => state.themeConfig);
  const dispatch = useDispatch();

  function createMarkup(messages) {
    return { __html: messages };
  }

  const {
    isLoading,
    data: notificationData,
    status,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotification(user?._id),
    keepPreviousData: true,
  });

  // console.log("notificationData", notificationData);
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      coloredToast(
        "success",
        "Notification Removed Successfully !",
        "top",
        null,
        null,
        15000
      );
    },
  });

  const markAllReadMutation = useMutation({
    mutationKey: ["markRead"],
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      // coloredToast(
      //   "success",
      //   "Notification readed Successfully !",
      //   "top",
      //   null,
      //   null,
      //   15000
      // );
    },
  });

  // Mark Notification as Read
  // const markAsReadMutation = useMutation({
  //   mutationFn: markAsRead,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["notifications"]);
  //   },
  // });

  // Mark All Notifications as Read
  // const markAllAsReadMutation = useMutation({
  //   mutationFn: markAllAsRead,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["notifications"]);
  //   },
  // });



  // const [notifications, setNotifications] = useState([
  //   {
  //     id: 1,
  //     profile: "user-profile.jpeg",
  //     message:
  //       '<strong class="text-sm mr-1">John Doe</strong>invite you to <strong>Prototyping</strong>',
  //     time: "45 min ago",
  //   },
  //   {
  //     id: 2,
  //     profile: "profile-34.jpeg",
  //     message:
  //       '<strong class="text-sm mr-1">Adam Nolan</strong>mentioned you to <strong>UX Basics</strong>',
  //     time: "9h Ago",
  //   },
  //   {
  //     id: 3,
  //     profile: "profile-16.jpeg",
  //     message: '<strong class="text-sm mr-1">Anna Morgan</strong>Upload a file',
  //     time: "9h Ago",
  //   },
  // ]);

  const removeNotification = (value) => {
    // setNotifications(notifications.filter((user) => user.id !== value));
  };

  const [search, setSearch] = useState(false);

  const setLocale = (flag) => {
    setFlag(flag);
    if (flag.toLowerCase() === "ae") {
      dispatch(toggleRTL("rtl"));
    } else {
      dispatch(toggleRTL("ltr"));
    }
  };
  const [flag, setFlag] = useState(themeConfig.locale);

  const { t } = useTranslation();

  const filteredRoutes = routes?.filter((route) => {
    if (!route.role) return false;
    return route?.role?.includes(user?.role);
  });


  // const toggleNotifications = async () => {
  //   if (!isEnabled) {
  //     const permission = await Notification.requestPermission();
  //     if (permission === "granted") {
  //       localStorage.setItem("notificationsEnabled", "true");
  //       setIsEnabled(true);
  //       console.log("✅ Notifications Enabled");
  //     } else {
  //       console.log("❌ Notifications Denied");
  //     }
  //   } else {
  //     localStorage.setItem("notificationsEnabled", "false");
  //     setIsEnabled(false);
  //     console.log("🔕 Notifications Disabled");
  //   }
  // };

  const handleDropdownOpen = () => {
    if (!notificationData?.notifications) return;

    markAllReadMutation.mutate();

    // const unreadNotifications = notificationData?.notifications?.filter(
    //   (n) => !n.readBy.includes(user?._id)
    // );

    // if (unreadNotifications.length === 0) return;

    // const unreadIds = unreadNotifications.map((n) => n.id);
    // markAsReadMutation.mutate(unreadIds);
  };
  return (
    <header
      className={`z-40 ${themeConfig.semidark && themeConfig.menu === "horizontal" ? "dark" : ""
        }`}
    >
      <div className="shadow-sm">
        <div className="relative bg-white flex w-full items-center px-5 py-2.5 dark:bg-black">
          <div className="horizontal-logo flex lg:hidden justify-between items-center ltr:mr-2 rtl:ml-2">
            <Link to="/" className="main-logo flex items-center shrink-0">
              <img
                className="w-8 ltr:-ml-1 rtl:-mr-1 inline"
                src={logo}
                alt="logo"
              />
              <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5  font-extrabold  align-middle hidden md:inline text-[#000] dark:text-white-light transition-all duration-300">
                SENTRA CORE
              </span>
            </Link>
            <button
              type="button"
              className="collapse-icon flex-none dark:text-[#d0d2d6] hover:text-primary dark:hover:text-primary flex lg:hidden ltr:ml-2 rtl:mr-2 p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:bg-white-light/90 dark:hover:bg-dark/60"
              onClick={() => {
                dispatch(toggleSidebar());
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 7L4 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  opacity="0.5"
                  d="M20 12L4 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M20 17L4 17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <div className="sm:flex-1 ltr:sm:ml-0 ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex items-center space-x-1.5 lg:space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
            <div className="sm:ltr:mr-auto sm:rtl:ml-auto"></div>
            {/* <div>
              <button
                onClick={toggleNotifications}
                className={`px-4 py-2 rounded-lg text-white ${isEnabled
                  }`}
              >
                {isEnabled ? "🔔" : "🔕 "}
              </button>
            </div> */}
            <div>
              {themeConfig.theme === "light" ? (
                <button
                  className={`${themeConfig.theme === "light" &&
                    "flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                    }`}
                  onClick={() => {
                    dispatch(toggleTheme("dark"));
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M12 2V4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12 20V22"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M4 12L2 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M22 12L20 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      opacity="0.5"
                      d="M19.7778 4.22266L17.5558 6.25424"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      opacity="0.5"
                      d="M4.22217 4.22266L6.44418 6.25424"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      opacity="0.5"
                      d="M6.44434 17.5557L4.22211 19.7779"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      opacity="0.5"
                      d="M19.7778 19.7773L17.5558 17.5551"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              ) : (
                ""
              )}
              {themeConfig.theme === "dark" && (
                <button
                  className={`${themeConfig.theme === "dark" &&
                    "flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                    }`}
                  onClick={() => {
                    dispatch(toggleTheme("system"));
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.0672 11.8568L20.4253 11.469L21.0672 11.8568ZM12.1432 2.93276L11.7553 2.29085V2.29085L12.1432 2.93276ZM21.25 12C21.25 17.1086 17.1086 21.25 12 21.25V22.75C17.9371 22.75 22.75 17.9371 22.75 12H21.25ZM12 21.25C6.89137 21.25 2.75 17.1086 2.75 12H1.25C1.25 17.9371 6.06294 22.75 12 22.75V21.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75V1.25C6.06294 1.25 1.25 6.06294 1.25 12H2.75ZM15.5 14.25C12.3244 14.25 9.75 11.6756 9.75 8.5H8.25C8.25 12.5041 11.4959 15.75 15.5 15.75V14.25ZM20.4253 11.469C19.4172 13.1373 17.5882 14.25 15.5 14.25V15.75C18.1349 15.75 20.4407 14.3439 21.7092 12.2447L20.4253 11.469ZM9.75 8.5C9.75 6.41182 10.8627 4.5828 12.531 3.57467L11.7553 2.29085C9.65609 3.5593 8.25 5.86509 8.25 8.5H9.75ZM12 2.75C11.9115 2.75 11.8077 2.71008 11.7324 2.63168C11.6686 2.56527 11.6538 2.50244 11.6503 2.47703C11.6461 2.44587 11.6482 2.35557 11.7553 2.29085L12.531 3.57467C13.0342 3.27065 13.196 2.71398 13.1368 2.27627C13.0754 1.82126 12.7166 1.25 12 1.25V2.75ZM21.7092 12.2447C21.6444 12.3518 21.5541 12.3539 21.523 12.3497C21.4976 12.3462 21.4347 12.3314 21.3683 12.2676C21.2899 12.1923 21.25 12.0885 21.25 12H22.75C22.75 11.2834 22.1787 10.9246 21.7237 10.8632C21.286 10.804 20.7293 10.9658 20.4253 11.469L21.7092 12.2447Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              )}
              {themeConfig.theme === "system" && (
                <button
                  className={`${themeConfig.theme === "system" &&
                    "flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                    }`}
                  onClick={() => {
                    dispatch(toggleTheme("light"));
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 9C3 6.17157 3 4.75736 3.87868 3.87868C4.75736 3 6.17157 3 9 3H15C17.8284 3 19.2426 3 20.1213 3.87868C21 4.75736 21 6.17157 21 9V14C21 15.8856 21 16.8284 20.4142 17.4142C19.8284 18 18.8856 18 17 18H7C5.11438 18 4.17157 18 3.58579 17.4142C3 16.8284 3 15.8856 3 14V9Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      opacity="0.5"
                      d="M22 21H2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      opacity="0.5"
                      d="M15 15H9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
            </div>
            <div className="dropdown shrink-0">
              <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? "bottom-start" : "bottom-end"}`}
                btnClassName="block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                button={
                  <img
                    className="w-5 h-5 object-cover rounded-full"
                    src={`/assets/images/flags/${flag.toUpperCase()}.svg`}
                    alt="flag"
                  />
                }
              >
                <ul className="!px-2 text-dark dark:text-white-dark grid grid-cols-2 gap-2 font-semibold dark:text-white-light/90 w-[280px]">
                  {themeConfig.languageList.map((item, index) => {
                    return (
                      <li key={index}>
                        <button
                          type="button"
                          className={`flex w-full hover:text-primary rounded-lg ${i18next.language === item.code
                            ? "bg-primary/10 text-primary"
                            : ""
                            }`}
                          onClick={() => {
                            i18next.changeLanguage(item.code);
                            // setFlag(item.code);
                            setLocale(item.code);
                          }}
                        >
                          <img
                            src={`/assets/images/flags/${item.code.toUpperCase()}.svg`}
                            alt="flag"
                            className="w-5 h-5 object-cover rounded-full"
                          />
                          <span className="ltr:ml-3 rtl:mr-3">{item.name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </Dropdown>
            </div>

            <div className="dropdown shrink-0">
              <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? "bottom-start" : "bottom-end"}`}
                btnClassName="relative block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                button={
                  <span onClick={handleDropdownOpen}  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.0001 9.7041V9C19.0001 5.13401 15.8661 2 12.0001 2C8.13407 2 5.00006 5.13401 5.00006 9V9.7041C5.00006 10.5491 4.74995 11.3752 4.28123 12.0783L3.13263 13.8012C2.08349 15.3749 2.88442 17.5139 4.70913 18.0116C9.48258 19.3134 14.5175 19.3134 19.291 18.0116C21.1157 17.5139 21.9166 15.3749 20.8675 13.8012L19.7189 12.0783C19.2502 11.3752 19.0001 10.5491 19.0001 9.7041Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M12 6V10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="flex absolute w-3 h-3 ltr:right-0 rtl:left-0 top-0">
                      <span className="animate-ping absolute ltr:-left-[3px] rtl:-right-[3px] -top-[3px] inline-flex h-full w-full rounded-full bg-primary/50 opacity-75"></span>
                      <span className="relative inline-flex rounded-full w-[6px] h-[6px] bg-primary"></span>
                    </span>
                    {notificationData?.notifications &&
                      (() => {
                        const unreadCount = notificationData.notifications.filter(
                          (notification) => !notification.readBy.includes(user?._id)
                        ).length;
                        return unreadCount > 0 ? (
                          <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {unreadCount}
                          </span>
                        ) : null;
                      })()}
                  </span>
                }
              >
                <ul className="!py-0 text-dark dark:text-white-dark w-[300px] sm:w-[350px] divide-y dark:divide-white/10">
                  <li onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center px-4 py-2 justify-between font-semibold">
                      <h4 className="text-lg">Notification</h4>

                      {notificationData?.notifications &&
                        (() => {
                          const unreadCount = notificationData?.notifications?.filter(
                            (notification) => !notification.readBy.includes(user?._id)
                          )?.length;

                          return unreadCount > 0 ? (
                            <span className="badge bg-primary/80">{unreadCount} New</span>
                          ) : null;
                        })()}
                    </div>
                  </li>
                  {notificationData?.notifications?.length > 0 ? (
                    <div className="overflow-y-auto max-h-[400px]">
                      {notificationData?.notifications?.map((notification) => {
                        return (
                          // <Link to={getNotificationLink(notification.type)} key={notification?._id}>
                          <li
                            className="dark:text-white-light/90 "
                            onClick={(e) => e.stopPropagation()}
                            key={notification?._id}
                          >
                            <Link to={getNotificationLink(notification.type)} >
                            <div className="group flex items-center px-4 py-2">
                              <div className="grid place-content-center rounded">
                                <div className="w-12 h-12 relative">
                                  <img
                                    className="w-12 h-12 rounded-full object-cover"
                                    alt="profile"
                                    src={`https://res.cloudinary.com/ddvtgfqgv/image/upload/v1691059545/member-profile/avatar_aoyxl6.webp`}
                                  />
                                </div>
                              </div>
                              <div className="ltr:pl-3 rtl:pr-3 flex flex-auto">
                                <div className="ltr:pr-3 rtl:pl-3">
                                  <h6
                                    dangerouslySetInnerHTML={{
                                      __html: notification?.content,
                                    }}
                                  ></h6>
                                  <span className="text-xs block font-normal dark:text-gray-500">
                                    {formatDistanceToNow(new Date(notification?.createdAt), { addSuffix: true })}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  className="ltr:ml-auto rtl:mr-auto text-neutral-300 hover:text-danger opacity-0 group-hover:opacity-100"
                                  onClick={(e) => {
                                    e.preventDefault(); // Stop default link behavior
                                    e.stopPropagation();
                                    deleteMutation.mutate(notification?._id);
                                  }}
                                >
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <circle
                                      opacity="0.5"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                    />
                                    <path
                                      d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            </Link>
                          </li>
                        );
                      })}
                      <li>
                        <div className="p-4">
                          <button className="btn btn-primary block w-full btn-small">
                            Read All Notifications
                          </button>
                        </div>
                      </li>
                    </div>
                  ) : (
                    <li onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="!grid place-content-center hover:!bg-transparent text-lg min-h-[200px]"
                      >
                        <div className="mx-auto ring-4 ring-primary/30 rounded-full mb-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="#a9abb6"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-info bg-primary rounded-full"
                          >
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                          </svg>
                        </div>
                        No data available.
                      </button>
                    </li>
                  )}
                </ul>
              </Dropdown>
            </div>
            <div className="dropdown shrink-0 flex">
              <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? "bottom-start" : "bottom-end"}`}
                btnClassName="relative group block"
                button={
                  user?.profileImgUrl ? (
                    <img
                      className="w-9 h-9 rounded-full object-cover saturate-50 group-hover:saturate-100"
                      src={`https://bellevue-portal.b-cdn.net/${user?.profileImgUrl}`}
                      alt="userProfile"
                    />
                  ) : (
                    <div className="text-lg w-9 h-9 rounded-full object-cover saturate-50 group-hover:saturate-100 font-bold flex items-center justify-center bg-gray-200 text-gray-700">
                      {user?.userName
                        ? user?.userName.charAt(0).toUpperCase()
                        : "N/A"}
                    </div>
                    // <img
                    //   className="w-9 h-9 rounded-full object-cover saturate-50 group-hover:saturate-100"
                    //   src="https://res.cloudinary.com/ddvtgfqgv/image/upload/v1691059545/member-profile/avatar_aoyxl6.webp"
                    //   alt="defaultProfile"
                    // />
                  )
                }
              >
                <ul className="text-dark dark:text-white-dark !py-0 w-[230px] font-semibold dark:text-white-light/90">
                  <li>
                    <div className="flex items-center px-4 py-4">
                      {user?.profileImgUrl ? (
                        <img
                          className="rounded-md w-10 h-10 object-cover"
                          src={`https://bellevue-portal.b-cdn.net/${user?.profileImgUrl}`}
                          alt="userProfile"
                        />
                      ) : (
                        <div className="text-lg font-bold rounded-md w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-700">
                          {user?.userName
                            ? user?.userName.charAt(0).toUpperCase()
                            : "N/A"}
                        </div>
                      )}

                      <div className="ltr:pl-4 rtl:pr-4 truncate">
                        <h4 className="text-base capitalize">
                          {user?.userName}
                          <span className="text-xs bg-success-light rounded text-success px-1 ltr:ml-2 rtl:ml-2">
                            Pro
                          </span>
                        </h4>
                        <button
                          type="button"
                          className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white"
                        >
                          {user?.userEmail}
                        </button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <Link to="/profile" className="dark:hover:text-white">
                      <svg
                        className="ltr:mr-2 rtl:ml-2 shrink-0"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="12"
                          cy="6"
                          r="4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          opacity="0.5"
                          d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/auth/lockscreen"
                      onClick={() => dispatch(lockedRequest())}
                      className="dark:hover:text-white"
                    >
                      <svg
                        className="ltr:mr-2 rtl:ml-2 shrink-0"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.75736 10 5.17157 10 8 10H16C18.8284 10 20.2426 10 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          opacity="0.5"
                          d="M6 10V8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8V10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <g opacity="0.5">
                          <path
                            d="M9 16C9 16.5523 8.55228 17 8 17C7.44772 17 7 16.5523 7 16C7 15.4477 7.44772 15 8 15C8.55228 15 9 15.4477 9 16Z"
                            fill="currentColor"
                          />
                          <path
                            d="M13 16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16C11 15.4477 11.4477 15 12 15C12.5523 15 13 15.4477 13 16Z"
                            fill="currentColor"
                          />
                          <path
                            d="M17 16C17 16.5523 16.5523 17 16 17C15.4477 17 15 16.5523 15 16C15 15.4477 15.4477 15 16 15C16.5523 15 17 15.4477 17 16Z"
                            fill="currentColor"
                          />
                        </g>
                      </svg>
                      Lock Screen
                    </Link>
                  </li>
                  {/* <li>
                    <button
                      onClick={toggleNotifications}
                      className={`px-4 py-2 rounded-lg text-white ${isEnabled ? "bg-green-500" : "bg-red-500"
                        }`}
                    >
                      {isEnabled ? "🔔 Notifications ON" : "🔕 Notifications OFF"}
                    </button>
                  </li> */}
                  <li className="border-t border-white-light dark:border-white-light/10">
                    <Link
                      to={"/auth/login"}
                      onClick={() => handleLogout(user?._id, dispatch)}
                      className="text-danger !py-3 "
                    >
                      <svg
                        className="ltr:mr-2 rtl:ml-2 rotate-90 shrink-0"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.5"
                          d="M17 9.00195C19.175 9.01406 20.3529 9.11051 21.1213 9.8789C22 10.7576 22 12.1718 22 15.0002V16.0002C22 18.8286 22 20.2429 21.1213 21.1215C20.2426 22.0002 18.8284 22.0002 16 22.0002H8C5.17157 22.0002 3.75736 22.0002 2.87868 21.1215C2 20.2429 2 18.8286 2 16.0002L2 15.0002C2 12.1718 2 10.7576 2.87868 9.87889C3.64706 9.11051 4.82497 9.01406 7 9.00195"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M12 15L12 2M12 2L15 5.5M12 2L9 5.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Sign Out
                    </Link>
                  </li>
                </ul>
              </Dropdown>
            </div>
          </div>
        </div>
        <ul className="horizontal-menu hidden py-1.5 font-semibold px-6 lg:space-x-1.5 xl:space-x-8 rtl:space-x-reverse bg-white border-t border-[#ebedf2] dark:border-[#191e3a] dark:bg-black text-black dark:text-white-dark">
          {filteredRoutes?.map((item, index) => (
            <div key={index}>
              <li className="menu nav-item relative">
                <button type="button" className=" min-w-[150px] nav-link">
                  <div className="flex items-center">
                    {item.icon}
                    <span className="px-1">{t(item.lable)}</span>
                  </div>
                  <div className="right_arrow">
                    <svg
                      className="rotate-90"
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
              </li>
              {item?.subRoutes && (
                <li className="menu nav-item relative">
                  <button type="button" className="nav-link">
                    <div className="flex items-center">
                      {item.icon}
                      <span className="px-1">{t(item.lable)}</span>
                    </div>
                    <div className="right_arrow">
                      <svg
                        className="rotate-90"
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
                  <ul className="sub-menu">
                    {item?.subRoutes?.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <NavLink to={`${subItem.path}`}>
                          {t(subItem.label)}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              )}
            </div>
          ))}
        </ul>

      </div>
    </header>
  );
};

export default Header;
