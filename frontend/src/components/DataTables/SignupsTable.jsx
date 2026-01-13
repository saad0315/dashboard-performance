import React from "react";
import { DataTable } from "mantine-datatable";
import { useState, Fragment, useEffect } from "react";
import sortBy from "lodash/sortBy";
import "tippy.js/dist/tippy.css";
import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Dropdown from "../Dropdown";
import IconCaretDown from "../Icon/IconCaretDown";
import { addLeads, getConvertedFormIds, getSignups, updateLead } from "../../api/leadsApi";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, NavLink } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
// import MaskedInput from "react-text-mask";
// import IconPhone from "../Icon/IconPhone";
// import DynamicInput from "../DynamicInput/DynamicInput";
import IconX from "../Icon/IconX";
import { coloredToast } from "../Alerts/SimpleAlert";
import { DataTableSkeleton } from "../Skeletons/Skeletons";
import InitialAvatar from "../InitialAvatar";
// import Flatpickr from "react-flatpickr";
// import "flatpickr/dist/flatpickr.css";
function debounce(callback, delay) {
    let timerId;
    return function (...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            callback.apply(this, args);
        }, delay);
    };
}

function SignupsTable() {
    const queryClient = useQueryClient();
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState([]);
    const [recordsData, setRecordsData] = useState([]);
    const [modal17, setModal17] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
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
        queryKey: ["Signups", search, page, pageSize],
        queryFn: () => getSignups(search, page, pageSize),
        keepPreviousData: true,
    });


    const { data: convertedLeadsData } = useQuery({
        queryKey: ["convertedFormIds"],
        queryFn: getConvertedFormIds,
    });

    // Add this function to check if signup is converted
    const isSignupConverted = (formId) => {
        return convertedLeadsData?.convertedFormIds?.includes(formId);
    };



    const handlePageChange = (newPage) => {
        setPage(newPage);
        queryClient.invalidateQueries(["Signups", newPage]);
    };

    useEffect(() => {
        if (leadsData?.data) {
            const sortedSignups = sortBy(leadsData.data, 'createdAt').reverse();
            setInitialRecords(sortedSignups);
            setRecordsData(sortedSignups.slice(0, pageSize));
        }
    }, [leadsData, pageSize, page]);

    const showHideColumns = (col, value) => {
        if (hideCols.includes(col)) {
            setHideCols((col) => hideCols.filter((d) => d !== col));
        } else {
            setHideCols([...hideCols, col]);
        }
    };
    const addLeadMutation = useMutation({
        mutationKey: ["register"],
        mutationFn: addLeads,
        onSuccess: (response) => {
            coloredToast(
                "success",
                "Lead Created Successfully",
                "top",
                null,
                null,
                1500
            );
            queryClient.invalidateQueries(["Signups"]);
        },
        onError: (error) => {
            coloredToast("danger", error?.response?.data?.message, "top");
        },
    });

    const handleConvertToLead = (data) => {
        if (isSignupConverted(data._id)) {
            return;
        }

        const leadData = {
            formId: data._id,
            userName: data.formData?.name || data.formData?.['your-name'] || data.formData?.['user_name'],
            userEmail: data.formData?.email || data.formData?.['your-email'] || data.formData?.['user_email'],
            userPhone: data.formData?.number || data.formData?.phoneNumber || data.formData?.phone || data.formData?.['your-phone'] || data.formData?.['user_phone'] || data.formData?.['phone_no'],
            companyName: data.formData?.companyName,
            businessName: data.formData?.Business || data.formData?.['Business Name'],
            message: data.formData?.message || data.formData?.['user_message'] || data.formData?.subjects,
            fullPageUrl: data.formData?.fullPageUrl,
            ipInfo: data.formData?.ipInfo,
            date: data.createdAt,
        };

        addLeadMutation.mutate(leadData);
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
    const cols = [
        {
            accessor: 'formData.name',
            title: 'Name',
            sortable: true,
            render: ({ formData }) => (
                <div className="flex items-center w-max gap-3 protected-content">
                    <InitialAvatar name={formData?.name || formData?.userName || formData?.['your-name'] || formData?.['user-name'] || formData?.['user_name'] ? (formData.name || formData.userName || formData['your-name'] || formData['user-name'] || formData['user_name'])?.charAt(0)?.toUpperCase() : ""} />
                    <div>{formData?.name || formData?.userName || formData?.['your-name'] || formData?.['user-name'] || formData?.['user_name']}</div>
                </div>
            ),
        },
        {
            accessor: 'formData.email',
            title: 'Email',
            sortable: true,
            render: ({ formData }) => {
                const clientEmail = formData?.email || formData?.userEmail || formData?.['your-email'] || formData?.['user-email'] || formData?.['user_email'] || 'N/A'
                return (
                    <a href={`mailto:${clientEmail}`} onClick={(e) => {
                        e.stopPropagation();
                    }} className="w-max group protected-content">
                        {user?.role === "admin" ? (
                            clientEmail
                        ) : (
                            <div className="">
                                <span>{clientEmail}</span>
                                {/* <span>{clientEmail.slice(0, 6)}</span> */}
                                {/* <span className="blur-sm group-hover:blur-none select-none">{clientEmail.slice(4)}</span> */}
                            </div>
                        )}
                    </a>
                )
            },
        },
        {
            accessor: 'formData.phoneNumber',
            title: 'Phone',
            sortable: true,
            render: ({ formData }) => {
                const phoneNumber = formData?.number || formData?.phoneNumber || formData?.phone || formData?.['your-phone'] || formData?.['user_phone'] || formData?.['phone_no'] || 'N/A';

                return (
                    <a href={`tel:${phoneNumber}`} onClick={(e) => {
                        e.stopPropagation()
                    }} className="w-max group hover:underline">
                        {user?.role === "admin" ? (
                            phoneNumber
                        ) : (
                            <div className="">
                                <span>{phoneNumber?.slice(0, 4)}</span>
                                <span className="blur-sm group-hover:blur-none select-none">{phoneNumber?.slice(4)}</span>
                            </div>
                        )}
                    </a>
                );
            },
        },
        {
            accessor: 'formData.companyName',
            title: 'Source',
            sortable: true,
            render: ({ formData }) => (
                <div>
                    {formData?.companyName || 'N/A'}
                </div>
            ),
        },
        {
            accessor: 'createdAt',
            title: 'Date',
            sortable: true,
            render: ({ createdAt }) => (
                <div className="flex items-center w-max">
                    {new Date(createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
            ),
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
                            className={`btn ${isConverted
                                ? 'btn-success cursor-not-allowed'
                                : 'btn-primary hover:btn-secondary'
                                }`}
                        >
                            {addLeadMutation.isPending ? (
                                <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-4 h-4 inline-block align-middle"></span>
                            ) : isConverted ? (
                                'Assigned'
                            ) : (
                                'UnAssigned'
                            )}
                        </button>
                    </div>
                );
            },
        }

        // {
        //     accessor: 'actions',
        //     title: 'Actions',
        //     sortable: false,
        //     render: ({ formData, ...rowData }) => (
        //         <div className="flex items-center w-max gap-2">
        //             <button
        //                 type="button"
        //                 onClick={(e) => {
        //                     e.stopPropagation();
        //                     handleConvertToLead({ formData, ...rowData });
        //                 }}
        //                 className="btn btn-sm btn-primary"
        //                 disabled={addLeadMutation.isPending}
        //             >
        //                 {addLeadMutation.isPending ? (
        //                     <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-4 h-4 inline-block align-middle"></span>
        //                 ) : (
        //                     'Convert to Lead'
        //                 )}
        //             </button>
        //         </div>
        //     ),
        // },
    ];

    const isConverted = isSignupConverted(selectedLead?._id);
    return (
        <div className="md:col-span-3 sm:col-span-12 ">
            {" "}
            <ul className="flex space-x-2 rtl:space-x-reverse mb-5">
                <li>
                    <Link to="#" className="text-primary hover:underline">
                        SignUps
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Table</span>
                </li>
            </ul>
            <div className="">
                <div className="flex md:items-center md:flex-row md:justify-between flex-col mb-5 gap-5">
                    <h1 className="screenHeading">
                        SignUps
                    </h1>
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
                                paginationText={({ from, to, totalRecords }) =>
                                    `Showing  ${from} to ${to} of ${totalRecords} entries`
                                }
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
                                    <h2 className="text-xl font-extrabold uppercase !leading-snug text-primary md:text-2xl">
                                        Lead Details
                                    </h2>
                                    <div className="datatables">
                                        <Formik
                                            initialValues={{
                                                name: selectedLead?.formData?.name || selectedLead?.formData?.userName || selectedLead?.formData?.['user-name'] || selectedLead?.formData?.['user_name'] || selectedLead?.formData?.['your-name'] || '',
                                                email: selectedLead?.formData?.email || selectedLead?.formData?.userEmail || selectedLead?.formData?.['user-email'] || selectedLead?.formData?.['user_email'] || selectedLead?.formData?.['your-email'] || '',
                                                phone: selectedLead?.formData?.number || selectedLead?.formData?.phone || selectedLead?.formData?.phoneNumber || selectedLead?.formData?.['user-phone'] || selectedLead?.formData?.['user_phone'] || selectedLead?.formData?.['your-phone'] || '',
                                                message: selectedLead?.formData?.message || selectedLead?.formData?.subjects || selectedLead?.formData?.website || selectedDate?.business || selectedLead?.formData?.['your-message'] || selectedLead?.formData?.['user_message'] || selectedLead?.formData?.['user-message'] || '',
                                                website: selectedLead?.formData?.website || selectedLead?.formData?.['your-website'] || '',
                                                companyName: selectedLead?.companyName || '',
                                                status: 'New',
                                                fullPageUrl: selectedLead?.formData?.fullPageUrl || '',
                                                ipInfo: selectedLead?.formData?.ipInfo || {},
                                            }}
                                            onSubmit={(values) => {
                                                const leadData = {
                                                    formId: selectedLead?._id,
                                                    userName: values.name,
                                                    userEmail: values.email,
                                                    userPhone: values.phone,
                                                    message: values.message,
                                                    website: values.website,
                                                    companyName: values.companyName,
                                                    status: values.status,
                                                    fullPageUrl: values.fullPageUrl,
                                                    ipInfo: values.ipInfo,
                                                };
                                                addLeadMutation.mutate(leadData);
                                            }}
                                        >
                                            {({ values }) => (
                                                <Form className="space-y-5">

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                                        className="form-input"
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
                                                            className="form-input"
                                                            disabled
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="message">Message/Subject</label>
                                                        <Field
                                                            as="textarea"
                                                            name="message"
                                                            className="form-textarea"
                                                            rows="3"
                                                            disabled
                                                        />
                                                    </div>

                                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                                        <h4 className="font-semibold mb-3">IP Information</h4>
                                                        <div className="grid grid-cols-2 gap-4 protected-content">
                                                            <div>
                                                                <label>IP Address</label>
                                                                <div className="text-sm">{values.ipInfo?.ip}</div>
                                                            </div>
                                                            <div>
                                                                <label>Location</label>
                                                                <div className="text-sm">{`${values.ipInfo?.city}, ${values.ipInfo?.region}, ${values.ipInfo?.country}`}</div>
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

                                                    <button
                                                        type="submit"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                        }}
                                                        disabled={isConverted}
                                                        className={`btn ${isConverted
                                                            ? 'btn-success cursor-not-allowed'
                                                            : 'btn-primary hover:btn-secondary'
                                                            }`}
                                                    >
                                                        {addLeadMutation.isPending ? (
                                                            <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-4 h-4 inline-block align-middle"></span>
                                                        ) : isConverted ? (
                                                            'Assigned'
                                                        ) : (
                                                            'UnAssigned'
                                                        )}
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
                                                            class="p-6 text-base bg-white border-t border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                                                        >
                                                            <footer class="flex justify-between items-center mb-2">
                                                                <div class="flex items-center">
                                                                    <p class=" capitalize inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                                                                        {item?.postedBy?.profileImageUrl ? (
                                                                            <img
                                                                                class="mr-2 w-6 h-6 rounded-full"
                                                                                src={item?.postedBy?.profileImageUrl}
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
                                                                            item.createdAt
                                                                        ).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                            </footer>
                                                            <p class="text-gray-500 dark:text-gray-400">
                                                                {item?.text}
                                                            </p>
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

        </div >
    );
}

export default SignupsTable;

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


////////////////////////////////////////////////////


// import React from "react";
// import { DataTable } from "mantine-datatable";
// import { useState, Fragment, useEffect } from "react";
// import sortBy from "lodash/sortBy";
// import "tippy.js/dist/tippy.css";
// import { useSelector } from "react-redux";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import Dropdown from "../Dropdown";
// import IconCaretDown from "../Icon/IconCaretDown";
// import { addLeads, deleteSignupById, getConvertedFormIds, getSignups, updateLead } from "../../api/leadsApi";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import { Link, NavLink } from "react-router-dom";
// import { Dialog, Transition } from "@headlessui/react";
// import IconX from "../Icon/IconX";
// import { coloredToast } from "../Alerts/SimpleAlert";
// import { DataTableSkeleton } from "../Skeletons/Skeletons";
// import IconTrashLines from "../Icon/IconTrashLines";
// import IconChecks from "../Icon/IconChecks";
// import IconPlusCircle from "../Icon/IconPlusCircle";
// import DeleteModals from "../DeleteModals/DeleteModals";
// import useDeleteMutation from "../DeleteModals/DeleteMutation";
// import Tippy from "@tippyjs/react";

// function debounce(callback, delay) {
//     let timerId;
//     return function (...args) {
//         clearTimeout(timerId);
//         timerId = setTimeout(() => {
//             callback.apply(this, args);
//         }, delay);
//     };
// }

// function SignupsTable() {
//     const queryClient = useQueryClient();
//     const PAGE_SIZES = [10, 20, 30, 50, 100];
//     const [page, setPage] = useState(1);
//     const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
//     const [initialRecords, setInitialRecords] = useState([]);
//     const [recordsData, setRecordsData] = useState([]);
//     const [modal17, setModal17] = useState(false);
//     const [selectedLead, setSelectedLead] = useState(null);
//     const [selectedStatus, setSelectedStatus] = useState("");
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
//         queryKey: ["Signups", search, page],
//         queryFn: () => getSignups(search, page),
//         keepPreviousData: true,
//     });


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
//         queryClient.invalidateQueries(["Signups", newPage]);
//     };

//     useEffect(() => {
//         if (leadsData?.data) {
//             const sortedSignups = sortBy(leadsData.data, 'createdAt').reverse();
//             setInitialRecords(sortedSignups);
//             setRecordsData(sortedSignups.slice(0, pageSize));
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
//             queryClient.invalidateQueries(["Signups"]);
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
//             userName: data.formData?.name || data.formData?.['your-name'] || data.formData?.['user_name'],
//             userEmail: data.formData?.email || data.formData?.['your-email'] || data.formData?.['user_email'],
//             userPhone: data.formData?.number || data.formData?.phoneNumber || data.formData?.phone || data.formData?.['your-phone'] || data.formData?.['user_phone'] || data.formData?.['phone_no'],
//             companyName: data.formData?.companyName,
//             businessName: data.formData?.Business || data.formData?.['Business Name'],
//             message: data.formData?.message || data.formData?.['user_message'] || data.formData?.subjects,
//             fullPageUrl: data.formData?.fullPageUrl,
//             ipInfo: data.formData?.ipInfo,
//             date: data.createdAt,
//         };

//         addLeadMutation.mutate(leadData);
//     };
//     const { deleteMutation, modalOpen, setModalOpen, setSelectedId } =
//         useDeleteMutation({
//             mutationFn: deleteSignupById,
//             successMessage: "Signup has been deleted successfully",
//             queryKey: "Signups",
//         });
//     const handleDeleteClick = (e, id) => {
//         e.stopPropagation();
//         setSelectedId(id);
//         setModalOpen(true);
//     };
//     const formatDate = (date) => {
//         if (date) {
//             const dt = new Date(date);
//             const month =
//                 dt.getMonth() + 1 < 10 ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1;
//             const day = dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate();
//             return day + "/" + month + "/" + dt.getFullYear();
//         }
//         return "";
//     };
//     const cols = [
//         {
//             accessor: 'formData.name',
//             title: 'Name',
//             sortable: true,
//             render: ({ formData }) => (
//                 <div className="flex items-center w-max gap-3 protected-content">
//                     <div className="text-lg rounded-full w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700">
//                         {formData?.name || formData?.userName || formData?.['your-name'] || formData?.['user-name'] || formData?.['user_name'] ? (formData.name || formData.userName || formData['your-name'] || formData['user-name'] || formData['user_name'])?.charAt(0)?.toUpperCase() : ''}
//                     </div>

//                     <div>{formData?.name || formData?.userName || formData?.['your-name'] || formData?.['user-name'] || formData?.['user_name']}</div>
//                 </div>
//             ),
//         },
//         {
//             accessor: 'formData.email',
//             title: 'Email',
//             sortable: true,
//             render: ({ formData }) => {
//                 const clientEmail = formData?.email || formData?.userEmail || formData?.['your-email'] || formData?.['user-email'] || formData?.['user_email'] || 'N/A'
//                 return (
//                     <div className="w-max group protected-content">
//                         {user?.role === "admin" ? (
//                             clientEmail
//                         ) : (
//                             <div className="">
//                                 <span>{clientEmail.slice(0, 6)}</span>
//                                 <span className="blur-sm group-hover:blur-none select-none">{clientEmail.slice(4)}</span>
//                             </div>
//                         )}
//                     </div>
//                 )
//             },
//         },
//         {
//             accessor: 'formData.phoneNumber',
//             title: 'Phone',
//             sortable: true,
//             render: ({ formData }) => {
//                 const phoneNumber = formData?.number || formData?.phoneNumber || formData?.phone || formData?.['your-phone'] || formData?.['user_phone'] || formData?.['phone_no'] || 'N/A';

//                 return (
//                     <div className="w-max group">
//                         {user?.role === "admin" ? (
//                             phoneNumber
//                         ) : (
//                             <div>
//                                 <span>{phoneNumber.slice(0, 6)}</span>
//                                 <span className="blur-sm group-hover:blur-none select-none">{phoneNumber.slice(4)}</span>
//                             </div>
//                         )}
//                     </div>
//                 );
//             },
//         },
//         {
//             accessor: 'formData.companyName',
//             title: 'Source',
//             sortable: true,
//             render: ({ formData }) => (
//                 <div>
//                     {formData?.companyName || 'N/A'}
//                 </div>
//             ),
//         },
//         {
//             accessor: 'createdAt',
//             title: 'Date',
//             sortable: true,
//             render: ({ createdAt }) => (
//                 <div className="flex items-center w-max">
//                     {new Date(createdAt).toLocaleDateString('en-US', {
//                         year: 'numeric',
//                         month: 'short',
//                         day: 'numeric',
//                         hour: '2-digit',
//                         minute: '2-digit'
//                     })}
//                 </div>
//             ),
//         },
//         {
//             accessor: "action",
//             title: "Actions",
//             render: (data) => {
//                 const isConverted = isSignupConverted(data._id);

//                 return (
//                     <div>
//                         <div className="flex items-center w-max mx-auto gap-2">

//                             <Tippy content={isConverted ? `Converted` : `Convert to Lead`} >
//                                 <button
//                                     type="button"
//                                     onClick={(e) => {
//                                         e.stopPropagation();
//                                         if (!isConverted) handleConvertToLead(data);
//                                     }}
//                                     disabled={isConverted}
//                                     className={`${isConverted
//                                         ? 'text-success cursor-not-allowed'
//                                         : 'text-primary hover:text-secondary'
//                                         }`}
//                                 >
//                                     {addLeadMutation.isPending ? (
//                                         <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-4 h-4 inline-block align-middle"></span>
//                                     ) : isConverted ? (
//                                         <IconChecks />
//                                     ) : (
//                                         <IconPlusCircle />
//                                     )}
//                                 </button>
//                             </Tippy>
//                             <Tippy content="Delete Signup">
//                                 <button
//                                     type="button"
//                                     disabled={isConverted}
//                                     onClick={(e) => handleDeleteClick(e, data?._id)}
//                                     className={isConverted ? "cursor-not-allowed" : `text-red-600 hover:text-red-800`}
//                                     title="Delete Form"
//                                 >
//                                     {deleteMutation.isPending ? (
//                                         <span className="animate-spin border-2 border-red-600 border-l-transparent rounded-full w-4 h-4 inline-block"></span>
//                                     ) : (
//                                         <IconTrashLines size={18} />
//                                     )}
//                                 </button>
//                             </Tippy>
//                         </div>

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
//                         SignUps
//                     </Link>
//                 </li>
//                 <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
//                     <span>Table</span>
//                 </li>
//             </ul>
//             <div className="panel ">
//                 <div className="flex md:items-center md:flex-row md:justify-between flex-col mb-5 gap-5">
//                     <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">
//                         SignUps
//                     </h1>{" "}
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
//                                 loaderBackgroundBlur={true}
//                                 highlightOnHover
//                                 className="whitespace-nowrap table-hover"
//                                 records={recordsData}
//                                 onRowClick={(record) => {
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
//                                 <Dialog.Panel className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0  text-black dark:text-white-dark">
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
//                                                 name: selectedLead?.formData?.name || selectedLead?.formData?.userName || selectedLead?.formData?.['user-name'] || selectedLead?.formData?.['user_name'] || selectedLead?.formData?.['your-name'] || '',
//                                                 email: selectedLead?.formData?.email || selectedLead?.formData?.userEmail || selectedLead?.formData?.['user-email'] || selectedLead?.formData?.['user_email'] || selectedLead?.formData?.['your-email'] || '',
//                                                 phone: selectedLead?.formData?.number || selectedLead?.formData?.phone || selectedLead?.formData?.phoneNumber || selectedLead?.formData?.['user-phone'] || selectedLead?.formData?.['user_phone'] || selectedLead?.formData?.['your-phone'] || '',
//                                                 message: selectedLead?.formData?.message || selectedLead?.formData?.subjects || selectedLead?.formData?.website || selectedDate?.business || selectedLead?.formData?.['your-message'] || selectedLead?.formData?.['user_message'] || selectedLead?.formData?.['user-message'] || '',
//                                                 website: selectedLead?.formData?.website || selectedLead?.formData?.['your-website'] || '',
//                                                 companyName: selectedLead?.companyName || '',
//                                                 status: 'New',
//                                                 fullPageUrl: selectedLead?.formData?.fullPageUrl || '',
//                                                 ipInfo: selectedLead?.formData?.ipInfo || {},
//                                             }}
//                                             onSubmit={(values) => {
//                                                 const leadData = {
//                                                     formId: selectedLead?._id,
//                                                     userName: values.name,
//                                                     userEmail: values.email,
//                                                     userPhone: values.phone,
//                                                     message: values.message,
//                                                     website: values.website,
//                                                     companyName: values.companyName,
//                                                     status: values.status,
//                                                     fullPageUrl: values.fullPageUrl,
//                                                     ipInfo: values.ipInfo,
//                                                 };
//                                                 addLeadMutation.mutate(leadData);
//                                             }}
//                                         >
//                                             {({ values }) => (
//                                                 <Form className="space-y-5">

//                                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                                         <div>
//                                                             <label htmlFor="name">Name</label>
//                                                             <Field
//                                                                 type="text"
//                                                                 name="name"
//                                                                 className="form-input protected-content"
//                                                                 disabled
//                                                             />
//                                                         </div>
//                                                         {user?.role !== "ppc" && (
//                                                             <>
//                                                                 <div>
//                                                                     <label htmlFor="email">Email</label>
//                                                                     <Field
//                                                                         type="email"
//                                                                         name="email"
//                                                                         className="form-input"
//                                                                         disabled
//                                                                     />
//                                                                 </div>
//                                                                 <div>
//                                                                     <label htmlFor="phone">Phone</label>
//                                                                     <Field
//                                                                         type="text"
//                                                                         name="phone"
//                                                                         className="form-input protected-content"
//                                                                         disabled
//                                                                     />
//                                                                 </div>
//                                                             </>
//                                                         )}
//                                                         <div>
//                                                             <label htmlFor="companyName">Company Name</label>
//                                                             <Field
//                                                                 type="text"
//                                                                 name="companyName"
//                                                                 className="form-input protected-content"
//                                                                 disabled
//                                                             />
//                                                         </div>
//                                                     </div>


//                                                     <div>
//                                                         <label htmlFor="fullPageUrl">Full Page URL</label>
//                                                         <Field
//                                                             type="text"
//                                                             name="fullPageUrl"
//                                                             className="form-input"
//                                                             disabled
//                                                         />
//                                                     </div>

//                                                     <div>
//                                                         <label htmlFor="message">Message/Subject</label>
//                                                         <Field
//                                                             as="textarea"
//                                                             name="message"
//                                                             className="form-textarea"
//                                                             rows="3"
//                                                             disabled
//                                                         />
//                                                     </div>

//                                                     <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
//                                                         <h4 className="font-semibold mb-3">IP Information</h4>
//                                                         <div className="grid grid-cols-2 gap-4 protected-content">
//                                                             <div>
//                                                                 <label>IP Address</label>
//                                                                 <div className="text-sm">{values.ipInfo?.ip}</div>
//                                                             </div>
//                                                             <div>
//                                                                 <label>Location</label>
//                                                                 <div className="text-sm">{`${values.ipInfo?.city}, ${values.ipInfo?.region}, ${values.ipInfo?.country}`}</div>
//                                                             </div>
//                                                             <div>
//                                                                 <label>Postal Code</label>
//                                                                 <div className="text-sm">{values.ipInfo?.postal}</div>
//                                                             </div>
//                                                             <div>
//                                                                 <label>Timezone</label>
//                                                                 <div className="text-sm">{values.ipInfo?.timezone}</div>
//                                                             </div>
//                                                             <div>
//                                                                 <label>Organization</label>
//                                                                 <div className="text-sm">{values.ipInfo?.org}</div>
//                                                             </div>
//                                                         </div>
//                                                     </div>

//                                                     <button
//                                                         type="submit"
//                                                         onClick={(e) => {
//                                                             e.stopPropagation();
//                                                         }}
//                                                         disabled={isConverted}
//                                                         className={`btn ${isConverted
//                                                             ? 'btn-success cursor-not-allowed'
//                                                             : 'btn-primary hover:btn-secondary'
//                                                             }`}
//                                                     >
//                                                         {addLeadMutation.isPending ? (
//                                                             <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-4 h-4 inline-block align-middle"></span>
//                                                         ) : isConverted ? (
//                                                             'Converted'
//                                                         ) : (
//                                                             'Convert to Lead'
//                                                         )}
//                                                     </button>
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
//             <DeleteModals
//                 isOpen={modalOpen}
//                 onClose={() => setModalOpen(false)}
//                 onDelete={() => deleteMutation.mutate()}
//             />
//         </div >
//     );
// }

// export default SignupsTable;
