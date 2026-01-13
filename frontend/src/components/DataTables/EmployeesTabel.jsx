
import { useState, Fragment, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconListCheck from '../../components/Icon/IconListCheck';
import IconLayoutGrid from '../../components/Icon/IconLayoutGrid';
import IconSearch from '../../components/Icon/IconSearch';
import IconUser from '../../components/Icon/IconUser';
import IconX from '../../components/Icon/IconX';
import { getAllUsers, removeUser, updateProfile, updateRole, updateStatus } from '../../api/userApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { coloredToast } from '../Alerts/SimpleAlert';
import IconUsersGroup from '../Icon/IconUsersGroup';
import IconGlobe from '../Icon/IconGlobe';
import { Link } from 'react-router-dom';

const EmployeesTabel = () => {
    const query = useQueryClient();
    const dispatch = useDispatch();

    const {
        isLoading: userLoading,
        data: usersData,
        status: userStatus,
    } = useQuery({
        queryKey: ["users"],
        queryFn: getAllUsers,
    });

    const { user } = useSelector((state) => state.user);
    // useEffect(() => {
    //     dispatch(setPageTitle('Employees '));
    // });
    const [modal10, setModal10] = useState(false);
    const [addContactModal, setAddContactModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [value, setValue] = useState('list');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('active');
    const [filteredItems, setFilteredItems] = useState(usersData?.users);

    // useEffect(() => {
    //     setFilteredItems(() => {
    //         return usersData?.users.filter((item) => {
    //             // Agar admin hai, to sabhi users dikhayein
    //             if (user?.role === "admin") {
    //                 return item.userName?.toLowerCase().includes(search?.toLowerCase());
    //             }

    //             // Agar manager hai, to sirf "user" role wale dikhayein
    //             if (user?.role === "manager") {
    //                 return (
    //                     item.role === "user" &&
    //                     item.userName?.toLowerCase().includes(search?.toLowerCase())
    //                 );
    //             }

    //             return false; // Baaki kisi role ke liye kuch nahi dikhayenge
    //         });
    //     });
    // }, [search, usersData]);



    useEffect(() => {
        const list = (usersData?.users || []).filter((item) => {
            const matchesSearch = item.userName?.toLowerCase().includes(search?.toLowerCase());
            const matchesStatus = statusFilter === 'all' ? true : item.status === statusFilter;

            if (user?.role === "admin") {
                return matchesSearch && matchesStatus;
            }

            if (user?.role === "manager") {
                return item.role === "user" && matchesSearch && matchesStatus;
            }

            return false;
        });

        setFilteredItems(list);
    }, [
        search,
        usersData,
        user?.role,      // NEW: ensure recompute if role changes
        statusFilter     // NEW: recompute when status filter changes
    ]);

    const removeUserMutation = useMutation({
        mutationKey: ["updateStatus"],
        mutationFn: () => updateStatus(selectedUser?._id, { status: selectedUser?.status === "active" ? "suspended" : "active" }
        ),
        onSuccess: (response) => {
            query.invalidateQueries("users");
            setModal10(false);
            coloredToast(
                "success",
                response.data.message,
                // `Sales Person has been ${selectedUser?.status === "active" ? "Suspended" : "Activated"} Successfully`,
                "top",
                null,
                null,
                1000
            );
        },
        onError: (error) => {
            console.log(error);
            coloredToast("danger", error?.response?.data?.message, "top");
        },
    });
    const showMessage = (msg = '', type = 'success') => {
        const toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };
    const form = useRef(null);
    const mutation = useMutation({
        mutationKey: ["editProfile"],
        mutationFn: (data) => updateProfile(data, selectedUser?._id),
        onSuccess: (response) => {
            query.invalidateQueries("users");
            form.current.reset();
            setAddContactModal(false);
            coloredToast(
                "success",
                "User Role has been updated successfully",
                "top",
                null,
                null,
                15000
            );

        },
        onError: (error) => {
            console.log(error);
            coloredToast("danger", error?.response?.data?.message, "top");
        },
    });

    const submitForm = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const role = {
            role: formData.get('role'),
            isRemoteAccessAllowed: formData.get('isRemoteAccessAllowed')
        };
        mutation.mutate(role);
    };

    // console.log("selecteeeeeeeeeeeed userrrrrrrr", selectedUser)
    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h1 className="screenHeading"> {user?.role === "admin" ? "Employees" : "Sales Persons"}</h1>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    {/* <div className="flex gap-3">
                        <div>
                            <button type="button" className={`btn btn-outline-primary p-2 ${value === 'list' && 'bg-primary text-white'}`} onClick={() => setValue('list')}>
                                <IconListCheck />
                            </button>
                        </div>
                        <div>
                            <button type="button" className={`btn btn-outline-primary p-2 ${value === 'grid' && 'bg-primary text-white'}`} onClick={() => setValue('grid')}>
                                <IconLayoutGrid />
                            </button>
                        </div>
                    </div> */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="form-select py-2"
                        >
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>
                    <div className="relative">
                        <input type="text" placeholder="Search Contacts" className="form-input py-2 ltr:pr-11 rtl:pl-11 peer" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <button type="button" className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                            <IconSearch className="mx-auto" />
                        </button>
                    </div>
                </div>
            </div>
            {value === 'list' && (
                <div className="mt-5 panel p-0 border-0 overflow-hidden">
                    <div className="table-responsive">
                        <table className=" table-hover">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    {/* <th>Phone</th> */}
                                    <th className="!text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems?.map((contact) => {
                                    return (
                                        <tr key={contact.id}>
                                            <td>
                                                <div className="flex items-center w-max">
                                                    <Link to={`/sales-persons/${contact._id}`} className="flex items-center hover:underline">
                                                        {contact.path && (
                                                            <div className="w-max">
                                                                <img src={`/assets/images/${contact.path}`} className="h-8 w-8 rounded-full object-cover ltr:mr-2 rtl:ml-2" alt="avatar" />
                                                            </div>
                                                        )}
                                                        {!contact.path && contact.name && (
                                                            <div className="grid place-content-center h-8 w-8 ltr:mr-2 rtl:ml-2 rounded-full bg-primary text-white text-sm font-semibold"></div>
                                                        )}
                                                        {!contact.path && !contact.name && (
                                                            <div className="border border-primary dark:border-primary rounded-full p-2 ltr:mr-2 rtl:ml-2">
                                                                <IconUser className="w-4.5 h-4.5 text-primary" />
                                                            </div>
                                                        )}
                                                        <div>{contact.userName}</div>
                                                    </Link>
                                                </div>
                                            </td>
                                            <td>{contact.userEmail}</td>
                                            <td className="whitespace-nowrap capitalize">{contact?.role === "user"
                                                ? "Sales Person"
                                                : contact?.role === "ppc"
                                                    ? "PPC"
                                                    : contact?.role}
                                            </td>
                                            <td className="">
                                                <div className={`${contact?.status === "active" ? "text-success" : "text-danger"} `} >
                                                    {contact?.status === "active" ? "Active" : "Suspended"}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex gap-4 items-center justify-center">
                                                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => {
                                                        setSelectedUser(contact);
                                                        setAddContactModal(true);
                                                    }}>
                                                        Edit
                                                    </button>
                                                    <button type="button" className={`btn btn-sm ${contact?.status === "active" ? "btn-outline-danger" : "btn-outline-success"} `} onClick={() => {
                                                        setSelectedUser(contact);
                                                        setModal10(true);
                                                    }}>
                                                        {contact?.status === "active" ? "Suspend" : "Activate"}

                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {value === 'grid' && (
                <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-5 w-full">
                    {filteredItems.map((contact) => {
                        return (
                            <div className="bg-white dark:bg-[#1c232f] rounded-md overflow-hidden text-center shadow relative" key={contact.id}>
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
                                            <div className="text-xl">{contact.userName}</div>
                                            <div className="text-white-dark capitalize">{contact.role === "user" ? "Sales Person" : contact.role}</div>
                                        </div>
                                        <div className="mt-6 grid grid-cols-1 gap-4 ltr:text-left rtl:text-right">
                                            <div className="flex items-center">
                                                <div className="flex-none ltr:mr-2 rtl:ml-2">Email :</div>
                                                <div className="truncate text-white-dark">{contact.userEmail}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex gap-4 absolute bottom-0 w-full ltr:left-0 rtl:right-0 p-6">
                                        <button type="button" className="btn btn-outline-primary w-1/2" onClick={() => editUser(contact)}>
                                            Edit
                                        </button>
                                        <button type="button" className="btn btn-outline-danger w-1/2" onClick={() => {
                                            setSelectedUser(contact);
                                            setModal10(true);
                                        }}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Transition appear show={addContactModal} as={Fragment}>
                <Dialog as="div" open={addContactModal} onClose={() => setAddContactModal(false)} className="relative z-[51]">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => setAddContactModal(false)}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        Update User Role
                                    </div>
                                    <div className="p-5">
                                        <form
                                            ref={form}
                                            onSubmit={submitForm}
                                        >
                                            <div>
                                                <label htmlFor="role">Role</label>
                                                <div className="relative text-white-dark">
                                                    <select
                                                        defaultValue={selectedUser?.role}
                                                        id="role"
                                                        name="role"
                                                        className="form-select ps-12 placeholder:text-white-dark"
                                                    >
                                                        <option value="" disabled selected hidden>
                                                            Select Role
                                                        </option>
                                                        <option value={"manager"}>
                                                            Manager
                                                        </option>
                                                        <option value={"user"}>
                                                            Sales Person
                                                        </option>
                                                        <option value={"ppc"}>
                                                            PPC
                                                        </option>
                                                    </select>
                                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                        <IconUsersGroup fill={true} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="isRemoteAccessAllowed">Allow Remote Access</label>
                                                <div className="flex items-center gap-6 mt-2">
                                                    <span className="text-white-dark">
                                                        <IconGlobe fill={true} />
                                                    </span>
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name="isRemoteAccessAllowed"
                                                            value="true"
                                                            defaultChecked={selectedUser?.isRemoteAccessAllowed === true}
                                                            className="form-radio"
                                                        />
                                                        True
                                                    </label>
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name="isRemoteAccessAllowed"
                                                            value="false"
                                                            defaultChecked={selectedUser?.isRemoteAccessAllowed === false}
                                                            className="form-radio"
                                                        />
                                                        False
                                                    </label>

                                                </div>
                                            </div>

                                            <div className="flex justify-end items-center mt-8">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setAddContactModal(false)}>
                                                    Cancel
                                                </button>
                                                <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4" >
                                                    Update
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <Transition appear show={modal10} as={Fragment}>
                <Dialog as="div" open={modal10} onClose={() => setModal10(false)}>
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
                        id="slideIn_down_modal"
                        className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto"
                    >
                        <div className="flex items-start justify-center min-h-screen px-4">
                            <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark animate__animated animate__slideInDown">
                                <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                    <h5 className="font-bold text-lg">Warning !</h5>
                                    <button
                                        onClick={() => setModal10(false)}
                                        type="button"
                                        className="text-white-dark hover:text-dark"
                                    >
                                        <IconX />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <p>
                                        Are you sure you want {selectedUser?.status === "active" ? "Suspend" : "Activate"} {selectedUser?.userName} ?
                                    </p>
                                    <div className="flex justify-end items-center mt-8">
                                        <button
                                            onClick={() => setModal10(false)}
                                            type="button"
                                            className="btn btn-outline-danger"
                                        >
                                            Discard
                                        </button>
                                        <button
                                            onClick={() => removeUserMutation.mutate(selectedUser?._id)}
                                            type="button"
                                            className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                        >
                                            Yes
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default EmployeesTabel;