import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import MonthlySaleTable from "../../components/DataTables/SalesByMonth";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LeadById, updateLead } from "../../api/leadsApi";
import { getSalesByClient } from "../../api/salesApi";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { getAllUsers } from "../../api/userApi";
import Dropdown from "../../components/Dropdown";
import IconCaretDown from "../../components/Icon/IconCaretDown";
import { getInvoiceId } from "../../api/invoiceApi";
import { DataTable } from "mantine-datatable";
import { sortBy } from "lodash";
import Tippy from "@tippyjs/react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "../../components/InvoicePdf";
import IconDownload from "../../components/Icon/IconDownload";
import IconXCircle from "../../components/Icon/IconXCircle";
import { coloredToast } from "../../components/Alerts/SimpleAlert";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";

export default function ClientselectedLeads() {
  const queryClient = useQueryClient();
  const { id: id } = useParams();

  const { user } = useSelector((state) => state.user);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [hideCols, setHideCols] = useState([]);
  const [recordsData, setRecordsData] = useState([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: 'createdAt',
    direction: 'desc',
  });
  const navigate = useNavigate();
  const isDark = useSelector(
    (state) =>
      state.themeConfig.theme === "dark" || state.themeConfig.isDarkMode
  );
  const isRtl =
    useSelector((state) => state.themeConfig.rtlClass) === "rtl" ? true : false;

  const {
    isLoading: usersLoading,
    data: usersData,
    status: usersStatus,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const {
    isLoading: salesLoading,
    data: salesData,
    status: salesStatus,
  } = useQuery({
    queryKey: ["clientSales", id],
    queryFn: () => getSalesByClient(id),
  });
  const {
    isLoading: invoiceLoading,
    data: invoiceData,
    status: invoiceStatus,
  } = useQuery({
    queryKey: ['invoiceById'],
    queryFn: () => getInvoiceId(id),
  });

  useEffect(() => {
    if (invoiceData?.invoices) {
      const filteredInvoices = invoiceData.invoices
      const sortedInvoices = sortBy(filteredInvoices, sortStatus.columnAccessor);
      setRecordsData(sortStatus.direction === 'desc' ? sortedInvoices.reverse() : sortedInvoices);
    }
  }, [sortStatus, invoiceData]);

  const {
    isLoading,
    data: leadsData,
    status,
  } = useQuery({
    queryKey: ["leadById"],
    queryFn: () => LeadById(id),
  });

  useEffect(() => {
    if (leadsData?.lead) {
      setSelectedLead(leadsData?.lead);
    }
  }, [leadsData]);

  const userOptions =
    Array.isArray(usersData?.users)
      ? usersData?.users
        .filter((item) => item.role !== "admin" && item.role !== "ppc")
        .map((item) => ({
          value: item._id,
          label: item.userName,
        }))
      : [];

  const cols = [
    { accessor: 'customer.userName', title: 'Name' },
    { accessor: 'customer.userEmail', title: 'Email' },
    { accessor: 'totalAmount', title: 'Amount' },
    { accessor: 'customer.companyName', title: 'Brand' },
    { accessor: 'paymentStatus', title: 'Payment Status' },
    { accessor: 'code', title: 'Card Code' },
    { accessor: 'creditCard', title: 'Cr.' },
    { accessor: 'issuer', title: 'Issuer' },
    { accessor: 'expiryDate', title: 'Card Expiry' },
  ];

  const mutation = useMutation({
    mutationKey: ["updateLead"],
    mutationFn: (data) => updateLead(data, selectedLead?._id),
    onSuccess: (response) => {
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

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <div
            onClick={() => navigate(-1)}
            className="cursor-pointer text-primary hover:underline"
          >
            All Clients
          </div>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>{selectedLead?.userName}</span>
        </li>
      </ul>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pt-5">
        <div className="panel h-full  ">
          <div className="flex items-center justify-between dark:text-white-light mb-5">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Client</h5>
          </div>
          <div>
            <div className="bg-white dark:bg-[#1c232f] rounded-md overflow-hidden text-center shadow relative" >
              <div className="bg-white dark:bg-[#1c232f] rounded-md overflow-hidden text-center shadow relative">
                <div
                  className="bg-white/40 rounded-t-md bg-center bg-cover p-6 pb-0 bg-"
                  style={{
                    backgroundImage: `url('/assets/images/notification-bg.png')`,
                    backgroundRepeat: 'no-repeat',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <img className="object-contain w-4/5 max-h-40 mx-auto" src={`https://res.cloudinary.com/ddvtgfqgv/image/upload/v1691059545/member-profile/avatar_aoyxl6.webp`} alt="contact_image" />
                </div>
                <div className="px-6 pb-24 -mt-10 relative">
                  <div className="shadow-md bg-white dark:bg-gray-900 rounded-md px-2 py-4">
                    <div className="text-xl">{selectedLead?.userName}</div>
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-4 ltr:text-left rtl:text-right">
                    <div className="flex items-center">
                      <div className="flex-none ltr:mr-2 rtl:ml-2">Email :</div>
                      <div className="truncate text-white-dark protected-content">{selectedLead?.userEmail}</div>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-4 ltr:text-left rtl:text-right">
                    <div className="flex items-center">
                      <div className="flex-none ltr:mr-2 rtl:ml-2">Phone :</div>
                      <div className="truncate text-white-dark protected-content">{selectedLead?.userPhone}</div>
                    </div>
                  </div>
                  {/* <div className="mt-6 grid grid-cols-1 gap-4 ltr:text-left rtl:text-right">
                    <div className="flex items-center">
                      <div className="flex-none ltr:mr-2 rtl:ml-2">Credit Card No. :</div>
                      <div className="truncate text-white-dark protected-content">{selectedLead?.last4Digits ? `**** **** **** ${selectedLead.last4Digits}` : ""}</div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 h-full ">
          <MonthlySaleTable
            isLoading={salesLoading}
            salesData={salesData}
            selectedMonth={selectedMonth}
          />
        </div>
      </div>


      {user.role == "admin" && (
        <div className="panel ">
          <div className="flex md:items-center md:flex-row md:justify-between flex-col mb-5 gap-5">
            <h5 className="font-semibold text-lg dark:text-white-light uppercase">Invoices</h5>
            <div className="flex md:items-center md:flex-row flex-col gap-5">
              <div className="dropdown">
                <Dropdown
                  placement={`${isRtl ? 'bottom-end' : 'bottom-start'}`}
                  btnClassName="!flex items-center border font-semibold border-white-light dark:border-[#253b5c] rounded-md px-4 py-2 text-sm dark:bg-[#1b2e4b] dark:text-white-dark"
                  button={
                    <>
                      <span className="ltr:mr-1 rtl:ml-1">Columns</span>
                      <IconCaretDown className="w-5 h-5" />
                    </>
                  }
                >
                  <ul className="!min-w-[200px]">
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
                                  const isChecked = event.target.checked;
                                  const accessor = col.accessor;

                                  setHideCols((prev) =>
                                    isChecked
                                      ? prev.filter((item) => item !== accessor) // show column
                                      : [...prev, accessor] // hide column
                                  );

                                  showHideColumns(accessor, isChecked);
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
            </div>
          </div>
          {Array.isArray(recordsData) && (
            <div className="datatables">
              <DataTable
                pinLastColumn
                fetching={isLoading}
                loaderBackgroundBlur={true}
                highlightOnHover
                className="whitespace-nowrap table-hover"
                records={recordsData}
                columns={[
                  {
                    accessor: 'invoiceNumber',
                    title: 'Invoice Number',
                    sortable: true,
                    hidden: hideCols.includes('invoiceNumber'),
                  },
                  {
                    accessor: 'customer.userName',
                    title: 'User Name',
                    sortable: true,
                    hidden: hideCols.includes('customer.userName'),
                  },
                  {
                    accessor: 'customer.userEmail',
                    title: 'User Email',
                    sortable: true,
                    hidden: hideCols.includes('customer.userEmail'),
                  },
                  {
                    accessor: 'totalAmount',
                    title: 'Amount',
                    sortable: true,
                    hidden: hideCols.includes('totalAmount'),
                  },
                  {
                    accessor: 'customer.companyName',
                    title: 'Brand',
                    sortable: true,
                    hidden: hideCols.includes('customer.companyName'),
                  },
                  // {
                  //   accessor: 'paymentStatus',
                  //   title: 'Payment Status',
                  //   sortable: true,
                  //   hidden: hideCols.includes('paymentStatus'),
                  // },
                  {
                    accessor: "paymentStatus",
                    title: "Payment Status",
                    sortable: true,
                    hidden: hideCols.includes("paymentStatus"),
                    render: (value) => (
                      <span className={`badge bg-${value.paymentStatus === "Pending" ? "danger" : "success"}`}>
                        {value.paymentStatus}
                      </span>
                    ),
                  },
                  {
                    accessor: 'paidFrom.last4Digits',
                    title: 'CR.',
                    sortable: true,
                    hidden: hideCols.includes('creditCard'),
                  },
                  {
                    accessor: 'paidFrom.issuer',
                    title: 'Issuer',
                    sortable: true,
                    hidden: hideCols.includes('issuer'),
                  },
                  {
                    accessor: 'paidFrom.expiry',
                    title: 'Card Expiry',
                    sortable: true,
                    hidden: hideCols.includes('expiryDate'),
                  },
                  {
                    accessor: 'paidFrom.code',
                    title: 'Card Code',
                    sortable: true,
                    hidden: hideCols.includes('code'),
                  },
                  {
                    accessor: 'action',
                    title: 'Action',
                    titleClassName: '!text-center',
                    render: (data) => (
                      <div className="flex items-center w-max mx-auto gap-2 justify-center">
                        <Tippy content="Dwonload Invoice">
                          <span>
                            <PDFDownloadLink
                              document={<InvoicePDF invoiceData={data} />}
                              fileName={`invoice-${data?.invoiceNumber}.pdf`}
                              style={{ textDecoration: 'none', color: '#333' }}
                            >
                              {({ loading }) =>
                                loading ? 'Loading...' : (
                                  <button>
                                    <IconDownload />
                                  </button>
                                )
                              }
                            </PDFDownloadLink>
                          </span>
                        </Tippy>
                      </div>
                    ),
                  },
                ]}
                totalRecords={recordsData?.length}
                recordsPerPage={pageSize}
                page={page}
                onPageChange={(p) => setPage(p)}
                recordsPerPageOptions={PAGE_SIZES}
                onRecordsPerPageChange={setPageSize}
                sortStatus={sortStatus}
                onSortStatusChange={setSortStatus}
                minHeight={200}
                paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}

              />
            </div>
          )}
        </div>
      )}


      <div className="panel mt-5">
        <div className="" >
          {/* <h3 className="text-xl py-7 mb-5 font-semibold text-black dark:text-white-light"></h3> */}

          <div className="datatables grid grid-cols-1 md:grid-cols-2 gap-5 ">
            {selectedLead ? (
              <>
                <Formik
                  initialValues={{
                    id: selectedLead?._id || '',
                    name: selectedLead?.userName || '',
                    email: selectedLead?.userEmail || '',
                    phone: selectedLead?.userPhone || '',
                    message: selectedLead?.message || '',
                    website: selectedLead?.website || '',
                    companyName: selectedLead?.companyName || '',
                    status: selectedLead?.status || '',
                    fullPageUrl: selectedLead?.fullPageUrl || '',
                    ipInfo: selectedLead?.ipInfo || {},
                    assigned:
                      selectedLead?.assigned?.length > 0
                        ? selectedLead?.assigned?.map((assignee) => ({
                          user: assignee?.user?._id,
                          role: assignee.role || "",
                          status: assignee.status || "New",
                          followUpEndDate: assignee.followUp?.endDate || null, // ✅ FIXED LINE
                          assignedAt: assignee.assignedAt,
                          updatedAt: assignee.updatedAt,
                        }))
                        : [
                          {
                            user: "",
                            role: "",
                            status: "New",
                            followUpEndDate: null,
                          },
                        ],
                  }}
                  onSubmit={(values) => {
                    const filteredAssignedTo = values.assigned.filter((a) => a.user && a.role);
                    const combinedValues = {
                      status: values?.status,
                      source: values?.source,
                      leadType: values?.leadType,
                      assigned: filteredAssignedTo,
                      date: values?.date,
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
                  {({ values }) => (
                    <Form className="space-y-5 ">
                      <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                        Client Details
                      </div>
                      <div className="grid grid-cols-2  gap-4 ">
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
                          <label htmlFor="companyName">Company Name</label>
                          <Field
                            type="text"
                            name="companyName"
                            className="form-input protected-content"
                            disabled
                          />
                        </div>
                      </div>


                      <div>
                        <label htmlFor="fullPageUrl">Full Page URL</label>
                        <Field
                          type="text"
                          name="fullPageUrl"
                          className="form-input protected-content"
                          disabled
                        />
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
                            <option value="Invalid">Invalid</option>
                            <option value="Contacted">Contacted</option>
                          </Field>
                          <ErrorMessage
                            name="status"
                            component="div"
                            className="text-red-600"
                          />
                        </div>
                      </div>
                      <div className="">
                        <div className="border mb-2 px-5 py-3 rounded-xl">
                          <div className="flex justify-between items-center mb-2">
                            <label className="font-semibold text-primary text-xl">Assigned To</label>
                          </div>
                          <FieldArray name="assigned">
                            {({ push, remove, form }) => (
                              <div className="space-y-4">
                                {values.assigned.map((assignee, index) => (
                                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 relative border p-4 rounded-md bg-gray-50">
                                    {/* {!assignee.assignedAt && ( */}
                                    <button
                                      type="button"
                                      onClick={() => remove(index)}
                                      className="absolute top-2 right-2  text-red-600 hover:text-red-800"
                                      title="Remove this assignee"
                                    >
                                      <IconXCircle />
                                    </button>

                                    <div>
                                      <label>User</label>
                                      <Field
                                        as="select"
                                        name={`assigned[${index}].user`}
                                        className="form-input"
                                        value={assignee.user}
                                      >
                                        <option value="" disabled hidden>
                                          Select User
                                        </option>
                                        {userOptions.map((option) => (
                                          <option key={option.value} value={option.value}>
                                            {option.label}
                                          </option>
                                        ))}
                                      </Field>
                                    </div>
                                    <div>
                                      <label>Role</label>
                                      <Field
                                        as="select"
                                        name={`assigned[${index}].role`}
                                        className="form-input"
                                      >
                                        <option value="">Select Role</option>
                                        <option value="frontsell">Front Sell</option>
                                        <option value="upsell">Upsell</option>
                                        <option value="projectManager">Project Manager</option>
                                      </Field>
                                    </div>
                                    <div>
                                      <label>Status</label>
                                      <Field
                                        as="select"
                                        name={`assigned[${index}].status`}
                                        className="form-input"
                                      >
                                        <option value="">Select Status</option>
                                        <option value="New">New</option>
                                        <option value="Lost">Lost</option>
                                        <option value="FollowUp">Follow Up</option>
                                        <option value="Converted">Converted</option>
                                        <option value="Qualified">Qualified</option>
                                        <option value="Contacted">Contacted</option>
                                        <option value="Invalid">Invalid</option>
                                      </Field>
                                    </div>
                                    {assignee.status === "FollowUp" && (
                                      <div>
                                        <label>Follow-Up End Date</label>
                                        <Flatpickr
                                          name={`assigned[${index}].followUpEndDate`}
                                          value={assignee.followUpEndDate}
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
                                        Assigned At: {new Date(assignee.assignedAt).toLocaleString()}<br />
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
                                      role: "",
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
                  <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                    Comments
                  </div>
                  {selectedLead?.comments?.length > 0 ?
                    (selectedLead?.comments
                      ?.slice()
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt) - new Date(a.createdAt)
                      )
                      ?.map((item, index) => (
                        <article
                          key={index}
                          class="p-6 text-base bg-white border-t border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                        >
                          <footer class="flex justify-between items-center mb-2">
                            <div class="flex items-center">
                              <p class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                                {item?.postedBy?.profileImageUrl ? (
                                  <img
                                    class="mr-2 w-6 h-6 rounded-full"
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
                              <p class="text-sm text-gray-600 dark:text-gray-400">
                                {new Date(
                                  item?.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </footer>
                          <p class="text-gray-500 dark:text-gray-400">
                            {item?.text}
                          </p>
                        </article>
                      ))) : (
                      <div className="flex justify-center items-center py-5" >No Comments...</div>
                    )}
                </div>
              </>
            ) : (
              <div>Loading...</div>
            )}


          </div>


        </div>
      </div>
    </div>
  );
}

