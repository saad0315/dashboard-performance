import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setPageTitle, toggleRTL } from "../../../store/themeConfigSlice";
import Dropdown from "../../../components/Dropdown";
import i18next from "i18next";
import IconCaretDown from "../../../components/Icon/IconCaretDown";
import IconUser from "../../../components/Icon/IconUser";
import IconMail from "../../../components/Icon/IconMail";
import IconUsersGroup from "../../../components/Icon/IconUsersGroup";
import IconLockDots from "../../../components/Icon/IconLockDots";
import { useMutation, useQuery } from "@tanstack/react-query";
import { registerApi } from "../../../api/userApi";
import { coloredToast } from "../../../components/Alerts/SimpleAlert";
import MaskedInput from "react-text-mask";
import { getTeam } from "../../../api/salesApi";

const AddUserForm = () => {
  const {
    isLoading,
    data: teamsData,
    status,
  } = useQuery({
    queryKey: ["team"],
    queryFn: getTeam,
  });

  const dispatch = useDispatch();
  const form = useRef();
  const [phone, setPhone] = useState("");
  useEffect(() => {
    dispatch(setPageTitle("Add User"));
  });
  // const navigate = useNavigate();

  const mutation = useMutation({
    mutationKey: ["register"],
    mutationFn: registerApi,
    onSuccess: (response) => {
      form.current.reset();
      coloredToast(
        "success",
        response?.data?.message,
        "top",
        null,
        null,
        15000
      );
    },
    onError: (error) => {
      console.log(error);
      coloredToast("danger", error?.response?.data?.message, "top");
    },
  });
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

  const submitForm = (e) => {
    // navigate('/');
    e.preventDefault();

    // const countDigits = (str) => {
    //   const digits = str.replace(/\D/g, ""); // Remove all non-digit characters
    //   console.log(digits);
    //   return digits.length;
    // };
    // if (countDigits(phone) < 10) {
    //   coloredToast("danger", "Please enter a valid phone number", "top");
    //   return;
    // }

    let object = {};
    const formData = new FormData(e.target);
    for (const [key, value] of formData.entries()) {
      object[key] = value;
    }
    mutation.mutate(object);
  };

  return (
    <div>
      <div className="relative  flex bg-cover bg-center bg-no-repeat dark:bg-[#060818]">
        {/* <div className="relative flex w-full bg-red-200 max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 h-full lg:flex-row lg:gap-10 xl:gap-0"> */}
        <div className="rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 relative  flex w-full flex-col  gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px] mx-auto">
          <div className="w-full max-w-[600px] ">
            <div className="mb-10">
              <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">
                Add User
              </h1>
              <p className="text-base font-bold leading-normal text-white-dark">
                Enter email and password to register
              </p>
            </div>
            <form
              ref={form}
              className="space-y-5 dark:text-white"
              onSubmit={submitForm}
            >
              <div>
                <label htmlFor="Name">Name</label>
                <div className="relative text-white-dark">
                  <input
                    required
                    name="userName"
                    id="Name"
                    type="text"
                    placeholder="Enter Name"
                    className="form-input ps-10 placeholder:text-white-dark"
                  />
                  <span className="absolute start-4 top-1/2 -translate-y-1/2">
                    <IconUser fill={true} />
                  </span>
                </div>
              </div>
              <div>
                <label htmlFor="Email">Email</label>
                <div className="relative text-white-dark">
                  <input
                    required
                    name="userEmail"
                    id="Email"
                    type="email"
                    placeholder="Enter Email"
                    className="form-input ps-10 placeholder:text-white-dark"
                  />
                  <span className="absolute start-4 top-1/2 -translate-y-1/2">
                    <IconMail fill={true} />
                  </span>
                </div>
              </div>
              <div>
                <label htmlFor="Password">Password</label>
                <div className="relative text-white-dark">
                  <input
                    required
                    name="userPassword"
                    id="Password"
                    type="password"
                    placeholder="Enter Password"
                    className="form-input ps-10 placeholder:text-white-dark"
                  />
                  <span className="absolute start-4 top-1/2 -translate-y-1/2">
                    <IconLockDots fill={true} />
                  </span>
                </div>
              </div>
              <div>
                <label htmlFor="role">Role</label>
                <div className="relative text-white-dark">
                  <select
                    id="role"
                    name="role"
                    className="form-select ps-12 placeholder:text-white-dark"
                  >
                    <option value="" disabled selected hidden>
                      Select Role
                    </option>
                    <option value={"manager"}>
                      Manager
                    </option>
                    <option value={"user"}>
                      Sales Person
                    </option>
                  </select>
                  <span className="absolute start-4 top-1/2 -translate-y-1/2">
                    <IconUsersGroup fill={true} />
                  </span>
                </div>
              </div>
              {/* <div>
                <label htmlFor="team">Team</label>
                <div className="relative text-white-dark">
                  <select
                      as="select"
                      id="team"
                      name="team"
                      placeholder="Select Team"
                      className="form-select ps-12 placeholder:text-white-dark"
                    >
                      {Array.isArray(teamsData?.teams) &&
                        teamsData?.teams?.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.teamName}
                          </option>
                        ))}
                    </select>
                  <select
                    id="team"
                    name="team"
                    className="form-select ps-12 placeholder:text-white-dark"
                  >
                    <option value="" disabled selected hidden>
                      Select Team
                    </option>
                    {Array.isArray(teamsData?.teams) &&
                      teamsData?.teams?.map((item) => (
                        <option key={item?._id} value={item?._id}>
                          {item?.department}
                        </option>
                      ))}
                  </select>

                  <span className="absolute start-4 top-1/2 -translate-y-1/2">
                    <IconUsersGroup fill={true} />
                  </span>
                </div>
              </div> */}

              <button
                disabled={mutation.isPending}
                type="submit"
                className="btn btn-primary !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
              >
                {mutation.isPending && (
                  <span className="animate-spin border-2 border-primary border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle "></span>
                )}{" "}
                Submit
              </button>
            </form>
          </div>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
};

export default AddUserForm;
