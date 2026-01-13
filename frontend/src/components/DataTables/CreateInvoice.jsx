import { DataTable } from 'mantine-datatable';
import { useState, Fragment, useEffect } from 'react';
import sortBy from 'lodash/sortBy';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useDispatch, useSelector } from 'react-redux';
import IconEye from '../Icon/IconEye';
import { Dialog, Transition } from '@headlessui/react';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Dropdown from '../Dropdown';
import IconCaretDown from '../Icon/IconCaretDown';
import { getAllUsers } from '../../apis/userApi';
import { getPartialInvoice } from '../../apis/projectApi';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment';
function CreateInvoice() {
    const {
        isLoading: usersLoading,
        data: usersData,
        status: usersStatus,
    } = useQuery({
        queryKey: ['users'],
        queryFn: getAllUsers,
    });

    const [selectedId, setSelectedId] = useState(null);

    const {
        isLoading: partialLoading,
        data: partialInvoices,
        status: partialStatus,
    } = useQuery({ queryKey: ['partialInvoices', selectedId], queryFn: () => getPartialInvoice(selectedId), enabled: !!selectedId });

    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState([]);
    const [recordsData, setRecordsData] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState([]);
    const [modal17, setModal17] = useState(false);
    const [search, setSearch] = useState('');
    const [hideCols, setHideCols] = useState([]);
    const [sortStatus, setSortStatus] = useState({
        columnAccessor: 'userName',
        direction: 'asc',
    });

    const isRtl = useSelector((state) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    useEffect(() => {
        setInitialRecords(sortBy(usersData?.users, 'userName'));
        setRecordsData(initialRecords);
    }, [usersData]);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        setInitialRecords(() => {
            return usersData?.users?.filter((item) => {
                return (
                    item?.userName.toLowerCase().includes(search.toLowerCase()) ||
                    item?.userEmail.toString().toLowerCase().includes(search.toLowerCase()) ||
                    item?.userMobile.toString().toLowerCase().includes(search.toLowerCase())
                );
            });
        });
    }, [search]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);
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
            const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
            const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
            return day + '/' + month + '/' + dt.getFullYear();
        }
        return '';
    };
    const cols = [
        { accessor: 'userName', title: 'User Name' },
        { accessor: 'userEmail', title: 'Email' },
        { accessor: 'userMobile', title: 'Phone No.' },
        { accessor: 'createdAt', title: 'Start Date' },
        { accessor: 'verified', title: 'Status' },
    ];

    return (
        <div className="md:col-span-3 sm:col-span-12">
            {' '}
            <div className="panel ">
                <div className="flex md:items-center md:flex-row md:justify-between flex-col mb-5 gap-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Customers</h5>
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
                                                                showHideColumns(col.accessor, event.target.checked);
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
                        <div className="text-right">
                            <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                    </div>
                </div>
                {Array.isArray(recordsData) && (
                    <div className="datatables">
                        <DataTable
                            pinLastColumn
                            fetching={usersLoading}
                            loaderBackgroundBlur={true}
                            highlightOnHover
                            className="whitespace-nowrap table-hover"
                            records={recordsData}
                            columns={[
                                // {
                                //     accessor: 'userName',
                                //     title: 'User Name',
                                //     sortable: true,
                                //     hidden: hideCols.includes('userName'),
                                // },
                                {
                                    accessor: 'userName',
                                    title: 'User',
                                    sortable: true,
                                    hidden: hideCols.includes('userName'),
                                    render: ({ userName }) => (
                                        <div className="flex items-center w-max">
                                            <img
                                                className="w-9 h-9 rounded-full ltr:mr-2 rtl:ml-2 object-cover"
                                                src={`https://res.cloudinary.com/ddvtgfqgv/image/upload/v1691059545/member-profile/avatar_aoyxl6.webp`}
                                                alt=""
                                            />
                                            <div>{userName}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'userEmail',
                                    title: 'Email',
                                    sortable: true,
                                    hidden: hideCols.includes('userEmail'),
                                },
                                {
                                    accessor: 'userMobile',
                                    title: 'Phone No.',
                                    sortable: true,
                                    hidden: hideCols.includes('userMobile'),
                                },
                                {
                                    accessor: 'createdAt',
                                    title: 'Start Date',
                                    sortable: true,
                                    hidden: hideCols.includes('createdAt'),
                                    render: ({ createdAt }) => (
                                        <div className="flex items-center w-max">
                                            <div>{new Date(createdAt).toLocaleDateString()}</div>
                                        </div>
                                    ),
                                },

                                {
                                    accessor: 'verified',
                                    title: 'Status',
                                    sortable: true,
                                    hidden: hideCols.includes('verified'),
                                    render: (value) => <span className={`badge bg-${value ? 'success' : 'danger'}`}>{value ? 'Active' : 'Inactive'}</span>,
                                },

                                {
                                    accessor: 'action',
                                    title: 'Action',
                                    titleClassName: '!text-center',
                                    render: (data) => (
                                        <div className="flex items-center w-max mx-auto">
                                            <Tippy content="View">
                                                <button
                                                    onClick={() => {
                                                        setModal17(true);
                                                        setSelectedId(data._id);
                                                    }}
                                                    type="button"
                                                >
                                                    <IconEye />
                                                </button>
                                            </Tippy>
                                        </div>
                                    ),
                                },
                            ]}
                            totalRecords={recordsData.length}
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
            <Transition appear show={modal17} as={Fragment}>
                <Dialog as="div" open={modal17} onClose={() => setModal17(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
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
                                <Dialog.Panel className="panel my-8 w-full max-w-2xl overflow-hidden rounded-lg border-0  text-black dark:text-white-dark">
                                    {/* <h3 className="text-xl py-7 mb-5 font-semibold text-black dark:text-white-light"></h3> */}
                                    {Array.isArray(partialInvoices?.invoices) && (
                                        <div className="datatables">
                                            <DataTable
                                                pinLastColumn
                                                fetching={partialLoading}
                                                loaderBackgroundBlur={true}
                                                highlightOnHover
                                                className="whitespace-nowrap table-hover"
                                                records={partialInvoices?.invoices}
                                                onRowClick={(record) => setSelectedCustomer(record)}
                                                columns={[
                                                    {
                                                        accessor: 'invoiceNumber',
                                                        title: '#Invoice',
                                                    },

                                                    {
                                                        accessor: 'project.projectName',
                                                        title: 'Project Name',
                                                    },
                                                    {
                                                        accessor: 'totalAmount',
                                                        title: 'Total Amount',
                                                    },
                                                    {
                                                        accessor: 'remainingAmount',
                                                        title: 'Remaining Amount',
                                                    },
                                                ]}
                                                rowExpansion={{
                                                    content: ({ record }) => (
                                                        <Formik
                                                            initialValues={{
                                                                amount: '',
                                                                id: record._id,
                                                                dueDate: null,
                                                            }}
                                                            validationSchema={Yup.object().shape({
                                                                amount: Yup.number().required('Please input Amount!').max(record.remainingAmount, 'Amount exceeds remaining amount'),
                                                                // dueDate: Yup.date().required('Please Select Due Date!'),
                                                            })}
                                                            onSubmit={(values) => {
                                                                console.log(values);
                                                            }}
                                                        >
                                                            {({ setFieldValue }) => (
                                                                <Form className="flex justify-between items-center gap-4">
                                                                    <div>
                                                                        <Field type="number" name="amount" placeholder="Enter Amount" className="form-input" />
                                                                        <ErrorMessage name="amount" component="div" className="text-danger" />
                                                                    </div>

                                                                    <Field type="hidden" name="id" />

                                                                    <div>
                                                                        <Flatpickr
                                                                            // value={date1}
                                                                            options={{
                                                                                dateFormat: 'Y-m-d',
                                                                                position: isRtl ? 'auto right' : 'auto left',
                                                                                disable: [
                                                                                    function (date) {
                                                                                        const today = moment().startOf('day');
                                                                                        const nextMonth = moment().add(1, 'month').endOf('day');
                                                                                        return date < today.toDate() || date > nextMonth.toDate();
                                                                                    },
                                                                                ],
                                                                            }}
                                                                            className="form-input"
                                                                            onChange={(date) => {
                                                                                // setDate1(date);
                                                                                setFieldValue('dueDate', date);
                                                                            }}
                                                                            placeholder="Select Due Date"
                                                                        />
                                                                        <ErrorMessage name="dueDate" component="div" className="error" />
                                                                    </div>

                                                                    <button type="submit" className=" btn btn-primary">
                                                                        Create
                                                                    </button>
                                                                </Form>
                                                            )}
                                                        </Formik>
                                                    ),
                                                }}
                                                totalRecords={partialInvoices?.invoices?.length}
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
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}

export default CreateInvoice;

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
