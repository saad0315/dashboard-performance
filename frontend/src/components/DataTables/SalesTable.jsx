import { DataTable } from "mantine-datatable";
import { useState, Fragment, useEffect, useMemo } from "react";
import sortBy from "lodash/sortBy";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useSelector } from "react-redux";
// import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Dropdown from "../Dropdown";
import { Dialog, Transition } from "@headlessui/react";
import IconCaretDown from "../Icon/IconCaretDown";
import { deleteSale, getSales, updateSales } from "../../api/salesApi";
import { Link, useLocation } from "react-router-dom";
import { DataTableSkeleton } from "../Skeletons/Skeletons";
import useDeleteMutation from "../DeleteModals/DeleteMutation";
import DeleteModals from "../DeleteModals/DeleteModals";
import IconTrashLines from "../Icon/IconTrashLines";
import IconX from "../Icon/IconX";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import { coloredToast } from "../Alerts/SimpleAlert";
import Select from "react-select";
import { getAllMembers, getAllUsers } from "../../api/userApi";
import { updateLead } from "../../api/leadsApi";
import LeadDetailsModal from "../Modals/LeadDetailModal";
import InitialAvatar from "../InitialAvatar";
import { getLastAssignedUserByRole } from "../../constants/constants";

function SalesTable() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const lastSegment = location.pathname.split("/").pop(); // gets 'urban-quill-publishings' or 'bellevue-publishers'

  let saleType = "";
  let headingText = "Sales";
  if (lastSegment === "front-sales") {
    saleType = "frontSell";
    headingText = "Front Sales";
  } else if (lastSegment === "up-sales") {
    saleType = "upSell";
    headingText = "Up Sales";
  } else if (lastSegment === "cross-sales") {
    saleType = "crossSell";
    headingText = "Cross Sales";
  }

  const {
    isLoading,
    data: salesData,
    status,
  } = useQuery({
    queryKey: ["Sales", saleType],
    queryFn: () => getSales(saleType),
  });
  const {
    isLoading: usersLoading,
    data: usersData,
    status: usersStatus,
  } = useQuery({
    queryKey: ["members"],
    queryFn: getAllMembers,
  });

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [initialRecords, setInitialRecords] = useState([]);
  const [recordsData, setRecordsData] = useState([]);
  const [modal17, setModal17] = useState(false);
  const [modal18, setModal18] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [search, setSearch] = useState("");
  const [hideCols, setHideCols] = useState([]);
  const [assignedToEditMode, setAssignedToEditMode] = useState(false);
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: "createdAt",
    // direction: "dsc",
  });

  const { user } = useSelector((state) => state.user);
  const isRtl =
    useSelector((state) => state.themeConfig.rtlClass) === "rtl" ? true : false;
  const toggleEditMode = (index) => {
    setAssignedToEditMode((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const mutation = useMutation({
    mutationKey: ["updateSale"],
    mutationFn: (data) => updateSales(data, selectedSale?._id),
    onSuccess: (response) => {
      setModal17(false);
      queryClient.invalidateQueries("Sales");
      coloredToast(
        "success",
        "Sale Updated Successfully !",
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

  const leadMutation = useMutation({
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

  const {
    deleteMutation,
    modalOpen,
    setModalOpen,
    setSelectedId,
  } = useDeleteMutation({
    mutationFn: deleteSale,
    successMessage: "Sale has been deleted successfully",
    queryKey: "Sales",
  });

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setModalOpen(true);
  };

  const userOptions =
    Array.isArray(usersData?.allUser)
      ? usersData?.allUser
        .filter((item) => item.role !== "admin" && item.role !== "ppc")
        .map((item) => ({
          value: item._id,
          label: item.userName,
        }))
      : [];

  useEffect(() => {
    if (salesData?.sales) {
      const sortedUsers = sortBy(salesData?.sales, "createdAt");
      setInitialRecords(sortedUsers);
      // console.log(sortedUsers);
      setRecordsData(sortedUsers);
    }
  }, [salesData]);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecordsData([...initialRecords.slice(from, to)]);
  }, [page, pageSize, initialRecords]);

  const leadId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("lead"); // e.g. ?lead=68a356defdb47ebdb07671ff
  }, [location.search]);

  useEffect(() => {
    if (!Array.isArray(salesData?.sales)) return;

    let list = salesData.sales;

    // 1) filter by lead id if present in query
    if (leadId) {
      list = list.filter((item) => {
        const id = String(item?.lead?._id ?? item?.lead?.id ?? "").trim();
        console.log("[lead filter]", { id, leadId })
        return id && id === leadId;
      });
    }

    // 2) then apply text search (case-insensitive)
    const q = (search ?? "").trim().toLowerCase();
    if (q) {
      list = list.filter((item) => {
        const salesPerson = item?.salesPerson?.userName?.toLowerCase() ?? "";
        const leadName = item?.lead?.userName?.toLowerCase() ?? "";
        const leadEmail = item?.lead?.userEmail?.toLowerCase() ?? "";
        const amount = String(item?.amount ?? "").toLowerCase();

        return (
          salesPerson.includes(q) ||
          leadName.includes(q) ||
          leadEmail.includes(q) ||
          amount.includes(q)
        );
      });
    }

    setInitialRecords(list);
    setPage(1);
  }, [salesData, leadId, search]);

  // useEffect(() => {
  //   if (salesData?.sales) {
  //     const filteredSales = salesData?.sales?.filter((item) => {
  //       return (
  //         item?.salesPerson?.userName
  //           .toLowerCase()
  //           .includes(search.toLowerCase()) ||
  //         item?.salesPerson?.userName.toLowerCase().includes(search.toLowerCase()) ||
  //         item?.lead?.userName.toLowerCase().includes(search.toLowerCase()) ||
  //         item?.lead?.userEmail.toLowerCase().includes(search.toLowerCase()) ||
  //         item?.amount.toString().toLowerCase().includes(search.toLowerCase())
  //       );
  //     });
  //     // const sortedSales = sortBy(filteredSales, "createdAt");
  //     setInitialRecords(filteredSales);
  //     setPage(1);
  //   }
  // }, [search, salesData]);
  const showHideColumns = (col, value) => {
    if (hideCols.includes(col)) {
      setHideCols((col) => hideCols.filter((d) => d !== col));
    } else {
      setHideCols([...hideCols, col]);
    }
  };

  const cols = [
    {
      accessor: "salesPerson.userName",
      title: "Sales Person",
      sortable: true,
      hidden: hideCols.includes("salesPerson.userName"),
      render: ({ salesPerson }) => (
        <div className="flex items-center w-max gap-3">
          {salesPerson?.profileImgUrl ? (
            <img
              className="rounded-full w-8 h-8 object-cover"
              src={`https://bellevue-portal.b-cdn.net/${salesPerson?.profileImgUrl}`}
              alt="userProfile"
            />
          ) : (
            <InitialAvatar name={salesPerson?.userName ? salesPerson?.userName.charAt(0).toUpperCase() : ""} />
          )}
          <div className="capitalize">{salesPerson?.userName}</div>
        </div>
      ),
    },

    {
      accessor: "lead.userName",
      title: "Client Name",
      sortable: true,
      hidden: hideCols.includes("lead.userName"),
      render: ({ lead }) => (
        <button
          onClick={(e) => {
            e.stopPropagation(); // to avoid triggering row click
            setSelectedLead(lead);
            setModal18(true);
          }}
          className="text-primary underline hover:text-primary-700"
        >
          {lead?.userName || "N/A"}
        </button>
      ),
    },
    {
      accessor: "lead.userEmail",
      title: "Client Email",
      sortable: true,
      hidden: hideCols.includes("lead.userEmail"),
      render: ({ lead }) => {
        const userEmail = lead?.userEmail
        return (
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
        )
      }
    },
    {
      accessor: "lead.userPhone",
      title: "Client Phone",
      sortable: true,
      hidden: hideCols.includes("lead.userPhone"),
      render: ({ lead }) => {

        const userPhone = lead?.userPhone

        return (
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
        )
      }
    },
    {
      accessor: "services",
      title: "Services",
      render: ({ services }) => {
        if (!Array.isArray(services)) {
          return <span>No servicessss</span>;
        }
        return (
          <div className="flex items-center w-max mx-auto">
            <Tippy content={services.length > 1 ? services?.slice(0).join(", ") : ""} placement="top">
              <span>{services[0]}</span>
            </Tippy>
          </div>
        );
      },
    },
    {
      accessor: "saleType",
      title: "Sales Type",
      sortable: true,
      hidden: hideCols.includes("saleType"),
      render: ({ saleType }) => (
        <span className={` capitalize`}>
          {saleType}
        </span>
      ),
    },
    {
      accessor: "amount",
      title: "Amount",
      sortable: true,
      hidden: hideCols.includes("amount"),
    },

    {
      accessor: "date",
      title: "Date",
      sortable: true,
      hidden: hideCols.includes("date"),
      render: ({ date }) => (
        <div className="flex items-center w-max">
          <div>{new Date(date).toLocaleDateString()}</div>
        </div>
      ),
    },
    {
      accessor: "lead.companyName",
      title: "Brand",
      sortable: true,
      hidden: hideCols.includes("lead.companyName"),
    },
    {
      accessor: "Frontsell",
      title: "Front Sell",
      sortable: false,
      hidden: hideCols.includes("Frontsell"),
      render: ({ lead }) => {
        const frontSell = getLastAssignedUserByRole(lead?.assigned, "frontsell");
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
      render: ({ lead }) => {
        const upsell = getLastAssignedUserByRole(lead?.assigned, "upsell");
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
      render: ({ lead }) => {
        const pm = getLastAssignedUserByRole(lead?.assigned, "projectManager");
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
      accessor: "saleAgreement",
      title: "Sale Agreement",
      sortable: true,
      hidden: hideCols.includes("saleAgreement"),
      render: ({ saleAgreement }) =>
        saleAgreement ? (
          <a target="_blank" onClick={(e) => e.stopPropagation()} className="bg-primary hover:bg-primary-700 text-white px-3 py-1 rounded text-sm" href={`https://ebook-sales.b-cdn.net/ebook-sales/${saleAgreement}`} download>
            download
          </a>
        ) : (
          <span className="text-gray-400 italic">No file</span>
        ),
    },
    {
      accessor: "action",
      title: "Action",
      titleClassName: "!text-center",
      render: (data) => (
        <div className="flex items-center w-max mx-auto">
          <Tippy content="Delete Sale">
            <button onClick={(e) => { e.stopPropagation(), handleDeleteClick(data?._id) }}>
              <IconTrashLines className="text-danger hover:text-red-900" />
            </button>
          </Tippy>
        </div>
      ),
    },
  ];


  const Services = [
    "Marketing",
    "Publishing",
    "Designing",
    "Writing",
    "Audio Book",
    "Ebook",
    "Others",
  ]
  return (
    <div className="md:col-span-3 sm:col-span-12">
      <ul className="flex space-x-2 rtl:space-x-reverse mb-5">
        <li>
          <Link to="#" className="text-primary hover:underline">
            Sales
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Table</span>
        </li>
      </ul>{" "}
      <div className="">
        <div className="flex md:items-center md:flex-row md:justify-between flex-col mb-5 gap-5">
          <h1 className="screenHeading">
            {headingText}
          </h1>
          <div className="flex md:items-center md:flex-row flex-col gap-5">
            <div className="dropdown ">
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
                <ul className="!min-w-[200px]">
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
                            <span className="ltr:ml-2 rtl:mr-2">
                              {col?.title}
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
          <DataTableSkeleton rows={5} />
        ) : (
          Array.isArray(recordsData) && (
            <div className="datatables">
              <DataTable
                pinLastColumn
                highlightOnHover
                className="whitespace-nowrap table-hover"
                records={recordsData}
                onRowClick={({ record }) => {
                  setSelectedSale(record);
                  setModal17(true);
                }}
                columns={cols?.map((col) => ({
                  ...col,
                  hidden: hideCols.includes(col.accessor),
                }))}
                totalRecords={initialRecords.length}
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

      <LeadDetailsModal
        isOpen={modal18}
        onClose={() => setModal18(false)}
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
          leadMutation.mutate(combinedValues);
        }}
        user={user}
        userOptions={usersData || []}

      />


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
                <Dialog.Panel className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0  text-black dark:text-white-dark">
                  <button
                    type="button"
                    className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                    onClick={() => setModal17(false)}
                  >
                    <IconX />
                  </button>
                  {/* <h3 className="text-xl py-7 mb-5 font-semibold text-black dark:text-white-light"></h3> */}
                  <h2 className="text-xl font-extrabold uppercase !leading-snug text-primary md:text-2xl">
                    Sales Detail
                  </h2>
                  <div className="datatables">
                    <Formik
                      initialValues={{
                        id: selectedSale?._id || '',
                        amount: selectedSale?.amount || '',
                        services: selectedSale?.services || '',  // If packageName is part of selectedSale
                        saleType: selectedSale?.saleType || '',  // If saleType is part of selectedSale
                        salesPerson: selectedSale?.salesPerson,  // If salesPerson is part of selectedSale
                        date: selectedSale?.date || '',  // If date is part of selectedSale
                        saleDescription: selectedSale?.saleDescription || '',
                      }}
                      onSubmit={(values) => {
                        const combinedValues = {
                          lead: selectedSale?.lead?._id,
                          ...values,
                          comments: values?.comments && values.comments.trim() ? [
                            ...(selectedSale?.comments || []),
                            {
                              text: values.comments,
                              postedBy: user?._id,
                            },
                          ] : (selectedSale?.comments || []),
                        };
                        mutation.mutate(combinedValues);
                      }}
                    >
                      {({ values, setFieldValue }) => (


                        <Form
                          style={{
                            maxWidth: 600,
                          }}
                          className="mx-auto"
                        >
                          <div className="flex w-full xl:flex-row md:flex-col md:gap-0 fl:gap-0 sm:gap-0 flex-col xl:gap-3 fl:flex-col sm:flex-col">
                            <div className="w-full mb-2">
                              <label htmlFor="amount">Amount</label>
                              <Field
                                id="amount"
                                name="amount"
                                className="form-input"
                                placeholder="Enter Sale Amount"
                              />
                              <ErrorMessage
                                name="amount"
                                component="div"
                                className="text-red-500"
                              />
                            </div>
                          </div>
                          <div className="w-full mb-2">
                            <label htmlFor="services">Services</label>
                            <Field name="services">
                              {({ field, form }) => (
                                <Select
                                  isMulti
                                  options={Services.map((service) => ({ value: service, label: service }))} // Convert string array to objects
                                  placeholder="Select Services"
                                  className="form-select mb-2 flex-1 !border-none p-0"
                                  value={field.value?.map((service) => ({ value: service, label: service })) || []} // Convert selected values back to objects
                                  onChange={(selectedOptions) => {
                                    form.setFieldValue(
                                      "services",
                                      selectedOptions.map((option) => option.value) // Store only string values in form
                                    );
                                  }}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="services"
                              component="div"
                              className="text-red-500"
                            />
                          </div>
                          <div className="w-full mb-2">
                            <label htmlFor="saleType">Sale Type</label>
                            <Field
                              as="select"
                              id="saleType"
                              name="saleType"
                              className="form-select"
                              onChange={(e) =>
                                setFieldValue("saleType", e.target.value)
                              }
                            >
                              <option value="" disabled selected hidden>
                                Select Sale Type
                              </option>
                              {[
                                { item: "Front Sell", value: "frontSell" },
                                { item: "Up Sell", value: "upSell" },
                                { item: "Cross Sell", value: "crossSell" },
                              ].map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.item}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage
                              name="saleType"
                              component="div"
                              className="text-red-500"
                            />
                          </div>
                          <div>
                            <label htmlFor="saleDescription">Sale Description</label>
                            <Field
                              as="textarea"
                              name="saleDescription"
                              className="form-textarea protected-content"
                              rows="3"
                            />
                          </div>

                          <div className="w-full mb-2">
                            <label htmlFor="date">Date</label>
                            <Flatpickr
                              name="date"
                              placeholder="Select the Date"
                              options={{ dateFormat: "Y-m-d", position: "auto left" }}
                              className="form-input"
                              value={values.date}
                              onChange={(selectedDate) => {
                                setFieldValue("date", selectedDate[0]);  // Update Formik's state with the selected date
                              }}
                            />
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
                          <div className="flex justify-center items-center">
                            <button
                              disabled={mutation.isPending}
                              type="submit"
                              className="btn btn-primary !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                            >
                              {mutation.isPending && (
                                <span className="animate-spin border-2  border-primary border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle "></span>
                              )}
                              Update Sale
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                    <div>
                      {selectedSale?.comments?.length > 0 &&
                        selectedSale?.comments
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
      </Transition >

      <DeleteModals
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onDelete={() => deleteMutation.mutate()}
      />
    </div >
  );
}

export default SalesTable;

// const randomColor = () => {
//     const color = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];
//     const random = Math.floor(Math.random() * color.length);
//     return color[random];
// };

// const randomStatus = () => {
//     const status = ['PAID', 'APPROVED', 'FAILED', 'CANCEL', 'SUCCESS', 'PENDING', 'COMPLETE'];
//     const random = Math.floor(Math.random() * status.length);
//     return status[random];
// };


// <Transition appear show={modal17} as={Fragment}>
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
//           <Dialog.Panel className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0  text-black dark:text-white-dark">
//             <button
//               type="button"
//               className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
//               onClick={() => setModal17(false)}
//             >
//               <IconX />
//             </button>
//             {/* <h3 className="text-xl py-7 mb-5 font-semibold text-black dark:text-white-light"></h3> */}
//             <h2 className="text-xl font-extrabold uppercase !leading-snug text-primary md:text-2xl">
//               Sales Detail
//             </h2>
//             <div className="datatables">





//             </div>
//           </Dialog.Panel>
//         </Transition.Child>
//       </div>
//     </div >
//   </Dialog >
// </Transition >




//  <div className="border mb-2 px-5 py-3 rounded-xl ">
//                           <label className="font-semibold mb-3 text-primary text-xl">Assigned To</label>
//                           <FieldArray name="assignedTo" className="bg-red-900">
//                             {({ push, remove, form }) => (
//                               <div className="space-y-4">

//                                 {values.assignedTo.map((assignee, index) => (
//                                   < div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end relative" >
//                                     {/* User */}
//                                     {
//                                       values.assignedTo.length > 1 && (
//                                         <button
//                                           type="button"
//                                           onClick={() => remove(index)}
//                                           className="absolute -top-3 right-2 text-red-600 hover:text-red-800"
//                                           title="Remove this service"
//                                         >
//                                           <IconX />
//                                         </button>
//                                       )
//                                     }
//                                     < div >
//                                       <label>User</label>
//                                       <Select
//                                         options={userOptions}
//                                         placeholder="Select User"
//                                         className="form-select !border-none p-0"
//                                         value={userOptions.find(opt => opt.value === assignee.user)}
//                                         onChange={(option) =>
//                                           form.setFieldValue(`assignedTo[${index}].user`, option.value)
//                                         }
//                                       />
//                                     </div>

//                                     {/* Role */}
//                                     <div>
//                                       <label>Role</label>
//                                       <Field as="select" name={`assignedTo[${index}].role`} className="form-input">
//                                         <option value="" disabled>Select Role</option>
//                                         <option value="frontSales">Front Sales</option>
//                                         <option value="upsell">Upsell</option>
//                                         <option value="projectManager">Project Manager</option>
//                                       </Field>
//                                     </div>

//                                     {/* Status */}
//                                     <div>
//                                       <label>Status</label>
//                                       <Field as="select" name={`assignedTo[${index}].status`} className="form-input">
//                                         <option disabled value="" label="Select Status" selected hidden />
//                                         <option value="New">New</option>
//                                         <option value="Lost">Lost</option>
//                                         <option value="FollowUp">Follow Up</option>
//                                         <option value="Converted">Converted</option>
//                                         <option value="Qualified">Qualified</option>
//                                         <option value="Contacted">Contacted</option>
//                                         <option value="Invalid">Invalid</option>
//                                       </Field>
//                                     </div>
//                                   </div>
//                                 ))}
//                                 {/* {assignee?.status === "FollowUp" && (
//                                   <div className="form-group mb-2 flex-1">
//                                     <label htmlFor="followUpEndDate">Follow-Up End Date</label>
//                                     <Flatpickr
//                                       name="followUpEndDate"
//                                       value={selectedLead?.followUp?.endDate}
//                                       placeholder="Select Follow-Up End Date"
//                                       options={{ dateFormat: "Y-m-d", position: "auto left" }}
//                                       className="form-input"
//                                       onChange={(selectedDate) => {
//                                         setFieldValue("followUpEndDate", selectedDate[0]);
//                                       }}
//                                     />
//                                   </div>
//                                 )} */}
//                                 <button
//                                   type="button"
//                                   className="btn btn-outline-primary mt-2"
//                                   onClick={() =>
//                                     push({
//                                       user: "",
//                                       role: "",
//                                       status: "New",
//                                     })
//                                   }
//                                 >
//                                   Add Assignee
//                                 </button>
//                               </div>
//                             )}
//                           </FieldArray>
//                         </div>








// ???////////////////////////////////

// <Transition appear show={modal18} as={Fragment}>
//       <Dialog as="div" open={modal18} onClose={() => setModal18(false)}>
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0" />
//         </Transition.Child>
//         <div
//           id="standard_modal"
//           className="fixed inset-0 bg-[black]/90 z-[999] overflow-y-auto"
//         >
//           <div className="flex min-h-screen items-start justify-center px-4">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 scale-95"
//               enterTo="opacity-100 scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-95"
//             >
//               <Dialog.Panel className="panel my-8 w-full lg:max-w-4xl overflow-hidden rounded-lg border-0  text-black dark:text-white-dark">
//                 <button
//                   type="button"
//                   className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
//                   onClick={() => setModal18(false)}
//                 >
//                   <IconX />
//                 </button>
//                 {/* <h3 className="text-xl py-7 mb-5 font-semibold text-black dark:text-white-light"></h3> */}
//                 <h2 className="text-xl font-extrabold uppercase !leading-snug text-primary md:text-2xl">
//                   Lead Details
//                 </h2>
//                 <div className="datatables">

//                   <Formik
//                     initialValues={{
//                       id: selectedLead?._id,
//                       name: selectedLead?.userName || '',
//                       email: selectedLead?.userEmail || '',
//                       phone: selectedLead?.userPhone || '',
//                       message: selectedLead?.message || '',
//                       date: selectedLead?.date,
//                       // followUpEndDate: selectedLead?.followUp?.endDate,
//                       leadType: selectedLead?.leadType,
//                       source: selectedLead?.source,
//                       companyName: selectedLead?.companyName || '',
//                       status: selectedLead?.status || '',
//                       fullPageUrl: selectedLead?.fullPageUrl || '',
//                       ipInfo: selectedLead?.ipInfo || {},
//                       // assignedTo: selectedLead?.assignedTo?.map(user => user?._id) || [],
//                       // assignedTo: selectedLead?.assignedTo?.map(assignee => ({
//                       //   user: assignee.user?._id || assignee?._id, // to support older entries
//                       //   role: assignee.role || "",
//                       //   status: assignee.status || "New",
//                       //   followUpEndDate: assignee.followUpEndDate || null,
//                       // })) || [],
//                       assignedTo:
//                         selectedLead?.assignedTo?.length > 0
//                           ? selectedLead.assignedTo.map((assignee) => ({
//                             user: assignee.user,
//                             role: assignee.role || "",
//                             status: assignee.status || "New",
//                             followUpEndDate: assignee.followUp?.endDate || null, // ✅ FIXED LINE
//                             assignedAt: assignee.assignedAt,
//                             updatedAt: assignee.updatedAt,
//                           }))
//                           : [
//                             {
//                               user: "",
//                               role: "",
//                               status: "New",
//                               followUpEndDate: null,
//                             },
//                           ],
//                     }}
//                     onSubmit={(values) => {
//                       const filteredAssignedTo = values.assignedTo.filter(
//                         (a) => a.user && a.role // only include filled ones
//                       );
//                       const combinedValues = {
//                         source: values?.source,
//                         leadType: values?.leadType,
//                         assignedTo: filteredAssignedTo,
//                         // projectManager: values.projectManager,
//                         // status: values?.status,
//                         date: values?.date,
//                         // followUpEndDate: values?.followUpEndDate,
//                         comments: values?.comments && values.comments.trim() ? [
//                           ...(selectedLead?.comments || []),
//                           {
//                             text: values.comments,
//                             postedBy: user?._id,
//                           },
//                         ] : (selectedLead?.comments || []),
//                       };
//                       console.log("values", combinedValues)
//                       leadMutation.mutate(combinedValues);
//                     }}
//                   >
//                     {({ values, setFieldValue }) => (
//                       <Form className="space-y-5">
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

//                           <div>
//                             <label htmlFor="name">Name</label>
//                             <Field
//                               type="text"
//                               name="name"
//                               className="form-input protected-content"
//                               disabled
//                             />
//                           </div>
//                           {user?.role !== "ppc" && (
//                             <>
//                               <div>
//                                 <label htmlFor="email">Email</label>
//                                 <Field
//                                   type="email"
//                                   name="email"
//                                   className="form-input "
//                                   disabled
//                                 />
//                               </div>
//                               <div>
//                                 <label htmlFor="phone">Phone</label>
//                                 <Field
//                                   type="text"
//                                   name="phone"
//                                   className="form-input protected-content"
//                                   disabled
//                                 />
//                               </div>
//                             </>
//                           )}
//                           <div>
//                             <label htmlFor="companyName">Brand Name</label>
//                             <Field
//                               type="text"
//                               name="companyName"
//                               className="form-input protected-content"
//                               disabled
//                             />
//                           </div>
//                           <div className="">
//                             <label htmlFor="date">Date</label>
//                             <Flatpickr
//                               name="date"
//                               value={selectedLead?.date}
//                               placeholder="Select the Date"
//                               options={{ dateFormat: "Y-m-d", position: "auto left" }}
//                               className="form-input"
//                               onChange={(selectedDate) => {
//                                 setFieldValue("date", selectedDate[0]);
//                               }}

//                             />
//                           </div>
//                           <div className="" >
//                             <label htmlFor="fullPageUrl">Full Page URL</label>
//                             <Field
//                               type="text"
//                               name="fullPageUrl"
//                               className="form-input protected-content"
//                               disabled
//                             />
//                           </div>

//                         </div>

//                         <div>
//                           <label htmlFor="message">Message/Subject</label>
//                           <Field
//                             as="textarea"
//                             name="message"
//                             className="form-textarea protected-content"
//                             rows="3"
//                             disabled
//                           />
//                         </div>

//                         {values.ipInfo && Object.keys(values.ipInfo).length > 0 && (
//                           <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
//                             <h4 className="font-semibold mb-3 text-primary text-xl">IP Information</h4>
//                             <div className="grid grid-cols-2 gap-4 protected-content">
//                               <div>
//                                 <label>IP Address</label>
//                                 <div className="text-sm">{values.ipInfo?.ip}</div>
//                               </div>
//                               <div>
//                                 <label>Location</label>
//                                 <div className="text-sm">{`${values.ipInfo?.city || ''}, ${values.ipInfo?.region || ''}, ${values.ipInfo?.country || ''}`}</div>
//                               </div>
//                               <div>
//                                 <label>Postal Code</label>
//                                 <div className="text-sm">{values.ipInfo?.postal}</div>
//                               </div>
//                               <div>
//                                 <label>Timezone</label>
//                                 <div className="text-sm">{values.ipInfo?.timezone}</div>
//                               </div>
//                               <div>
//                                 <label>Organization</label>
//                                 <div className="text-sm">{values.ipInfo?.org}</div>
//                               </div>
//                             </div>
//                           </div>
//                         )}

//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                           <div className="form-group mb-2 flex-1">
//                             <label htmlFor="leadType">Select Type</label>
//                             <Field as="select" name="leadType" className="form-input">
//                               <option value="" disabled selected hidden>
//                                 Select Lead Type
//                               </option>
//                               <option value="chat">Chat</option>
//                               <option value="signUp">SignUp</option>
//                               <option value="inbound">Inbound</option>
//                               <option value="social">Social</option>
//                               <option value="referral">Referral</option>
//                               <option value="cold">Cold</option>
//                             </Field>
//                             <ErrorMessage
//                               name="leadType"
//                               component="div"
//                               className="text-red-600"
//                             />
//                           </div>
//                           <div className="form-group mb-2 flex-1">
//                             <label htmlFor="source">Select Source</label>
//                             <Field as="select" name="source" className="form-input">
//                               <option disabled value="" label="Select Source" selected hidden />
//                               <option value="ppc">PPC</option>
//                               <option value="smm">SSM</option>
//                               <option value="referral">Referral</option>
//                               <option value="cold">Cold</option>
//                             </Field>
//                             <ErrorMessage
//                               name="source"
//                               component="div"
//                               className="text-red-600"
//                             />
//                           </div>
//                           <div className="form-group mb-2 flex-1">
//                             <label htmlFor="status">Select Status</label>
//                             <Field
//                               as="select"

//                               name="status"
//                               className="form-input"
//                             >
//                               <option disabled value="" label="Select Status" selected hidden />
//                               <option value="New">New</option>
//                               <option value="Lost">Lost</option>
//                               <option value="FollowUp">Follow Up</option>
//                               <option value="Converted">Converted</option>
//                               <option value="Qualified">Qualified</option>
//                               <option value="Contacted">Contacted</option>
//                               <option value="Invalid">Invalid</option>
//                             </Field>
//                             <ErrorMessage
//                               name="status"
//                               component="div"
//                               className="text-red-600"
//                             />
//                           </div>

//                         </div>

//                         <div className="">
//                           <div className="border mb-2 px-5 py-3 rounded-xl">
//                             <div className="flex justify-between items-center mb-2">
//                               <label className="font-semibold text-primary text-xl">Assigned To</label>
//                             </div>
//                             <FieldArray name="assignedTo">
//                               {({ push, remove, form }) => (
//                                 <div className="space-y-4">
//                                   {values.assignedTo.map((assignee, index) => (
//                                     <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 relative border p-4 rounded-md bg-gray-50">
//                                       {/* {!assignee.assignedAt && ( */}
//                                       <button
//                                         type="button"
//                                         onClick={() => remove(index)}
//                                         className="absolute top-2 right-2  text-red-600 hover:text-red-800"
//                                         title="Remove this assignee"
//                                       >
//                                         <IconXCircle />
//                                       </button>
//                                       {/* )} */}
//                                       {/* <button
//                                         type="button"
//                                         className="absolute top-2 right-9 "
//                                         onClick={() => toggleEditMode(index)}
//                                       >
//                                         {assignedToEditMode[index] ? "Cancel" : <IconEdit />}
//                                       </button> */}
//                                       <div>
//                                         <label>User</label>
//                                         <Field
//                                           as="select"
//                                           name={`assignedTo[${index}].user`}
//                                           className="form-input"
//                                           value={assignee.user}
//                                         >
//                                           <option value="" disabled hidden>
//                                             Select User
//                                           </option>
//                                           {userOptions.map((option) => (
//                                             <option key={option.value} value={option.value}>
//                                               {option.label}
//                                             </option>
//                                           ))}
//                                         </Field>
//                                       </div>
//                                       <div>
//                                         <label>Role</label>
//                                         <Field
//                                           as="select"
//                                           name={`assignedTo[${index}].role`}
//                                           className="form-input"
//                                         >
//                                           <option value="">Select Role</option>
//                                           <option value="frontSales">Front Sales</option>
//                                           <option value="upsell">Upsell</option>
//                                           <option value="projectManager">Project Manager</option>
//                                         </Field>
//                                       </div>
//                                       <div>
//                                         <label>Status</label>
//                                         <Field
//                                           as="select"
//                                           name={`assignedTo[${index}].status`}
//                                           className="form-input"
//                                         >
//                                           <option value="">Select Status</option>
//                                           <option value="New">New</option>
//                                           <option value="Lost">Lost</option>
//                                           <option value="FollowUp">Follow Up</option>
//                                           <option value="Converted">Converted</option>
//                                           <option value="Qualified">Qualified</option>
//                                           <option value="Contacted">Contacted</option>
//                                           <option value="Invalid">Invalid</option>
//                                         </Field>
//                                       </div>
//                                       {assignee.status === "FollowUp" && (
//                                         <div>
//                                           <label>Follow-Up End Date</label>
//                                           <Flatpickr
//                                             name={`assignedTo[${index}].followUpEndDate`}
//                                             value={assignee.followUpEndDate}
//                                             options={{ dateFormat: "Y-m-d", position: "auto left" }}
//                                             className="form-input"
//                                             onChange={(selectedDate) =>
//                                               form.setFieldValue(`assignedTo[${index}].followUpEndDate`, selectedDate[0])
//                                             }
//                                           />
//                                         </div>
//                                       )}
//                                       {assignee.assignedAt && (
//                                         <div className="col-span-full text-xs text-gray-500">
//                                           Assigned At: {new Date(assignee.assignedAt).toLocaleString()}<br />
//                                           Last Updated: {assignee.updatedAt ? new Date(assignee.updatedAt).toLocaleString() : "-"}
//                                         </div>
//                                       )}
//                                     </div>
//                                   ))}
//                                   <button
//                                     type="button"
//                                     className="btn btn-outline-primary mt-2"
//                                     onClick={() =>
//                                       push({
//                                         user: "",
//                                         role: "",
//                                         status: "New",
//                                         followUpEndDate: null,
//                                       })
//                                     }
//                                   >
//                                     Add Assignee
//                                   </button>
//                                 </div>
//                               )}
//                             </FieldArray>
//                           </div>
//                         </div>

//                         <div className="form-group flex-1">
//                           <label htmlFor="comments">Comments</label>
//                           <Field
//                             as="textarea"
//                             rows="4"
//                             name="comments"
//                             type="text"
//                             className="form-input"
//                             placeholder="Write comments here... "
//                           />
//                           <ErrorMessage
//                             name="comments"
//                             component="div"
//                             className="text-red-500"
//                           />
//                         </div>

//                         <button
//                           type="submit"
//                           className="btn btn-primary"
//                         >
//                           Update Lead
//                         </button>
//                       </Form>
//                     )}
//                   </Formik>

//                   <div>
//                     {selectedLead?.comments?.length > 0 &&
//                       selectedLead?.comments
//                         ?.slice()
//                         .sort(
//                           (a, b) =>
//                             new Date(b.createdAt) - new Date(a.createdAt)
//                         )
//                         .map((item, index) => (
//                           <article
//                             key={index}
//                             className="p-6 text-base bg-white border-t border-gray-200 dark:border-gray-700 dark:bg-gray-900"
//                           >
//                             <footer className="flex justify-between items-center mb-2">
//                               <div className="flex items-center">
//                                 <p className=" capitalize inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
//                                   {item?.postedBy?.profileImageUrl ? (
//                                     <img
//                                       className="mr-2 w-6 h-6 rounded-full"
//                                       src={item.postedBy?.profileImageUrl}
//                                       alt={item?.postedBy?.userName}
//                                     />
//                                   ) : (
//                                     <div className="text-sm  mr-2 w-6 h-6 rounded-full flex items-center justify-center bg-gray-200 text-gray-700">
//                                       {item?.postedBy?.userName
//                                         ? item?.postedBy?.userName
//                                           .charAt(0)
//                                           .toUpperCase()
//                                         : ""}
//                                     </div>
//                                   )}

//                                   {item?.postedBy?.userName}
//                                 </p>
//                                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                                   {new Date(
//                                     item.createdAt
//                                   ).toLocaleDateString()}
//                                 </p>
//                               </div>
//                             </footer>
//                             <p className="text-gray-500 dark:text-gray-400">
//                               {item?.text}
//                             </p>
//                           </article>
//                         ))}
//                   </div>
//                 </div>
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </div >
//       </Dialog >
//     </Transition >