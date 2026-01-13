// import React from "react";
// import { DataTable } from "mantine-datatable";
// import { useState, Fragment, useEffect } from "react";
// import sortBy from "lodash/sortBy";
// import "tippy.js/dist/tippy.css";
// import { useSelector } from "react-redux";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import Dropdown from "../Dropdown";
// import IconCaretDown from "../Icon/IconCaretDown";
// import { addLeads, getConvertedFormIds, getOldSignups, updateOldLead } from "../../api/leadsApi";
// import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
// import { Link, NavLink } from "react-router-dom";
// import { Dialog, Transition } from "@headlessui/react";
// // import MaskedInput from "react-text-mask";
// // import IconPhone from "../Icon/IconPhone";
// // import DynamicInput from "../DynamicInput/DynamicInput";
// import IconX from "../Icon/IconX";
// import { coloredToast } from "../Alerts/SimpleAlert";
// import { DataTableSkeleton } from "../Skeletons/Skeletons";
// import InitialAvatar from "../InitialAvatar";
// import { getStatusColor } from "../../utils/Utils";
// import IconXCircle from "../Icon/IconXCircle";
// import { getAllMembers } from "../../api/userApi";
// import Flatpickr from "react-flatpickr";
// import "flatpickr/dist/flatpickr.css";
// function debounce(callback, delay) {
//     let timerId;
//     return function (...args) {
//         clearTimeout(timerId);
//         timerId = setTimeout(() => {
//             callback.apply(this, args);
//         }, delay);
//     };
// }

// function OldLeadTable() {
//     const queryClient = useQueryClient();
//     const PAGE_SIZES = [10, 20, 30, 50, 100];
//     const [page, setPage] = useState(1);
//     const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
//     const [initialRecords, setInitialRecords] = useState([]);
//     const [recordsData, setRecordsData] = useState([]);
//     const [modal17, setModal17] = useState(false);
//     const [selectedLead, setSelectedLead] = useState(null);
//     // const [selectedStatus, setSelectedStatus] = useState("");
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [search, setSearch] = useState("");
//     const [hideCols, setHideCols] = useState([]);
//     const [sortStatus, setSortStatus] = useState({
//         columnAccessor: "createdAt",
//         direction: "asc",
//     });
//     const isRtl =
//         useSelector((state) => state.themeConfig.rtlClass) === "rtl" ? true : false;
//     const { user } = useSelector((state) => state.user);
//     const debouncedSearch = debounce(setSearch, 300);

//     const {
//         isLoading,
//         data: leadsData,
//         status,
//     } = useQuery({
//         queryKey: ["oldLeads", search, page, pageSize],
//         queryFn: () => getOldSignups(search, page, pageSize),
//         keepPreviousData: true,
//     });

//     const {
//         isLoading: usersLoading,
//         data: usersData,
//         status: usersStatus,
//     } = useQuery({
//         queryKey: ["members"],
//         queryFn: getAllMembers,
//     });

//     // console.log("helooo world this is lead old data" , oldSignups)

//     // const leadsData = []

//     const { data: convertedLeadsData } = useQuery({
//         queryKey: ["convertedFormIds"],
//         queryFn: getConvertedFormIds,
//     });

//     // Add this function to check if signup is converted
//     const isSignupConverted = (formId) => {
//         return convertedLeadsData?.convertedFormIds?.includes(formId);
//     };

//     const handlePageChange = (newPage) => {
//         setPage(newPage);
//         queryClient.invalidateQueries(["oldLeads", newPage]);
//     };

//     useEffect(() => {
//         if (leadsData?.data) {
//             const sortedSignups = sortBy(leadsData?.data, 'createdAt').reverse();
//             setInitialRecords(sortedSignups);
//             setRecordsData(sortedSignups?.slice(0, pageSize));
//         }
//     }, [leadsData, pageSize, page]);

//     const showHideColumns = (col, value) => {
//         if (hideCols.includes(col)) {
//             setHideCols((col) => hideCols.filter((d) => d !== col));
//         } else {
//             setHideCols([...hideCols, col]);
//         }
//     };
//     const addLeadMutation = useMutation({
//         mutationKey: ["register"],
//         mutationFn: addLeads,
//         onSuccess: (response) => {
//             coloredToast(
//                 "success",
//                 "Lead Created Successfully",
//                 "top",
//                 null,
//                 null,
//                 1500
//             );
//         },
//         onError: (error) => {
//             coloredToast("danger", error?.response?.data?.message, "top");
//         },
//     });
//     const updateLeadMutation = useMutation({
//         mutationKey: ["updateOldLead"],
//         mutationFn: (data) => updateOldLead(data, selectedLead?._id),
//         onSuccess: (response) => {
//             coloredToast(
//                 "success",
//                 "Lead Updated Successfully",
//                 "top",
//                 null,
//                 null,
//                 1500
//             );
//         },
//         onError: (error) => {
//             coloredToast("danger", error?.response?.data?.message, "top");
//         },
//     });

//     const handleConvertToLead = (data) => {
//         if (isSignupConverted(data._id)) {
//             return;
//         }
//         const leadData = {
//             formId: data._id,
//             userName: data?.userName,
//             userEmail: data?.userEmail,
//             userPhone: data?.userPhone,
//             companyName: "Bellevue Publishers",
//             date: data.createdAt,
//         };
//         addLeadMutation.mutate(leadData);
//     };

//     const userOptions =
//         Array.isArray(usersData?.allUsers)
//             ? usersData?.allUsers
//                 .filter((item) => item.role !== "admin" && item.role !== "ppc")
//                 .map((item) => ({
//                     value: item._id,
//                     label: item.userName,
//                 }))
//             : [];

//     const cols = [
//         {
//             accessor: 'userName',
//             title: 'Name',
//             sortable: true,
//             render: ({ userName }) => (
//                 <div className="flex items-center w-max gap-3 protected-content">
//                     <InitialAvatar name={userName ? (userName)?.charAt(0)?.toUpperCase() : ""} />
//                     <div>{userName}</div>
//                 </div>
//             ),
//         },
//         {
//             accessor: 'userEmail',
//             title: 'Email',
//             sortable: true,
//             render: ({ userEmail }) => {
//                 return (
//                     <a href={`mailto:${userEmail}`} onClick={(e) => {
//                         e.stopPropagation();
//                     }} className="w-max group protected-content hover:underline">
//                         {user?.role === "admin" ? (
//                             userEmail
//                         ) : (
//                             <div className="">
//                                 <span>{userEmail?.slice(0, 6)}</span>
//                                 <span className="blur-sm group-hover:blur-none select-none">{userEmail?.slice(4)}</span>
//                             </div>
//                         )}
//                     </a>
//                 )
//             },
//         },
//         {
//             accessor: 'userPhone',
//             title: 'Phone',
//             sortable: true,
//             render: ({ userPhone }) => {

//                 return (
//                     <a href={`tel:${userPhone}`} onClick={(e) => {
//                         e.stopPropagation()
//                     }} className="w-max group hover:underline">
//                         {user?.role === 'admin' ? (
//                             userPhone
//                         ) : (
//                             <div>
//                                 <span>{userPhone?.slice(0, 6)}</span>
//                                 <span className="blur-sm group-hover:blur-none select-none">
//                                     {userPhone?.slice(4)}
//                                 </span>
//                             </div>
//                         )}
//                     </a>
//                 );
//             },
//         },
//         {
//             accessor: 'companyName',
//             title: 'Brand',
//             sortable: true,
//             render: ({ companyName }) => (
//                 <div>
//                     {companyName || 'N/A'}
//                 </div>
//             ),
//         },
//         {
//             accessor: "status",
//             title: "Status",
//             sortable: true,
//             render: ({ status, followUp }) => (
//                 <span style={{ backgroundColor: getStatusColor(status, followUp?.endDate) }} className={`badge `}>{status}</span>
//             ),
//             hidden: hideCols.includes("status"),
//         },
//         {
//             accessor: "action",
//             title: "Actions",
//             render: (data) => {
//                 const isConverted = isSignupConverted(data._id);

//                 return (
//                     <div className="flex items-center w-max mx-auto gap-2">
//                         <button
//                             type="button"
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 if (!isConverted) handleConvertToLead(data);
//                             }}
//                             disabled={isConverted}
//                             className={`btn ${isConverted
//                                 ? 'btn-success cursor-not-allowed'
//                                 : 'btn-primary hover:btn-secondary'
//                                 }`}
//                         >
//                             {addLeadMutation.isPending ? (
//                                 <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-4 h-4 inline-block align-middle"></span>
//                             ) : isConverted ? (
//                                 'Assigned'
//                             ) : (
//                                 'UnAssigned'
//                             )}
//                         </button>
//                     </div>
//                 );
//             },
//         }
//     ];

//     const isConverted = isSignupConverted(selectedLead?._id);
//     return (
//         <div className="md:col-span-3 sm:col-span-12 ">
//             {" "}
//             <ul className="flex space-x-2 rtl:space-x-reverse mb-5">
//                 <li>
//                     <Link to="#" className="text-primary hover:underline">
//                         Old Clients
//                     </Link>
//                 </li>
//                 <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
//                     <span>Table</span>
//                 </li>
//             </ul>
//             <div className="panel ">
//                 <div className="flex md:items-center md:flex-row md:justify-between flex-col mb-5 gap-5">
//                     <h1 className="screenHeading">
//                         Old Clients
//                     </h1>
//                     <div className="flex md:items-center md:flex-row flex-col gap-5">


//                         <div className="dropdown">
//                             <Dropdown
//                                 placement={`${isRtl ? "bottom-end" : "bottom-start"}`}
//                                 btnClassName="!flex items-center border font-semibold border-white-light dark:border-[#253b5c] rounded-md px-4 py-2 text-sm dark:bg-[#1b2e4b] dark:text-white-dark"
//                                 button={
//                                     <>
//                                         <span className="ltr:mr-1 rtl:ml-1">Columns</span>
//                                         <IconCaretDown className="w-5 h-5" />
//                                     </>
//                                 }
//                             >
//                                 <ul className="!min-w-[140px]">
//                                     {cols?.map((col, i) => {
//                                         return (
//                                             <li
//                                                 key={i}
//                                                 className="flex flex-col"
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                 }}
//                                             >
//                                                 <div className="flex items-center px-4 py-1">
//                                                     <label className="cursor-pointer mb-0">
//                                                         <input
//                                                             type="checkbox"
//                                                             checked={!hideCols.includes(col.accessor)}
//                                                             className="form-checkbox"
//                                                             defaultValue={col.accessor}
//                                                             onChange={(event) => {
//                                                                 setHideCols(event.target.value);
//                                                                 showHideColumns(
//                                                                     col.accessor,
//                                                                     event.target.checked
//                                                                 );
//                                                             }}
//                                                         />
//                                                         <span className="ltr:ml-2 rtl:mr-2">
//                                                             {col.title}
//                                                         </span>
//                                                     </label>
//                                                 </div>
//                                             </li>
//                                         );
//                                     })}
//                                 </ul>
//                             </Dropdown>
//                         </div>
//                         <div className="text-right">
//                             <input
//                                 type="text"
//                                 className="form-input w-auto"
//                                 placeholder="Search..."
//                                 onChange={(e) => debouncedSearch(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                 </div>
//                 {isLoading ? (
//                     <DataTableSkeleton rows={6} />
//                 ) : (
//                     Array.isArray(recordsData) && (
//                         <div className="datatables">
//                             <DataTable
//                                 pinLastColumn
//                                 loaderBackgroundBlur={true}
//                                 highlightOnHover
//                                 className="whitespace-nowrap table-hover"
//                                 records={recordsData}
//                                 onRowClick={({ record }) => {
//                                     setSelectedLead(record);
//                                     setModal17(true);
//                                 }}
//                                 columns={cols?.map((col) => ({
//                                     ...col,
//                                     hidden: hideCols.includes(col.accessor),
//                                 }))}
//                                 totalRecords={leadsData?.leadCount}
//                                 recordsPerPage={pageSize}
//                                 page={page}
//                                 onPageChange={handlePageChange}
//                                 recordsPerPageOptions={PAGE_SIZES}
//                                 onRecordsPerPageChange={setPageSize}
//                                 sortStatus={sortStatus}

//                                 onSortStatusChange={setSortStatus}
//                                 minHeight={200}
//                                 paginationText={({ from, to, totalRecords }) =>
//                                     `Showing  ${from} to ${to} of ${totalRecords} entries`
//                                 }
//                             />
//                         </div>
//                     )
//                 )}
//             </div>
//             <Transition appear show={modal17} as={Fragment}>
//                 <Dialog as="div" open={modal17} onClose={() => setModal17(false)}>
//                     <Transition.Child
//                         as={Fragment}
//                         enter="ease-out duration-300"
//                         enterFrom="opacity-0"
//                         enterTo="opacity-100"
//                         leave="ease-in duration-200"
//                         leaveFrom="opacity-100"
//                         leaveTo="opacity-0"
//                     >
//                         <div className="fixed inset-0" />
//                     </Transition.Child>
//                     <div
//                         id="standard_modal"
//                         className="fixed inset-0 bg-[black]/90 z-[999] overflow-y-auto"
//                     >
//                         <div className="flex min-h-screen items-start justify-center px-4">
//                             <Transition.Child
//                                 as={Fragment}
//                                 enter="ease-out duration-300"
//                                 enterFrom="opacity-0 scale-95"
//                                 enterTo="opacity-100 scale-100"
//                                 leave="ease-in duration-200"
//                                 leaveFrom="opacity-100 scale-100"
//                                 leaveTo="opacity-0 scale-95"
//                             >
//                                 <Dialog.Panel className="panel my-8 w-full max-w-2xl overflow-hidden rounded-lg border-0  text-black dark:text-white-dark">
//                                     <button
//                                         type="button"
//                                         className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
//                                         onClick={() => setModal17(false)}
//                                     >
//                                         <IconX />
//                                     </button>
//                                     <h2 className="text-xl font-extrabold uppercase !leading-snug text-primary md:text-2xl">
//                                         Lead Details
//                                     </h2>
//                                     <div className="datatables">
//                                         <Formik
//                                             initialValues={{
//                                                 userName: selectedLead?.userName || '',
//                                                 userEmail: selectedLead?.userEmail || '',
//                                                 userPhone: selectedLead?.userPhone || '',
//                                                 companyName: 'Bellevue Publishers',
//                                                 status: selectedLead?.status || "New",
//                                                 date: selectedLead?.date ? new Date(selectedLead?.date) : new Date(),
//                                                 assigned:
//                                                     selectedLead?.assigned?.length > 0
//                                                         ? selectedLead?.assigned?.map((assignee) => ({
//                                                             user: assignee?.user?._id,
//                                                             status: assignee.status || "New",
//                                                             followUpEndDate: assignee.followUp?.endDate || null, // ✅ FIXED LINE
//                                                             assignedAt: assignee.assignedAt,
//                                                             updatedAt: assignee.updatedAt,
//                                                         }))
//                                                         : [
//                                                             {
//                                                                 user: "",
//                                                                 role: "",
//                                                                 status: "New",
//                                                                 followUpEndDate: null,
//                                                             },
//                                                         ],
//                                             }}
//                                             onSubmit={(values) => {
//                                                 const filteredAssignedTo = values.assigned.filter((a) => a.user);
//                                                 console.log('Form values on submit:', filteredAssignedTo);
//                                                 const leadData = {
//                                                     formId: selectedLead?._id,
//                                                     userName: values.userName,
//                                                     userEmail: values.userEmail,
//                                                     userPhone: values.userPhone,
//                                                     companyName: values.companyName,
//                                                     status: values?.status,
//                                                     date: values?.date,
//                                                     assigned: filteredAssignedTo,
//                                                     comments: values?.comments && values.comments.trim()
//                                                         ? [
//                                                             ...(selectedLead?.comments || []),
//                                                             {
//                                                                 text: values.comments,
//                                                                 postedBy: user?._id,
//                                                             },
//                                                         ]
//                                                         : selectedLead?.comments || [],
//                                                 };
//                                                 addLeadMutation.mutate(leadData);
//                                                 updateLeadMutation.mutate(leadData);
//                                             }}
//                                         >
//                                             {({ values, setFieldValue }) => (
//                                                 <Form className="space-y-5">
//                                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                                                         <div>
//                                                             <label htmlFor="userName">Name</label>
//                                                             <Field
//                                                                 type="text"
//                                                                 name="userName"
//                                                                 className="form-input protected-content"
//                                                                 disabled
//                                                             />
//                                                         </div>
//                                                         <div>
//                                                             <label htmlFor="userEmail">Email</label>
//                                                             <Field
//                                                                 type="email"
//                                                                 name="userEmail"
//                                                                 className="form-input"
//                                                                 disabled
//                                                             />
//                                                         </div>
//                                                         <div>
//                                                             <label htmlFor="userPhone">Phone</label>
//                                                             <Field
//                                                                 type="text"
//                                                                 name="userPhone"
//                                                                 className="form-input protected-content"
//                                                                 disabled
//                                                             />
//                                                         </div>
//                                                         <div>
//                                                             <label htmlFor="companyName">Company Name</label>
//                                                             <Field as="select" name="companyName" className="form-input">
//                                                                 <option value="" disabled>Select Brand</option>
//                                                                 <option value="Bellevue Publishers">Bellevue Publishers</option>
//                                                                 <option value="Urban Quill Publishing">Urban Quill Publishing</option>
//                                                                 <option value="American Writers Association">American Writers Association</option>
//                                                                 <option value="Book Publishings">Book Publishings</option>
//                                                             </Field>
//                                                             <ErrorMessage name="comapnyName" component="div" className="text-red-500" />
//                                                         </div>
//                                                         <div className="">
//                                                             <label htmlFor="date">Date</label>
//                                                             <Flatpickr
//                                                                 name="date"
//                                                                 value={selectedLead?.date}
//                                                                 placeholder="Select the Date"
//                                                                 options={{ dateFormat: "Y-m-d", position: "auto left" }}
//                                                                 className="form-input"
//                                                                 onChange={(selectedDate) => {
//                                                                     setFieldValue("date", selectedDate[0]);
//                                                                 }}
//                                                             />
//                                                         </div>
//                                                         <div className="form-group mb-2 flex-1">
//                                                             <label htmlFor="status">Select Status</label>
//                                                             <Field
//                                                                 as="select"
//                                                                 name="status"
//                                                                 className="form-input"
//                                                             >
//                                                                 <option disabled value="" label="Select Status" selected hidden />
//                                                                 <option value="Lost">Lost</option>
//                                                                 <option value="FollowUp">Follow Up</option>
//                                                                 <option value="Converted">Converted</option>
//                                                                 <option value="Qualified">Qualified</option>
//                                                                 <option value="Contacted">Contacted</option>
//                                                                 <option value="Invalid">Invalid</option>
//                                                             </Field>
//                                                             <ErrorMessage
//                                                                 name="status"
//                                                                 component="div"
//                                                                 className="text-red-600"
//                                                             />
//                                                         </div>
//                                                     </div>
//                                                     <div className="">
//                                                         <div className="border mb-2 px-5 py-3 rounded-xl">
//                                                             <div className="flex justify-between items-center mb-2">
//                                                                 <label className="font-semibold text-primary text-xl">Assigned To</label>
//                                                             </div>
//                                                             <FieldArray name="assigned">
//                                                                 {({ push, remove, form }) => (
//                                                                     <div className="space-y-4">
//                                                                         {values.assigned.map((assignee, index) => {

//                                                                             return (<div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 relative border dark:border-none  rounded-md bg-gray-50 dark:bg-black-dark-light">
//                                                                                 {!assignee.assignedAt && (
//                                                                                     <button
//                                                                                         type="button"
//                                                                                         onClick={() => remove(index)}
//                                                                                         className="absolute top-2 right-2  text-red-600 hover:text-red-800"
//                                                                                         title="Remove this assignee"
//                                                                                     >
//                                                                                         <IconXCircle />
//                                                                                     </button>
//                                                                                 )}

//                                                                                 <div>
//                                                                                     <label>User</label>
//                                                                                     <Field
//                                                                                         as="select"
//                                                                                         name={`assigned[${index}].user`}
//                                                                                         className="form-input"
//                                                                                         value={assignee.user}
//                                                                                         disabled={!!assignee.assignedAt}
//                                                                                     >
//                                                                                         <option value="" disabled hidden>
//                                                                                             Select User
//                                                                                         </option>
//                                                                                         {userOptions?.map((option) => (
//                                                                                             <option key={option.value} value={option.value}>
//                                                                                                 {option.label}
//                                                                                             </option>
//                                                                                         ))}
//                                                                                     </Field>
//                                                                                 </div>
//                                                                                 <div>
//                                                                                     <label>Status</label>
//                                                                                     <Field
//                                                                                         as="select"
//                                                                                         name={`assigned[${index}].status`}
//                                                                                         className="form-input"
//                                                                                     >
//                                                                                         <option value="" disabled>Select Status</option>
//                                                                                         {["New", "Lost", "FollowUp", "Converted", "Qualified", "Contacted", "Invalid"].map((st) => (
//                                                                                             <option key={st} value={st}>{st}</option>
//                                                                                         ))}
//                                                                                     </Field>
//                                                                                 </div>
//                                                                                 {assignee.status === "FollowUp" && (
//                                                                                     <div>
//                                                                                         <label>Follow-Up End Date</label>
//                                                                                         <Flatpickr
//                                                                                             name={`assigned[${index}].followUpEndDate`}
//                                                                                             value={assignee.followUpEndDate}
//                                                                                             options={{ dateFormat: "Y-m-d", position: "auto left" }}
//                                                                                             className="form-input"
//                                                                                             onChange={(selectedDate) =>
//                                                                                                 form.setFieldValue(`assigned[${index}].followUpEndDate`, selectedDate[0])
//                                                                                             }
//                                                                                         />
//                                                                                     </div>
//                                                                                 )}
//                                                                                 {assignee.assignedAt && (
//                                                                                     <div className="col-span-full text-xs text-gray-500">
//                                                                                         Assigned At: {new Date(assignee.assignedAt).toLocaleString()}<br />
//                                                                                         Last Updated: {assignee.updatedAt ? new Date(assignee.updatedAt).toLocaleString() : "-"}
//                                                                                     </div>
//                                                                                 )}
//                                                                             </div>
//                                                                             )

//                                                                         })}
//                                                                         <button
//                                                                             type="button"
//                                                                             className="btn btn-outline-primary mt-2"
//                                                                             onClick={() =>
//                                                                                 push({
//                                                                                     user: "",
//                                                                                     role: "",
//                                                                                     status: "New",
//                                                                                     followUpEndDate: null,
//                                                                                 })
//                                                                             }
//                                                                         >
//                                                                             Add Assignee
//                                                                         </button>
//                                                                     </div>
//                                                                 )}
//                                                             </FieldArray>
//                                                         </div>
//                                                     </div>

//                                                     <div className="form-group flex-1">
//                                                         <label htmlFor="comments">Comments</label>
//                                                         <Field
//                                                             as="textarea"
//                                                             rows="4"
//                                                             name="comments"
//                                                             type="text"
//                                                             className="form-input"
//                                                             placeholder="Write comments here... "
//                                                         />
//                                                         <ErrorMessage
//                                                             name="comments"
//                                                             component="div"
//                                                             className="text-red-500"
//                                                         />
//                                                     </div>
//                                                     <div className="flex items-center gap-3">
//                                                         <button
//                                                             type="submit"
//                                                             onClick={(e) => {
//                                                                 e.stopPropagation();
//                                                             }}
//                                                             disabled={isConverted}
//                                                             className={`btn ${isConverted
//                                                                 ? 'btn-success cursor-not-allowed'
//                                                                 : 'btn-primary hover:btn-secondary'
//                                                                 }`}
//                                                         >
//                                                             {addLeadMutation.isPending ? (
//                                                                 <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-4 h-4 inline-block align-middle"></span>
//                                                             ) : isConverted ? (
//                                                                 'Assigned'
//                                                             ) : (
//                                                                 'UnAssigned'
//                                                             )}
//                                                         </button>
//                                                         <button
//                                                             type="submit"
//                                                             onClick={(e) => {
//                                                                 e.stopPropagation();
//                                                             }}
//                                                             disabled={isConverted}
//                                                             className={`btn ${isConverted
//                                                                 ? 'btn-success cursor-not-allowed'
//                                                                 : 'btn-primary hover:btn-secondary'
//                                                                 }`}
//                                                         >
//                                                             {updateLeadMutation.isPending ? (
//                                                                 <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-4 h-4 inline-block align-middle"></span>
//                                                             ) : (
//                                                                 'update'
//                                                             )}
//                                                         </button>
//                                                     </div>
//                                                 </Form>
//                                             )}
//                                         </Formik>
//                                         <div>
//                                             {selectedLead?.comments?.length > 0 &&
//                                                 selectedLead?.comments
//                                                     ?.slice()
//                                                     .sort(
//                                                         (a, b) =>
//                                                             new Date(b.createdAt) - new Date(a.createdAt)
//                                                     )
//                                                     .map((item, index) => (
//                                                         <article
//                                                             key={index}
//                                                             class="p-6 text-base bg-white border-t border-gray-200 dark:border-gray-700 dark:bg-gray-900"
//                                                         >
//                                                             <footer class="flex justify-between items-center mb-2">
//                                                                 <div class="flex items-center">
//                                                                     <p class=" capitalize inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
//                                                                         {item?.postedBy?.profileImageUrl ? (
//                                                                             <img
//                                                                                 class="mr-2 w-6 h-6 rounded-full"
//                                                                                 src={item?.postedBy?.profileImageUrl}
//                                                                                 alt={item?.postedBy?.userName}
//                                                                             />
//                                                                         ) : (
//                                                                             <div className="text-sm  mr-2 w-6 h-6 rounded-full flex items-center justify-center bg-gray-200 text-gray-700">
//                                                                                 {item?.postedBy?.userName
//                                                                                     ? item?.postedBy?.userName
//                                                                                         .charAt(0)
//                                                                                         .toUpperCase()
//                                                                                     : ""}
//                                                                             </div>
//                                                                         )}

//                                                                         {item?.postedBy?.userName}
//                                                                     </p>
//                                                                     <p class="text-sm text-gray-600 dark:text-gray-400">
//                                                                         {new Date(
//                                                                             item.createdAt
//                                                                         ).toLocaleDateString()}
//                                                                     </p>
//                                                                 </div>
//                                                             </footer>
//                                                             <p class="text-gray-500 dark:text-gray-400">
//                                                                 {item?.text}
//                                                             </p>
//                                                         </article>
//                                                     ))}
//                                         </div>
//                                     </div>
//                                 </Dialog.Panel>
//                             </Transition.Child>
//                         </div>
//                     </div>
//                 </Dialog>
//             </Transition>

//         </div >
//     );
// }

// export default OldLeadTable;



import React from "react";
import { DataTable } from "mantine-datatable";
import { useState, Fragment, useEffect } from "react";
import sortBy from "lodash/sortBy";
import "tippy.js/dist/tippy.css";
import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Dropdown from "../Dropdown";
import IconCaretDown from "../Icon/IconCaretDown";
import { addLeads, getConvertedFormIds, getOldSignups, updateOldLead } from "../../api/leadsApi";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { Link } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../Icon/IconX";
import { coloredToast } from "../Alerts/SimpleAlert";
import { DataTableSkeleton } from "../Skeletons/Skeletons";
import InitialAvatar from "../InitialAvatar";
import { getStatusColor } from "../../utils/Utils";
import IconXCircle from "../Icon/IconXCircle";
import { getAllMembers } from "../../api/userApi";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";

function debounce(callback, delay) {
    let timerId;
    return function (...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            callback.apply(this, args);
        }, delay);
    };
}

function OldLeadTable() {
    const queryClient = useQueryClient();
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState([]);
    const [recordsData, setRecordsData] = useState([]);
    const [modal17, setModal17] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [selectedLeadStatus, setSelectedLeadStatus] = useState(null);
    const [search, setSearch] = useState("");
    const [hideCols, setHideCols] = useState([]);
    const [submitAction, setSubmitAction] = React.useState(null);
    const [sortStatus, setSortStatus] = useState({
        columnAccessor: "createdAt",
        direction: "asc",
    });
    const isRtl = useSelector((state) => state.themeConfig.rtlClass) === "rtl";
    const { user } = useSelector((state) => state.user);
    const debouncedSearch = debounce(setSearch, 300);

    const {
        isLoading,
        data: leadsData,
        status,
    } = useQuery({
        queryKey: ["oldLeads", search, page, pageSize, selectedLeadStatus],
        queryFn: () => getOldSignups(search, page, pageSize, selectedLeadStatus),
        keepPreviousData: true,
    });

    const {
        isLoading: usersLoading,
        data: usersData,
        status: usersStatus,
    } = useQuery({
        queryKey: ["members"],
        queryFn: getAllMembers,
    });

    const { data: convertedLeadsData } = useQuery({
        queryKey: ["convertedFormIds"],
        queryFn: getConvertedFormIds,
    });

    const isSignupConverted = (formId) => {
        return convertedLeadsData?.convertedFormIds?.includes(formId);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        queryClient.invalidateQueries(["oldLeads", newPage]);
    };

    useEffect(() => {
        if (leadsData?.data) {
            const sortedSignups = sortBy(leadsData?.data, "createdAt").reverse();
            setInitialRecords(sortedSignups);
            setRecordsData(sortedSignups?.slice(0, pageSize));
        }
    }, [leadsData, pageSize, page]);

    const showHideColumns = (col, value) => {
        if (hideCols.includes(col)) {
            setHideCols((prev) => prev.filter((d) => d !== col));
        } else {
            setHideCols([...hideCols, col]);
        }
    };

    const addLeadMutation = useMutation({
        mutationKey: ["register"],
        mutationFn: addLeads,
        onSuccess: () => {
            coloredToast("success", "Lead Created Successfully", "top", null, null, 1500);
            queryClient.invalidateQueries(["oldLeads"]);
            setModal17(false);
        },
        onError: (error) => {
            coloredToast("danger", error?.response?.data?.message || "Failed to create lead", "top");
        },
    });

    const updateLeadMutation = useMutation({
        mutationKey: ["updateOldLead"],
        mutationFn: ({ id, data }) => updateOldLead(data, id),
        onSuccess: () => {
            coloredToast("success", "Lead Updated Successfully", "top", null, null, 1500);
            queryClient.invalidateQueries(["oldLeads"]);
            setModal17(false);
        },
        onError: (error) => {
            coloredToast("danger", error?.response?.data?.message || "Failed to update lead", "top");
        },
    });

    const handleConvertToLead = (data) => {
        if (isSignupConverted(data._id)) {
            return;
        }
        const leadData = {
            formId: data._id,
            userName: data?.userName,
            userEmail: data?.userEmail,
            userPhone: data?.userPhone,
            companyName: "Bellevue Publishers",
            date: data.createdAt,
        };
        addLeadMutation.mutate(leadData);
    };

    const userOptions = Array.isArray(usersData?.allUsers)
        ? usersData.allUsers
            .filter((item) => item.role !== "admin" && item.role !== "ppc")
            .map((item) => ({
                value: item._id,
                label: item.userName,
            }))
        : [];

    const getLastAssignedUserByRole = (assignedTo, role) => {
        if (!assignedTo || !Array.isArray(assignedTo)) return null;
        // Sort by updatedAt DESC to get latest one
        const sorted = assignedTo.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        return sorted[0]; // latest one
    };

    const cols = [
        {
            accessor: "userName",
            title: "Name",
            sortable: true,
            render: ({ userName }) => (
                <div className="flex items-center w-max gap-3 protected-content">
                    <InitialAvatar name={userName ? userName.charAt(0).toUpperCase() : ""} />
                    <div>{userName}</div>
                </div>
            ),
        },
        {
            accessor: "userEmail",
            title: "Email",
            sortable: true,
            render: ({ userEmail }) => (
                <a
                    href={`mailto:${userEmail}`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-max group protected-content hover:underline"
                >
                    {user?.role === "admin" ? (
                        userEmail
                    ) : (
                        <div>
                            <span>{userEmail?.slice(0, 6)}</span>
                            <span className="blur-sm group-hover:blur-none select-none">{userEmail?.slice(4)}</span>
                        </div>
                    )}
                </a>
            ),
        },
        {
            accessor: "userPhone",
            title: "Phone",
            sortable: true,
            render: ({ userPhone }) => (
                <a
                    href={`tel:${userPhone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-max group hover:underline"
                >
                    {user?.role === "admin" ? (
                        userPhone
                    ) : (
                        <div>
                            <span>{userPhone?.slice(0, 6)}</span>
                            <span className="blur-sm group-hover:blur-none select-none">{userPhone?.slice(4)}</span>
                        </div>
                    )}
                </a>
            ),
        },
        {
            accessor: "companyName",
            title: "Brand",
            sortable: true,
            render: ({ companyName }) => <div>{companyName || "N/A"}</div>,
        },
        {
            accessor: "assigned",
            title: "Assigned",
            sortable: false,
            hidden: hideCols.includes("Assigned"),
            render: ({ assigned }) => {
                const frontSell = getLastAssignedUserByRole(assigned);
                const userName = frontSell?.user?.userName;
                return (
                    <div className="flex items-center gap-2">
                        {userName && <InitialAvatar name={userName} />}
                        <div className="capitalize">{userName || "—"}</div>
                    </div>
                );
            },
        },
        {
            accessor: "status",
            title: "Status",
            sortable: true,
            render: ({ status, followUp }) => (
                <span style={{ backgroundColor: getStatusColor(status, followUp?.endDate) }} className="badge">
                    {status}
                </span>
            ),
            hidden: hideCols.includes("status"),
        },
        {
            accessor: "action",
            title: "Actions",
            render: (data) => {
                const isConverted = isSignupConverted(data._id);
                return (
                    <div className="flex items-center w-max mx-auto gap-2">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!isConverted) handleConvertToLead(data);
                            }}
                            disabled={isConverted}
                            className={`btn ${isConverted ? "btn-success cursor-not-allowed" : "btn-primary hover:btn-secondary"}`}
                        >
                            {addLeadMutation.isPending ? (
                                <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-4 h-4 inline-block align-middle"></span>
                            ) : isConverted ? (
                                "Assigned"
                            ) : (
                                "UnAssigned"
                            )}
                        </button>
                    </div>
                );
            },
        },
    ];

    const isConverted = isSignupConverted(selectedLead?._id);

    return (
        <div className="md:col-span-3 sm:col-span-12">
            <ul className="flex space-x-2 rtl:space-x-reverse mb-5">
                <li>
                    <Link to="#" className="text-primary hover:underline">
                        Old Clients
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Table</span>
                </li>
            </ul>
            <div className="panel">
                <div className="flex md:items-center md:flex-row md:justify-between flex-col mb-5 gap-5">
                    <h1 className="screenHeading">Old Clients</h1>
                    <div className="flex md:items-center md:flex-row flex-col gap-5">
                        <div className="dropdown">
                            <Dropdown
                                placement={`${isRtl ? "bottom-end" : "bottom-start"}`}
                                btnClassName="!flex items-center border font-semibold border-white-light dark:border-[#253b5c] rounded-md px-4 py-2 text-sm dark:bg-[#1b2e4b] dark:text-white-dark"
                                button={
                                    <>
                                        <span className="ltr:mr-1 rtl:ml-1">Columns</span>
                                        <IconCaretDown className="w-5 h-5" />
                                    </>
                                }
                            >
                                <ul className="!min-w-[140px]">
                                    {cols?.map((col, i) => (
                                        <li key={i} className="flex flex-col" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center px-4 py-1">
                                                <label className="cursor-pointer mb-0">
                                                    <input
                                                        type="checkbox"
                                                        checked={!hideCols.includes(col.accessor)}
                                                        className="form-checkbox"
                                                        value={col.accessor}
                                                        onChange={(event) => showHideColumns(col.accessor, event.target.checked)}
                                                    />
                                                    <span className="ltr:ml-2 rtl:mr-2">{col.title}</span>
                                                </label>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </Dropdown>
                        </div>
                        <div className="min-w-[200px] z-[19]">
                            <select
                                as="select"
                                name="status"
                                className="form-input"
                                value={selectedLeadStatus}
                                onChange={(e) => setSelectedLeadStatus(e.target.value)} // Yahan aap apna state update function use karein
                            >
                                <option disabled value="" label="Select Status" selected hidden />
                                <option value="" >All</option>
                                <option value="Lost">Lost</option>
                                <option value="FollowUp">Follow Up</option>
                                <option value="Converted">Converted</option>
                                <option value="Qualified">Qualified</option>
                                <option value="Contacted">Contacted</option>
                            </select>
                        </div>
                        <div className="text-right">
                            <input
                                type="text"
                                className="form-input w-auto"
                                placeholder="Search..."
                                onChange={(e) => debouncedSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                {isLoading ? (
                    <DataTableSkeleton rows={6} />
                ) : (
                    Array.isArray(recordsData) && (
                        <div className="datatables">
                            <DataTable
                                pinLastColumn
                                loaderBackgroundBlur={true}
                                highlightOnHover
                                className="whitespace-nowrap table-hover"
                                records={recordsData}
                                onRowClick={({ record }) => {
                                    setSelectedLead(record);
                                    setModal17(true);
                                }}
                                columns={cols?.map((col) => ({
                                    ...col,
                                    hidden: hideCols.includes(col.accessor),
                                }))}
                                totalRecords={leadsData?.leadCount}
                                recordsPerPage={pageSize}
                                page={page}
                                onPageChange={handlePageChange}
                                recordsPerPageOptions={PAGE_SIZES}
                                onRecordsPerPageChange={setPageSize}
                                sortStatus={sortStatus}
                                onSortStatusChange={setSortStatus}
                                minHeight={200}
                                paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
                            />
                        </div>
                    )
                )}
            </div>
            <Transition appear show={modal17} as={Fragment}>
                <Dialog as="div" open={modal17} onClose={() => setModal17(false)}>
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
                    <div id="standard_modal" className="fixed inset-0 bg-[black]/90 z-[999] overflow-y-auto">
                        <div className="flex min-h-screen items-start justify-center px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel my-8 w-full max-w-2xl overflow-hidden rounded-lg border-0 text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                        onClick={() => setModal17(false)}
                                    >
                                        <IconX />
                                    </button>
                                    <h2 className="text-xl font-extrabold uppercase !leading-snug text-primary md:text-2xl">
                                        Lead Details
                                    </h2>
                                    <div className="datatables">
                                        <Formik
                                            initialValues={{
                                                userName: selectedLead?.userName || "",
                                                userEmail: selectedLead?.userEmail || "",
                                                userPhone: selectedLead?.userPhone || "",
                                                companyName: selectedLead?.companyName || "Bellevue Publishers",
                                                status: selectedLead?.status || "New",
                                                date: selectedLead?.date ? new Date(selectedLead?.date) : new Date(),
                                                assigned:
                                                    selectedLead?.assigned?.length > 0
                                                        ? selectedLead?.assigned?.map((assignee) => ({
                                                            user: assignee?.user?._id || assignee?.user || "",
                                                            status: assignee.status || "New",
                                                            followUpEndDate: assignee.followUp?.endDate || null,
                                                            assignedAt: assignee.assignedAt,
                                                            updatedAt: assignee.updatedAt,
                                                        }))
                                                        : [
                                                            {
                                                                user: "",
                                                                status: "New",
                                                                followUpEndDate: null,
                                                            },
                                                        ],
                                                comments: "",
                                            }}
                                            onSubmit={(values, { setSubmitting }) => {
                                                const filteredAssignedTo = values.assigned.filter((a) => a.user);
                                                const leadData = {
                                                    userName: values.userName,
                                                    userEmail: values.userEmail,
                                                    userPhone: values.userPhone,
                                                    companyName: "Bellevue Publishers",
                                                    status: values.status,
                                                    date: values.date,
                                                    assigned: filteredAssignedTo.map((assignee) => ({
                                                        user: assignee.user,
                                                        status: assignee.status,
                                                        followUpEndDate: assignee.followUpEndDate,
                                                        assignedAt: assignee.assignedAt || new Date(),
                                                        updatedAt: new Date(),
                                                    })),
                                                    comments: values.comments && values.comments.trim()
                                                        ? [
                                                            ...(selectedLead?.comments || []),
                                                            {
                                                                text: values.comments,
                                                                postedBy: user?._id,
                                                            },
                                                        ]
                                                        : selectedLead?.comments || [],
                                                };

                                                const updateData = {
                                                    status: values.status,
                                                    companyName: values.companyName,
                                                    assigned: filteredAssignedTo.map((assignee) => ({
                                                        user: assignee.user,
                                                        status: assignee.status,
                                                        followUpEndDate: assignee.followUpEndDate,
                                                        assignedAt: assignee.assignedAt || new Date(),
                                                        updatedAt: new Date(),
                                                    })),
                                                    comments: values.comments && values.comments.trim()
                                                        ? [
                                                            ...(selectedLead?.comments || []),
                                                            {
                                                                text: values.comments,
                                                                postedBy: user?._id,
                                                            },
                                                        ]
                                                        : undefined,
                                                };

                                                if (submitAction === "update") {
                                                    updateLeadMutation.mutate({ id: selectedLead._id, data: updateData });
                                                } else if (submitAction === "assign") {
                                                    addLeadMutation.mutate(leadData);
                                                }

                                                // if (isConverted) {
                                                //     // Update lead
                                                //     updateLeadMutation.mutate({ id: selectedLead._id, data: updateData });
                                                // } else {
                                                //     // Assign lead
                                                //     leadData.formId = selectedLead?._id;
                                                //     addLeadMutation.mutate(leadData);
                                                // }
                                                setSubmitting(false);
                                            }}
                                        >
                                            {({ values, setFieldValue, submitForm }) => (
                                                <Form className="space-y-5">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        <div>
                                                            <label htmlFor="userName">Name</label>
                                                            <Field type="text" name="userName" className="form-input protected-content" disabled />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="userEmail">Email</label>
                                                            <Field type="email" name="userEmail" className="form-input" disabled />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="userPhone">Phone</label>
                                                            <Field type="text" name="userPhone" className="form-input protected-content" disabled />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="companyName">Company Name</label>
                                                            <Field as="select" name="companyName" className="form-input">
                                                                <option value="" disabled>
                                                                    Select Brand
                                                                </option>
                                                                <option value="Bellevue Publishers">Bellevue Publishers</option>
                                                                <option value="Urban Quill Publishing">Urban Quill Publishing</option>
                                                                <option value="American Writers Association">American Writers Association</option>
                                                                <option value="Book Publishings">Book Publishings</option>
                                                            </Field>
                                                            <ErrorMessage name="companyName" component="div" className="text-red-500" />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="date">Date</label>
                                                            <Flatpickr
                                                                name="date"
                                                                value={values.date}
                                                                placeholder="Select the Date"
                                                                options={{ dateFormat: "Y-m-d", position: "auto left" }}
                                                                className="form-input"
                                                                onChange={(selectedDate) => setFieldValue("date", selectedDate[0])}
                                                            />
                                                        </div>
                                                        <div className="form-group mb-2 flex-1">
                                                            <label htmlFor="status">Select Status</label>
                                                            <Field as="select" name="status" className="form-input">
                                                                <option disabled value="" label="Select Status" />
                                                                <option value="Lost">Lost</option>
                                                                <option value="FollowUp">Follow Up</option>
                                                                <option value="Converted">Converted</option>
                                                                <option value="Qualified">Qualified</option>
                                                                <option value="Contacted">Contacted</option>
                                                            </Field>
                                                            <ErrorMessage name="status" component="div" className="text-red-600" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="border mb-2 px-5 py-3 rounded-xl">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <label className="font-semibold text-primary text-xl">Assigned To</label>
                                                            </div>
                                                            <FieldArray name="assigned">
                                                                {({ push, remove, form }) => (
                                                                    <div className="space-y-4">
                                                                        {values.assigned.map((assignee, index) => (
                                                                            <div
                                                                                key={index}
                                                                                className="grid grid-cols-1 md:grid-cols-3 gap-4 relative border dark:border-none rounded-md bg-gray-50 dark:bg-black-dark-light"
                                                                            >
                                                                                {!assignee.assignedAt && (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => remove(index)}
                                                                                        className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                                                                                        title="Remove this assignee"
                                                                                    >
                                                                                        <IconXCircle />
                                                                                    </button>
                                                                                )}
                                                                                <div>
                                                                                    <label>User</label>
                                                                                    <Field
                                                                                        as="select"
                                                                                        name={`assigned[${index}].user`}
                                                                                        className="form-input"
                                                                                        value={assignee.user || ""}
                                                                                        disabled={!!assignee.assignedAt}
                                                                                    >
                                                                                        <option value="" disabled hidden>
                                                                                            Select User
                                                                                        </option>
                                                                                        {userOptions?.map((option) => (
                                                                                            <option key={option.value} value={option.value}>
                                                                                                {option.label}
                                                                                            </option>
                                                                                        ))}
                                                                                    </Field>
                                                                                </div>
                                                                                <div>
                                                                                    <label>Status</label>
                                                                                    <Field
                                                                                        as="select"
                                                                                        name={`assigned[${index}].status`}
                                                                                        className="form-input"
                                                                                        value={assignee.status || ""}
                                                                                        onChange={(e) => {
                                                                                            const newStatus = e.target.value;
                                                                                            form.setFieldValue(`assigned[${index}].status`, newStatus);
                                                                                            if (newStatus === "FollowUp" && !assignee.followUpEndDate) {
                                                                                                form.setFieldValue(`assigned[${index}].followUpEndDate`, new Date());
                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        <option value="" disabled>
                                                                                            Select Status
                                                                                        </option>
                                                                                        {["Lost", "FollowUp", "Converted", "Qualified", "Contacted"].map(
                                                                                            (st) => (
                                                                                                <option key={st} value={st}>
                                                                                                    {st}
                                                                                                </option>
                                                                                            )
                                                                                        )}
                                                                                    </Field>
                                                                                </div>
                                                                                {assignee.status === "FollowUp" && (
                                                                                    <div>
                                                                                        <label>Follow-Up End Date</label>
                                                                                        <Flatpickr
                                                                                            name={`assigned[${index}].followUpEndDate`}
                                                                                            value={assignee.followUpEndDate || new Date()}
                                                                                            options={{ dateFormat: "Y-m-d", position: "auto left" }}
                                                                                            className="form-input"
                                                                                            onChange={(selectedDate) =>
                                                                                                form.setFieldValue(`assigned[${index}].followUpEndDate`, selectedDate[0])
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                )}
                                                                                {assignee.assignedAt && (
                                                                                    <div className="col-span-full text-xs text-gray-500">
                                                                                        Assigned At: {new Date(assignee.assignedAt).toLocaleString()}
                                                                                        <br />
                                                                                        Last Updated: {assignee.updatedAt ? new Date(assignee.updatedAt).toLocaleString() : "-"}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-outline-primary mt-2"
                                                                            onClick={() =>
                                                                                push({
                                                                                    user: "",
                                                                                    status: "New",
                                                                                    followUpEndDate: null,
                                                                                })
                                                                            }
                                                                        >
                                                                            Add Assignee
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </FieldArray>
                                                        </div>
                                                    </div>
                                                    <div className="form-group flex-1">
                                                        <label htmlFor="comments">Comments</label>
                                                        <Field
                                                            as="textarea"
                                                            rows="4"
                                                            name="comments"
                                                            type="text"
                                                            className="form-input"
                                                            placeholder="Write comments here..."
                                                        />
                                                        <ErrorMessage name="comments" component="div" className="text-red-500" />
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                submitForm({ assign: true });
                                                                setSubmitAction("assign");
                                                            }}
                                                            disabled={isConverted || addLeadMutation.isPending}
                                                            className={`btn ${isConverted || addLeadMutation.isPending ? "btn-success cursor-not-allowed" : "btn-primary hover:btn-secondary"}`}
                                                        >
                                                            {addLeadMutation.isPending ? (
                                                                <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-4 h-4 inline-block align-middle"></span>
                                                            ) : isConverted ? (
                                                                "Assigned"
                                                            ) : (
                                                                "Assign"
                                                            )}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSubmitAction("update");
                                                                submitForm({ update: true });
                                                            }}
                                                            disabled={updateLeadMutation.isPending}
                                                            className={`btn ${updateLeadMutation.isPending ? "btn-success cursor-not-allowed" : "btn-primary hover:btn-secondary"}`}
                                                        >
                                                            {updateLeadMutation.isPending ? (
                                                                <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-4 h-4 inline-block align-middle"></span>
                                                            ) : (
                                                                "Update"
                                                            )}
                                                        </button>
                                                    </div>
                                                </Form>
                                            )}
                                        </Formik>
                                        <div>
                                            {selectedLead?.comments?.length > 0 &&
                                                selectedLead?.comments
                                                    .slice()
                                                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                                    .map((item, index) => (
                                                        <article
                                                            key={index}
                                                            className="text-base bg-white border-t dark:bg-gray-900 mt-4 px-4 py-3 rounded-lg"
                                                        >
                                                            <footer className="flex justify-between items-center mb-2">
                                                                <div className="flex items-center">
                                                                    <p className="capitalize inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                                                                        {item?.postedBy?.profileImageUrl ? (
                                                                            <img
                                                                                className="mr-2 w-6 h-6 rounded-full"
                                                                                src={item?.postedBy?.profileImageUrl}
                                                                                alt={item?.postedBy?.userName}
                                                                            />
                                                                        ) : (
                                                                            <div className="text-sm mr-2 w-6 h-6 rounded-full flex items-center justify-center bg-gray-200 text-gray-700">
                                                                                {item?.postedBy?.userName ? item.postedBy.userName.charAt(0).toUpperCase() : ""}
                                                                            </div>
                                                                        )}
                                                                        {item?.postedBy?.userName}
                                                                    </p>
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                        {new Date(item.createdAt).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                            </footer>
                                                            <p className="text-gray-500 dark:text-gray-400">{item?.text}</p>
                                                        </article>
                                                    ))}
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}

export default OldLeadTable;
