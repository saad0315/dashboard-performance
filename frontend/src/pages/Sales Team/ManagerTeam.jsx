import React, { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTeam, addTeam, deleteTeam } from "../../api/salesApi";
import { SalesTeamCardSkeleton } from "../../components/Skeletons/Skeletons";
import IconPlus from "../../components/Icon/IconPlus";
import IconX from "../../components/Icon/IconX";
import IconUser from "../../components/Icon/IconUser";
import IconUsersGroup from "../../components/Icon/IconUsersGroup";
import Tippy from "@tippyjs/react";
import { Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Dialog } from "@headlessui/react";
import { coloredToast } from "../../components/Alerts/SimpleAlert";
import { getAllUsers } from "../../api/userApi";
import IconTrashLines from "../../components/Icon/IconTrashLines";


export default function ManagerTeam() {
  const query = useQueryClient();
  const { managerId } = useParams();

  const {
    isLoading,
    data: teamsData,
    status,
  } = useQuery({
    queryKey: ["team"],
    queryFn: getTeam,
  });

  const {
    isLoading: userLoading,
    data: usersData,
    status: userStatus,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  // Filter teams for the specific manager
  const managerTeams = teamsData?.teams?.filter(
    (team) => team.manager?._id === managerId
  );
  const [modal20, setModal20] = useState(false);
  const [modal10, setModal10] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  const form = useRef();

  const mutation = useMutation({
    mutationKey: ["addTeam"],
    mutationFn: addTeam,
    onSuccess: (response) => {
      query.invalidateQueries("team");
      form.current.reset();
      setModal20(false);
      coloredToast(
        "success",
        "Team Has been Created Successfully",
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


  const submitForm = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    let object = {};
    const formData = new FormData(e.target);
    for (const [key, value] of formData.entries()) {
      object[key] = value;
    }
    mutation.mutate(object);
  };

  const deleteMutation = useMutation({
    mutationKey: ["deleteTeam"],
    mutationFn: deleteTeam,
    onSuccess: () => {
      query.invalidateQueries("team");
      setModal10(false);
      coloredToast(
        "success",
        "Team Has been Deleted Successfully",
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

  return (
    <div>
      <div>
        <div className="flex justify-between items-center">
          <ul className="flex space-x-2 rtl:space-x-reverse mb-5">
            <li>
              <Link to="/sales-managers" className="text-primary hover:underline">
                Managers
              </Link>
            </li>
            <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
              <span>Teams</span>
            </li>
          </ul>
          <Tippy content="Add Team">
            <button
              type="button"
              onClick={() => setModal20(true)}
              className="btn btn-dark w-10 h-10 p-0 rounded-full mb-5"
            >
              <IconPlus />
            </button>
          </Tippy>
        </div>

        {isLoading ? (
          <SalesTeamCardSkeleton />
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-5">
            {managerTeams?.map((item, idx) => (
              <div
                key={idx}
                className="relative max-w-[25rem] w-full panel h-full"
              >
                <Link to={`/sales-teams/${item?._id}`}>
                  <div className="flex items-center justify-between border-b border-white-light dark:border-[#1b2e4b] -m-5 mb-5 p-5">
                    <div className="flex">
                      <div className="font-semibold">
                        <h6>{item?.teamName}</h6>
                        <p className="text-xs text-white-dark mt-1">
                          {item?.department === "ebook"
                            ? "Ebook"
                            : item?.department === "seo"
                              ? "Seo"
                              : "Sales Team"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold text-center pb-8">
                    <div className="mb-4 text-primary">
                      {item?.users?.length} Members
                    </div>
                    {item?.users?.length > 0 ? (
                      <div className="flex items-center justify-center -space-x-3 rtl:space-x-reverse md:mb-10 mb-5">
                        {item?.users?.slice(0, 4)?.map((user, index) => (
                          user.profileImageUrl ? (
                            <img
                              key={index}
                              className="w-9 h-9 rounded-full overflow-hidden object-cover ring-2 ring-white dark:ring-[#515365]"
                              src={user?.profileImageUrl}
                              alt={`profile${index + 1}`}
                            />
                          ) : (
                            <div className="text-lg rounded-full w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700">
                              {user.userName?.charAt(0).toUpperCase()}
                            </div>
                          )
                        ))}
                        {item?.users?.length > 4 && (
                          <span className="bg-white rounded-full px-2 py-1 text-primary text-xs">
                            +{item.users.length - 4} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center -space-x-3 rtl:space-x-reverse md:mb-10 mb-5">
                        <IconPlus />
                      </div>
                    )}
                  </div>
                  <Tippy content="Delete Team">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent Link navigation
                        e.stopPropagation(); // Add this line to stop event bubbling
                        setSelectedTeamId(item?._id);
                        setModal10(true);
                      }}
                      className="absolute top-4 right-4 hover:text-danger"
                    >
                      <IconTrashLines className="w-5 h-5" />
                    </button>
                  </Tippy>
                </Link>
              </div>
            ))}
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
                    <h5>Add Team</h5>
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
                        <label htmlFor="teamName">Name</label>
                        <div className="relative text-white-dark">
                          <input
                            name="teamName"
                            id="Name"
                            type="text"
                            required
                            placeholder="Enter Team Name"
                            className="form-input ps-10 placeholder:text-white-dark"
                          />
                          <span className="absolute start-4 top-1/2 -translate-y-1/2">
                            <IconUser fill={true} />
                          </span>
                        </div>
                      </div>
                      {/* <div>
                        <label htmlFor="team">Team</label>
                        <div className="relative text-white-dark">
                          <select
                            id="department"
                            name="department"
                            className="form-select ps-12 placeholder:text-white-dark"
                          >
                            <option value="" disabled selected hidden>
                              Select Team
                            </option>
                            <option value={"ebook"}>
                              Ebook
                            </option>
                            <option value={"seo"}>
                              Seo
                            </option>
                          </select>

                          <span className="absolute start-4 top-1/2 -translate-y-1/2">
                            <IconUsersGroup fill={true} />
                          </span>
                        </div>
                      </div> */}

                      <input type="hidden" name="department" value="ebook" />

                      <div>
                        <label htmlFor="manager">Manager</label>
                        <div className="relative text-white-dark">
                          <select
                            id="manager"
                            name="manager"
                            className="form-select ps-12 placeholder:text-white-dark"
                          >
                            <option value="" disabled selected hidden>
                              Select Manager
                            </option>
                            {Array.isArray(usersData?.users) &&
                              usersData?.users
                                ?.filter(
                                  (item) =>
                                    item.role !== "user"
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
                  <p>Are you sure you want to delete ?</p>
                  <div className="flex justify-end items-center mt-8">
                    <button
                      onClick={() => setModal10(false)}
                      type="button"
                      className="btn btn-outline-danger"
                    >
                      Discard
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(selectedTeamId)}
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