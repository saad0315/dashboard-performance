import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle, toggleRTL } from "../../store/themeConfigSlice";
import Dropdown from "../../components/Dropdown";
import i18next from "i18next";
import IconCaretDown from "../../components/Icon/IconCaretDown";
import IconLockDots from "../../components/Icon/IconLockDots";
import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../../api/userApi";
import { coloredToast } from "../../components/Alerts/SimpleAlert";
import { setUser, unLockedRequest } from "../../store/userSlice";
import { capitalizeTitle } from "../../constants/constants";

const UnlockBox = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle("Unlock Box"));
  });

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const isRtl =
    useSelector((state) => state.themeConfig.rtlClass) === "rtl" ? true : false;
  const themeConfig = useSelector((state) => state.themeConfig);
  const setLocale = (flag) => {
    setFlag(flag);
    if (flag.toLowerCase() === "ae") {
      dispatch(toggleRTL("rtl"));
    } else {
      dispatch(toggleRTL("ltr"));
    }
  };
  const [flag, setFlag] = useState(themeConfig.locale);

  // const submitForm = () => {
  //     navigate('/');
  // };
  const form = useRef(null);
  const mutation = useMutation({
    mutationKey: ["login"],
    mutationFn: loginApi,
    onSuccess: (response) => {
      dispatch(unLockedRequest(response?.data));
      localStorage.setItem("user", JSON.stringify(response?.data?.user));
      localStorage.setItem("token", response?.data?.token);
      coloredToast(
        "success",
        `Welcome Back, ${capitalizeTitle(response?.data?.user?.userName)}`,
        "top"
      );

      navigate("/");
      //   form.current.reset();
    },
    onError: (error) => {
      console.log(error);
      console.log(error?.response?.data?.message);
      coloredToast("danger", "Incorrect Password", "top");
    },
  });
  const submitForm = (e) => {
    e.preventDefault();
    let object = {};

    const formData = new FormData(form.current);
    formData.append("userEmail", user.userEmail);
    for (const [key, value] of formData.entries()) {
      object[key] = value;
    }
    mutation.mutate(object);
  };

  return (
    <div>
      <div className="absolute inset-0">
        <img
          src="/assets/images/auth/bg-gradient.png"
          alt="image"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
        <img
          src="/assets/images/auth/coming-soon-object1.png"
          alt="image"
          className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2"
        />
        <img
          src="/assets/images/auth/coming-soon-object2.png"
          alt="image"
          className="absolute left-24 top-0 h-40 md:left-[30%]"
        />
        <img
          src="/assets/images/auth/coming-soon-object3.png"
          alt="image"
          className="absolute right-0 top-0 h-[300px]"
        />
        <img
          src="/assets/images/auth/polygon-object.svg"
          alt="image"
          className="absolute bottom-0 end-[28%]"
        />
        <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
          <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[758px] py-20">
            <div className="absolute top-6 end-6">
              <div className="dropdown">
                <Dropdown
                  offset={[0, 8]}
                  placement={`${isRtl ? "bottom-start" : "bottom-end"}`}
                  btnClassName="flex items-center gap-2.5 rounded-lg border border-white-dark/30 bg-white px-2 py-1.5 text-white-dark hover:border-primary hover:text-primary dark:bg-black"
                  button={
                    <>
                      <div>
                        <img
                          src={`/assets/images/flags/${flag.toUpperCase()}.svg`}
                          alt="image"
                          className="h-5 w-5 rounded-full object-cover"
                        />
                      </div>
                      <div className="text-base font-bold uppercase">
                        {flag}
                      </div>
                      <span className="shrink-0">
                        <IconCaretDown />
                      </span>
                    </>
                  }
                >
                  <ul className="!px-2 text-dark dark:text-white-dark grid grid-cols-2 gap-2 font-semibold dark:text-white-light/90 w-[280px]">
                    {themeConfig.languageList.map((item) => {
                      return (
                        <li key={item.code}>
                          <button
                            type="button"
                            className={`flex w-full hover:text-primary rounded-lg ${
                              flag === item.code
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
                            <span className="ltr:ml-3 rtl:mr-3">
                              {item.name}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </Dropdown>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[440px]">
              <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="hidden  md:flex h-16 w-16 items-end justify-center overflow-hidden rounded-full bg-[#00AB55] ltr:mr-4 rtl:ml-4">
                  {user?.profileImgUrl ? (
                    <img
                      className="w-full object-cover"
                      src={`https://bellevue-portal.b-cdn.net/${user?.profileImgUrl}`}
                      alt="userProfile"
                    />
                  ) : (
                    <div className="text-3xl font-semibold  rounded-full w-full h-full flex items-center justify-center bg-[#00AB55] text-white-light ">
                      {user?.userName
                        ? user?.userName.charAt(0).toUpperCase()
                        : ""}
                    </div>
                  )}

                  {/* <img
                    src="/assets/images/auth/user.png"
                    className="w-full object-cover"
                    alt="images"
                  /> */}
                </div>
                <div className="flex-1">
                  <div className="flex  items-center mb-2">
                  <div className="md:hidden flex h-10 w-10 items-end justify-center overflow-hidden rounded-full bg-[#00AB55] ltr:mr-2 rtl:ml-2">
                  {user?.profileImgUrl ? (
                    <img
                      className="w-full object-cover"
                      src={`https://bellevue-portal.b-cdn.net/${user?.profileImgUrl}`}
                      alt="userProfile"
                    />
                  ) : (
                    <div className="text-xl font-semibold  rounded-full w-full h-full flex items-center justify-center bg-[#00AB55] text-white-light ">
                      {user?.userName
                        ? user?.userName.charAt(0).toUpperCase()
                        : ""}
                    </div>
                  )}

                  {/* <img
                    src="/assets/images/auth/user.png"
                    className="w-full object-cover"
                    alt="images"
                  /> */}
                </div>
                    <h4 className="text-2xl dark:text-white capitalize">
                      {user?.userName}
                    </h4>
                  </div>
                  <p className="text-white-dark">
                    Enter your password to unlock your ID
                  </p>
                </div>
              </div>
              <form ref={form} className="space-y-5" onSubmit={submitForm}>
                <div>
                  <label htmlFor="Password" className="dark:text-white">
                    Password
                  </label>
                  <div className="relative text-white-dark">
                    <input
                      id="Password"
                      type="password"
                      name="userPassword"
                      placeholder="Enter Password"
                      className="form-input ps-10 placeholder:text-white-dark"
                      required
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                      <IconLockDots fill={true} />
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                >
                  UNLOCK
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnlockBox;
