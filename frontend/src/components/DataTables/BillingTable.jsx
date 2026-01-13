// import { DataTable } from 'mantine-datatable';
// import { useState, Fragment, useEffect, useCallback } from 'react';
// import sortBy from 'lodash/sortBy';
// import Tippy from '@tippyjs/react';
// import 'tippy.js/dist/tippy.css';
// import { useSelector } from 'react-redux';
// import IconEye from '../Icon/IconEye';
// import { Dialog, Transition } from '@headlessui/react';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import Dropdown from '../Dropdown';
// import IconCaretDown from '../Icon/IconCaretDown';
// import IconBarChart from '../Icon/IconBarChart';
// import IconTrashLines from '../Icon/IconTrashLines';
// import IconDownload from '../Icon/IconDownload';
// import { createInstallmentApi, getAllInvoices, invoiceEmailApi, invoiceApi, deleteInvoice, updateInvoice, getInvoices } from '../../api/invoiceApi';
// import IconSend from '../Icon/IconSend';
// import IconX from '../Icon/IconX';
// import { ErrorMessage, Field, Form, Formik } from "formik";
// import * as Yup from "yup";
// import { coloredToast } from '../Alerts/SimpleAlert';
// import IconCopy from '../Icon/IconCopy';
// import DeleteModals from '../DeleteModals/DeleteModals';
// import useDeleteMutation from '../DeleteModals/DeleteMutation';
// // import InvoicePDF from '../updatedInvoicepdf';
// // import { PDFDownloadLink } from '@react-pdf/renderer';
// import { addSales, updateSales } from '../../api/salesApi';
// import Select from "react-select";
// import { getAllMembers, getAllUsers } from '../../api/userApi';
// import InvoiceModal from '../Modals/InvoiceModal';
// import Flatpickr from "react-flatpickr";
// import "flatpickr/dist/flatpickr.css";
// import { useLocation } from 'react-router-dom';
// // import debounce from 'lodash.debounce';


// const MemoizedPDFDownloadLink = memo(({ invoiceData, invoiceNumber, isLoading, isPDFReady, handleGeneratePDF }) => {
//     return (
//         <Tippy content="Download Invoice">
//             <span>
//                 {isPDFReady ? (
//                     <PDFDownloadLink
//                         document={<InvoicePDF invoiceData={invoiceData} />}
//                         fileName={`invoice-${invoiceNumber}.pdf`}
//                         style={{ textDecoration: 'none', color: '#333' }}
//                     >
//                         {({ loading }) =>
//                             loading ? (
//                                 <button disabled>
//                                     <span className="animate-spin">
//                                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                             <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 strokeWidth={2}
//                                                 d="M12 4v1m0 14v1m8.66-9h-1M4.34 12h-1m15.36 5.36l-.7-.7M6.34 6.34l-.7-.7m12.02 12.02l-.7-.7M6.34 17.66l-.7-.7"
//                                             />
//                                         </svg>
//                                     </span>
//                                 </button>
//                             ) : (
//                                 <button>
//                                     <IconDownload />
//                                 </button>
//                             )
//                         }
//                     </PDFDownloadLink>
//                 ) : (
//                     <button
//                         onClick={() => handleGeneratePDF(invoiceData._id)}
//                         disabled={isLoading}
//                         className={isLoading ? "opacity-50 cursor-not-allowed" : ""}
//                     >
//                         {isLoading ? (
//                             <span className="animate-spin">
//                                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         strokeWidth={2}
//                                         d="M12 4v1m0 14v1m8.66-9h-1M4.34 12h-1m15.36 5.36l-.7-.7M6.34 6.34l-.7-.7m12.02 12.02l-.7-.7M6.34 17.66l-.7-.7"
//                                     />
//                                 </svg>
//                             </span>
//                         ) : (
//                             <IconDownload />
//                         )}
//                     </button>
//                 )}
//             </span>
//         </Tippy>
//     );
// }, (prevProps, nextProps) => {
//     return (
//         prevProps.invoiceData._id === nextProps.invoiceData._id &&
//         prevProps.isLoading === nextProps.isLoading &&
//         prevProps.isPDFReady === nextProps.isPDFReady
//     );
// });


// function BillingTable() {
//     const queryClient = useQueryClient()
//     const location = useLocation();
//     const [page, setPage] = useState(1);
//     const PAGE_SIZES = [10, 20, 30, 50, 100];
//     const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
//     const [addInvoiceModal, setAddInvoiceModal] = useState(false);
//     const [initialRecords, setInitialRecords] = useState([]);
//     const [recordsData, setRecordsData] = useState([]);
//     const [modal17, setModal17] = useState(false);
//     const [selectedInvoice, setSelectedInvoice] = useState("");
//     const [search, setSearch] = useState('');
//     const [hideCols, setHideCols] = useState(['project.projectType', 'status']);
//     const [sendingId, setSendingId] = useState(null);
//     const [editInvoiceModal, setEditInvoiceModal] = useState(false);
//     // const [showInvoiceModal, setShowInvoiceModal] = useState(false);
//     const [statusFilter, setStatusFilter] = useState('all');
//     const [editInvoiceData, setEditInvoiceData] = useState(null);
//     const [isPDFReady, setIsPDFReady] = useState(false);
//     const [loadingPDFs, setLoadingPDFs] = useState(new Set());
//     const [readyPDFs, setReadyPDFs] = useState(new Set());
//     const [sortStatus, setSortStatus] = useState({
//         columnAccessor: 'createdAt',
//         direction: 'desc',
//     });
//     const isRtl = useSelector((state) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
//     const { user } = useSelector((state) => state.user);
//     const {
//         isLoading,
//         data: invoiceData,
//         status,
//     } = useQuery({
//         queryKey: ['invoices'],
//         // queryFn: user?.role !== 'admin' && user?.role !== 'superAdmin' ? getInvoices : getAllInvoices,
//         queryFn: getAllInvoices,
//     });

//     const {
//         isLoading: usersLoading,
//         data: usersData,
//         status: usersStatus,
//     } = useQuery({
//         queryKey: ["memebers"],
//         queryFn: getAllMembers,
//     });
//     // useEffect(() => {
//     //     if (invoiceData?.invoices) {
//     //         const sortedInvoices = sortBy(invoiceData.invoices, sortStatus.columnAccessor);
//     //         setInitialRecords(sortedInvoices);
//     //         setRecordsData(sortedInvoices);
//     //     }
//     // }, [invoiceData]);


//     useEffect(() => {
//         const params = new URLSearchParams(location.search);
//         const status = params.get("status"); // Pending / Paid / null
//         if (status === "pending" || status === "paid") {
//             setStatusFilter(status);
//         } else {
//             setStatusFilter("all");
//         }
//     }, [location.search]);

//     useEffect(() => {
//         setPage(1);
//     }, [pageSize]);

//     useEffect(() => {
//         const from = (page - 1) * pageSize;
//         const to = from + pageSize;
//         setRecordsData(initialRecords.slice(from, to));
//     }, [page, pageSize, initialRecords]);

//     // useEffect(() => {
//     //     if (invoiceData?.invoices) {
//     //         const filteredInvoices = invoiceData.invoices.filter((item) => {
//     //             return (
//     //                 item?.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
//     //                 item?.customer?.userEmail.toLowerCase().includes(search.toLowerCase()) ||
//     //                 item?.totalAmount.toString().toLowerCase().includes(search.toLowerCase())
//     //             );
//     //         });
//     //         const sortedInvoices = sortBy(filteredInvoices, sortStatus.columnAccessor);
//     //         setInitialRecords(sortStatus.direction === 'desc' ? sortedInvoices.reverse() : sortedInvoices);
//     //         setPage(1);
//     //     }
//     // }, [search, sortStatus, invoiceData]);


//     useEffect(() => {
//         if (invoiceData?.invoices) {
//             const filteredInvoices = invoiceData.invoices.filter((item) => {
//                 const matchesSearch =
//                     item?.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
//                     item?.salesPerson?.userName?.toLowerCase().includes(search.toLowerCase()) ||
//                     item?.customer?.userName?.toLowerCase().includes(search.toLowerCase()) ||
//                     item?.customer?.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
//                     item?.totalAmount?.toString()?.toLowerCase().includes(search.toLowerCase());
//                 const normalizedStatus = item?.paymentStatus?.toLowerCase()?.trim(); // "pending" / "paid"
//                 const matchesStatus = statusFilter === 'all' ? true : normalizedStatus === statusFilter;

//                 return matchesSearch && matchesStatus;
//             });

//             const sortedInvoices = sortBy(filteredInvoices, sortStatus.columnAccessor);
//             setInitialRecords(sortStatus.direction === 'desc' ? sortedInvoices.reverse() : sortedInvoices);
//             setPage(1);
//         }
//     }, [search, sortStatus, invoiceData, statusFilter]); // <-- statusFilter add


//     const showHideColumns = (col, value) => {
//         if (hideCols.includes(col)) {
//             setHideCols((col) => hideCols.filter((d) => d !== col));
//         } else {
//             setHideCols([...hideCols, col]);
//         }
//     };
//     const formatDate = (date) => {
//         if (date) {
//             const dt = new Date(date);
//             const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
//             const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
//             return day + '/' + month + '/' + dt.getFullYear();
//         }
//         return '';
//     };
//     const cols = [
//         { accessor: 'invoiceNumber', title: 'Invoice Number' },
//         { accessor: 'sales.salesPerson', title: 'Sale' },
//         { accessor: 'customer.userName', title: 'Name' },
//         { accessor: 'customer.userEmail', title: 'Email' },
//         { accessor: 'totalAmount', title: 'Amount' },
//         { accessor: 'Brand', title: 'Brand' },
//         { accessor: 'createdAt', title: 'Created At' },
//         { accessor: 'paymentStatus', title: 'Payment Status' },
//         // { accessor: 'status', title: 'Status' },
//     ];
//     const validationSchema = Yup.object({
//         // lead: Yup.string().required(),
//         amount: Yup.string().required("Please Enter Sale Amount!"),
//         services: Yup.array().required("Please Select Services!"),
//         salesPerson: Yup.string().required("Please select Sales Person!"),
//         saleType: Yup.string().required("Please select Sales Person!"),
//         saleDescription: Yup.string().required("Please Add Sale Description!"),
//         saleAgreement: Yup.mixed().optional(),
//     });
//     const installmentSchema = Yup.object().shape({
//         amount: Yup.number().required("Amount is required").positive(),
//         dueDate: Yup.date().required("Due Date is required"),
//         note: Yup.string(),
//     });

//     const { mutate, isSubmitting } = useMutation({
//         mutationFn: createInstallmentApi,
//         onSuccess: (data) => {
//             toast.success("Installment created");
//             setModal17(false);
//         },
//         onError: () => {
//             toast.error("Something went wrong");
//         },
//     });
//     const { mutate: addSaleMutation } = useMutation({
//         mutationKey: ["addSales"],
//         mutationFn: addSales,
//         onSuccess: (response) => {
//             coloredToast(
//                 "success",
//                 "Sale Added Successfully !",
//                 "top",
//                 null,
//                 null,
//                 15000
//             );
//             setModal17(false);
//             queryClient.invalidateQueries(['invoices']);
//         },
//         onError: (error) => {
//             console.log(error);
//             coloredToast("danger", error?.response?.data?.message, "top");
//         },
//     });
//     const { mutate: updateSaleMutation } = useMutation({
//         mutationKey: ["updateSale"],
//         mutationFn: (data) => updateSales(data, editInvoiceData?.sale?._id),
//         onSuccess: (response) => {
//             setModal17(false);
//             queryClient.invalidateQueries(['invoices']);
//             coloredToast(
//                 "success",
//                 "Sale Updated Successfully !",
//                 "top",
//                 null,
//                 null,
//                 15000
//             );
//         },
//         onError: (error) => {
//             coloredToast("danger", error?.response?.data?.message, "top");
//         },
//     });
//     const { mutate: updateInvoiceMutate, isInvoiceUpdating } = useMutation({
//         mutationFn: ({ id, data }) => updateInvoice(id, data),
//         onSuccess: () => {
//             coloredToast('success', 'Invoice updated successfully', 'top');
//             setEditInvoiceModal(false);
//             queryClient.invalidateQueries(['invoices']);
//         },
//         onError: () => {
//             coloredToast('danger', 'Failed to update invoice', 'top');
//         },
//     });

//     const { mutate: invoiceMutation, isInvoiceSubmitting } = useMutation({
//         mutationKey: ["addInvoice"],
//         mutationFn: invoiceApi,
//         onSuccess: (response) => {
//             coloredToast("success", "Invoice created successfully", "top");
//             // setInitialRecords((prev) => [response?.invoice, ...prev]);
//             setAddInvoiceModal(false)
//             queryClient.invalidateQueries(['invoices'], { refetchType: 'Inactive' });
//         },
//         onError: () => {
//             toast.error("Something went wrong");
//         },
//     });

//     const { mutate: senMailmutate } = useMutation({
//         mutationFn: (invoice) => invoiceEmailApi(invoice?._id),
//         onMutate: (invoice) => {
//             setSendingId(invoice._id);
//         },
//         onSuccess: (data) => {
//             coloredToast(
//                 "success",
//                 data.message,
//                 "top",
//                 null,
//                 null,
//                 1000
//             );
//             setSendingId(null);
//         },
//         onError: (error) => {
//             coloredToast("danger", error?.response?.data?.message, "top");
//             setSendingId(null);
//         },
//     });
//     const { deleteMutation, modalOpen, setModalOpen, setSelectedId } =
//         useDeleteMutation({
//             mutationFn: deleteInvoice,
//             successMessage: "Invoice has been deleted successfully",
//             queryKey: "invoices",
//         });
//     const handleDeleteClick = (e, id) => {
//         e.stopPropagation();
//         setSelectedId(id);
//         setModalOpen(true);
//     };
//     const Services = [
//         "Book Cover Design",
//         "Book Writing",
//         "Book Publishing",
//         "Book Printing",
//         "Book Marketing",
//         "Audiobook Production",
//         "Website Design",
//         "Website Development",
//         "SEO",
//         "Social Media Marketing",
//         "Google Ads",
//         "Branding & Logo Design",
//         "UI/UX Design",
//         "Content Writing",
//         "Video Editing",
//         "Software Maintenance"
//     ];


//     const editInvoiceSubmit = (values) => {
//         const calculatedTotal = values.services.reduce((acc, s) => {
//             return acc + (Number(s.unitPrice || 0) * Number(s.quantity || 0));
//         }, 0);
//         const finalValues = {
//             ...values,
//             totalAmount: calculatedTotal,
//         };
//         // console.log("finalValues", finalValues);
//         // invoiceMutation(finalValues);
//         updateInvoiceMutate({ id: editInvoiceData._id, data: finalValues });
//     }
//     const handleSubmit = (values) => {
//         const calculatedTotal = values.services.reduce((acc, s) => {
//             return acc + (Number(s.unitPrice || 0) * Number(s.quantity || 0));
//         }, 0);
//         const finalValues = {
//             ...values,
//             totalAmount: calculatedTotal,
//         };
//         // console.log("finalValues", finalValues);
//         invoiceMutation(finalValues);
//     }

//     const handleGeneratePDF = useCallback((invoiceId) => {
//         if (readyPDFs.has(invoiceId)) return; // Already ready

//         setLoadingPDFs((prev) => new Set([...prev, invoiceId]));

//         // Simulate PDF generation delay
//         setTimeout(() => {
//             setLoadingPDFs((prev) => {
//                 const newSet = new Set(prev);
//                 newSet.delete(invoiceId);
//                 return newSet;
//             });
//             setReadyPDFs((prev) => new Set([...prev, invoiceId]));
//         }, 1000);
//     }, []);

//     const userOptions =
//         Array.isArray(usersData?.allUsers)
//             ? usersData?.allUsers
//                 .filter((item) => item.role !== "admin" && item.role !== "ppc")
//                 .map((item) => ({
//                     value: item._id,
//                     label: item.userName,
//                 }))
//             : [];
//     return (
//         <div className="md:col-span-3 sm:col-span-12">
//             <div className="">
//                 <div className="flex md:items-center md:flex-row md:justify-between flex-col mb-5 gap-5">
//                     <h1 className="screenHeading">Invoices</h1>
//                     <div className="flex md:items-center md:flex-row flex-col gap-5">
//                         <div className="dropdown">
//                             <Dropdown
//                                 placement={`${isRtl ? 'bottom-end' : 'bottom-start'}`}
//                                 btnClassName="!flex items-center border font-semibold border-white-light dark:border-[#253b5c] rounded-md px-4 py-2 text-sm dark:bg-[#1b2e4b] dark:text-white-dark"
//                                 button={
//                                     <>
//                                         <span className="ltr:mr-1 rtl:ml-1">Columns</span>
//                                         <IconCaretDown className="w-5 h-5" />
//                                     </>
//                                 }
//                             >
//                                 <ul className="!min-w-[140px]">
//                                     {cols.map((col, i) => {
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
//                                                                 showHideColumns(col.accessor, event.target.checked);
//                                                             }}
//                                                         />
//                                                         <span className="ltr:ml-2 rtl:mr-2">{col.title}</span>
//                                                     </label>
//                                                 </div>
//                                             </li>
//                                         );
//                                     })}
//                                 </ul>
//                             </Dropdown>
//                         </div>
//                         {/* <div className="text-right">
//                             <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
//                         </div> */}


//                         <div className="flex gap-2 items-center">
//                             <input
//                                 type="text"
//                                 className="form-input w-auto"
//                                 placeholder="Search..."
//                                 value={search}
//                                 onChange={(e) => setSearch(e.target.value)}
//                             />
//                             <select
//                                 className="form-select w-auto"
//                                 value={statusFilter}
//                                 onChange={(e) => {
//                                     setStatusFilter(e.target.value);
//                                     setPage(1);
//                                 }}
//                             >
//                                 <option value="all">All</option>
//                                 <option value="pending">Pending</option>
//                                 <option value="paid">Paid</option>
//                             </select>
//                             <button
//                                 className="btn btn-primary"
//                                 onClick={() => setAddInvoiceModal(true)}
//                             >
//                                 + Add
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//                 {Array.isArray(recordsData) && (
//                     <div className="datatables">
//                         <DataTable
//                             pinLastColumn
//                             fetching={isLoading}
//                             loaderBackgroundBlur={true}
//                             highlightOnHover
//                             className="whitespace-nowrap table-hover"
//                             records={recordsData}
//                             columns={[
//                                 {
//                                     accessor: 'invoiceNumber',
//                                     title: 'Invoice Number',
//                                     sortable: true,
//                                     hidden: hideCols.includes('invoiceNumber'),
//                                 },
//                                 {
//                                     accessor: "salesPerson.userName",
//                                     title: "Sales Person",
//                                     sortable: true,
//                                     hidden: hideCols.includes("salesPerson.userName"),
//                                 },
//                                 {
//                                     accessor: "sales.sale",
//                                     title: "Sale",
//                                     sortable: true,
//                                     hidden: hideCols.includes("sales.sale"),
//                                     render: (data) => (
//                                         <button
//                                             onClick={(e) => {
//                                                 e.stopPropagation();
//                                                 setEditInvoiceData(data);
//                                                 setModal17(true);
//                                             }}
//                                             className="text-primary underline hover:text-primary-700"
//                                         >
//                                             {data?.sale?.salesPerson?.userName}
//                                         </button>
//                                     ),
//                                 },
//                                 {
//                                     accessor: 'customer.userName',
//                                     title: 'Client Name',
//                                     sortable: true,
//                                     hidden: hideCols.includes('customer.userName'),
//                                 },
//                                 {
//                                     accessor: 'customer.userEmail',
//                                     title: 'Client Email',
//                                     sortable: true,
//                                     hidden: hideCols.includes('customer.userEmail'),
//                                     render: ({ customer }) => {
//                                         const userEmail = customer?.userEmail
//                                         return (
//                                             <a href={`mailto:${userEmail}`} onClick={(e) => {
//                                                 e.stopPropagation();
//                                             }} className="w-max group hover:underline">
//                                                 {user?.role === "admin" ? (
//                                                     userEmail
//                                                 ) : (
//                                                     <div className="">
//                                                         <span>{userEmail}</span>
//                                                         {/* <span>{userEmail?.slice(0, 6)}</span> */}
//                                                         {/* <span className="blur-sm group-hover:blur-none select-none">{userEmail?.slice(4)}</span> */}
//                                                     </div>
//                                                 )}
//                                             </a>
//                                         )
//                                     }
//                                 },
//                                 {
//                                     accessor: 'totalAmount',
//                                     title: 'Amount',
//                                     sortable: true,
//                                     hidden: hideCols.includes('totalAmount'),
//                                 },
//                                 {
//                                     accessor: "Brand",
//                                     title: "Brand",
//                                     sortable: true,
//                                     hidden: hideCols.includes("Brand"),
//                                     render: (data) => (
//                                         <div className="flex items-center w-max">
//                                             {data?.companyName || data?.customer?.companyName}
//                                         </div>
//                                     ),
//                                 },
//                                 {
//                                     accessor: "CreatedAt",
//                                     title: "Created At",
//                                     sortable: true,
//                                     hidden: hideCols.includes("CreatedAt"),
//                                     render: (data) => (
//                                         <div className="flex items-center w-max">
//                                             {data?.createdAt ? formatDate(data?.createdAt) : ''}
//                                         </div>
//                                     ),
//                                 },
//                                 {
//                                     accessor: "paymentStatus",
//                                     title: "Payment Status",
//                                     sortable: true,
//                                     hidden: hideCols.includes("paymentStatus"),
//                                     render: (value) => (
//                                         <span className={`badge bg-${value.paymentStatus === "Pending" ? "danger" : "success"}`}>
//                                             {value.paymentStatus}
//                                         </span>
//                                     ),
//                                 },
//                                 {
//                                     accessor: 'action',
//                                     title: 'Action',
//                                     titleClassName: '!text-center',
//                                     render: (data) => {
//                                         const isLoading = loadingPDFs.has(data._id);
//                                         const isPDFReady = readyPDFs.has(data._id);
//                                         return (
//                                             <div className="flex items-center w-max mx-auto gap-2 justify-center">

//                                                 <Tippy content="Copy Payment Link">
//                                                     <div
//                                                         className="cursor-pointer"
//                                                         // onClick={() => {
//                                                         //     const paymentLink = `https://billing.bellevuepublishers.com/payment/${data._id}`;
//                                                         //     navigator.clipboard.writeText(paymentLink);
//                                                         //     coloredToast("success", "payment link copied!", "top");
//                                                         // }}
//                                                         onClick={() => {
//                                                             const company = data?.companyName || data.customer?.companyName || '';
//                                                             const baseDomain = company.toLowerCase().replace(/\s+/g, '');
//                                                             const paymentLink = `https://billing.${baseDomain}.com/payment/${data._id}`;
//                                                             navigator.clipboard.writeText(paymentLink);
//                                                             coloredToast("success", "payment link copied!", "top");
//                                                         }}
//                                                     >
//                                                         <IconCopy />
//                                                     </div>
//                                                 </Tippy>
//                                                 {!data?.sale && data?.paymentStatus === "Paid" && (
//                                                     <Tippy content="Add Sale">
//                                                         <button onClick={() => {
//                                                             setEditInvoiceData(data);
//                                                             setModal17(true);
//                                                         }}>
//                                                             <IconBarChart />
//                                                         </button>
//                                                     </Tippy>
//                                                 )}
//                                                 {/* <Tippy content="Dwonload Invoice">
//                                                     <span>
//                                                         {isPDFReady ? (
//                                                             <PDFDownloadLink
//                                                                 document={<InvoicePDF invoiceData={data} />}
//                                                                 fileName={`invoice-${data?.invoiceNumber}.pdf`}
//                                                                 style={{ textDecoration: 'none', color: '#333' }}
//                                                             >
//                                                                 {({ loading }) =>
//                                                                     loading ? 'Loading...' : (
//                                                                         <button>
//                                                                             <IconDownload />
//                                                                         </button>
//                                                                     )
//                                                                 }
//                                                             </PDFDownloadLink>
//                                                         ) : (
//                                                             <button onClick={() => handleGeneratePDF(data._id)}>
//                                                                 <IconDownload />
//                                                             </button>
//                                                         )}
//                                                     </span>
//                                                 </Tippy> */}
//                                                 <Tippy content="Download Invoice">
//                                                     <span>
//                                                         {isPDFReady ? (
//                                                             // <PDFDownloadLink
//                                                             //     document={<InvoicePDF invoiceData={data} />}
//                                                             //     fileName={`invoice-${data?.invoiceNumber}.pdf`}
//                                                             //     style={{ textDecoration: 'none', color: '#333' }}
//                                                             // >
//                                                             //     {({ loading }) =>
//                                                             //         loading ? (
//                                                             //             <button disabled>
//                                                             //                 <span className="animate-spin">
//                                                             //                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                             //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m0 14v1m8.66-9h-1M4.34 12h-1m15.36 5.36l-.7-.7M6.34 6.34l-.7-.7m12.02 12.02l-.7-.7M6.34 17.66l-.7-.7" />
//                                                             //                     </svg>
//                                                             //                 </span>
//                                                             //             </button>
//                                                             //         ) : (
//                                                             //             <button>
//                                                             //                 <IconDownload />
//                                                             //             </button>
//                                                             //         )
//                                                             //     }
//                                                             // </PDFDownloadLink>

//                                                             <MemoizedPDFDownloadLink
//                                                                 invoiceData={data}
//                                                                 invoiceNumber={data?.invoiceNumber}
//                                                                 isLoading={loadingPDFs.has(data._id)}
//                                                                 isPDFReady={readyPDFs.has(data._id)}
//                                                                 handleGeneratePDF={handleGeneratePDF}
//                                                             />
//                                                         ) : (
//                                                             <button
//                                                                 onClick={() => handleGeneratePDF(data._id)}
//                                                                 disabled={isLoading}
//                                                                 className={isLoading ? "opacity-50 cursor-not-allowed" : ""}
//                                                             >
//                                                                 {isLoading ? (
//                                                                     <span className="animate-spin">
//                                                                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m0 14v1m8.66-9h-1M4.34 12h-1m15.36 5.36l-.7-.7M6.34 6.34l-.7-.7m12.02 12.02l-.7-.7M6.34 17.66l-.7-.7" />
//                                                                         </svg>
//                                                                     </span>
//                                                                 ) : (
//                                                                     <IconDownload />
//                                                                 )}
//                                                             </button>
//                                                         )}
//                                                     </span>
//                                                 </Tippy>
//                                                 <Tippy content="Edit Invoice">
//                                                     <button
//                                                         onClick={() => {
//                                                             setEditInvoiceData(data);
//                                                             setEditInvoiceModal(true);
//                                                         }}
//                                                     >
//                                                         <IconEye /> {/* Replace with pencil icon if needed */}
//                                                     </button>
//                                                 </Tippy>
//                                                 {
//                                                     data?.paymentStatus === "Pending" && (
//                                                         <Tippy content="Send Invoice Email">
//                                                             <div
//                                                                 onClick={() => sendingId !== data._id && senMailmutate(data)}
//                                                                 className="cursor-pointer"
//                                                             >
//                                                                 {sendingId === data._id ? (
//                                                                     <span className="animate-spin text-blue-500">
//                                                                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                                             <path
//                                                                                 strokeLinecap="round"
//                                                                                 strokeLinejoin="round"
//                                                                                 strokeWidth={2}
//                                                                                 d="M12 4v1m0 14v1m8.66-9h-1M4.34 12h-1m15.36 5.36l-.7-.7M6.34 6.34l-.7-.7m12.02 12.02l-.7-.7M6.34 17.66l-.7-.7"
//                                                                             />
//                                                                         </svg>
//                                                                     </span>
//                                                                 ) : (
//                                                                     <IconSend />
//                                                                 )}
//                                                             </div>
//                                                         </Tippy>
//                                                     )
//                                                 }
//                                                 <Tippy content="Delete Invoice">
//                                                     <button onClick={(e) => handleDeleteClick(e, data?._id)}>
//                                                         <IconTrashLines className="text-danger hover:text-red-900" />
//                                                     </button>
//                                                 </Tippy>

//                                             </div>
//                                         )
//                                     }
//                                 },
//                             ]}
//                             totalRecords={initialRecords.length}
//                             recordsPerPage={pageSize}
//                             page={page}
//                             onPageChange={(p) => setPage(p)}
//                             recordsPerPageOptions={PAGE_SIZES}
//                             onRecordsPerPageChange={setPageSize}
//                             sortStatus={sortStatus}
//                             onSortStatusChange={setSortStatus}
//                             minHeight={200}
//                             paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
//                         />
//                     </div>
//                 )}
//             </div>

//             <Transition appear show={modal17} as={Fragment}>
//                 <Dialog as="div" open={modal17} onClose={() => setModal17(false)}>
//                     <div className="modalDiv1">
//                         <div className="modalDiv2">
//                             <Dialog.Panel className="dialogDiv1">
//                                 <div className="dialogDiv2 ">
//                                     <button
//                                         type="button"
//                                         className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
//                                         onClick={() => setModal17(false)}
//                                     >
//                                         <IconX />
//                                     </button>
//                                     <h5 className="modalTitle">Sales Details</h5>
//                                 </div>
//                                 <Formik
//                                     initialValues={{
//                                         amount: editInvoiceData?.sale?.amount || editInvoiceData?.totalAmount || '',
//                                         services: editInvoiceData?.sale?.services || editInvoiceData?.services?.map((s) => s.type) || [],
//                                         salesPerson: editInvoiceData?.sale?.salesPerson?._id || editInvoiceData?.salesPerson?._id,
//                                         saleDescription: editInvoiceData?.sale?.saleDescription,
//                                         saleType: editInvoiceData?.sale?.saleType || editInvoiceData?.saleType,
//                                         date: editInvoiceData?.sale?.date || new Date(),
//                                         saleAgreement: null,
//                                     }}
//                                     validationSchema={validationSchema}
//                                     onSubmit={(values) => {
//                                         const combinedValues = {
//                                             lead: editInvoiceData?.customer?._id,
//                                             invoice: editInvoiceData?._id,
//                                             ...values,
//                                             comments: values?.comments && values.comments.trim() ? [
//                                                 ...(editInvoiceData?.comments || []),
//                                                 {
//                                                     text: values.comments,
//                                                     postedBy: user?._id,
//                                                 },
//                                             ] : (editInvoiceData?.comments || []),
//                                         };
//                                         if (editInvoiceData?.sale?._id) {
//                                             updateSaleMutation({
//                                                 ...combinedValues,
//                                                 id: editInvoiceData.sale._id, // Pass sale ID if needed by update API
//                                             });
//                                         } else {
//                                             addSaleMutation(combinedValues);
//                                         }

//                                         // addSaleMutation(combinedValues);
//                                     }}
//                                 >
//                                     {({ values, setFieldValue }) => (


//                                         <Form
//                                             style={{
//                                                 maxWidth: 600,
//                                             }}
//                                             className="mx-auto space-y-4 py-4 px-6"
//                                         >
//                                             <div className="flex w-full xl:flex-row md:flex-col md:gap-0 fl:gap-0 sm:gap-0 flex-col xl:gap-3 fl:flex-col sm:flex-col">
//                                                 <div className="w-full mb-2">
//                                                     <label htmlFor="amount">Amount</label>
//                                                     <Field
//                                                         id="amount"
//                                                         name="amount"
//                                                         className="form-input"
//                                                         placeholder="Enter Sale Amount"
//                                                     />
//                                                     <ErrorMessage
//                                                         name="amount"
//                                                         component="div"
//                                                         className="text-red-500"
//                                                     />
//                                                 </div>
//                                                 <div className="w-full mb-2">
//                                                     <label htmlFor="saleType">Sale Type</label>
//                                                     <Field
//                                                         as="select"
//                                                         id="saleType"
//                                                         name="saleType"
//                                                         className="form-select"
//                                                         onChange={(e) =>
//                                                             setFieldValue("saleType", e.target.value)
//                                                         }
//                                                     >
//                                                         <option value="" disabled selected hidden>
//                                                             Select Sale Type
//                                                         </option>
//                                                         {[
//                                                             { item: "Front Sell", value: "frontSell" },
//                                                             { item: "Up Sell", value: "upSell" },
//                                                             { item: "Cross Sell", value: "crossSell" },
//                                                         ].map((option) => (
//                                                             <option key={option.value} value={option.value}>
//                                                                 {option.item}
//                                                             </option>
//                                                         ))}
//                                                     </Field>
//                                                     <ErrorMessage
//                                                         name="saleType"
//                                                         component="div"
//                                                         className="text-red-500"
//                                                     />
//                                                 </div>
//                                             </div>
//                                             <div className="w-full mb-2">
//                                                 <label htmlFor="services">Services</label>
//                                                 <Field name="services">
//                                                     {({ field, form }) => (
//                                                         <Select
//                                                             isMulti
//                                                             options={Services.map((service) => ({ value: service, label: service }))}
//                                                             placeholder="Select Services"
//                                                             className="form-select !mb-2 flex-1 !border-none !p-0"
//                                                             value={field.value?.map((service) => ({ value: service, label: service })) || []}
//                                                             onChange={(selectedOptions) => {
//                                                                 form.setFieldValue(
//                                                                     "services",
//                                                                     selectedOptions.map((option) => option.value)
//                                                                 );
//                                                             }}
//                                                         />
//                                                     )}
//                                                 </Field>
//                                                 <ErrorMessage
//                                                     name="services"
//                                                     component="div"
//                                                     className="text-red-500"
//                                                 />
//                                             </div>
//                                             <div className="flex w-full xl:flex-row md:flex-col md:gap-0 fl:gap-0 sm:gap-0 flex-col xl:gap-3 fl:flex-col sm:flex-col">
//                                                 <div className="w-full mb-2">
//                                                     <label htmlFor="salesPerson">Sales Person</label>
//                                                     <Field
//                                                         as="select"
//                                                         id="salesPerson"
//                                                         name="salesPerson"
//                                                         className="form-select"
//                                                         onChange={(e) =>
//                                                             setFieldValue("salesPerson", e.target.value)
//                                                         }
//                                                     >
//                                                         <option
//                                                             disabled
//                                                             value=""
//                                                             hidden
//                                                             selected
//                                                             label="Select Sales Person"
//                                                         />
//                                                         {Array.isArray(usersData?.teamMembers) &&
//                                                             usersData?.teamMembers
//                                                                 ?.filter((item) => item.role !== "admin" && item.role !== "ppc")
//                                                                 ?.map((item) => (
//                                                                     <option key={item?._id} value={item?._id}>
//                                                                         {item?.userName}
//                                                                     </option>
//                                                                 ))}
//                                                     </Field>
//                                                     <ErrorMessage
//                                                         name="salesPerson"
//                                                         component="div"
//                                                         className="text-red-500"
//                                                     />
//                                                 </div>
//                                                 <div className="w-full mb-2">
//                                                     <label htmlFor="date">Date</label>
//                                                     <Flatpickr
//                                                         name="date"
//                                                         placeholder="Select the Date"
//                                                         options={{ dateFormat: "Y-m-d", position: "auto left" }}
//                                                         className="form-input"
//                                                         value={values.date}
//                                                         onChange={(selectedDate) => {
//                                                             setFieldValue("date", selectedDate[0]);  // Update Formik's state with the selected date
//                                                         }}
//                                                     />
//                                                 </div>
//                                             </div>

//                                             <div>
//                                                 <label htmlFor="saleDescription">Sale Description</label>
//                                                 <Field
//                                                     as="textarea"
//                                                     name="saleDescription"
//                                                     className="form-textarea protected-content"
//                                                     rows="3"
//                                                 />
//                                                 <ErrorMessage
//                                                     name="saleDescription"
//                                                     component="div"
//                                                     className="text-red-500"
//                                                 />
//                                             </div>

//                                             <div className="form-group flex-1">
//                                                 <label htmlFor="comments">Comments</label>
//                                                 <Field
//                                                     as="textarea"
//                                                     rows="4"
//                                                     name="comments"
//                                                     type="text"
//                                                     className="form-input"
//                                                     placeholder="Write comments here... "
//                                                 />
//                                                 <ErrorMessage
//                                                     name="comments"
//                                                     component="div"
//                                                     className="text-red-500"
//                                                 />
//                                             </div>
//                                             <div className="flex justify-center items-center">
//                                                 <button
//                                                     disabled={addSaleMutation.isPending}
//                                                     type="submit"
//                                                     className="btn btn-primary !mt-2 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
//                                                 >
//                                                     {addSaleMutation.isPending && (
//                                                         <span className="animate-spin border-2  border-primary border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle "></span>
//                                                     )}
//                                                     Submit
//                                                 </button>
//                                             </div>
//                                         </Form>
//                                     )}
//                                 </Formik>
//                             </Dialog.Panel>
//                         </div>
//                     </div >
//                 </Dialog >
//             </Transition >

//             <InvoiceModal
//                 isOpen={addInvoiceModal}
//                 onClose={() => setAddInvoiceModal(false)}
//                 initialValues={{
//                     userName: "", userEmail: "",
//                     userPhone: "",
//                     companyName: "",
//                     salesPerson: "",
//                     saleType: "",
//                     totalAmount: '',
//                     billTo: {
//                         name: "",
//                         email: "",
//                     },
//                     services: [
//                         {
//                             type: '',
//                             unitPrice: '',
//                             quantity: 1,
//                             customDescription: '',
//                         }
//                     ],
//                 }}
//                 onSubmit={handleSubmit}
//                 usersData={usersData}
//                 mode="add" // or "edit" or "view"
//                 isSubmitting={isInvoiceSubmitting}
//             />

//             <InvoiceModal
//                 isOpen={editInvoiceModal}
//                 onClose={() => setEditInvoiceModal(false)}
//                 initialValues={{
//                     userName: editInvoiceData?.customer?.userName || '',
//                     userEmail: editInvoiceData?.customer?.userEmail || '',
//                     userPhone: editInvoiceData?.customer?.userPhone || '',
//                     companyName: editInvoiceData?.companyName || editInvoiceData?.customer?.companyName || '',
//                     saleType: editInvoiceData?.saleType,
//                     salesPerson: editInvoiceData?.salesPerson,
//                     billTo: {
//                         name: editInvoiceData?.billTo?.name || '',
//                         email: editInvoiceData?.billTo?.email || '',
//                     },
//                     services: editInvoiceData?.services || [
//                         { type: '', unitPrice: '', quantity: 1, customDescription: '' },
//                     ],
//                     paymentStatus: editInvoiceData?.paymentStatus || 'Pending',
//                 }}
//                 onSubmit={editInvoiceSubmit}
//                 usersData={usersData}
//                 mode="edit" // or "edit" or "view"
//                 isSubmitting={isInvoiceUpdating}
//             />

//             <DeleteModals
//                 isOpen={modalOpen}
//                 onClose={() => setModalOpen(false)}
//                 onDelete={() => deleteMutation.mutate()}
//             />
//         </div >
//     );
// }

// export default BillingTable;

// // const randomColor = () => {
// //     const color = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];
// //     const random = Math.floor(Math.random() * color.length);
// //     return color[random];
// // };

// // const randomStatus = () => {
// //     const status = ['PAID', 'APPROVED', 'FAILED', 'CANCEL', 'SUCCESS', 'PENDING', 'COMPLETE'];
// //     const random = Math.floor(Math.random() * status.length);
// //     return status[random];
// // };



import { DataTable } from 'mantine-datatable';
import { useState, Fragment, useEffect, useCallback } from 'react';
import sortBy from 'lodash/sortBy';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useSelector } from 'react-redux';
import IconEye from '../Icon/IconEye';
import { Dialog, Transition } from '@headlessui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Dropdown from '../Dropdown';
import IconCaretDown from '../Icon/IconCaretDown';
import IconBarChart from '../Icon/IconBarChart';
import IconTrashLines from '../Icon/IconTrashLines';
import IconDownload from '../Icon/IconDownload';
import { createInstallmentApi, getAllInvoices, invoiceEmailApi, invoiceApi, deleteInvoice, updateInvoice, getInvoices } from '../../api/invoiceApi';
import IconSend from '../Icon/IconSend';
import IconX from '../Icon/IconX';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { coloredToast } from '../Alerts/SimpleAlert';
import IconCopy from '../Icon/IconCopy';
import DeleteModals from '../DeleteModals/DeleteModals';
import useDeleteMutation from '../DeleteModals/DeleteMutation';
import InvoicePDF from '../updatedInvoicepdf';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { addSales, updateSales } from '../../api/salesApi';
import Select from 'react-select';
import { getAllMembers, getAllUsers } from '../../api/userApi';
import InvoiceModal from '../Modals/InvoiceModal';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { useLocation } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { memo } from 'react';

const MemoizedPDFDownloadLink = memo(({ invoiceData, invoiceNumber, isLoading, isPDFReady, handleGeneratePDF }) => {
    return (
        <Tippy content="Download Invoice">
            <span>
                {isPDFReady ? (
                    <PDFDownloadLink
                        document={<InvoicePDF invoiceData={invoiceData} />}
                        fileName={`invoice-${invoiceNumber}.pdf`}
                        style={{ textDecoration: 'none', color: '#333' }}
                    >
                        {({ loading }) =>
                            loading ? (
                                <button disabled>
                                    <span className="animate-spin">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 4v1m0 14v1m8.66-9h-1M4.34 12h-1m15.36 5.36l-.7-.7M6.34 6.34l-.7-.7m12.02 12.02l-.7-.7M6.34 17.66l-.7-.7"
                                            />
                                        </svg>
                                    </span>
                                </button>
                            ) : (
                                <button>
                                    <IconDownload />
                                </button>
                            )
                        }
                    </PDFDownloadLink>
                ) : (
                    <button
                        onClick={() => handleGeneratePDF(invoiceData._id)}
                        disabled={isLoading}
                        className={isLoading ? "opacity-50 cursor-not-allowed" : ""}
                    >
                        {isLoading ? (
                            <span className="animate-spin">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v1m0 14v1m8.66-9h-1M4.34 12h-1m15.36 5.36l-.7-.7M6.34 6.34l-.7-.7m12.02 12.02l-.7-.7M6.34 17.66l-.7-.7"
                                    />
                                </svg>
                            </span>
                        ) : (
                            <IconDownload />
                        )}
                    </button>
                )}
            </span>
        </Tippy>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.invoiceData._id === nextProps.invoiceData._id &&
        prevProps.isLoading === nextProps.isLoading &&
        prevProps.isPDFReady === nextProps.isPDFReady
    );
});

function BillingTable() {
    const queryClient = useQueryClient();
    const location = useLocation();
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [addInvoiceModal, setAddInvoiceModal] = useState(false);
    const [initialRecords, setInitialRecords] = useState([]);
    const [recordsData, setRecordsData] = useState([]);
    const [modal17, setModal17] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState('');
    const [search, setSearch] = useState('');
    const [hideCols, setHideCols] = useState(['project.projectType', 'status']);
    const [sendingId, setSendingId] = useState(null);
    const [editInvoiceModal, setEditInvoiceModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [editInvoiceData, setEditInvoiceData] = useState(null);
    const [loadingPDFs, setLoadingPDFs] = useState(new Set());
    const [readyPDFs, setReadyPDFs] = useState(new Set());
    const [sortStatus, setSortStatus] = useState({
        columnAccessor: 'createdAt',
        direction: 'desc',
    });
    const isRtl = useSelector((state) => state.themeConfig.rtlClass) === 'rtl';
    const { user } = useSelector((state) => state.user);
    const { isLoading, data: invoiceData } = useQuery({
        queryKey: ['invoices'],
        queryFn: getAllInvoices,
    });
    const { isLoading: usersLoading, data: usersData } = useQuery({
        queryKey: ['memebers'],
        queryFn: getAllMembers,
    });

    const debouncedSetSearch = useCallback(
        debounce((value) => {
            setSearch(value);
        }, 300),
        []
    );

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const status = params.get('status');
        if (status === 'pending' || status === 'paid') {
            setStatusFilter(status);
        } else {
            setStatusFilter('all');
        }
    }, [location.search]);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        if (invoiceData?.invoices) {
            const filteredInvoices = invoiceData.invoices.filter((item) => {
                const matchesSearch =
                    item?.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
                    item?.salesPerson?.userName?.toLowerCase().includes(search.toLowerCase()) ||
                    item?.customer?.userName?.toLowerCase().includes(search.toLowerCase()) ||
                    item?.customer?.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
                    item?.totalAmount?.toString()?.toLowerCase().includes(search.toLowerCase());
                const normalizedStatus = item?.paymentStatus?.toLowerCase()?.trim();
                const matchesStatus = statusFilter === 'all' ? true : normalizedStatus === statusFilter;

                return matchesSearch && matchesStatus;
            });

            const sortedInvoices = sortBy(filteredInvoices, sortStatus.columnAccessor);
            const finalRecords = sortStatus.direction === 'desc' ? sortedInvoices.reverse() : sortedInvoices;

            setInitialRecords((prev) => {
                if (JSON.stringify(prev) !== JSON.stringify(finalRecords)) {
                    return finalRecords;
                }
                return prev;
            });
            setPage(1);
        }
    }, [search, sortStatus, invoiceData, statusFilter]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        const newRecordsData = initialRecords.slice(from, to);

        setRecordsData((prev) => {
            if (JSON.stringify(prev) !== JSON.stringify(newRecordsData)) {
                return newRecordsData;
            }
            return prev;
        });
    }, [page, pageSize, initialRecords]);

    const showHideColumns = (col, value) => {
        if (hideCols.includes(col)) {
            setHideCols((prev) => prev.filter((d) => d !== col));
        } else {
            setHideCols((prev) => [...prev, col]);
        }
    };

    const formatDate = (date) => {
        if (date) {
            const dt = new Date(date);
            const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
            const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
            return day + '/' + month + '/' + dt.getFullYear();
        }
        return '';
    };

    const cols = [
        { accessor: 'invoiceNumber', title: 'Invoice Number' },
        { accessor: 'sales.salesPerson', title: 'Sale' },
        { accessor: 'customer.userName', title: 'Name' },
        { accessor: 'customer.userEmail', title: 'Email' },
        { accessor: 'totalAmount', title: 'Amount' },
        { accessor: 'Brand', title: 'Brand' },
        { accessor: 'createdAt', title: 'Created At' },
        { accessor: 'paymentStatus', title: 'Payment Status' },
    ];

    const validationSchema = Yup.object({
        amount: Yup.string().required('Please Enter Sale Amount!'),
        services: Yup.array().required('Please Select Services!'),
        salesPerson: Yup.string().required('Please select Sales Person!'),
        saleType: Yup.string().required('Please select Sales Person!'),
        saleDescription: Yup.string().required('Please Add Sale Description!'),
        saleAgreement: Yup.mixed().optional(),
    });

    const installmentSchema = Yup.object().shape({
        amount: Yup.number().required('Amount is required').positive(),
        dueDate: Yup.date().required('Due Date is required'),
        note: Yup.string(),
    });

    const { mutate, isSubmitting } = useMutation({
        mutationFn: createInstallmentApi,
        onSuccess: () => {
            toast.success('Installment created');
            setModal17(false);
        },
        onError: () => {
            toast.error('Something went wrong');
        },
    });

    const { mutate: addSaleMutation } = useMutation({
        mutationKey: ['addSales'],
        mutationFn: addSales,
        onSuccess: (response) => {
            coloredToast('success', 'Sale Added Successfully !', 'top', null, null, 15000);
            setModal17(false);
            queryClient.invalidateQueries(['invoices']);
        },
        onError: (error) => {
            coloredToast('danger', error?.response?.data?.message, 'top');
        },
    });

    const { mutate: updateSaleMutation } = useMutation({
        mutationKey: ['updateSale'],
        mutationFn: (data) => updateSales(data, editInvoiceData?.sale?._id),
        onSuccess: () => {
            setModal17(false);
            queryClient.invalidateQueries(['invoices']);
            coloredToast('success', 'Sale Updated Successfully !', 'top', null, null, 15000);
        },
        onError: (error) => {
            coloredToast('danger', error?.response?.data?.message, 'top');
        },
    });

    const { mutate: updateInvoiceMutate, isInvoiceUpdating } = useMutation({
        mutationFn: ({ id, data }) => updateInvoice(id, data),
        onSuccess: () => {
            coloredToast('success', 'Invoice updated successfully', 'top');
            setEditInvoiceModal(false);
            queryClient.invalidateQueries(['invoices']);
        },
        onError: () => {
            coloredToast('danger', 'Failed to update invoice', 'top');
        },
    });

    const { mutate: invoiceMutation, isInvoiceSubmitting } = useMutation({
        mutationKey: ['addInvoice'],
        mutationFn: invoiceApi,
        onSuccess: () => {
            coloredToast('success', 'Invoice created successfully', 'top');
            setAddInvoiceModal(false);
            queryClient.invalidateQueries(['invoices'], { refetchType: 'Inactive' });
        },
        onError: () => {
            toast.error('Something went wrong');
        },
    });

    const { mutate: senMailmutate } = useMutation({
        mutationFn: (invoice) => invoiceEmailApi(invoice?._id),
        onMutate: (invoice) => {
            setSendingId(invoice._id);
        },
        onSuccess: (data) => {
            coloredToast('success', data.message, 'top', null, null, 1000);
            setSendingId(null);
        },
        onError: (error) => {
            coloredToast('danger', error?.response?.data?.message, 'top');
            setSendingId(null);
        },
    });

    const { deleteMutation, modalOpen, setModalOpen, setSelectedId } = useDeleteMutation({
        mutationFn: deleteInvoice,
        successMessage: 'Invoice has been deleted successfully',
        queryKey: 'invoices',
    });

    const handleDeleteClick = (e, id) => {
        e.stopPropagation();
        setSelectedId(id);
        setModalOpen(true);
    };

    const Services = [
        'Book Cover Design',
        'Book Writing',
        'Book Publishing',
        'Book Printing',
        'Book Marketing',
        'Audiobook Production',
        'Website Design',
        'Website Development',
        'SEO',
        'Social Media Marketing',
        'Google Ads',
        'Branding & Logo Design',
        'UI/UX Design',
        'Content Writing',
        'Video Editing',
        'Software Maintenance',
    ];

    const editInvoiceSubmit = (values) => {
        const calculatedTotal = values.services.reduce((acc, s) => {
            return acc + Number(s.unitPrice || 0) * Number(s.quantity || 0);
        }, 0);
        const finalValues = {
            ...values,
            totalAmount: calculatedTotal,
        };
        updateInvoiceMutate({ id: editInvoiceData._id, data: finalValues });
    };

    const handleSubmit = (values) => {
        const calculatedTotal = values.services.reduce((acc, s) => {
            return acc + Number(s.unitPrice || 0) * Number(s.quantity || 0);
        }, 0);
        const finalValues = {
            ...values,
            totalAmount: calculatedTotal,
        };
        invoiceMutation(finalValues);
    };

    const handleGeneratePDF = useCallback((invoiceId) => {
        if (readyPDFs.has(invoiceId)) return;

        setLoadingPDFs((prev) => new Set([...prev, invoiceId]));

        setTimeout(() => {
            setLoadingPDFs((prev) => {
                const newSet = new Set(prev);
                newSet.delete(invoiceId);
                return newSet;
            });
            setReadyPDFs((prev) => new Set([...prev, invoiceId]));
        }, 1000);
    }, []);

    const userOptions = Array.isArray(usersData?.allUsers)
        ? usersData.allUsers
              .filter((item) => item.role !== 'admin' && item.role !== 'ppc')
              .map((item) => ({
                  value: item._id,
                  label: item.userName,
              }))
        : [];

    return (
        <div className="md:col-span-3 sm:col-span-12">
            <div>
                <div className="flex md:items-center md:flex-row md:justify-between flex-col mb-5 gap-5">
                    <h1 className="screenHeading">Invoices</h1>
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
                                <ul className="!min-w-[140px]">
                                    {cols.map((col, i) => (
                                        <li key={i} className="flex flex-col" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center px-4 py-1">
                                                <label className="cursor-pointer mb-0">
                                                    <input
                                                        type="checkbox"
                                                        checked={!hideCols.includes(col.accessor)}
                                                        className="form-checkbox"
                                                        defaultValue={col.accessor}
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
                        <div className="flex gap-2 items-center">
                            <input
                                type="text"
                                className="form-input w-auto"
                                placeholder="Search..."
                                onChange={(e) => debouncedSetSearch(e.target.value)}
                            />
                            <select
                                className="form-select w-auto"
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setPage(1);
                                }}
                            >
                                <option value="all">All</option>
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                            </select>
                            <button className="btn btn-primary" onClick={() => setAddInvoiceModal(true)}>
                                + Add
                            </button>
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
                                    accessor: 'salesPerson.userName',
                                    title: 'Sales Person',
                                    sortable: true,
                                    hidden: hideCols.includes('salesPerson.userName'),
                                },
                                {
                                    accessor: 'sales.sale',
                                    title: 'Sale',
                                    sortable: true,
                                    hidden: hideCols.includes('sales.sale'),
                                    render: (data) => (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditInvoiceData(data);
                                                setModal17(true);
                                            }}
                                            className="text-primary underline hover:text-primary-700"
                                        >
                                            {data?.sale?.salesPerson?.userName}
                                        </button>
                                    ),
                                },
                                {
                                    accessor: 'customer.userName',
                                    title: 'Client Name',
                                    sortable: true,
                                    hidden: hideCols.includes('customer.userName'),
                                },
                                {
                                    accessor: 'customer.userEmail',
                                    title: 'Client Email',
                                    sortable: true,
                                    hidden: hideCols.includes('customer.userEmail'),
                                    render: ({ customer }) => {
                                        const userEmail = customer?.userEmail;
                                        return (
                                            <a
                                                href={`mailto:${userEmail}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-max group hover:underline"
                                            >
                                                {user?.role === 'admin' ? (
                                                    userEmail
                                                ) : (
                                                    <div>
                                                        <span>{userEmail}</span>
                                                    </div>
                                                )}
                                            </a>
                                        );
                                    },
                                },
                                {
                                    accessor: 'totalAmount',
                                    title: 'Amount',
                                    sortable: true,
                                    hidden: hideCols.includes('totalAmount'),
                                },
                                {
                                    accessor: 'Brand',
                                    title: 'Brand',
                                    sortable: true,
                                    hidden: hideCols.includes('Brand'),
                                    render: (data) => (
                                        <div className="flex items-center w-max">
                                            {data?.companyName || data?.customer?.companyName}
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'CreatedAt',
                                    title: 'Created At',
                                    sortable: true,
                                    hidden: hideCols.includes('CreatedAt'),
                                    render: (data) => (
                                        <div className="flex items-center w-max">
                                            {data?.createdAt ? formatDate(data?.createdAt) : ''}
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'paymentStatus',
                                    title: 'Payment Status',
                                    sortable: true,
                                    hidden: hideCols.includes('paymentStatus'),
                                    render: (value) => (
                                        <span className={`badge bg-${value.paymentStatus === 'Pending' ? 'danger' : 'success'}`}>
                                            {value.paymentStatus}
                                        </span>
                                    ),
                                },
                                {
                                    accessor: 'action',
                                    title: 'Action',
                                    titleClassName: '!text-center',
                                    render: (data) => (
                                        <div className="flex items-center w-max mx-auto gap-2 justify-center">
                                            <Tippy content="Copy Payment Link">
                                                <div
                                                    className="cursor-pointer"
                                                    onClick={() => {
                                                        const company = data?.companyName || data.customer?.companyName || '';
                                                        const baseDomain = company.toLowerCase().replace(/\s+/g, '');
                                                        const paymentLink = `https://billing.${baseDomain}.com/payment/${data._id}`;
                                                        navigator.clipboard.writeText(paymentLink);
                                                        coloredToast('success', 'payment link copied!', 'top');
                                                    }}
                                                >
                                                    <IconCopy />
                                                </div>
                                            </Tippy>
                                            {!data?.sale && data?.paymentStatus === 'Paid' && (
                                                <Tippy content="Add Sale">
                                                    <button
                                                        onClick={() => {
                                                            setEditInvoiceData(data);
                                                            setModal17(true);
                                                        }}
                                                    >
                                                        <IconBarChart />
                                                    </button>
                                                </Tippy>
                                            )}
                                            <MemoizedPDFDownloadLink
                                                invoiceData={data}
                                                invoiceNumber={data?.invoiceNumber}
                                                isLoading={loadingPDFs.has(data._id)}
                                                isPDFReady={readyPDFs.has(data._id)}
                                                handleGeneratePDF={handleGeneratePDF}
                                            />
                                            <Tippy content="Edit Invoice">
                                                <button
                                                    onClick={() => {
                                                        setEditInvoiceData(data);
                                                        setEditInvoiceModal(true);
                                                    }}
                                                >
                                                    <IconEye />
                                                </button>
                                            </Tippy>
                                            {data?.paymentStatus === 'Pending' && (
                                                <Tippy content="Send Invoice Email">
                                                    <div
                                                        onClick={() => sendingId !== data._id && senMailmutate(data)}
                                                        className="cursor-pointer"
                                                    >
                                                        {sendingId === data._id ? (
                                                            <span className="animate-spin text-blue-500">
                                                                <svg
                                                                    className="w-4 h-4"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M12 4v1m0 14v1m8.66-9h-1M4.34 12h-1m15.36 5.36l-.7-.7M6.34 6.34l-.7-.7m12.02 12.02l-.7-.7M6.34 17.66l-.7-.7"
                                                                    />
                                                                </svg>
                                                            </span>
                                                        ) : (
                                                            <IconSend />
                                                        )}
                                                    </div>
                                                </Tippy>
                                            )}
                                            <Tippy content="Delete Invoice">
                                                <button onClick={(e) => handleDeleteClick(e, data?._id)}>
                                                    <IconTrashLines className="text-danger hover:text-red-900" />
                                                </button>
                                            </Tippy>
                                        </div>
                                    ),
                                },
                            ]}
                            totalRecords={initialRecords.length}
                            recordsPerPage={pageSize}
                            page={page}
                            onPageChange={(p) => setPage(p)}
                            recordsPerPageOptions={PAGE_SIZES}
                            onRecordsPerPageChange={setPageSize}
                            sortStatus={sortStatus}
                            onSortStatusChange={setSortStatus}
                            minHeight={200}
                            paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
                        />
                    </div>
                )}
            </div>

            <Transition appear show={modal17} as={Fragment}>
                <Dialog as="div" open={modal17} onClose={() => setModal17(false)}>
                    <div className="modalDiv1">
                        <div className="modalDiv2">
                            <Dialog.Panel className="dialogDiv1">
                                <div className="dialogDiv2">
                                    <button
                                        type="button"
                                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
                                        onClick={() => setModal17(false)}
                                    >
                                        <IconX />
                                    </button>
                                    <h5 className="modalTitle">Sales Details</h5>
                                </div>
                                <Formik
                                    initialValues={{
                                        amount: editInvoiceData?.sale?.amount || editInvoiceData?.totalAmount || '',
                                        services: editInvoiceData?.sale?.services || editInvoiceData?.services?.map((s) => s.type) || [],
                                        salesPerson: editInvoiceData?.sale?.salesPerson?._id || editInvoiceData?.salesPerson?._id,
                                        saleDescription: editInvoiceData?.sale?.saleDescription,
                                        saleType: editInvoiceData?.sale?.saleType || editInvoiceData?.saleType,
                                        date: editInvoiceData?.sale?.date || new Date(),
                                        saleAgreement: null,
                                    }}
                                    validationSchema={validationSchema}
                                    onSubmit={(values) => {
                                        const combinedValues = {
                                            lead: editInvoiceData?.customer?._id,
                                            invoice: editInvoiceData?._id,
                                            ...values,
                                            comments: values?.comments && values.comments.trim()
                                                ? [...(editInvoiceData?.comments || []), { text: values.comments, postedBy: user?._id }]
                                                : editInvoiceData?.comments || [],
                                        };
                                        if (editInvoiceData?.sale?._id) {
                                            updateSaleMutation({ ...combinedValues, id: editInvoiceData.sale._id });
                                        } else {
                                            addSaleMutation(combinedValues);
                                        }
                                    }}
                                >
                                    {({ values, setFieldValue }) => (
                                        <Form style={{ maxWidth: 600 }} className="mx-auto space-y-4 py-4 px-6">
                                            <div className="flex w-full xl:flex-row md:flex-col md:gap-0 fl:gap-0 sm:gap-0 flex-col xl:gap-3 fl:flex-col sm:flex-col">
                                                <div className="w-full mb-2">
                                                    <label htmlFor="amount">Amount</label>
                                                    <Field id="amount" name="amount" className="form-input" placeholder="Enter Sale Amount" />
                                                    <ErrorMessage name="amount" component="div" className="text-red-500" />
                                                </div>
                                                <div className="w-full mb-2">
                                                    <label htmlFor="saleType">Sale Type</label>
                                                    <Field
                                                        as="select"
                                                        id="saleType"
                                                        name="saleType"
                                                        className="form-select"
                                                        onChange={(e) => setFieldValue('saleType', e.target.value)}
                                                    >
                                                        <option value="" disabled selected hidden>
                                                            Select Sale Type
                                                        </option>
                                                        {[
                                                            { item: 'Front Sell', value: 'frontSell' },
                                                            { item: 'Up Sell', value: 'upSell' },
                                                            { item: 'Cross Sell', value: 'crossSell' },
                                                        ].map((option) => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.item}
                                                            </option>
                                                        ))}
                                                    </Field>
                                                    <ErrorMessage name="saleType" component="div" className="text-red-500" />
                                                </div>
                                            </div>
                                            <div className="w-full mb-2">
                                                <label htmlFor="services">Services</label>
                                                <Field name="services">
                                                    {({ field, form }) => (
                                                        <Select
                                                            isMulti
                                                            options={Services.map((service) => ({ value: service, label: service }))}
                                                            placeholder="Select Services"
                                                            className="form-select !mb-2 flex-1 !border-none !p-0"
                                                            value={field.value?.map((service) => ({ value: service, label: service })) || []}
                                                            onChange={(selectedOptions) => {
                                                                form.setFieldValue('services', selectedOptions.map((option) => option.value));
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                                <ErrorMessage name="services" component="div" className="text-red-500" />
                                            </div>
                                            <div className="flex w-full xl:flex-row md:flex-col md:gap-0 fl:gap-0 sm:gap-0 flex-col xl:gap-3 fl:flex-col sm:flex-col">
                                                <div className="w-full mb-2">
                                                    <label htmlFor="salesPerson">Sales Person</label>
                                                    <Field
                                                        as="select"
                                                        id="salesPerson"
                                                        name="salesPerson"
                                                        className="form-select"
                                                        onChange={(e) => setFieldValue('salesPerson', e.target.value)}
                                                    >
                                                        <option disabled value="" hidden selected label="Select Sales Person" />
                                                        {Array.isArray(usersData?.teamMembers) &&
                                                            usersData.teamMembers
                                                                .filter((item) => item.role !== 'admin' && item.role !== 'ppc')
                                                                .map((item) => (
                                                                    <option key={item?._id} value={item?._id}>
                                                                        {item?.userName}
                                                                    </option>
                                                                ))}
                                                    </Field>
                                                    <ErrorMessage name="salesPerson" component="div" className="text-red-500" />
                                                </div>
                                                <div className="w-full mb-2">
                                                    <label htmlFor="date">Date</label>
                                                    <Flatpickr
                                                        name="date"
                                                        placeholder="Select the Date"
                                                        options={{ dateFormat: 'Y-m-d', position: 'auto left' }}
                                                        className="form-input"
                                                        value={values.date}
                                                        onChange={(selectedDate) => {
                                                            setFieldValue('date', selectedDate[0]);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="saleDescription">Sale Description</label>
                                                <Field as="textarea" name="saleDescription" className="form-textarea protected-content" rows="3" />
                                                <ErrorMessage name="saleDescription" component="div" className="text-red-500" />
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
                                            <div className="flex justify-center items-center">
                                                <button
                                                    disabled={addSaleMutation.isPending}
                                                    type="submit"
                                                    className="btn btn-primary !mt-2 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                                                >
                                                    {addSaleMutation.isPending && (
                                                        <span className="animate-spin border-2 border-primary border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                                                    )}
                                                    Submit
                                                </button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <InvoiceModal
                isOpen={addInvoiceModal}
                onClose={() => setAddInvoiceModal(false)}
                initialValues={{
                    userName: '',
                    userEmail: '',
                    userPhone: '',
                    companyName: '',
                    salesPerson: '',
                    saleType: '',
                    totalAmount: '',
                    billTo: { name: '', email: '' },
                    services: [{ type: '', unitPrice: '', quantity: 1, customDescription: '' }],
                }}
                onSubmit={handleSubmit}
                usersData={usersData}
                mode="add"
                isSubmitting={isInvoiceSubmitting}
            />

            <InvoiceModal
                isOpen={editInvoiceModal}
                onClose={() => setEditInvoiceModal(false)}
                initialValues={{
                    userName: editInvoiceData?.customer?.userName || '',
                    userEmail: editInvoiceData?.customer?.userEmail || '',
                    userPhone: editInvoiceData?.customer?.userPhone || '',
                    companyName: editInvoiceData?.companyName || editInvoiceData?.customer?.companyName || '',
                    saleType: editInvoiceData?.saleType,
                    salesPerson: editInvoiceData?.salesPerson?._id,
                    billTo: {
                        name: editInvoiceData?.billTo?.name || '',
                        email: editInvoiceData?.billTo?.email || '',
                    },
                    services: editInvoiceData?.services || [{ type: '', unitPrice: '', quantity: 1, customDescription: '' }],
                    paymentStatus: editInvoiceData?.paymentStatus || 'Pending',
                }}
                onSubmit={editInvoiceSubmit}
                usersData={usersData}
                mode="edit"
                isSubmitting={isInvoiceUpdating}
            />

            <DeleteModals isOpen={modalOpen} onClose={() => setModalOpen(false)} onDelete={() => deleteMutation.mutate()} />
        </div>
    );
}

export default BillingTable;