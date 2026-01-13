import { Dialog, Transition } from "@headlessui/react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { Fragment } from "react";
import Flatpickr from "react-flatpickr";
import IconX from "../Icon/IconX";
import IconArrowLeft from "../Icon/IconArrowLeft";
import IconXCircle from "../Icon/IconXCircle";
import { getSalesByLead } from "../../api/salesApi";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";


// JSX se pehle (component ke andar hi) helper bana lein:
const getStatusOptions = (role) => {
    if (role === "upsell") {
        return ["Just Contacted", "Welcome Email"];
    }
    if (role === "projectManager") {
        return ["Contacted", "In Progress"];
    }
    // frontsell (ya empty) -> existing full list
    return ["New", "Lost", "Follow Up", "Converted", "Qualified", "Contacted", "Invalid"];
};


const humanizeSaleType = (t) => (t ? t.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase()) : "—");
const formatAmount = (n) =>
    typeof n === "number" ? new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(n) : "—";
const formatDateTime = (d) => (d ? new Date(d).toLocaleString() : "—");

const SaleInfo = ({ data, leadId, user }) => {
    if (!data.sale) return null;
    const sale = data?.sale

    const closedBy =
        sale?.salesPerson
            ? `${sale.salesPerson.userName ?? "—"} (${sale.salesPerson.userEmail ?? "—"})`
            : "—";

    return (
        <div className="mt-4 rounded-xl border p-4 bg-gray-50 dark:bg-black-dark-light">
            {/* Header + Actions */}
            <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold">Deal Information (read-only)</h2>
                {(user.role == "admin" || user.role == "pmManager" || user.role == "pm") && (
                    <Link
                        to={`/clients/${leadId}`}
                        className="btn btn-sm btn-outline-primary"
                    >
                        View All
                        <IconArrowLeft className="h-4 w-4" />
                    </Link>
                )}
            </div>

            {/* Stats */}
            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border bg-white/60 p-3 dark:bg-black/30">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">Total Closed</div>
                    <div className="mt-1 text-xl font-semibold">{data?.totalSales ?? 0}</div>
                </div>
                <div className="rounded-lg border bg-white/60 p-3 dark:bg-black/30">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">Frontsell</div>
                    <div className="mt-1 text-xl font-semibold">{data?.frontSellCount ?? 0}</div>
                </div>
                <div className="rounded-lg border bg-white/60 p-3 dark:bg-black/30">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">Upsell</div>
                    <div className="mt-1 text-xl font-semibold">{data?.upsellCount ?? 0}</div>
                </div>
            </div>

            {["admin", "upsellManager", "upsell", "upfront"].includes(user?.role) && (
                <fieldset disabled className="grid gap-3 sm:grid-cols-2">
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-600 mb-1">Deal Type</label>
                        <input className="form-input" value={humanizeSaleType(sale.saleType)} readOnly />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs text-gray-600 mb-1">Amount</label>
                        <input className="form-input" value={formatAmount(sale.amount)} readOnly />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs text-gray-600 mb-1">Deal Date</label>
                        <Flatpickr
                            value={sale.date ? new Date(sale.date) : null}
                            options={{ dateFormat: "Y-m-d" }}
                            disabled
                            className="form-input"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs text-gray-600 mb-1">Closed By</label>
                        <input className="form-input" value={closedBy} readOnly />
                    </div>

                    <div className="flex flex-col sm:col-span-2">
                        <label className="text-xs text-gray-600 mb-1">Services Provided</label>
                        <textarea
                            className="textarea form-input"
                            rows={2}
                            value={(sale.services && sale.services.length ? sale.services.join(", ") : "—")}
                            readOnly
                        />
                    </div>

                    <div className="flex flex-col sm:col-span-2">
                        <label className="text-xs text-gray-600 mb-1">Notes / Description</label>
                        <textarea
                            className="textarea form-input"
                            rows={3}
                            value={sale.saleDescription || "—"}
                            readOnly
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs text-gray-600 mb-1">Created At</label>
                        <input className="form-input" value={formatDateTime(sale.createdAt)} readOnly />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs text-gray-600 mb-1">Updated At</label>
                        <input className="form-input" value={formatDateTime(sale.updatedAt)} readOnly />
                    </div>

                </fieldset>
            )}
        </div >
    );
};
const LeadDetailsModal = ({
    isOpen,
    onClose,
    lead,
    onSubmit,
    user,
    userOptions,
}) => {
    const leadId = lead?._id ?? null;
    const {
        data,
        isFetching,
        isError,
        error,
        status,
    } = useQuery({
        queryKey: ["leadSale", leadId],
        queryFn: () => getSalesByLead(leadId),
        enabled: Boolean(isOpen && leadId),
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        retry: 1,
    });

    const info = data?.message;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" open={isOpen} onClose={onClose}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0" />
                </Transition.Child>

                <div className="fixed inset-0 bg-[black]/90 z-[999] overflow-y-auto">
                    <div className="flex min-h-screen items-start justify-center px-4">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="panel my-8 w-full lg:max-w-4xl overflow-hidden rounded-lg border-0 text-black dark:text-white-dark">
                                <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600" onClick={onClose}>
                                    <IconX />
                                </button>

                                <h2 className="text-xl font-extrabold uppercase text-primary md:text-2xl">Lead Details</h2>

                                <Formik
                                    initialValues={{
                                        id: lead?._id,
                                        name: lead?.userName || '',
                                        email: lead?.userEmail || '',
                                        phone: lead?.userPhone || '',
                                        message: lead?.message || '',
                                        date: lead?.date,
                                        leadType: lead?.leadType,
                                        source: lead?.source,
                                        companyName: lead?.companyName || '',
                                        status: lead?.status || '',
                                        fullPageUrl: lead?.fullPageUrl || '',
                                        ipInfo: lead?.ipInfo || {},
                                        assigned:
                                            lead?.assigned?.length > 0
                                                ? lead?.assigned?.map((assignee) => ({
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
                                    onSubmit={onSubmit}
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
                                                        value={lead?.date}
                                                        placeholder="Select the Date"
                                                        options={{ dateFormat: "Y-m-d", position: "auto left" }}
                                                        className="form-input"
                                                        onChange={(selectedDate) => {
                                                            setFieldValue("date", selectedDate[0]);
                                                        }}

                                                    />
                                                </div>
                                                {!(user?.role === "upsell" || user?.role === "projectManager" || user?.role === "upsellManager") && (
                                                    <>
                                                        <div className="" >
                                                            <label htmlFor="fullPageUrl">Full Page URL</label>
                                                            <Field
                                                                type="text"
                                                                name="fullPageUrl"
                                                                className="form-input protected-content"
                                                                disabled
                                                            />
                                                        </div>
                                                        <div className="col-span-3" >
                                                            <label htmlFor="message">Message/Subject</label>
                                                            <Field
                                                                as="textarea"
                                                                name="message"
                                                                className="form-textarea protected-content"
                                                                rows="3"
                                                                disabled
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                                {user.role !== "user" || user.role !== "salesUser" || values.ipInfo && Object.keys(values.ipInfo).length > 0 && (
                                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                                        <h4 className="font-semibold mb-3 text-primary text-xl">IP Information</h4>
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
                                                {!(user?.role === "upsell" || user?.role === "projectManager" || user?.role === "upsellManager") && (
                                                    <>
                                                        <div className="form-group mb-2 flex-1">
                                                            <label htmlFor="leadType">Select Type</label>
                                                            <Field disabled={["frontSell", "manager"].includes(user.role)} as="select" name="leadType" className="form-input">
                                                                <option value="" disabled selected hidden>
                                                                    Select Lead Type
                                                                </option>
                                                                <option value="chat">Chat</option>
                                                                <option value="signUp">SignUp</option>
                                                                <option value="inbound">Inbound</option>
                                                                <option value="social">Social</option>
                                                            </Field>
                                                            <ErrorMessage
                                                                name="leadType"
                                                                component="div"
                                                                className="text-red-600"
                                                            />
                                                        </div>
                                                        <div className="form-group mb-2 flex-1">
                                                            <label htmlFor="source">Select Source</label>
                                                            <Field disabled={["frontSell", "manager"].includes(user.role)} as="select" name="source" className="form-input">
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
                                                    </>
                                                )}
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

                                            {isFetching && <div>Loading…</div>}
                                            {isError && <div className="error">Error: {error?.message ?? "Failed to load sale"}</div>}
                                            {!isFetching && !isError && !data?.sale && <div>{info ?? "No sale found for this lead."}</div>}


                                            {data?.sale && (
                                                <SaleInfo data={data} leadId={lead?._id} user={user} />
                                            )}

                                            <div className="">
                                                <div className="border mb-2 px-5 py-3 rounded-xl">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <label className="font-semibold text-primary text-xl">Assigned To</label>
                                                    </div>
                                                    <FieldArray name="assigned">
                                                        {({ push, remove, form }) => (
                                                            <div className="space-y-4">
                                                                {values.assigned.map((assignee, index) => {
                                                                    const allowedStatuses = getStatusOptions(assignee.role);
                                                                    if (assignee.status && !allowedStatuses.includes(assignee.status)) {
                                                                        form.setFieldValue(`assigned[${index}].status`, allowedStatuses[0] || "");
                                                                    }
                                                                    return (<div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 relative border dark:border-none p-4 rounded-md bg-gray-50 dark:bg-black-dark-light">
                                                                        {!assignee.assignedAt && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => remove(index)}
                                                                                className="absolute top-2 right-2  text-red-600 hover:text-red-800"
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
                                                                                value={assignee.user}
                                                                                disabled={!!assignee.assignedAt}
                                                                            >
                                                                                <option value="" disabled hidden>
                                                                                    Select User
                                                                                </option>
                                                                                {/* {userOptions?.allUsers?.map((option) => (
                                                                                    <option key={option._id} value={option._id}>
                                                                                        {option.userName}
                                                                                    </option>
                                                                                ))} */}
                                                                                {(() => {
                                                                                    // Extract the userId from current assignee
                                                                                    const assignedUserId = assignee.user;

                                                                                    // Check if user is already in teamMembers
                                                                                    const isUserInTeam = userOptions?.teamMembers?.some(user => user._id === assignedUserId);

                                                                                    // If user is not in team, find him from allUsers to include in dropdown
                                                                                    const extraUser = !isUserInTeam
                                                                                        ? userOptions?.allUsers?.find(user => user._id === assignedUserId)
                                                                                        : null;

                                                                                    // Final list: team members + (if needed) the extra old assigned user
                                                                                    const combinedUsers = [
                                                                                        ...userOptions?.teamMembers,
                                                                                        ...(extraUser ? [extraUser] : [])
                                                                                    ];

                                                                                    return combinedUsers.map((option) => (
                                                                                        <option key={option._id} value={option._id}>
                                                                                            {option.userName}
                                                                                        </option>
                                                                                    ));
                                                                                })()}
                                                                            </Field>
                                                                        </div>
                                                                        <div>
                                                                            <label>Role</label>
                                                                            <Field
                                                                                as="select"
                                                                                name={`assigned[${index}].role`}
                                                                                className="form-input"
                                                                                onChange={(e) => {
                                                                                    const newRole = e.target.value;
                                                                                    form.setFieldValue(`assigned[${index}].role`, newRole);

                                                                                    const nextAllowed = getStatusOptions(newRole);
                                                                                    const current = form.values.assigned[index].status;

                                                                                    if (!nextAllowed.includes(current)) {
                                                                                        form.setFieldValue(`assigned[${index}].status`, nextAllowed[0] || "");
                                                                                    }
                                                                                }}
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
                                                                                <option value="" disabled>Select Status</option>
                                                                                {allowedStatuses.map((st) => (
                                                                                    <option key={st} value={st}>{st}</option>
                                                                                ))}
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
                                                                    )

                                                                })}
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
                                <div className="mt-6">
                                    {lead?.comments?.length > 0 &&
                                        lead?.comments
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
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition >
    );
};

export default LeadDetailsModal;