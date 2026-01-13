import React, { useMemo } from "react";
import { DataTable } from "mantine-datatable";
import { useState, Fragment, useEffect } from "react";
import sortBy from "lodash/sortBy";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Dropdown from "../Dropdown";
import IconCaretDown from "../Icon/IconCaretDown";
import { deleteLead, getLeads, markLead, updateLead } from "../../api/leadsApi";
import { getAllMembers } from "../../api/userApi";
import { Link, NavLink, useLocation } from "react-router-dom";
import IconCashBanknotes from "../Icon/IconCashBanknotes";
import IconPlus from "../Icon/IconPlus";
import { coloredToast } from "../Alerts/SimpleAlert";
import { DataTableSkeleton } from "../Skeletons/Skeletons";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import IconTrashLines from "../Icon/IconTrashLines";
import useDeleteMutation from "../DeleteModals/DeleteMutation";
import DeleteModals from "../DeleteModals/DeleteModals";
import Select from "react-select";
import IconDollarSign from "../Icon/IconDollarSign";
import { invoiceApi } from "../../api/invoiceApi";
import * as Yup from "yup";
import LeadDetailsModal from "../Modals/LeadDetailModal";
import InitialAvatar from "../InitialAvatar";
import { getStatusColor } from "../../utils/Utils";
import InvoiceModal from "../Modals/InvoiceModal";
import { Button } from "@headlessui/react";
import { Field } from "formik";

function debounce(callback, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}

function LeadsTable() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const lastSegment = location.pathname.split("/").pop(); // gets 'urban-quill-publishings' or 'bellevue-publishers'

  // console.log("lastSegment", lastSegment);

  let companyName = "";
  if (lastSegment === "urban-quill-publishings") {
    companyName = "Urban Quill Publishing";
  } else if (lastSegment === "belleuve-publishers") {
    companyName = "Bellevue Publishers";
  } else if (lastSegment === "book-publishings") {
    companyName = "Book Publishings";
  } else if (lastSegment === "data-sheet") {
    companyName = "Data Sheet";
  } else if (lastSegment === "american-writers-association") {
    companyName = "American Writers Association";
  }

  const {
    isLoading: usersLoading,
    data: usersData,
    status: usersStatus,
  } = useQuery({
    queryKey: ["members"],
    queryFn: getAllMembers,
  });

  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [initialRecords, setInitialRecords] = useState([]);
  const [recordsData, setRecordsData] = useState([]);
  const [modal17, setModal17] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [addInvoiceModal, setAddInvoiceModal] = useState(false);
  const [selectedLeadStatus, setSelectedLeadStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAssignedUser, setSelectedAssignedUser] = useState("");
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [search, setSearch] = useState("");
  const [hideCols, setHideCols] = useState([]);
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: "createdAt",
    direction: "asc",
  });
  const isRtl =
    useSelector((state) => state.themeConfig.rtlClass) === "rtl" ? true : false;
  const { user } = useSelector((state) => state.user);
  const debouncedSearch = debounce(setSearch, 300);

  const {
    isLoading,
    data: leadsData,
    status,
  } = useQuery({
    queryKey: [
      "Leads",
      search,
      page,
      pageSize,
      selectedAssignedUser,
      selectedCompanyName,
      selectedMonth,
      selectedLeadStatus,
    ],
    queryFn: () =>
      getLeads(
        search,
        page,
        pageSize,
        selectedAssignedUser,
        selectedCompanyName,
        selectedMonth,
        selectedLeadStatus
      ),
    keepPreviousData: true,
  });

  const { deleteMutation, modalOpen, setModalOpen, setSelectedId } =
    useDeleteMutation({
      mutationFn: deleteLead,
      successMessage: "Lead has been deleted successfully",
      queryKey: "Leads",
    });

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setSelectedId(id);
    setModalOpen(true);
  };

  useEffect(() => {
    if (leadsData?.leads) {
      const sortedData = sortBy(leadsData.leads, "createdAt").reverse();
      setInitialRecords(sortedData);
      setRecordsData(sortedData);
    }
  }, [leadsData, sortStatus, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const showHideColumns = (col, value) => {
    if (hideCols.includes(col)) {
      setHideCols((col) => hideCols.filter((d) => d !== col));
    } else {
      setHideCols([...hideCols, col]);
    }
  };

  const formatDate = (date) => {
    if (date) {
      const dt = new Date(date);
      const month =
        dt.getMonth() + 1 < 10 ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1;
      const day = dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate();
      return day + "/" + month + "/" + dt.getFullYear();
    }
    return "";
  };

  const getLastAssignedUserByRole = (assignedTo, role) => {
    if (!assignedTo || !Array.isArray(assignedTo)) return null;

    const filtered = assignedTo.filter((a) => a.role === role);
    if (filtered.length === 0) return null;

    // Sort by updatedAt DESC to get latest one
    const sorted = filtered.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
    return sorted[0]; // latest one
  };

  const cols = [
    {
      accessor: "userName",
      title: "Name",
      sortable: true,
      hidden: hideCols.includes("userName"),
      render: ({ userName }) => (
        <div className="flex items-center w-max gap-3 protected-content">
          <InitialAvatar
            name={userName ? userName.charAt(0).toUpperCase() : ""}
          />
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
        <a
          href={`mailto:${userEmail}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="w-max group hover:underline"
        >
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
        <a
          href={`tel:${userPhone}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="w-max group hover:underline"
        >
          {user?.role === "admin" ? (
            userPhone
          ) : (
            <div className="">
              <span>{userPhone?.slice(0, 4)}</span>
              <span className="blur-sm group-hover:blur-none select-none">
                {userPhone?.slice(4)}
              </span>
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
    {
      accessor: "leadType",
      title: "Lead Type",
      sortable: true,
      hidden: hideCols.includes("leadType"),
      render: ({ leadType }) => <div className="capitalize">{leadType}</div>,
    },
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
          className={`badge `}
        >
          {status}
        </span>
      ),
      hidden: hideCols.includes("status"),
    },
    {
      accessor: "date",
      title: "Date",
      sortable: true,
      hidden: hideCols.includes("date"),
      render: ({ date }) => (
        <div className="flex items-center w-max">
          <div>{formatDate(date)}</div>
        </div>
      ),
    },
    {
      accessor: "action",
      title: "Action",
      titleClassName: "!text-center",
      render: (data) => (
        <div className="flex items-center w-max mx-auto gap-1">
          {/* {(user.role === "superAdmin" || user.role === "admin") && ( */}
          <Tippy content="Create Invoice">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedLead(data);
                setAddInvoiceModal(true);
              }}
            >
              <IconDollarSign />
            </button>
          </Tippy>
          {/* )} */}
          <Tippy content="Add Sale">
            <NavLink to={`/add-sales/${data?._id}`} type="button">
              <IconCashBanknotes />
            </NavLink>
          </Tippy>
          <Tippy content="Delete Lead">
            <button onClick={(e) => handleDeleteClick(e, data?._id)}>
              <IconTrashLines className="text-danger hover:text-red-900" />
            </button>
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
      queryClient.invalidateQueries("Leads");

      coloredToast(
        "success",
        "Lead Updated Successfully !",
        "top",
        null,
        null,
        15000
      );
    },
    onError: (error) => {
      coloredToast("danger", error?.response?.data?.message, "top");
    },
  });

  const { mutate: invoiceMutation, isInvoiceSubmitting } = useMutation({
    mutationKey: ["addInvoice"],
    mutationFn: invoiceApi,
    onSuccess: (response) => {
      coloredToast("success", "Invoice created successfully", "top");
      // setInitialRecords((prev) => [response?.invoice, ...prev]);
      setAddInvoiceModal(false);
      // queryClient.invalidateQueries(['invoices'], { refetchType: 'Inactive' });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const userOptions = Array.isArray(usersData?.allUsers)
    ? usersData?.allUsers
        .filter((item) => item.role !== "admin" && item.role !== "ppc")
        .map((item) => ({
          value: item._id,
          label: item.userName,
        }))
    : [];

  const markSeenMutation = useMutation({
    mutationKey: ["markSeen"],
    mutationFn: (leadId) => markLead(leadId),
  });

  useEffect(() => {
    if (leadsData?.leads?.length > 0) {
      leadsData.leads.forEach((lead) => {
        if (lead.isNew) {
          markSeenMutation.mutate(lead?._id);
        }
      });
    }
  }, [leadsData]);

  const handleSubmit = (values) => {
    const calculatedTotal = values.services.reduce((acc, s) => {
      return acc + Number(s.unitPrice || 0) * Number(s.quantity || 0);
    }, 0);
    const finalValues = {
      ...values,
      totalAmount: calculatedTotal,
      leadId: selectedLead._id,
    };
    // console.log("finalValues", finalValues);
    invoiceMutation(finalValues);
  };
  const handleMonthChange = (e) => {
    const value = e.target.value;

    if (!value) {
      setSelectedMonth(null); // show all data if cleared
    } else {
      const [year, month] = value.split("-");
      setSelectedMonth({
        year: parseInt(year),
        month: parseInt(month),
      });
    }
  };

  return (
    <div className="md:col-span-3 sm:col-span-12">
      {" "}
      <ul className="flex space-x-2 rtl:space-x-reverse mb-5">
        <li>
          <Link to="#" className="text-primary hover:underline">
            Leads
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Table</span>
        </li>
      </ul>
      <div className="p-5 relative ">
        <div className="flex md:items-center md:flex-row md:justify-between flex-col mb-5 gap-5">
          <h1 className="screenHeading">Leads</h1>{" "}
          <div className="min-w-[200px] z-[19]">
            <Select
              options={userOptions}
              placeholder="Filter by Assigned User"
              isClearable
              className="form-select dark:!text-dark !p-0 "
              onChange={(selected) => {
                setPage(1);
                setSelectedAssignedUser(selected ? selected.value : "");
              }}
            />
          </div>
        </div>

        <div className="flex md:flex-row flex-col justify-between gap-5 mb-5  overflow-x-scroll custom-scrollbar">
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
                {cols?.map((col, i) => {
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
                          <span className="ltr:ml-2 rtl:mr-2">{col.title}</span>
                        </label>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Dropdown>
          </div>
          <div className="min-w-[200px] z-[19]">
            <input
              type="month"
              value={selectedMonth} // already in "YYYY-MM" format
              onChange={(e) => setSelectedMonth(e.target.value)} // e.g., "2025-09"
              className="select form-input w-auto"
            />
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
              <option value="">All</option>
              <option value="New">New</option>
              <option value="Lost">Lost</option>
              <option value="FollowUp">Follow Up</option>
              <option value="Converted">Converted</option>
              <option value="Qualified">Qualified</option>
              <option value="Contacted">Contacted</option>
              <option value="Invalid">Invalid</option>
            </select>
          </div>

          <div className="min-w-[200px] z-[19]">
            <select
              as="select"
              name="companyName"
              className="form-input"
              value={selectedCompanyName}
              onChange={(e) => setSelectedCompanyName(e.target.value)} // Yahan aap apna state update function use karein
            >
              <option disabled value="" label="Select Brand" selected hidden />
              <option value="">All Brands</option>
              <option value="Bellevue Publishers">Bellevue Publishers</option>
              <option value="American Writers Association">
                American Writers Association
              </option>
              <option value="The Pulp House Publishing">
                The Pulp House Publishing
              </option>
              <option value="Book Publishings">Book Publishings</option>
              <option value="Urban Quill Publishing">
                Urban Quill Publishing
              </option>
              <option value="Amazon Book Publishing Agency">
                Amazon Book Publishing Agency
              </option>
              <option value="Data Sheet">Data Sheet</option>
            </select>
          </div>
          <div className="text-right flex gap-2 items-center">
            <input
              type="text"
              className="form-input w-auto"
              placeholder="Search..."
              onChange={(e) => debouncedSearch(e.target.value)}
            />
            <Link to="/add-leads" className="btn btn-primary">
              + Add
            </Link>
          </div>
        </div>

        {isLoading ? (
          <DataTableSkeleton rows={6} />
        ) : (
          Array.isArray(recordsData) && (
            <div className="datatables">
              <DataTable
                pinLastColumn
                loaderBackgroundBlur
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
                paginationText={({ from, to, totalRecords }) =>
                  `Showing  ${from} to ${to} of ${totalRecords} entries`
                }
              />
            </div>
          )
        )}
      </div>
      <LeadDetailsModal
        isOpen={modal17}
        onClose={() => setModal17(false)}
        lead={selectedLead}
        onSubmit={(values) => {
          const filteredAssignedTo = values.assigned.filter(
            (a) => a.user && a.role
          );
          const combinedValues = {
            status: values?.status,
            source: values?.source,
            leadType: values?.leadType,
            assigned: filteredAssignedTo,
            date: values?.date,
            comments:
              values?.comments && values.comments.trim()
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
      <InvoiceModal
        isOpen={addInvoiceModal}
        onClose={() => setAddInvoiceModal(false)}
        initialValues={{
          userName: selectedLead?.userName,
          userEmail: selectedLead?.userEmail,
          userPhone: selectedLead?.userPhone,
          companyName: selectedLead?.companyName,
          salesPerson: "",
          saleType: "",
          totalAmount: "",
          billTo: {
            name: selectedLead?.userName,
            email: selectedLead?.userEmail,
          },
          services: [
            {
              type: "",
              unitPrice: "",
              quantity: 1,
              customDescription: "",
            },
          ],
        }}
        onSubmit={handleSubmit}
        usersData={usersData}
        mode="add" // or "edit" or "view"
        isSubmitting={isInvoiceSubmitting}
      />
      <DeleteModals
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onDelete={() => deleteMutation.mutate()}
      />
    </div>
  );
}

export default LeadsTable;

{
  /* <Transition appear show={modal17} as={Fragment}>
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
    <div
      id="standard_modal"
      className="fixed inset-0 bg-[black]/90 z-[999] overflow-y-auto"
    >
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
          <Dialog.Panel className="panel my-8 w-full lg:max-w-4xl overflow-hidden rounded-lg border-0  text-black dark:text-white-dark">
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
                  id: selectedLead?._id,
                  name: selectedLead?.userName || '',
                  email: selectedLead?.userEmail || '',
                  phone: selectedLead?.userPhone || '',
                  message: selectedLead?.message || '',
                  date: selectedLead?.date,
                  followUpEndDate: selectedLead?.followUp?.endDate,
                  leadType: selectedLead?.leadType,
                  source: selectedLead?.source,
                  companyName: selectedLead?.companyName || '',
                  status: selectedLead?.status || '',
                  fullPageUrl: selectedLead?.fullPageUrl || '',
                  ipInfo: selectedLead?.ipInfo || {},
                  assignedTo: selectedLead?.assignedTo?.map(user => user?._id) || [],
                  projectManager: selectedLead?.projectManager?.map(user => user?._id) || [],
                }}
                onSubmit={(values) => {
                  const combinedValues = {
                    source: values?.source,
                    leadType: values?.leadType,
                    assignedTo: values.assignedTo,
                    projectManager: values.projectManager,
                    status: values?.status,
                    date: values?.date,
                    followUpEndDate: values?.followUpEndDate,
                    comments: values?.comments && values.comments.trim() ? [
                      ...(selectedLead?.comments || []),
                      {
                        text: values.comments,
                        postedBy: user?._id,
                      },
                    ] : (selectedLead?.comments || []),
                  };

                  mutation.mutate(combinedValues);
                }}
              >
                {({ values, setFieldValue }) => (
                  <Form className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                      <div>
                        <label htmlFor="name">Name</label>
                        <Field
                          type="text"
                          name="name"
                          className="form-input protected-content"
                          disabled
                        />
                      </div>
                      {user?.role !== "ppc" && (
                        <>
                          <div>
                            <label htmlFor="email">Email</label>
                            <Field
                              type="email"
                              name="email"
                              className="form-input "
                              disabled
                            />
                          </div>
                          <div>
                            <label htmlFor="phone">Phone</label>
                            <Field
                              type="text"
                              name="phone"
                              className="form-input protected-content"
                              disabled
                            />
                          </div>
                        </>
                      )}



                      <div>
                        <label htmlFor="companyName">Brand Name</label>
                        <Field
                          type="text"
                          name="companyName"
                          className="form-input protected-content"
                          disabled
                        />
                      </div>
                      <div className="">
                        <label htmlFor="date">Date</label>
                        <Flatpickr
                          name="date"
                          value={selectedLead?.date}
                          placeholder="Select the Date"
                          options={{ dateFormat: "Y-m-d", position: "auto left" }}
                          className="form-input"
                          onChange={(selectedDate) => {
                            setFieldValue("date", selectedDate[0]);
                          }}

                        />
                      </div>
                      <div className="" >
                        <label htmlFor="fullPageUrl">Full Page URL</label>
                        <Field
                          type="text"
                          name="fullPageUrl"
                          className="form-input protected-content"
                          disabled
                        />
                      </div>

                    </div>

                    <div>
                      <label htmlFor="message">Message/Subject</label>
                      <Field
                        as="textarea"
                        name="message"
                        className="form-textarea protected-content"
                        rows="3"
                        disabled
                      />
                    </div>



                    {values.ipInfo && Object.keys(values.ipInfo).length > 0 && (
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <h4 className="font-semibold mb-3">IP Information</h4>
                        <div className="grid grid-cols-2 gap-4 protected-content">
                          <div>
                            <label>IP Address</label>
                            <div className="text-sm">{values.ipInfo?.ip}</div>
                          </div>
                          <div>
                            <label>Location</label>
                            <div className="text-sm">{`${values.ipInfo?.city || ''}, ${values.ipInfo?.region || ''}, ${values.ipInfo?.country || ''}`}</div>
                          </div>
                          <div>
                            <label>Postal Code</label>
                            <div className="text-sm">{values.ipInfo?.postal}</div>
                          </div>
                          <div>
                            <label>Timezone</label>
                            <div className="text-sm">{values.ipInfo?.timezone}</div>
                          </div>
                          <div>
                            <label>Organization</label>
                            <div className="text-sm">{values.ipInfo?.org}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="form-group mb-2 flex-1">
                        <label htmlFor="leadType">Select Type</label>
                        <Field as="select" name="leadType" className="form-input">
                          <option value="" disabled selected hidden>
                            Select Lead Type
                          </option>
                          <option value="chat">Chat</option>
                          <option value="signUp">SignUp</option>
                          <option value="inbound">Inbound</option>
                          <option value="social">Social</option>
                          <option value="referral">Referral</option>
                          <option value="cold">Cold</option>
                        </Field>
                        <ErrorMessage
                          name="leadType"
                          component="div"
                          className="text-red-600"
                        />
                      </div>
                      <div className="form-group mb-2 flex-1">
                        <label htmlFor="source">Select Source</label>
                        <Field as="select" name="source" className="form-input">
                          <option disabled value="" label="Select Source" selected hidden />
                          <option value="ppc">PPC</option>
                          <option value="smm">SSM</option>
                          <option value="referral">Referral</option>
                          <option value="cold">Cold</option>
                        </Field>
                        <ErrorMessage
                          name="source"
                          component="div"
                          className="text-red-600"
                        />
                      </div>
                      <div className="form-group mb-2 flex-1">
                        <label htmlFor="status">Select Status</label>
                        <Field
                          as="select"

                          name="status"
                          className="form-input"
                        >
                          <option disabled value="" label="Select Status" selected hidden />
                          <option value="New">New</option>
                          <option value="Lost">Lost</option>
                          <option value="FollowUp">Follow Up</option>
                          <option value="Converted">Converted</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Invalid">Invalid</option>
                        </Field>
                        <ErrorMessage
                          name="status"
                          component="div"
                          className="text-red-600"
                        />
                      </div>

                    </div>


                    <div className="">
                      {values.status === "FollowUp" && (
                        <div className="form-group mb-2 flex-1">
                          <label htmlFor="followUpEndDate">Follow-Up End Date</label>
                          <Flatpickr
                            name="followUpEndDate"
                            value={selectedLead?.followUp?.endDate}
                            placeholder="Select Follow-Up End Date"
                            options={{ dateFormat: "Y-m-d", position: "auto left" }}
                            className="form-input"
                            onChange={(selectedDate) => {
                              setFieldValue("followUpEndDate", selectedDate[0]);
                            }}
                          />
                        </div>
                      )}
                      <label htmlFor="assignedTo">Assigned To</label>

                      <Field name="assignedTo">
                        {({ field, form }) => (
                          <Select
                            isMulti
                            options={userOptions}
                            placeholder="Select Users"
                            className="form-select mb-2 flex-1 !border-none p-0"
                            value={userOptions?.filter((option) => field.value?.includes(option.value))}
                            onChange={(selectedOptions) => {
                              form.setFieldValue(
                                "assignedTo",
                                selectedOptions.map((option) => option.value)
                              );
                            }}
                          />
                        )}
                      </Field>
                      <label htmlFor="projectManager">Project Managers</label>

                      <Field name="projectManager">
                        {({ field, form }) => (
                          <Select
                            isMulti
                            options={userOptions}
                            placeholder="Select Users"
                            className="form-select mb-2 flex-1 !border-none p-0"
                            value={userOptions?.filter((option) => field.value?.includes(option.value))}
                            onChange={(selectedOptions) => {
                              form.setFieldValue(
                                "projectManager",
                                selectedOptions.map((option) => option.value)
                              );
                            }}
                          />
                        )}
                      </Field>

                    </div>

                    <div className="form-group flex-1">
                      <label htmlFor="comments">Comments</label>
                      <Field
                        as="textarea"
                        rows="4"
                        name="comments"
                        type="text"
                        className="form-input"
                        placeholder="Write comments here... "
                      />
                      <ErrorMessage
                        name="comments"
                        component="div"
                        className="text-red-500"
                      />
                    </div>


                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      Update Lead
                    </button>
                  </Form>
                )}
              </Formik>

              <div>
                {selectedLead?.comments?.length > 0 &&
                  selectedLead?.comments
                    ?.slice()
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    .map((item, index) => (
                      <article
                        key={index}
                        className="p-6 text-base bg-white border-t border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                      >
                        <footer className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <p className=" capitalize inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                              {item?.postedBy?.profileImageUrl ? (
                                <img
                                  className="mr-2 w-6 h-6 rounded-full"
                                  src={item.postedBy?.profileImageUrl}
                                  alt={item?.postedBy?.userName}
                                />
                              ) : (
                                <div className="text-sm  mr-2 w-6 h-6 rounded-full flex items-center justify-center bg-gray-200 text-gray-700">
                                  {item?.postedBy?.userName
                                    ? item?.postedBy?.userName
                                      .charAt(0)
                                      .toUpperCase()
                                    : ""}
                                </div>
                              )}

                              {item?.postedBy?.userName}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(
                                item.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </footer>
                        <p className="text-gray-500 dark:text-gray-400">
                          {item?.text}
                        </p>
                      </article>
                    ))}
              </div>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </div >
  </Dialog >
</Transition > */
}
