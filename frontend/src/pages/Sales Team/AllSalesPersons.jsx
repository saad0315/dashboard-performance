import React, { Fragment, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import IconStar from "../../components/Icon/IconStar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addTeam, getSalesTeam } from "../../api/salesApi";
import Tippy from "@tippyjs/react";
import sortBy from "lodash/sortBy";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../components/Icon/IconX";
import IconUser from "../../components/Icon/IconUser";
import IconPlus from "../../components/Icon/IconPlus";
import { assignedTeam, getAllUsers, removeTeam, updateProfile } from "../../api/userApi";
import IconUsersGroup from "../../components/Icon/IconUsersGroup";
import { coloredToast } from "../../components/Alerts/SimpleAlert";
import { SalesPersonCardSkeleton } from "../../components/Skeletons/Skeletons";
import IconMenuDocumentation from "../../components/Icon/Menu/IconMenuDocumentation";
import IconTrashLines from "../../components/Icon/IconTrashLines";
export default function AllSalesPersons() {
  const query = useQueryClient();
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    isLoading: userLoading,
    data: usersData,
    status: userStatus,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });
  const {
    isFetching,
    isLoading,
    data: salesTeamData,
    status,
  } = useQuery({
    queryKey: ["salesTeam"],
    queryFn: () => getSalesTeam(id),
  });

  const [modal20, setModal20] = useState(false);
  const [search, setSearch] = useState("");
  const [initialRecords, setInitialRecords] = useState([]);
  const [modal10, setModal10] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  useEffect(() => {
    if (salesTeamData?.team) {
      const filteredSales = salesTeamData?.team?.filter((item) => {
        return (
          // item.role === "user" ||
          // item.team !== id ||
          item?.userName.toLowerCase().includes(search.toLowerCase()) ||
          item?.userEmail.toLowerCase().includes(search.toLowerCase())
        );
      });
      const sortedSales = sortBy(filteredSales, "updatedAt");
      setInitialRecords(sortedSales);
    }
  }, [search, salesTeamData]);

  const form = useRef();

  const removeTeamMutation = useMutation({
    mutationKey: ["removeTeam"],
    mutationFn: () => removeTeam(selectedTeamId?._id),
    onSuccess: (response) => {
      query.invalidateQueries("salesTeam");
      setModal10(false);
      coloredToast(
        "success",
        "Sales Person has been Remove Successfully",
        "top",
        null,
        null,
        1000
      );
    },
    onError: (error) => {
      console.log(error);
      coloredToast("danger", error?.response?.data?.message, "top");
    },
  });

  const mutation = useMutation({
    mutationKey: ["assignTeam"],
    mutationFn: (data) => assignedTeam(data),
    onSuccess: (response) => {
      form.current.reset();
      query.invalidateQueries("salesTeam");
      setModal20(false);
      coloredToast(
        "success",
        "Team Has been Updated Successfully",
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

  const submitForm = (e) => {
    e.preventDefault();

    let object = {};
    const formData = new FormData(e.target);

    formData.append("teamId", id);

    for (const [key, value] of formData.entries()) {
      object[key] = value;
    }
    mutation.mutate(object);
  };

  const getStarRating = (converted, lost) => {
    const total = converted + lost;
    if (total === 0) return 0;
    const rating = (converted / total) * 5;
    return Math.round(rating);
  };

  // initialRecords?.map((item, index) => {
  //   const filledStars = getStarRating(
  //     item?.convertedLeadsCount,
  //     item?.lostLeadsCount
  //   );
  // });
  return (
    <div>
      <div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
          <ul className="flex  space-x-2 rtl:space-x-reverse mb-5">
            {/* <li>
              <Link to="/sales-teams" className="text-primary hover:underline">
                Sales Teams
              </Link>
            </li> */}
            <li>
              <button
                onClick={() => navigate(-1)}
                className="text-primary hover:underline cursor-pointer"
              >
                Sales Teams
              </button>
            </li>
            <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
              <span>Persons</span>
            </li>
          </ul>

          <div className="flex self-end gap-4">
            <div className="text-right">
              <input
                type="text"
                className="form-input w-auto"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Tippy content="Add Sales Person">
              <button
                type="button"
                onClick={() => setModal20(true)}
                className="btn btn-dark w-10 h-10 p-0 rounded-full mb-5"
              >
                <IconPlus />
              </button>
            </Tippy>
          </div>
        </div>
        {isFetching ? (
          <SalesPersonCardSkeleton />
        ) : (
          // <span className="animate-spin border-4 border-transparent border-l-primary rounded-full w-12 h-12 inline-block align-middle m-auto mb-10"></span>
          <div className="mb-5 flex flex-wrap items-center justify-center gap-4">
            {Array.isArray(initialRecords) && initialRecords?.length > 0 ? (
              initialRecords?.map((item, index) => {
                const filledStars = getStarRating(
                  item?.convertedLeadsCount,
                  item?.lostLeadsCount
                );
                return (
                  <div className="relative max-w-[16rem] w-full space-y-5 rounded-md border border-white-light bg-white p-5 shadow-[0px_0px_2px_0px_rgba(145,158,171,0.20),0px_12px_24px_-4px_rgba(145,158,171,0.12)] dark:border-[#1B2E4B] dark:bg-black">
                    <div
                      className="absolute top-0 right-0 cursor-pointer p-4 "
                      onClick={() => {
                        setSelectedTeamId(item);
                        setModal10(true);
                      }}
                    >
                      <IconTrashLines className="text-danger " />
                    </div>
                    <Link
                      to={`/sales-persons/${item?._id}`}
                      key={index}
                    // className=" max-w-[18rem] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] hover:shadow-none hover:dark:border-primary border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none rounded  p-5"
                    >
                      <div className="text-center text-black-light">
                        <div className="mb-5 w-20 h-20 rounded-full overflow-hidden mx-auto">
                          {item?.profileImgUrl ? (
                            <img
                              className="w-full h-full object-cover"
                              src={`https://bellevue-portal.b-cdn.net/${item?.profileImgUrl}`}
                              alt="userProfile"
                            />
                          ) : (
                            <div className="text-2xl font-bold  w-full h-full flex items-center justify-center bg-gray-200 text-gray-700">
                              {item?.userName
                                ? item?.userName.charAt(0).toUpperCase()
                                : ""}
                            </div>
                          )}
                        </div>
                        <h5 className="text-[#3b3f5c] text-lg font-semibold mb-2 dark:text-white-light capitalize">
                          {item?.userName}
                        </h5>
                        <p className="text-white-dark">{item?.userEmail}</p>
                        <div className="flex justify-center items-center text-[#e2a03f] my-4">
                          {[...Array(5)]?.map((_, i) => (
                            <IconStar
                              key={i}
                              className={i < filledStars ? "fill-warning" : ""}
                            />
                          ))}
                        </div>
                        <div className="grid grid-cols-3 mx-auto mt-5">
                          <div>
                            <p className="mb-2 text-white-dark">Assigned </p>
                            <span className="badge bg-primary rounded-full">
                              {item?.leadsCount}
                            </span>
                          </div>
                          <div>
                            <p className="mb-2 text-white-dark">Converted</p>
                            <span className="badge bg-success rounded-full">
                              {item?.convertedLeadsCount}
                            </span>
                          </div>
                          <div>
                            <p className="mb-2 text-white-dark">Lost</p>
                            <span className="badge bg-danger rounded-full">
                              {item?.lostLeadsCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })
            ) : (
              <div className="flex justify-center items-center  h-full w-full">
                <li
                  className={`group flex  cursor-pointer flex-col items-center justify-center gap-4 rounded-md px-8 py-2.5 text-center text-[#506690] duration-300 hover:bg-white hover:text-primary dark:hover:bg-[#1B2E4B]
                      'bg-white  dark:bg-[#1B2E4B]' `}
                >
                  <IconMenuDocumentation />

                  <h5 className="font-bold text-black dark:text-white">
                    No records
                  </h5>
                </li>
              </div>
            )}
          </div>
        )}
      </div>
      <Transition appear show={modal20} as={Fragment}>
        <Dialog as="div" open={modal20} onClose={() => setModal20(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0" />
          </Transition.Child>
          <div
            id="login_modal"
            className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto"
          >
            <div className="flex items-start justify-center min-h-screen px-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="panel border-0 py-1 px-4 rounded-lg overflow-hidden w-full max-w-sm my-8 text-black dark:text-white-dark">
                  <div className="flex items-center justify-between p-5 font-semibold text-lg dark:text-white">
                    <h5>Add Sales Person</h5>
                    <button
                      type="button"
                      onClick={() => setModal20(false)}
                      className="text-white-dark hover:text-dark"
                    >
                      <IconX />
                    </button>
                  </div>

                  <div className="p-5 pt-0">
                    <form
                      ref={form}
                      className="space-y-5 dark:text-white"
                      onSubmit={submitForm}
                    >
                      <div>
                        <label htmlFor="userId">Team</label>
                        <div className="relative text-white-dark">
                          <select
                            id="userId"
                            name="userId"
                            className="form-select ps-12 placeholder:text-white-dark"
                          >
                            <option value="" disabled selected hidden>
                              Select User
                            </option>
                            {Array.isArray(usersData?.users) &&
                              usersData?.users
                                ?.filter(
                                  (item) =>
                                    item?.role === "user" || item?.role === "manager" || item?.role === "superAdmin" 
                                )
                                .map((item) => (
                                  <option key={item._id} value={item._id}>
                                    {item.userName}
                                  </option>
                                ))}
                          </select>

                          <span className="absolute start-4 top-1/2 -translate-y-1/2">
                            <IconUsersGroup fill={true} />
                          </span>
                        </div>
                      </div>

                      <button
                        disabled={mutation.isPending}
                        type="submit"
                        className="btn btn-primary w-full"
                      >
                        {mutation.isPending && (
                          <span className="animate-spin border-2 border-primary border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle "></span>
                        )}{" "}
                        Add
                      </button>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Transition appear show={modal10} as={Fragment}>
        <Dialog as="div" open={modal10} onClose={() => setModal10(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0" />
          </Transition.Child>
          <div
            id="slideIn_down_modal"
            className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto"
          >
            <div className="flex items-start justify-center min-h-screen px-4">
              <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark animate__animated animate__slideInDown">
                <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                  <h5 className="font-bold text-lg">Warning !</h5>
                  <button
                    onClick={() => setModal10(false)}
                    type="button"
                    className="text-white-dark hover:text-dark"
                  >
                    <IconX />
                  </button>
                </div>
                <div className="p-5">
                  <p>
                    Are you sure you want to Remove {selectedTeamId?.userName} ?
                  </p>
                  <div className="flex justify-end items-center mt-8">
                    <button
                      onClick={() => setModal10(false)}
                      type="button"
                      className="btn btn-outline-danger"
                    >
                      Discard
                    </button>
                    <button
                      onClick={() => removeTeamMutation.mutate(selectedTeamId?._id)}
                      type="button"
                      className="btn btn-primary ltr:ml-4 rtl:mr-4"
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
