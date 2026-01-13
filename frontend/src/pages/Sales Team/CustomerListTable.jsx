import { DataTable } from 'mantine-datatable';
import { useState, Fragment, useEffect } from 'react';
import sortBy from 'lodash/sortBy';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch, useSelector } from 'react-redux';
import IconEye from '../Icon/IconEye';
import { Dialog, Transition } from '@headlessui/react';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Dropdown from '../Dropdown';
import IconCaretDown from '../Icon/IconCaretDown';
import { setSelectedInvoice, setSelectedProject } from '../../store/projectSlice';
import { NavLink } from 'react-router-dom';
import IconEdit from '../Icon/IconEdit';
import { getAllUsers } from '../../apis/userApi';

function CustomerListTable() {
    const {
        isLoading,
        data: usersData,
        status,
    } = useQuery({
        queryKey: ['users'],
        queryFn: getAllUsers,
    });
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState([]);
    const [recordsData, setRecordsData] = useState([]);
    const [modal17, setModal17] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [search, setSearch] = useState('');
    const [hideCols, setHideCols] = useState([]);
    const [sortStatus, setSortStatus] = useState({
        columnAccessor: 'userName',
        direction: 'asc',
    });

    const isRtl = useSelector((state) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    useEffect(() => {
        if (usersData?.users) {
            const sortedUsers = sortBy(usersData?.users, 'userName');
            setInitialRecords(sortedUsers);
            setRecordsData(sortedUsers);
        }
    }, [usersData]);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    // useEffect(() => {
    //     setInitialRecords(() => {
    //         return usersData?.users?.filter((item) => {
    //             return (
    //                 item?.userName.toLowerCase().includes(search.toLowerCase()) ||
    //                 item?.userEmail.toString().toLowerCase().includes(search.toLowerCase()) ||
    //                 item?.userMobile.toString().toLowerCase().includes(search.toLowerCase())
    //             );
    //         });
    //     });
    // }, [search]);

    // useEffect(() => {
    //     const data = sortBy(initialRecords, sortStatus.columnAccessor);
    //     setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
    //     setPage(1);
    // }, [sortStatus]);

    useEffect(() => {
        if (usersData?.users) {
            const filteredUsers = usersData?.users?.filter((item) => {
                return (
                    item?.userName.toLowerCase().includes(search.toLowerCase()) ||
                    item?.userEmail.toLowerCase().includes(search.toLowerCase()) ||
                    item?.userMobile.toString().toLowerCase().includes(search.toLowerCase())
                );
            });
            const sortedUsers = sortBy(filteredUsers, 'userName');
            setInitialRecords(sortedUsers);
            setPage(1);
        }
    }, [search, usersData]);
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
                            fetching={isLoading}
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

                                // {
                                //     accessor: 'action',
                                //     title: 'Action',
                                //     titleClassName: '!text-center',
                                //     render: (data) => (
                                //         <div className="flex items-center w-max mx-auto">
                                //             <Tippy content="Edit Project">
                                //                 <NavLink
                                //                     to={'/projects/edit'}
                                //                     onClick={() => {
                                //                         dispatch(setSelectedProject(data));
                                //                     }}
                                //                     type="button"
                                //                 >
                                //                     <IconEdit />
                                //                 </NavLink>
                                //             </Tippy>
                                //         </div>
                                //     ),
                                // },
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
                            paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                            
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default CustomerListTable;

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
