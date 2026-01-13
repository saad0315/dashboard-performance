import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import IconX from "../Icon/IconX";

const serviceOptions = [
    "Book Cover Design", "Book Writing", "Book Publishing", "Audiobook Production", "Website Design",
    "Website Development", "SEO", "Social Media Marketing", "Google Ads", "Branding & Logo Design",
    "UI/UX Design", "Content Writing", "Video Editing", "Software Maintenance"
];

export default function InvoiceModal({
    isOpen,
    onClose,
    initialValues,
    onSubmit,
    isSubmitting,
    usersData,
    mode = "add", // 'add', 'edit', or 'view'
}) {
    const isViewMode = mode === "view";
    const validationSchema = Yup.object({
        userName: Yup.string().required('Client name is required'),
        userEmail: Yup.string().email("Invalid email").required('Email is required'),
        userPhone: Yup.string().required('Phone Number is required'),
        companyName: Yup.string().required('Brand Name is required'),
        saleType: Yup.string().required('Please Select Sale Type'),
        salesPerson: Yup.string().required('Please Select Sales Person'),
        billTo: Yup.object({
            name: Yup.string(),
            email: Yup.string().email('Invalid email'),
        }),
        services: Yup.array().of(
            Yup.object({
                type: Yup.string().required('Service type is required'),
                unitPrice: Yup.number().required('Price is required').positive(),
                quantity: Yup.number().min(1).required('Quantity is required'),
                customDescription: Yup.string(),
            })
        ),
        ...(mode === "edit" && {
            paymentStatus: Yup.string()
                .oneOf(['Pending', 'Partial', 'Paid'])
                .required('Payment status is required'),
        }),
    });


    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" open={isOpen} onClose={onClose}>
                <div className="modalDiv1">
                    <div className="modalDiv2">
                        <Dialog.Panel className="dialogDiv1">
                            <div className="dialogDiv2">
                                <button
                                    type="button"
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
                                    onClick={onClose}
                                >
                                    <IconX />
                                </button>
                                <h3 className="modalTitle">
                                    {mode === "edit" ? "Edit Invoice" : "Create Invoice"}
                                </h3>
                            </div>

                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                enableReinitialize
                                onSubmit={onSubmit}
                            >
                                {({ values, setFieldValue }) => (
                                    <Form className="mx-auto space-y-4 py-4 px-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Fields: Name, Email, Phone */}
                                            {/* Similar to your existing logic but now reusable */}
                                            {/* Example: */}
                                            <div>
                                                <label className="form-label">Client Name</label>
                                                <Field name="userName">
                                                    {({ field }) => (
                                                        <input
                                                            placeholder="Enter Client Name"
                                                            type="text"
                                                            className="form-input"
                                                            disabled={isViewMode}
                                                            {...field}
                                                            onChange={(e) => {
                                                                setFieldValue('userName', e.target.value);
                                                                setFieldValue('billTo.name', e.target.value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                                <ErrorMessage name="userName" component="div" className="text-red-500" />
                                            </div>

                                            <div>
                                                <label className="form-label">Client Email</label>
                                                <Field name="userEmail">
                                                    {({ field, form }) => (
                                                        <input
                                                            placeholder="Enter Client Email"
                                                            type="email"
                                                            className="form-input"
                                                            {...field}
                                                            onChange={(e) => {
                                                                form.setFieldValue('userEmail', e.target.value);
                                                                form.setFieldValue('billTo.email', e.target.value); // sync
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                                <ErrorMessage name="userEmail" component="div" className="text-red-500" />
                                            </div>

                                            <div>
                                                <label className="form-label">Client Phone</label>
                                                <Field name="userPhone">
                                                    {({ field, form }) => (
                                                        <input
                                                            placeholder="Enter Client Phone"
                                                            type="tel"
                                                            className="form-input"
                                                            {...field}
                                                            onChange={(e) => {
                                                                form.setFieldValue('userPhone', e.target.value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                                <ErrorMessage name="userPhone" component="div" className="text-red-500" />
                                            </div>

                                            <div>
                                                <label>Service Brand</label>
                                                <Field as="select" name="companyName" className="form-input">
                                                    <option value="" disabled>Select Brand</option>
                                                    <option value="Bellevue Publishers">Bellevue Publishers</option>
                                                    <option value="The Pulp House Publishing">The Pulp House Publishing</option>
                                                    <option value="Urban Quill Publishing">Urban Quill Publishing</option>
                                                    <option value="American Writers Association">American Writers Association</option>
                                                    <option value="Book Publishings">Book Publishings</option>
                                                </Field>
                                                <ErrorMessage name="comapnyName" component="div" className="text-red-500" />
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

                                            <div className="w-full mb-2">
                                                <label htmlFor="salesPerson">Sales Person</label>
                                                <Field
                                                    as="select"
                                                    id="salesPerson"
                                                    name="salesPerson"
                                                    className="form-select"
                                                    onChange={(e) =>
                                                        setFieldValue("salesPerson", e.target.value)
                                                    }
                                                >
                                                    <option
                                                        disabled
                                                        value=""
                                                        hidden
                                                        selected
                                                        label="Select Sales Person"
                                                    />
                                                    {Array.isArray(usersData?.teamMembers) &&
                                                        usersData?.teamMembers
                                                            ?.filter((item) => item.role !== "admin" && item.role !== "ppc")
                                                            ?.map((item) => (
                                                                <option key={item?._id} value={item?._id}>
                                                                    {item?.userName}
                                                                </option>
                                                            ))}
                                                </Field>
                                                <ErrorMessage
                                                    name="salesPerson"
                                                    component="div"
                                                    className="text-red-500"
                                                />
                                            </div>

                                            <div className='col-span-2'>
                                                <label className="form-label">Services</label>
                                                {values.services.map((service, index) => (
                                                    <div key={index} className="relative border border-slate-200/70 dark:border-slate-700/60 p-3 mb-2 rounded-md space-y-2">
                                                        {values.services.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const updated = [...values.services];
                                                                    updated.splice(index, 1);
                                                                    setFieldValue('services', updated);
                                                                }}
                                                                className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                                                                title="Remove this service"
                                                            >
                                                                <IconX />
                                                            </button>
                                                        )}

                                                        <div className="flex flex-wrap gap-2">
                                                            <div>
                                                                <label>Service Type</label>
                                                                <Field as="select" name={`services[${index}].type`} className="form-input">
                                                                    <option value="" disabled>Select Service</option>
                                                                    <option value="Book Cover Design">Book Cover Design</option>
                                                                    <option value="Book Writing">Book Writing</option>
                                                                    <option value="Book Publishing">Book Publishing</option>
                                                                    <option value="Book Printing">Book Printing</option>
                                                                    <option value="Book Marketing">Book Marketing</option>
                                                                    <option value="Audiobook Production">Audiobook Production</option>
                                                                    <option value="Website Design">Website Design</option>
                                                                    <option value="Website Development">Website Development</option>
                                                                    <option value="SEO">SEO</option>
                                                                    <option value="Social Media Marketing">Social Media Marketing</option>
                                                                    <option value="Google Ads">Google Ads</option>
                                                                    <option value="Branding & Logo Design">Branding & Logo Design</option>
                                                                    <option value="UI/UX Design">UI/UX Design</option>
                                                                    <option value="Content Writing">Content Writing</option>
                                                                    <option value="Video Editing">Video Editing</option>
                                                                    <option value="Software Maintenance">Software Maintenance</option>
                                                                    <option value="Other">Other</option>
                                                                </Field>
                                                                <ErrorMessage name={`services[${index}].type`} component="div" className="text-red-500" />
                                                            </div>

                                                            <div className="flex-1">
                                                                <label>Price</label>
                                                                <Field name={`services[${index}].unitPrice`} type="number" className="form-input" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <label>Quantity</label>
                                                                <Field name={`services[${index}].quantity`} type="number" className="form-input" />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label>Description</label>
                                                            <Field rows={4}
                                                                cols={50} as="textarea" name={`services[${index}].customDescription`} className="form-input" />
                                                        </div>

                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary mt-2"
                                                    onClick={() =>
                                                        setFieldValue('services', [
                                                            ...values.services,
                                                            { type: '', unitPrice: '', quantity: 1, customDescription: '' },
                                                        ])
                                                    }
                                                >
                                                    + Add Service
                                                </button>
                                            </div>


                                            {/* ...repeat for userEmail, phone, etc */}

                                            {/* Dropdowns: Company, SalesPerson, SaleType */}
                                            {/* Services List */}
                                            {/* Add/Remove Services */}
                                        </div>

                                        {mode === "edit" && (
                                            <div>
                                                <label className="form-label">Payment Status</label>
                                                <Field as="select" name="paymentStatus" className="form-input" disabled={isViewMode}>
                                                    <option value="Pending">Pending</option>
                                                    <option value="Partial">Partial</option>
                                                    <option value="Paid">Paid</option>
                                                </Field>
                                                <ErrorMessage name="paymentStatus" component="div" className="text-red-500" />
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center">
                                            <p>
                                                Total Amount:{" "}
                                                <span className="font-bold">
                                                    {values.services.reduce(
                                                        (acc, s) => acc + Number(s.unitPrice || 0) * Number(s.quantity || 0),
                                                        0
                                                    )}
                                                </span>
                                            </p>

                                            {!isViewMode && (
                                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                                    {isSubmitting ? "Submitting..." : mode === "edit" ? "Update" : "Create"}
                                                </button>
                                            )}
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}