// import React, { Fragment, useRef, useState } from "react";
// import IconStar from "../../components/Icon/IconStar";
// import { Link } from "react-router-dom";
// import { addTeam, getTeam } from "../../api/salesApi";
// import IconPlus from "../../components/Icon/IconPlus";
// import IconDelete from "../../components/Icon/IconTrashLines";
// import Tippy from "@tippyjs/react";
// import { Dialog, Transition } from "@headlessui/react";
// import IconX from "../../components/Icon/IconX";
// import IconUser from "../../components/Icon/IconUser";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { coloredToast } from "../../components/Alerts/SimpleAlert";
// import { SalesTeamCardSkeleton } from "../../components/Skeletons/Skeletons";
// import IconUsersGroup from "../../components/Icon/IconUsersGroup";
// import { useSelector } from "react-redux";
// import { getAllUsers } from "../../api/userApi";

// export default function AllSalesTeams() {
//   const query = useQueryClient();
//   const {
//     isLoading,
//     data: teamsData,
//     status,
//   } = useQuery({
//     queryKey: ["team"],
//     queryFn: getTeam,
//   });
//   const {
//     isLoading: userLoading,
//     data: usersData,
//     status: userStatus,
//   } = useQuery({
//     queryKey: ["users"],
//     queryFn: getAllUsers,
//   });

//   const [modal20, setModal20] = useState(false);
//   const [modal10, setModal10] = useState(false);
//   const [selectedTeamId, setSelectedTeamId] = useState(null);
//   const { user } = useSelector((state) => state.user);

//   const form = useRef();

//   const mutation = useMutation({
//     mutationKey: ["addTeam"],
//     mutationFn: addTeam,
//     onSuccess: (response) => {
//       query.invalidateQueries("team");
//       form.current.reset();
//       setModal20(false);
//       coloredToast(
//         "success",
//         "Team Has been Created Successfully",
//         "top",
//         null,
//         null,
//         1000
//       );
//     },
//     onError: (error) => {
//       console.log(error);
//       coloredToast("danger", error?.response?.data?.message, "top");
//     },
//   });


//   const submitForm = (e) => {
//     e.preventDefault(); // Prevent the default form submission behavior

//     let object = {};
//     const formData = new FormData(e.target);
//     for (const [key, value] of formData.entries()) {
//       object[key] = value;
//     }
//     mutation.mutate(object);
//   };


//   if (!teamsData || !Array.isArray(teamsData.teams)) return null;

//   const formatDepartment = (dept) => {
//     switch (dept?.toLowerCase()) {
//       case 'ebook':
//         return 'Ebook';
//       case 'seo':
//         return 'SEO';
//       case 'sales':
//         return 'Sales Team';
//       default:
//         return dept ? dept.charAt(0).toUpperCase() + dept.slice(1) : 'Sales Team';
//     }
//   };

//   // Extract unique managers from teams
//   const managers = [];
//   const managerSet = new Set();

//   teamsData?.teams?.forEach((team) => {
//     if (team.manager && !managerSet.has(team.manager._id)) {
//       managerSet.add(team.manager._id);
//       managers.push({
//         ...team.manager,
//         departments: teamsData.teams
//           .filter(t => t.manager?._id === team.manager._id)
//           .map(t => t.department)
//           .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
//       });
//     }
//   });

//   // console.log(managers);

//   // Filtering teams based on role
//   // let filteredTeams = [];

//   // if (user.role === "admin") {
//   //   filteredTeams = teamsData.teams; // Admin can see all teams
//   // } else if (user.role === "manager") {
//   //   filteredTeams = teamsData.teams.filter(
//   //     (team) => team.manager?._id === user._id
//   //   ); // Manager sees only their own teams
//   // }

//   // // Extract unique managers from filtered teams
//   // const managers = [];
//   // const managerTeamsMap = {};

//   // filteredTeams.forEach((team) => {
//   //   const managerId = team.manager?._id;
//   //   if (!managerTeamsMap[managerId]) {
//   //     managerTeamsMap[managerId] = {
//   //       manager: team.manager,
//   //       teams: [],
//   //     };
//   //     managers.push(team.manager);
//   //   }
//   //   managerTeamsMap[managerId].teams.push(team);
//   // });


//   return (
//     <div>
//       <div>
//         <div className="flex justify-between items-center">
//           <ul className="flex space-x-2 rtl:space-x-reverse mb-5">
//             <li>
//               <Link to="#" className="text-primary hover:underline">
//                 Sales Managers
//               </Link>
//             </li>

//             <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
//               <span>Teams</span>
//             </li>
//           </ul>
//           <Tippy content="Add Team">
//             <button
//               type="button"
//               onClick={() => setModal20(true)}
//               className="btn btn-dark w-10 h-10 p-0 rounded-full mb-5"
//             >
//               <IconPlus />
//             </button>
//           </Tippy>
//         </div>

//         {isLoading ? (
//           <SalesTeamCardSkeleton />
//         ) : (
//           <>
//             {managers.length === 0 ? (
//               <div className="flex flex-col items-center justify-center min-h-[400px]">
//                 <div className="text-3xl font-bold text-gray-400 dark:text-gray-600 mb-2">
//                   No Records Found
//                 </div>
//                 <p className="text-gray-500 dark:text-gray-400">
//                   There are no sales managers available at the moment.
//                 </p>
//               </div>
//             ) : (
//               <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-5 w-full mx-auto place-content-center">
//                 {managers
//                   .filter((contact) => {
//                     // if (user?.role === "superAdmin") return true; // Admin ko sab show hoga
//                     if (user?.role === "admin") return true; // Admin ko sab show hoga
//                     if (user?.role === "manager") return contact?._id === user?._id  // Manager ke liye filtering
//                     if (user?.role === "superAdmin") return contact?._id === user?._id  // Manager ke liye filtering
//                     return false; // Baaki kisi role ke liye kuch nahi dikhayenge
//                   })
//                   .map((contact, index) => (

//                     <Link to={`/sales-manager-teams/${contact._id}`} key={index}>
//                       <div className="bg-white dark:bg-[#1c232f] rounded-md overflow-hidden text-center shadow relative" >
//                         <div className="bg-white dark:bg-[#1c232f] rounded-md overflow-hidden text-center shadow relative">
//                           <div
//                             className="bg-white/40 rounded-t-md bg-center bg-cover p-6 pb-0 bg-"
//                             style={{
//                               backgroundImage: `url('/assets/images/notification-bg.png')`,
//                               backgroundRepeat: 'no-repeat',
//                               width: '100%',
//                               height: '100%',
//                             }}
//                           >
//                             <img className="object-contain w-4/5 max-h-40 mx-auto" src={`https://res.cloudinary.com/ddvtgfqgv/image/upload/v1691059545/member-profile/avatar_aoyxl6.webp`} alt="contact_image" />
//                           </div>
//                           <div className="px-6 pb-24 -mt-10 relative">
//                             <div className="shadow-md bg-white dark:bg-gray-900 rounded-md px-2 py-4">
//                               <div className="text-xl capitalize">{contact.userName}</div>
//                               <div className="flex gap-2 mt-2 mx-auto justify-center">
//                                 {contact.departments.map((dept, idx) => (
//                                   <span
//                                     key={idx}
//                                     className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
//                                   >
//                                     {formatDepartment(dept)}
//                                   </span>
//                                 ))}
//                               </div>

//                             </div>
//                             <div className="mt-6 grid grid-cols-1 gap-4 ltr:text-left rtl:text-right">
//                               <div className="flex items-center">
//                                 <div className="flex-none ltr:mr-2 rtl:ml-2">Email :</div>
//                                 <div className="truncate text-white-dark">{contact.userEmail}</div>
//                               </div>
//                               <div className="flex items-center">
//                                 <div className="flex-none ltr:mr-2 rtl:ml-2">Role :</div>
//                                 <div className="text-white-dark capitalize">{contact.role === "user" ? "Sales Person" : contact.role}</div>
//                               </div>
//                             </div>
//                           </div>

//                         </div>
//                       </div>
//                     </Link>
//                   ))}
//               </div>
//             )}
//           </>
//         )}
//       </div>
//       <Transition appear show={modal20} as={Fragment}>
//         <Dialog as="div" open={modal20} onClose={() => setModal20(false)}>
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="fixed inset-0" />
//           </Transition.Child>
//           <div
//             id="login_modal"
//             className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto"
//           >
//             <div className="flex items-start justify-center min-h-screen px-4">
//               <Transition.Child
//                 as={Fragment}
//                 enter="ease-out duration-300"
//                 enterFrom="opacity-0 scale-95"
//                 enterTo="opacity-100 scale-100"
//                 leave="ease-in duration-200"
//                 leaveFrom="opacity-100 scale-100"
//                 leaveTo="opacity-0 scale-95"
//               >
//                 <Dialog.Panel className="panel border-0 py-1 px-4 rounded-lg overflow-hidden w-full max-w-sm my-8 text-black dark:text-white-dark">
//                   <div className="flex items-center justify-between p-5 font-semibold text-lg dark:text-white">
//                     <h5>Add Team</h5>
//                     <button
//                       type="button"
//                       onClick={() => setModal20(false)}
//                       className="text-white-dark hover:text-dark"
//                     >
//                       <IconX />
//                     </button>
//                   </div>

//                   <div className="p-5 pt-0">
//                     <form
//                       ref={form}
//                       className="space-y-5 dark:text-white"
//                       onSubmit={submitForm}
//                     >
//                       <div>
//                         <label htmlFor="teamName">Name</label>
//                         <div className="relative text-white-dark">
//                           <input
//                             name="teamName"
//                             id="Name"
//                             type="text"
//                             required
//                             placeholder="Enter Team Name"
//                             className="form-input ps-10 placeholder:text-white-dark"
//                           />
//                           <span className="absolute start-4 top-1/2 -translate-y-1/2">
//                             <IconUser fill={true} />
//                           </span>
//                         </div>
//                       </div>
//                       {/* <div>
//                         <label htmlFor="team">Team</label>
//                         <div className="relative text-white-dark">
//                           <select
//                             id="department"
//                             name="department"
//                             className="form-select ps-12 placeholder:text-white-dark"
//                           >
//                             <option value="" disabled selected hidden>
//                               Select Team
//                             </option>
//                             <option value={"ebook"}>
//                               Ebook
//                             </option>
//                             <option value={"seo"}>
//                               Seo
//                             </option>
//                           </select>

//                           <span className="absolute start-4 top-1/2 -translate-y-1/2">
//                             <IconUsersGroup fill={true} />
//                           </span>
//                         </div>
//                       </div> */}

//                       <input type="hidden" name="department" value="ebook" />

//                       <div>
//                         <label htmlFor="manager">Manager</label>
//                         <div className="relative text-white-dark">
//                           <select
//                             id="manager"
//                             name="manager"
//                             className="form-select ps-12 placeholder:text-white-dark"
//                           >
//                             <option value="" disabled selected hidden>
//                               Select Manager
//                             </option>
//                             {Array.isArray(usersData?.users) &&
//                               usersData?.users
//                                 ?.filter(
//                                   (item) =>
//                                     item.role !== "user"
//                                 )
//                                 .map((item) => (
//                                   <option key={item._id} value={item._id}>
//                                     {item.userName}
//                                   </option>
//                                 ))}
//                           </select>

//                           <span className="absolute start-4 top-1/2 -translate-y-1/2">
//                             <IconUsersGroup fill={true} />
//                           </span>
//                         </div>
//                       </div>

//                       <button
//                         disabled={mutation.isPending}
//                         type="submit"
//                         className="btn btn-primary w-full"
//                       >
//                         {mutation.isPending && (
//                           <span className="animate-spin border-2 border-primary border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle "></span>
//                         )}{" "}
//                         Add
//                       </button>
//                     </form>
//                   </div>
//                 </Dialog.Panel>
//               </Transition.Child>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>
//       <Transition appear show={modal10} as={Fragment}>
//         <Dialog as="div" open={modal10} onClose={() => setModal10(false)}>
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="fixed inset-0" />
//           </Transition.Child>
//           <div
//             id="slideIn_down_modal"
//             className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto"
//           >
//             <div className="flex items-start justify-center min-h-screen px-4">
//               <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark animate__animated animate__slideInDown">
//                 <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
//                   <h5 className="font-bold text-lg">Warning !</h5>
//                   <button
//                     onClick={() => setModal10(false)}
//                     type="button"
//                     className="text-white-dark hover:text-dark"
//                   >
//                     <IconX />
//                   </button>
//                 </div>
//                 <div className="p-5">
//                   <p>Are you sure you want to delete ?</p>
//                   <div className="flex justify-end items-center mt-8">
//                     <button
//                       onClick={() => setModal10(false)}
//                       type="button"
//                       className="btn btn-outline-danger"
//                     >
//                       Discard
//                     </button>
//                     <button
//                       onClick={() => deleteMutation.mutate(selectedTeamId)}
//                       type="button"
//                       className="btn btn-primary ltr:ml-4 rtl:mr-4"
//                     >
//                       Yes
//                     </button>
//                   </div>
//                 </div>
//               </Dialog.Panel>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>
//     </div>
//   );
// }




// // <div className="mb-5 flex flex-wrap items-center justify-center gap-5">
// //   {Array.isArray(teamsData?.teams) &&
// //     teamsData?.teams?.map((item, index) => (
// //       <div
// //         key={index}
// //         className="relative max-w-[25rem] w-full panel h-full"
// //       >

// //         <Link to={item?._id}>
// //           <div className=" flex items-center justify-between border-b  border-white-light dark:border-[#1b2e4b] -m-5 mb-5 p-5">
// //             <div className="flex">
// //               <div className="media-aside align-self-start">
// //                 <div className="shrink-0 ring-2 ring-white-light dark:ring-dark rounded-full ltr:mr-4 rtl:ml-4">
// //                   <img
// //                     src="/assets/images/g-8.png"
// //                     alt="profile2"
// //                     className="w-10 h-10 rounded-full object-cover"
// //                   />
// //                 </div>
// //               </div>
// //               <div className="font-semibold">
// //                 <h6>{item?.teamName}</h6>
// //                 <p className="text-xs text-white-dark mt-1">
// //                   {item?.department === "ebook" ? "Ebook" : "Sales Team" && item?.department === "seo" ? "Seo" : "Sales Team"}
// //                 </p>
// //               </div>
// //             </div>
// //           </div>
// //           <div className="font-semibold text-center pb-8">
// //             <div className="mb-4 text-primary">
// //               {item?.users?.length} Members Going
// //             </div>
// //             {item?.users?.length > 0 ? (
// //               <div className="flex items-center justify-center -space-x-3 rtl:space-x-reverse md:mb-10 mb-5 ">
// //                 {item?.users
// //                   ?.slice(0, 4)
// //                   ?.map((user, index) =>
// //                     user.profileImageUrl ? (
// //                       <img
// //                         key={index}
// //                         className="w-9 h-9 rounded-full overflow-hidden object-cover ring-2 ring-white dark:ring-[#515365] shadow-[0_0_15px_1px_rgba(113,106,202,0.30)] dark:shadow-none"
// //                         src={user?.profileImageUrl}
// //                         alt={`profile${index + 1}`}
// //                       />
// //                     ) : (
// //                       <div className="text-lg  rounded-full w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700">
// //                         {user.userName
// //                           ? user.userName.charAt(0).toUpperCase()
// //                           : ""}
// //                       </div>
// //                     )
// //                   )}
// //                 {item?.users?.length > 4 && (
// //                   <span className="bg-white rounded-full px-2 py-1 text-primary text-xs shadow-[0_0_20px_0_#d0d0d0] dark:shadow-none dark:bg-[#0e1726] dark:text-white">
// //                     +{item.users.length - 4} more
// //                   </span>
// //                 )}
// //               </div>
// //             ) : (
// //               <div className="flex items-center justify-center -space-x-3 rtl:space-x-reverse md:mb-10 mb-5 ">
// //                 <IconPlus />
// //               </div>
// //             )}
// //             <div className="w-full absolute bottom-0 flex items-center justify-between p-5 -mx-5">
// //               <button
// //                 type="button"
// //                 className="btn btn-secondary btn-lg w-full border-0 bg-gradient-to-r from-[#3d38e1] to-[#1e9afe]"
// //               >
// //                 View Details
// //               </button>
// //             </div>
// //           </div>
// //         </Link>
// //       </div>
// //     ))}
// // </div>


// Enhanced AllSalesTeams Component


import React, { Fragment, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Tippy from "@tippyjs/react";
import { Dialog, Transition } from "@headlessui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import IconPlus from "../../components/Icon/IconPlus";
import IconX from "../../components/Icon/IconX";
import IconUser from "../../components/Icon/IconUser";
import IconUsersGroup from "../../components/Icon/IconUsersGroup";
import { SalesTeamCardSkeleton } from "../../components/Skeletons/Skeletons";
import { addTeam, getTeam } from "../../api/salesApi";
// import { getAllUsers } from "../../api/userApi";
import { coloredToast } from "../../components/Alerts/SimpleAlert";

/**
 * Modern, responsive redesign:
 * – glass/soft cards, rounded chips, subtle gradients
 * – improved dark/light contrasts
 * – focus & hover states for a11y
 * – works down to small phones; scales up to 2xl
 */

export default function AllSalesTeams() {
  const query = useQueryClient();
  const { user } = useSelector((state) => state.user);

  const {
    isLoading,
    data: teamsData,
  } = useQuery({ queryKey: ["team"], queryFn: getTeam });

  // const {
  //   data: usersData,
  // } = useQuery({ queryKey: ["users"], queryFn: getAllUsers });

  const [modalOpen, setModalOpen] = useState(false);
  const form = useRef();

  const mutation = useMutation({
    mutationKey: ["addTeam"],
    mutationFn: addTeam,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["team"] });
      form.current?.reset();
      setModalOpen(false);
      coloredToast("success", "Team created", "top", null, null, 900);
    },
    onError: (error) => {
      coloredToast("danger", error?.response?.data?.message || "Error", "top");
    },
  });

  if (!teamsData || !Array.isArray(teamsData.teams)) return null;

  const formatDepartment = (dept) => {
    switch (dept?.toLowerCase()) {
      case "frontsell":
        return "Front Sales";
      case "upsell":
        return "Upsell";
      case "projectmanager":
        return "Project Manager";
      case "ppc":
        return "PPC";
      case "dataentry":
        return "Data Entry";
      default:
        return dept ? dept.charAt(0).toUpperCase() + dept.slice(1) : "Team";
    }
  };

  // Group teams
  const teamsByDepartment = {};
  teamsData?.teams?.forEach((team) => {
    if (!teamsByDepartment[team.department]) teamsByDepartment[team.department] = [];
    teamsByDepartment[team.department].push(team);
  });

  // Role-aware filtering
  const getFilteredTeams = () => {
    if (user.role === "superAdmin" || user.role === "admin") return teamsByDepartment;

    const filtered = {};
    Object.keys(teamsByDepartment).forEach((dept) => {
      const userTeams = teamsByDepartment[dept].filter(
        (team) =>
          user.teams?.some((ut) => ut.team === team._id && ut.role === "manager") ||
          team.manager?._id === user._id
      );
      if (userTeams.length) filtered[dept] = userTeams;
    });
    return filtered;
  };

  const filteredTeamsByDepartment = getFilteredTeams();

  const submitForm = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {};
    for (const [k, v] of formData.entries()) payload[k] = v;
    mutation.mutate(payload);
  };

  // status chip
const StatusChip = ({ status }) => {
   const active = status == "active";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1
      ${active
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-700/40"
          : "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:ring-rose-700/40"
        }`}
    >
      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-rose-500"}`} />
      {active ? "Active" : "Inactive"}
    </span>
  );
};


  return (
    <div className="mx-auto  px-3 sm:px-5 2xl:px-0">
      {/* Header */}
      <header className="sticky top-0 z-10 -mx-3 sm:-mx-5 2xl:mx-0  ">
        <div className="mx-auto px-3 sm:px-5 2xl:px-0 py-3">
          <div className="flex items-center justify-between gap-3">
            <nav className="text-sm">
              <ul className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <li>
                  <Link to="#" className="text-primary hover:underline">Teams</Link>
                </li>
                <li className="opacity-60">/</li>
                <li className="font-medium">Departments</li>
              </ul>
            </nav>
            <Tippy content="Add team">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="group inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-br from-primary to-violet-600 px-4 text-white shadow-md shadow-primary/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 hover:shadow-lg hover:shadow-primary/30 transition"
              >
                <span className="grid place-items-center h-6 w-6 rounded-full bg-white/20">
                  <IconPlus />
                </span>
                <span className="hidden sm:block">New Team</span>
              </button>
            </Tippy>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="py-6">
        {isLoading ? (
          <SalesTeamCardSkeleton />
        ) : Object.keys(filteredTeamsByDepartment).length === 0 ? (
          <div className="min-h-[46vh] grid place-items-center">
            <div className="text-center">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                <IconUsersGroup className="h-8 w-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white">No teams found</h3>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                You don’t have access to any teams yet.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
              >
                <IconPlus /> Create your first team
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(filteredTeamsByDepartment).map(([department, teams]) => (
              <section key={department} className="space-y-4">
                {/* Section header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {formatDepartment(department)}
                    </h2>
                    <span className="rounded-full bg-primary/10 text-primary dark:bg-primary/20 px-3 py-1 text-xs font-semibold">
                      {teams.length} Team{teams.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {teams.map((team) => (
                    <Link
                      key={team._id}
                      to={`/team-dashboard/${team._id}`}
                      className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-2xl"
                    >
                      <article
                        className="
                          relative overflow-hidden rounded-2xl
                          bg-white/80 dark:bg-slate-900/70
                          ring-1 ring-slate-200/70 dark:ring-slate-800/60
                          shadow-sm hover:shadow-xl transition
                          "
                      >
                        {/* Top banner */}
                        <div className="h-28 w-full bg-gradient-to-br from-primary/20 via-fuchsia-400/10 to-transparent dark:from-primary/25 dark:via-fuchsia-500/10" />
                        {/* Avatar circle */}
                        <div className="-mt-10 px-5">
                          <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-md">
                            <IconUsersGroup className="h-10 w-10 text-primary" />
                          </div>
                        </div>

                        {/* Body */}
                        <div className="p-5 pt-4">
                          <div className="flex flex-col items-center justify-between gap-3">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900 dark:text-white capitalize">
                                {team.teamName}
                              </h3>
                            </div>
                            <StatusChip status={team.status} />
                          </div>

                          {/* Members preview */}
                          {!!team.users?.length && (
                            <div className="mt-4 flex flex-col items-center justify-center">
                              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                                Team members
                              </div>
                              <div className="flex -space-x-2 ">
                                {team?.users?.slice(0, 5)?.map((m, i) => (
                                  <Tippy content={m.userName} key={i}>
                                    <span
                                      className="inline-flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-white dark:ring-slate-900 bg-gradient-to-tr from-primary to-violet-600 text-white text-xs font-semibold"
                                      aria-label={m.userName}
                                    >
                                      {m.userName?.charAt(0)?.toUpperCase()}
                                    </span>
                                  </Tippy>
                                ))}
                                {team?.users?.length > 5 && (
                                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold">
                                    +{team?.users?.length - 5}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Hover highlight */}
                        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-primary/30 transition" />
                      </article>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      <Transition appear show={modalOpen} as={Fragment}>
        <Dialog as="div" open={modalOpen} onClose={() => setModalOpen(false)} className="relative z-[999]">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-start justify-center px-4 py-10">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 translate-y-4 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 shadow-2xl">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
                    <Dialog.Title className="text-lg font-semibold text-slate-900 dark:text-white">
                      Create New Team
                    </Dialog.Title>
                    <button
                      onClick={() => setModalOpen(false)}
                      className="rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    >
                      <IconX />
                    </button>
                  </div>

                  <form ref={form} onSubmit={submitForm} className="px-5 py-5 space-y-5 text-slate-800 dark:text-slate-100">
                    <div>
                      <label htmlFor="teamName" className="mb-1 block text-sm font-medium">
                        Team Name
                      </label>
                      <div className="relative">
                        <input
                          id="teamName"
                          name="teamName"
                          type="text"
                          required
                          placeholder="e.g. Bellevue Publishers Front Sales"
                          className="form-input w-full ps-10 rounded-xl bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 placeholder:text-slate-400"
                        />
                        <span className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400">
                          <IconUser fill />
                        </span>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="department" className="mb-1 block text-sm font-medium">
                        Department
                      </label>
                      <div className="relative">
                        <select
                          id="department"
                          name="department"
                          required
                          className="form-select w-full ps-10 rounded-xl bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select Department
                          </option>
                          <option value="frontSell">Front Sales</option>
                          <option value="upsell">Upsell</option>
                          <option value="projectManager">Project Manager</option>
                          <option value="ppc">PPC</option>
                          <option value="dataEntry">Data Entry</option>
                        </select>
                        <span className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400">
                          <IconUsersGroup fill />
                        </span>
                      </div>
                    </div>

                    {/* <div>
                      <label htmlFor="manager" className="mb-1 block text-sm font-medium">
                        Team Manager
                      </label>
                      <div className="relative">
                        <select
                          id="manager"
                          name="manager"
                          required
                          className="form-select w-full ps-10 rounded-xl bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select Manager
                          </option>
                          {Array.isArray(usersData?.users) &&
                            usersData.users
                              .filter((u) => ["manager", "admin", "superAdmin"].includes(u.role))
                              .map((u) => (
                                <option key={u._id} value={u._id}>
                                  {u.userName} ({u.role})
                                </option>
                              ))}
                        </select>
                        <span className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400">
                          <IconUsersGroup fill />
                        </span>
                      </div>
                    </div> */}

                    <div>
                      <label htmlFor="description" className="mb-1 block text-sm font-medium">
                        Description (optional)
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        placeholder="Brief description of the team's responsibilities"
                        className="form-textarea w-full rounded-xl bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 placeholder:text-slate-400"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={mutation.isPending}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-violet-600 py-2.5 text-white font-medium shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-70"
                    >
                      {mutation.isPending && (
                        <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/60 border-l-transparent"></span>
                      )}
                      Create Team
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}




// import React, { Fragment, useRef, useState } from "react";
// import IconStar from "../../components/Icon/IconStar";
// import { Link } from "react-router-dom";
// import { addTeam, getTeam } from "../../api/salesApi";
// import IconPlus from "../../components/Icon/IconPlus";
// import IconDelete from "../../components/Icon/IconTrashLines";
// import Tippy from "@tippyjs/react";
// import { Dialog, Transition } from "@headlessui/react";
// import IconX from "../../components/Icon/IconX";
// import IconUser from "../../components/Icon/IconUser";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { coloredToast } from "../../components/Alerts/SimpleAlert";
// import { SalesTeamCardSkeleton } from "../../components/Skeletons/Skeletons";
// import IconUsersGroup from "../../components/Icon/IconUsersGroup";
// import { useSelector } from "react-redux";
// import { getAllUsers } from "../../api/userApi";

// export default function AllSalesTeams() {
//   const query = useQueryClient();
//   const {
//     isLoading,
//     data: teamsData,
//     status,
//   } = useQuery({
//     queryKey: ["team"],
//     queryFn: getTeam,
//   });
  
//   const {
//     isLoading: userLoading,
//     data: usersData,
//     status: userStatus,
//   } = useQuery({
//     queryKey: ["users"],
//     queryFn: getAllUsers,
//   });

//   const [modal20, setModal20] = useState(false);
//   const { user } = useSelector((state) => state.user);

//   const form = useRef();

//   const mutation = useMutation({
//     mutationKey: ["addTeam"],
//     mutationFn: addTeam,
//     onSuccess: (response) => {
//       query.invalidateQueries("team");
//       form.current.reset();
//       setModal20(false);
//       coloredToast(
//         "success",
//         "Team Has been Created Successfully",
//         "top",
//         null,
//         null,
//         1000
//       );
//     },
//     onError: (error) => {
//       console.log(error);
//       coloredToast("danger", error?.response?.data?.message, "top");
//     },
//   });

//   const submitForm = (e) => {
//     e.preventDefault();
//     let object = {};
//     const formData = new FormData(e.target);
//     for (const [key, value] of formData.entries()) {
//       object[key] = value;
//     }
//     mutation.mutate(object);
//   };

//   if (!teamsData || !Array.isArray(teamsData.teams)) return null;

//   const formatDepartment = (dept) => {
//     switch (dept?.toLowerCase()) {
//       case 'frontsell':
//         return 'Front Sales';
//       case 'upsell':
//         return 'Upsell';
//       case 'projectmanager':
//         return 'Project Manager';
//       case 'ppc':
//         return 'PPC';
//       case 'dataentry':
//         return 'Data Entry';
//       default:
//         return dept ? dept.charAt(0).toUpperCase() + dept.slice(1) : 'Team';
//     }
//   };

//   // Group teams by department for better organization
//   const teamsByDepartment = {};
//   teamsData?.teams?.forEach((team) => {
//     if (!teamsByDepartment[team.department]) {
//       teamsByDepartment[team.department] = [];
//     }
//     teamsByDepartment[team.department].push(team);
//   });

//   // Filter based on user role and permissions
//   const getFilteredTeams = () => {
//     if (user.role === "superAdmin" || user.role === "admin") {
//       return teamsByDepartment;
//     }
    
//     // For managers, show only their teams
//     const filteredTeams = {};
//     Object.keys(teamsByDepartment).forEach(dept => {
//       const userTeams = teamsByDepartment[dept].filter(team => {
//         // Check if user is manager of this team or part of this team
//         return user.teams?.some(userTeam => 
//           userTeam.team === team._id && userTeam.role === 'manager'
//         ) || team.manager?._id === user._id;
//       });
      
//       if (userTeams.length > 0) {
//         filteredTeams[dept] = userTeams;
//       }
//     });
    
//     return filteredTeams;
//   };

//   const filteredTeamsByDepartment = getFilteredTeams();

//   return (
//     <div>
//       <div>
//         <div className="flex justify-between items-center">
//           <ul className="flex space-x-2 rtl:space-x-reverse mb-5">
//             <li>
//               <Link to="#" className="text-primary hover:underline">
//                 Teams
//               </Link>
//             </li>
//             <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
//               <span>Departments</span>
//             </li>
//           </ul>
//           <Tippy content="Add Team">
//             <button
//               type="button"
//               onClick={() => setModal20(true)}
//               className="btn btn-dark w-10 h-10 p-0 rounded-full mb-5"
//             >
//               <IconPlus />
//             </button>
//           </Tippy>
//         </div>

//         {isLoading ? (
//           <SalesTeamCardSkeleton />
//         ) : (
//           <>
//             {Object.keys(filteredTeamsByDepartment).length === 0 ? (
//               <div className="flex flex-col items-center justify-center min-h-[400px]">
//                 <div className="text-3xl font-bold text-gray-400 dark:text-gray-600 mb-2">
//                   No Teams Found
//                 </div>
//                 <p className="text-gray-500 dark:text-gray-400">
//                   There are no teams available for your access level.
//                 </p>
//               </div>
//             ) : (
//               <div className="space-y-8">
//                 {Object.entries(filteredTeamsByDepartment).map(([department, teams]) => (
//                   <div key={department} className="space-y-4">
//                     <div className="flex items-center space-x-3">
//                       <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
//                         {formatDepartment(department)}
//                       </h2>
//                       <span className="badge bg-primary/10 text-primary px-3 py-1 rounded-full">
//                         {teams.length} Team{teams.length !== 1 ? 's' : ''}
//                       </span>
//                     </div>
                    
//                     <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
//                       {teams.map((team, index) => (
//                         <Link to={`/team-dashboard/${team._id}`} key={team._id}>
//                           <div className="bg-white dark:bg-[#1c232f] rounded-md overflow-hidden text-center shadow-lg hover:shadow-xl transition-shadow duration-300 relative group">
//                             <div
//                               className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-md bg-center bg-cover p-6 pb-0"
//                               style={{
//                                 backgroundImage: `url('/assets/images/notification-bg.png')`,
//                                 backgroundRepeat: 'no-repeat',
//                               }}
//                             >
//                               <div className="flex justify-center items-center w-20 h-20 mx-auto bg-white dark:bg-gray-800 rounded-full shadow-lg">
//                                 <IconUsersGroup className="w-10 h-10 text-primary" />
//                               </div>
//                             </div>
                            
//                             <div className="px-6 pb-6 -mt-10 relative">
//                               <div className="shadow-md bg-white dark:bg-gray-900 rounded-md px-4 py-6 mb-4">
//                                 <div className="text-xl font-semibold capitalize mb-2">
//                                   {team.teamName}
//                                 </div>
//                                 <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
//                                   {formatDepartment(team.department)}
//                                 </div>
                                
//                                 {/* Team Stats */}
//                                 <div className="grid grid-cols-2 gap-3 text-sm">
//                                   <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
//                                     <div className="text-blue-600 dark:text-blue-400 font-semibold">
//                                       {team.users?.length || 0}
//                                     </div>
//                                     <div className="text-gray-600 dark:text-gray-400">Members</div>
//                                   </div>
//                                   <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2">
//                                     <div className="text-green-600 dark:text-green-400 font-semibold">
//                                       {team.status === 'active' ? 'Active' : 'Inactive'}
//                                     </div>
//                                     <div className="text-gray-600 dark:text-gray-400">Status</div>
//                                   </div>
//                                 </div>
//                               </div>
                              
//                               {/* Team Members Preview */}
//                               {team.users && team.users.length > 0 && (
//                                 <div className="mt-4">
//                                   <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
//                                     Team Members:
//                                   </div>
//                                   <div className="flex items-center justify-center -space-x-2">
//                                     {team.users.slice(0, 4).map((member, idx) => (
//                                       <div
//                                         key={idx}
//                                         className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-sm font-semibold ring-2 ring-white dark:ring-gray-800"
//                                         title={member.userName}
//                                       >
//                                         {member.userName?.charAt(0).toUpperCase()}
//                                       </div>
//                                     ))}
//                                     {team.users.length > 4 && (
//                                       <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-semibold ring-2 ring-white dark:ring-gray-800">
//                                         +{team.users.length - 4}
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
                            
//                             {/* Hover overlay */}
//                             <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md" />
//                           </div>
//                         </Link>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Enhanced Add Team Modal */}
//       <Transition appear show={modal20} as={Fragment}>
//         <Dialog as="div" open={modal20} onClose={() => setModal20(false)}>
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="fixed inset-0" />
//           </Transition.Child>
//           <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
//             <div className="flex items-start justify-center min-h-screen px-4">
//               <Transition.Child
//                 as={Fragment}
//                 enter="ease-out duration-300"
//                 enterFrom="opacity-0 scale-95"
//                 enterTo="opacity-100 scale-100"
//                 leave="ease-in duration-200"
//                 leaveFrom="opacity-100 scale-100"
//                 leaveTo="opacity-0 scale-95"
//               >
//                 <Dialog.Panel className="panel border-0 py-1 px-4 rounded-lg overflow-hidden w-full max-w-md my-8 text-black dark:text-white-dark">
//                   <div className="flex items-center justify-between p-5 font-semibold text-lg dark:text-white">
//                     <h5>Create New Team</h5>
//                     <button
//                       type="button"
//                       onClick={() => setModal20(false)}
//                       className="text-white-dark hover:text-dark"
//                     >
//                       <IconX />
//                     </button>
//                   </div>

//                   <div className="p-5 pt-0">
//                     <form
//                       ref={form}
//                       className="space-y-5 dark:text-white"
//                       onSubmit={submitForm}
//                     >
//                       <div>
//                         <label htmlFor="teamName" className="font-medium">Team Name</label>
//                         <div className="relative text-white-dark">
//                           <input
//                             name="teamName"
//                             id="teamName"
//                             type="text"
//                             required
//                             placeholder="Enter Team Name"
//                             className="form-input ps-10 placeholder:text-white-dark"
//                           />
//                           <span className="absolute start-4 top-1/2 -translate-y-1/2">
//                             <IconUser fill={true} />
//                           </span>
//                         </div>
//                       </div>

//                       <div>
//                         <label htmlFor="department" className="font-medium">Department</label>
//                         <div className="relative text-white-dark">
//                           <select
//                             id="department"
//                             name="department"
//                             required
//                             className="form-select ps-12 placeholder:text-white-dark"
//                           >
//                             <option value="" disabled selected hidden>
//                               Select Department
//                             </option>
//                             <option value="frontSell">Front Sales</option>
//                             <option value="upsell">Upsell</option>
//                             <option value="projectManager">Project Manager</option>
//                             <option value="ppc">PPC</option>
//                             <option value="dataEntry">Data Entry</option>
//                           </select>
//                           <span className="absolute start-4 top-1/2 -translate-y-1/2">
//                             <IconUsersGroup fill={true} />
//                           </span>
//                         </div>
//                       </div>

//                       <div>
//                         <label htmlFor="manager" className="font-medium">Team Manager</label>
//                         <div className="relative text-white-dark">
//                           <select
//                             id="manager"
//                             name="manager"
//                             required
//                             className="form-select ps-12 placeholder:text-white-dark"
//                           >
//                             <option value="" disabled selected hidden>
//                               Select Manager
//                             </option>
//                             {Array.isArray(usersData?.users) &&
//                               usersData?.users
//                                 ?.filter((item) => 
//                                   item.role === "manager" || 
//                                   item.role === "admin" || 
//                                   item.role === "superAdmin"
//                                 )
//                                 .map((item) => (
//                                   <option key={item._id} value={item._id}>
//                                     {item.userName} ({item.role})
//                                   </option>
//                                 ))}
//                           </select>
//                           <span className="absolute start-4 top-1/2 -translate-y-1/2">
//                             <IconUsersGroup fill={true} />
//                           </span>
//                         </div>
//                       </div>

//                       <div>
//                         <label htmlFor="description" className="font-medium">Description (Optional)</label>
//                         <textarea
//                           name="description"
//                           id="description"
//                           rows="3"
//                           placeholder="Brief description of team responsibilities"
//                           className="form-textarea placeholder:text-white-dark"
//                         />
//                       </div>

//                       <button
//                         disabled={mutation.isPending}
//                         type="submit"
//                         className="btn btn-primary w-full"
//                       >
//                         {mutation.isPending && (
//                           <span className="animate-spin border-2 border-primary border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
//                         )}
//                         Create Team
//                       </button>
//                     </form>
//                   </div>
//                 </Dialog.Panel>
//               </Transition.Child>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>
//     </div>
//   );
// }