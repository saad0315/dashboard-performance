import React, { useState, useEffect } from "react";
import { DataTable } from "mantine-datatable";
import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { NavLink } from "react-router-dom";
import sortBy from "lodash/sortBy";
import { updateLead } from "../../api/leadsApi";
import { getAllMembers } from "../../api/userApi";
import IconCashBanknotes from "../Icon/IconCashBanknotes";
import Dropdown from "../Dropdown";
import IconCaretDown from "../Icon/IconCaretDown";
import IconView from "../Icon/IconEye";
import { coloredToast } from "../Alerts/SimpleAlert";
import { DataTableSkeleton } from "../Skeletons/Skeletons";
import LeadDetailsModal from "../Modals/LeadDetailModal";
import { getLastAssignedUserByRole } from "../../constants/constants";
import InitialAvatar from "../InitialAvatar";
import { getStatusColor } from "../../utils/Utils";
import IconDollarSign from "../Icon/IconDollarSign";
import InvoiceModal from "../Modals/InvoiceModal";
import { invoiceApi } from "../../api/invoiceApi";

const PAGE_SIZES = [10, 20, 30, 50, 100];

function SalesPersonLeadTable({ isLoading, leadsData, selectedMonth }) {
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.user);
  const isRtl = useSelector((state) => state.themeConfig.rtlClass) === "rtl";
  const {
    isLoading: usersLoading,
    data: usersData,
    status: usersStatus,
  } = useQuery({
    queryKey: ["members"],
    queryFn: getAllMembers,
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [initialRecords, setInitialRecords] = useState([]);
  const [recordsData, setRecordsData] = useState([]);
  const [modal17, setModal17] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [search, setSearch] = useState("");
  const [addInvoiceModal, setAddInvoiceModal] = useState(false);
  const [hideCols, setHideCols] = useState([]);
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: "userName",
    direction: "asc",
  });

  useEffect(() => {
    const from = (page - 1) * pageSize;
    setRecordsData(initialRecords.slice(from, from + pageSize));
  }, [page, pageSize, initialRecords]);

  useEffect(() => {
    if (leadsData) {
      const filteredLeads = leadsData?.filter((lead) =>
        ["userName", "userEmail", "userPhone", "source", "status"].some((key) =>
          lead[key]?.toString().toLowerCase().includes(search.toLowerCase())
        )
      );
      const sortedLeads = sortBy(filteredLeads, (lead) => {
      const assignedObj = lead.assigned?.find(
        (a) => a.user === user._id || a.user?._id === user._id
      );
      return assignedObj?.assignedAt ? new Date(assignedObj.assignedAt).getTime() : 0;
    }).reverse(); 

    setInitialRecords(sortedLeads);

      setPage(1);
    }
  }, [search, leadsData]);

  const showHideColumns = (col, value) => {
    if (hideCols.includes(col)) {
      setHideCols((col) => hideCols.filter((d) => d !== col));
    } else {
      setHideCols([...hideCols, col]);
    }
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-GB") : "";

  const cols = [
    {
      accessor: "userName",
      title: "Name",
      sortable: true,
      hidden: hideCols.includes("userName"),
      render: ({ userName }) => (
        <div className="flex items-center w-max gap-3 protected-content">
          <InitialAvatar name={userName ? userName.charAt(0).toUpperCase() : ""} />
          <div className="capitalize">{userName}</div>
        </div>
      ),
    },
    {
      accessor: "userEmail",
      title: "Email",
      sortable: true,
      hidden: hideCols.includes("userEmail"),
      render: ({ userEmail }) => (
         <a href={`mailto:${userEmail}`} onClick={(e) => {
            e.stopPropagation();
          }} className="w-max group hover:underline">
            {user?.role === "admin" ? (
              userEmail
            ) : (
              <div className="">
                <span>{userEmail}</span>
                {/* <span>{userEmail?.slice(0, 6)}</span> */}
                {/* <span className="blur-sm group-hover:blur-none select-none">{userEmail?.slice(4)}</span> */}
              </div>
            )}
          </a>
      ),
    },
    {
      accessor: "userPhone",
      title: "Phone No.",
      sortable: true,
      hidden: hideCols.includes("userPhone"),
      render: ({ userPhone }) => (
            <a href={`tel:${userPhone}`} onClick={(e) => {
            e.stopPropagation()
          }} className="w-max group hover:underline">
            {user?.role === "admin" ? (
              userPhone
            ) : (
              <div className="">
                <span>{userPhone?.slice(0,4)}</span> 
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
      hidden: hideCols.includes("Brand"),
    },
    // {
    //   accessor: "leadType",
    //   title: "Lead Type",
    //   sortable: true,
    //   hidden: hideCols.includes("leadType"),
    //   render: ({ leadType }) => (
    //     <div className="capitalize">
    //       {leadType}
    //     </div>
    //   ),
    // },
{
  accessor: "Frontsell",
  title: "Front Sell",
  sortable: false,
  hidden: hideCols.includes("Frontsell"),
  render: ({ assigned }) => {
    const frontSell = getLastAssignedUserByRole(assigned, "frontsell");
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
  accessor: "Upsell",
  title: "Upsell",
  sortable: false,
  hidden: hideCols.includes("Upsell"),
  render: ({ assigned }) => {
    const upsell = getLastAssignedUserByRole(assigned, "upsell");
    const userName = upsell?.user?.userName;
    return (
      <div className="flex items-center gap-2">
        {userName && <InitialAvatar name={userName} />}
        <div className="capitalize">{userName || "—"}</div>
      </div>
    );
  },
},
{
  accessor: "PM",
  title: "PM",
  sortable: false,
  hidden: hideCols.includes("PM"),
  render: ({ assigned }) => {
    const pm = getLastAssignedUserByRole(assigned, "projectManager");
    const userName = pm?.user?.userName;
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
        <span
          style={{ backgroundColor: getStatusColor(status, followUp?.endDate) }}
          className={`badge bg-${status.toLowerCase()}`}
        >
          {status}
        </span>
      ),
    },
    {
      accessor: "createdAt",
      title: "Date",
      sortable: true,
      render: ({ date }) => <div>{formatDate(date)}</div>,
    },
    {
      accessor: "action",
      title: "Action",
      titleClassName: "!text-center",
      render: (data) => (
        <div className="flex items-center w-max mx-auto gap-2">
          
            <Tippy content="Add Sale">
              <NavLink to={`/add-sales/${data._id}`} type="button">
                <IconCashBanknotes />
              </NavLink>
            </Tippy>
           <Tippy content="Create Invoice">
                      <button onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedLead(data);
                        setAddInvoiceModal(true);
                      }}>
                        <IconDollarSign />
                      </button>
                    </Tippy>
          <Tippy content="View Details">
            <NavLink type="button" onClick={() => setModal17(true)}>
              <IconView />
            </NavLink>
          </Tippy>
        </div>
      ),
    },
  ];

  const mutation = useMutation({
    mutationKey: ["updateLead"],
    mutationFn: (data) => updateLead(data, selectedLead?._id),
    onSuccess: (response) => {
      setModal17(false);
      queryClient.invalidateQueries("myLeads");
      coloredToast(
        "success",
        "Lead Updated Successfully",
        "top",
        null,
        null,
        1500
      );
    },
    onError: (error) => {
      coloredToast("danger", error?.response?.data?.message, "top");
    },
  });
  const handleFilterStatus = (status) => {
    if (status === "Assigned") {
      setRecordsData(leadsData);
    } else {
      setRecordsData(leadsData?.filter((lead) => lead.status === status));
    }
    // setRecordsData(leadsData?.filter((lead) => lead.status === status));
  };

  const getStatusCount = (status) =>
    leadsData?.filter((lead) => lead.status === status).length || 0;
  
  const { mutate: invoiceMutation, isInvoiceSubmitting } = useMutation({
    mutationKey: ["addInvoice"],
    mutationFn: invoiceApi,
    onSuccess: (response) => {
      coloredToast("success", "Invoice created successfully", "top");
      // setInitialRecords((prev) => [response?.invoice, ...prev]);
      setAddInvoiceModal(false)
      // queryClient.invalidateQueries(['invoices'], { refetchType: 'Inactive' });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  const handleSubmit = (values) => {
    const calculatedTotal = values.services.reduce((acc, s) => {
      return acc + (Number(s.unitPrice || 0) * Number(s.quantity || 0));
    }, 0);
    const finalValues = {
      ...values,
      totalAmount: calculatedTotal,
      leadId: selectedLead._id,
    };
    // console.log("finalValues", finalValues);
    invoiceMutation(finalValues);
  }

  const userOptions =
    Array.isArray(usersData?.allUsers)
      ? usersData?.allUsers
        .filter((item) => item.role !== "admin" && item.role !== "ppc")
        .map((item) => ({
          value: item._id,
          label: item.userName,
        }))
      : [];
  return (
    <div className="md:col-span-3 sm:col-span-12">
      <div className="flex flex-wrap justify-center gap-5 md:gap-8 lg:gap-10 items-center mb-5">
        {["Assigned", "New", "FollowUp", "Converted", "Lost", "Contacted", "Invalid", "Qualified"].map(
          (status) => (
            <button
              key={status}
              style={{ borderColor: getStatusColor(status) }}
              className={`border-2 rounded-lg font-semibold relative px-3 py-2 md:px-4 lg:px-6 md:py-3`}
              onClick={() => handleFilterStatus(status)}
            >
              {status}
              <span className="badge absolute right-0 -top-3 bg-danger p-0.5 px-1.5 rounded-full">
                {status == "Assigned"
                  ? leadsData?.length || 0
                  : getStatusCount(status)}
              </span>
            </button>
          )
        )}
      </div>

      <div className="panel ">
        <div className="flex md:items-center md:flex-row md:justify-between flex-col mb-5 gap-5">
          <h5 className="font-semibold text-lg dark:text-white-light">Leads</h5>
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
                  {cols.map((col, i) => {
                    return (
                      <li
                        key={i}
                        className="flex flex-col"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <div className="flex items-center px-4 py-1">
                          <label className="cursor-pointer mb-0">
                            <input
                              type="checkbox"
                              checked={!hideCols.includes(col.accessor)}
                              className="form-checkbox"
                              defaultValue={col.accessor}
                              onChange={(event) => {
                                setHideCols(event.target.value);
                                showHideColumns(
                                  col.accessor,
                                  event.target.checked
                                );
                              }}
                            />
                            <span className="ltr:ml-2 rtl:mr-2">
                              {col.title}
                            </span>
                          </label>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </Dropdown>
            </div>
            <div className="text-right">
              <input
                type="text"
                className="form-input w-auto"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        {isLoading ? (
          <DataTableSkeleton rows={7} />
        ) : (
          Array.isArray(recordsData) && (
            <div className="datatables">
              <DataTable
                pinLastColumn
                fetching={isLoading}
                loaderBackgroundBlur={true}
                highlightOnHover
                className="whitespace-nowrap table-hover"
                records={recordsData}
                onRowClick={({record}) => {
                  setSelectedLead(record);
                  setModal17(true);
                }}
                columns={cols?.map((col) => ({
                  ...col,
                  hidden: hideCols.includes(col.accessor),
                }))}
                totalRecords={initialRecords?.length}
                recordsPerPage={pageSize}
                page={page}
                onPageChange={(p) => setPage(p)}
                recordsPerPageOptions={PAGE_SIZES}
                onRecordsPerPageChange={setPageSize}
                sortStatus={sortStatus}
                onSortStatusChange={setSortStatus}
                minHeight={200}
                paginationText={({ from, to, totalRecords }) =>
                  `Showing  ${from} to ${to} of ${totalRecords} entries`
                }
                
              />
            </div>
          )
        )}
      </div>
<InvoiceModal
        isOpen={addInvoiceModal}
        onClose={() => setAddInvoiceModal(false)}
        initialValues={{
          userName: selectedLead?.userName, userEmail: selectedLead?.userEmail,
          userPhone: selectedLead?.userPhone,
          companyName: selectedLead?.companyName,
          salesPerson: user?._id,
          saleType: "",
          totalAmount: '',
          billTo: {
            name: selectedLead?.userName,
            email: selectedLead?.userEmail,
          },
          services: [
            {
              type: '',
              unitPrice: '',
              quantity: 1,
              customDescription: '',
            }
          ],
        }}
        onSubmit={handleSubmit}
        usersData={usersData}
        mode="add" // or "edit" or "view"
        isSubmitting={isInvoiceSubmitting}
      />
        <LeadDetailsModal
                isOpen={modal17}
                onClose={() => setModal17(false)}
                lead={selectedLead}
                onSubmit={(values) => {
                  const filteredAssignedTo = values.assigned.filter((a) => a.user && a.role);
                  const combinedValues = {
                    source: values?.source,
                    leadType: values?.leadType,
                    status: values?.status,
                    assigned: filteredAssignedTo,
                    date: values?.date,
                    comments: values?.comments && values.comments.trim()
                      ? [
                        ...(selectedLead?.comments || []),
                        {
                          text: values.comments,
                          postedBy: user?._id,
                        },
                      ]
                      : selectedLead?.comments || [],
                  };
                  mutation.mutate(combinedValues);
                }}
                user={user}
                userOptions={usersData || []}
              />
        

    </div>
  );
}

export default SalesPersonLeadTable;

  // {/* <Transition appear show={modal17} as={Fragment}>
  //   <Dialog as="div" open={modal17} onClose={() => setModal17(false)}>
  //     <Transition.Child
  //       as={Fragment}
  //       enter="ease-out duration-300"
  //       enterFrom="opacity-0"
  //       enterTo="opacity-100"
  //       leave="ease-in duration-200"
  //       leaveFrom="opacity-100"
  //       leaveTo="opacity-0"
  //     >
  //       <div className="fixed inset-0" />
  //     </Transition.Child>
  //     <div
  //       id="standard_modal"
  //       className="fixed inset-0 bg-[black]/90 z-[999] overflow-y-auto"
  //     >
  //       <div className="flex min-h-screen items-start justify-center px-4">
  //         <Transition.Child
  //           as={Fragment}
  //           enter="ease-out duration-300"
  //           enterFrom="opacity-0 scale-95"
  //           enterTo="opacity-100 scale-100"
  //           leave="ease-in duration-200"
  //           leaveFrom="opacity-100 scale-100"
  //           leaveTo="opacity-0 scale-95"
  //         >
  //           <Dialog.Panel className="panel my-8 w-full max-w-2xl overflow-hidden rounded-lg border-0  text-black dark:text-white-dark">
  //             <button
  //               type="button"
  //               className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
  //               onClick={() => setModal17(false)}
  //             >
  //               <IconX />
  //             </button>
  //             <h2 className="text-xl font-extrabold uppercase !leading-snug text-primary md:text-2xl">
  //               Lead Details
  //             </h2>
  //             <div className="datatables">
  //               <Formik
  //                 initialValues={{
  //                   userName: selectedLead?.userName,
  //                   userEmail: selectedLead?.userEmail,
  //                   userPhone: selectedLead?.userPhone,
  //                   status: selectedLead?.status,
  //                   leadType: selectedLead?.leadType,
  //                   source: selectedLead?.source,
  //                   projectManager: selectedLead?.projectManager?.map(user => user?._id) || [], // Convert to array of IDs
  //                   assignedTo: selectedLead?.assignedTo?.map(user => user?._id) || [], // Convert to array of IDs
  //                   id: selectedLead?._id,
  //                   comments: [""],
  //                 }}
  //                 onSubmit={(values) => {
  //                   const combinedValues = {
  //                     comments: [
  //                       ...selectedLead.comments,
  //                       {
  //                         text: values.comments,
  //                         postedBy: user?._id,
  //                       },
  //                     ],
  //                   };

  //                   // if (user.role !== "user") {
  //                   combinedValues.assignedTo = values?.assignedTo;
  //                   combinedValues.projectManager = values?.projectManager;
  //                   // } else {
  //                   combinedValues.status = values?.status;
  //                   // }

  //                   mutation.mutate(combinedValues);
  //                 }}
  //               >
  //                 {({ values, setFieldValue }) => (
                   
  //                   <Form className=" flex flex-col justify-center items-center my-5 ">
  //                     <div className="form-group w-full ">
  //                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  //                         <div className="form-group mb-2 flex-1">
  //                           <label htmlFor="userName">Full Name</label>
  //                           <Field
  //                             name="userName"
  //                             disabled
  //                             className="form-input protected-content"
  //                             placeholder="userName"
  //                           />
  //                           <ErrorMessage
  //                             name="userName"
  //                             component="div"
  //                             className="text-red-600"
  //                           />
  //                         </div>
  //                         <div className="form-group mb-2 flex-1">
  //                           <label htmlFor="userEmail">E-mail</label>
  //                           <Field
  //                             name="userEmail"
  //                             disabled
  //                             type="email"
  //                             className="form-input protected-content"
  //                             placeholder="User Email"
  //                           />
  //                           <ErrorMessage
  //                             name="userEmail"
  //                             component="div"
  //                             className="text-red-600"
  //                           />
  //                         </div>
  //                         <div className="form-group mb-2 flex-1">
  //                           <label htmlFor="userPhone">Phone Number</label>
  //                           <div className="relative text-white-dark">
  //                             <MaskedInput
  //                               id="phoneMask"
  //                               type="text"
  //                               name="userPhone"
  //                               disabled
  //                               placeholder="(___) ___-____"
  //                               value={selectedLead?.userPhone}
  //                               className="form-input ps-10 placeholder:text-white-dark protected-content"
  //                               mask={[
  //                                 "(",
  //                                 /[0-9]/,
  //                                 /[0-9]/,
  //                                 /[0-9]/,
  //                                 ")",
  //                                 " ",
  //                                 /[0-9]/,
  //                                 /[0-9]/,
  //                                 /[0-9]/,
  //                                 "-",
  //                                 /[0-9]/,
  //                                 /[0-9]/,
  //                                 /[0-9]/,
  //                                 /[0-9]/,
  //                               ]}
  //                             />{" "}
  //                             <span className="absolute start-4 top-1/2 -translate-y-1/2">
  //                               <IconPhone fill={true} />
  //                             </span>
  //                           </div>
  //                           <ErrorMessage
  //                             name="userPhone"
  //                             component="div"
  //                             className="text-red-600"
  //                           />
  //                         </div>

  //                       </div>

  //                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  //                         <div className="form-group mb-2 flex-1">
  //                           <label htmlFor="leadType">Select Type</label>
  //                           <Field disabled={user.role == "user"}
  //                             as="select" name="leadType" className="form-input">
  //                             <option value="" disabled selected hidden>
  //                               Select Lead Type
  //                             </option>
  //                             <option value="chat">Chat</option>
  //                             <option value="signUp">SignUp</option>
  //                             <option value="inbound">Inbound</option>
  //                             <option value="social">Social</option>
  //                             <option value="referral">Referral</option>
  //                             <option value="cold">Cold</option>
  //                           </Field>
  //                           <ErrorMessage
  //                             name="leadType"
  //                             component="div"
  //                             className="text-red-600"
  //                           />
  //                         </div>
  //                         <div className="form-group mb-2 flex-1">
  //                           <label htmlFor="source">Select Source</label>
  //                           <Field disabled={user.role == "user"}
  //                             as="select" name="source" className="form-input">
  //                             <option value="" disabled selected hidden>
  //                               Select Lead Source
  //                             </option>
  //                             <option value="ppc">PPC</option>
  //                             <option value="smm">SSM</option>
  //                             <option value="referral">Referral</option>
  //                             <option value="cold">Cold</option>
  //                           </Field>
  //                           <ErrorMessage
  //                             name="source"
  //                             component="div"
  //                             className="text-red-600"
  //                           />
  //                         </div>
  //                         <div className="form-group mb-2 flex-1">
  //                           <label htmlFor="status">Select Status</label>
  //                           <Field
  //                             as="select"
  //                             name="status"
  //                             className="form-input"
  //                           >
  //                             <option value="" disabled selected>
  //                               Select Status
  //                             </option>
  //                             <option value="New">New</option>
  //                             <option value="Lost">Lost</option>
  //                             <option value="FollowUp">Follow Up</option>
  //                             <option value="Converted">Converted</option>
  //                             <option value="Qualified">Qualified</option>
  //                             <option value="Invalid">Invalid</option>
  //                             <option value="Contacted">Contacted</option>
  //                           </Field>
  //                           <ErrorMessage
  //                             name="status"
  //                             component="div"
  //                             className="text-red-600"
  //                           />
  //                         </div>
  //                       </div>
  //                       {values.status === "FollowUp" && (
  //                         <div className="form-group mb-2 flex-1">
  //                           <label htmlFor="followUpEndDate">Follow-Up End Date</label>
  //                           <Flatpickr
  //                             name="followUpEndDate"
  //                             value={selectedLead?.followUp?.endDate}
  //                             placeholder="Select Follow-Up End Date"
  //                             options={{ dateFormat: "Y-m-d", position: "auto left" }}
  //                             className="form-input"
  //                             onChange={(selectedDate) => {
  //                               setFieldValue("followUpEndDate", selectedDate[0]);
  //                             }}
  //                           />
  //                         </div>
  //                       )}
  //                       <div className="form-group flex-1">
  //                         <label htmlFor="assignedTo">Assigned To</label>
  //                         <Field name="assignedTo" >
  //                           {({ field, form }) => (
  //                             <Select
  //                               // isDisabled={user.role === "user"}
  //                               isMulti
  //                               options={userOptions}
  //                               placeholder="Select Users"
  //                               className="form-select mb-2 flex-1 !border-none p-0"
  //                               value={userOptions.filter((option) => field.value?.includes(option.value))}
  //                               onChange={(selectedOptions) => {
  //                                 form.setFieldValue(
  //                                   "assignedTo",
  //                                   selectedOptions.map((option) => option.value)
  //                                 );
  //                               }}
  //                             />
  //                           )}
  //                         </Field>
  //                       </div>
  //                       <div className="form-group flex-1">
  //                         <label htmlFor="projectManager">Project Managers</label>
  //                         <Field name="projectManager" >
  //                           {({ field, form }) => (
  //                             <Select
  //                               // isDisabled={user.role === "user"}
  //                               isMulti
  //                               options={userOptions}
  //                               placeholder="Select Users"
  //                               className="form-select mb-2 flex-1 !border-none p-0"
  //                               value={userOptions.filter((option) => field.value?.includes(option.value))}
  //                               onChange={(selectedOptions) => {
  //                                 form.setFieldValue(
  //                                   "projectManager",
  //                                   selectedOptions.map((option) => option.value)
  //                                 );
  //                               }}
  //                             />
  //                           )}
  //                         </Field>
  //                       </div>
  //                       {/* {touched.accountsManager && errors.accountsManager && <div className="text-red-500">{errors.accountsManager}</div>} */}

  //                       <div className="form-group flex-1">
  //                         <label htmlFor="comments">Comments</label>
  //                         <Field
  //                           as="textarea"
  //                           rows="4"
  //                           name="comments"
  //                           type="text"
  //                           className="form-input"
  //                           placeholder="Write comments here... "
  //                         />
  //                         <ErrorMessage
  //                           name="comments"
  //                           component="div"
  //                           className="text-red-500"
  //                         />
  //                       </div>
  //                     </div>

  //                     <Field type="hidden" name="id" />
  //                     <div>
  //                       <button type="submit" className=" btn btn-primary">
  //                         Submit
  //                       </button>
  //                     </div>
  //                   </Form>
  //                 )}
  //               </Formik>
  //               <div>
  //                 {selectedLead?.comments?.length > 0 &&
  //                   selectedLead?.comments
  //                     ?.slice()
  //                     .sort(
  //                       (a, b) =>
  //                         new Date(b.createdAt) - new Date(a.createdAt)
  //                     )
  //                     ?.map((item, index) => (
  //                       <article
  //                         key={index}
  //                         class="p-6 text-base bg-white border-t border-gray-200 dark:border-gray-700 dark:bg-gray-900"
  //                       >
  //                         <footer class="flex justify-between items-center mb-2">
  //                           <div class="flex items-center">
  //                             <p class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
  //                               {item?.postedBy?.profileImageUrl ? (
  //                                 <img
  //                                   class="mr-2 w-6 h-6 rounded-full"
  //                                   src={item.postedBy?.profileImageUrl}
  //                                   alt={item?.postedBy?.userName}
  //                                 />
  //                               ) : (
  //                                 <div className="text-sm  mr-2 w-6 h-6 rounded-full flex items-center justify-center bg-gray-200 text-gray-700">
  //                                   {item?.postedBy?.userName
  //                                     ? item?.postedBy?.userName
  //                                       .charAt(0)
  //                                       .toUpperCase()
  //                                     : ""}
  //                                 </div>
  //                               )}

  //                               {item?.postedBy?.userName}
  //                             </p>
  //                             <p class="text-sm text-gray-600 dark:text-gray-400">
  //                               {new Date(
  //                                 item?.createdAt
  //                               ).toLocaleDateString()}
  //                             </p>
  //                           </div>
  //                         </footer>
  //                         <p class="text-gray-500 dark:text-gray-400">
  //                           {item?.text}
  //                         </p>
  //                       </article>
  //                     ))}
  //               </div>
  //             </div>
  //           </Dialog.Panel>
  //         </Transition.Child>
  //       </div>
  //     </div>
  //   </Dialog>
  // </Transition> */}