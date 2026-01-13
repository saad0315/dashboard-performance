import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { coloredToast } from "../../Alerts/SimpleAlert";
import { getAllMembers } from "../../../api/userApi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addSales } from "../../../api/salesApi";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import Select from "react-select";
import UploadFile from "../../UploadFile";
import { useSelector } from "react-redux";

function AddSalesForm() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const {
    isLoading: usersLoading,
    data: usersData,
    status: usersStatus,
  } = useQuery({
    queryKey: ["members"],
    queryFn: getAllMembers,
  });

  const { user } = useSelector((state) => state.user);

  const validationSchema = Yup.object({
    amount: Yup.string().required("Please Enter Sale Amount!"),
    saleDescription: Yup.string().required("Please Enter Sale Description!"),
    services: Yup.array()
      .of(Yup.string())
      .min(1, "Please select at least one service!")
      .required("Please select services!"), salesPerson: Yup.string().required("Please select Sales Person!"),
    saleType: Yup.string().required("Please select Sales Person!"),
    saleAgreement: Yup.mixed().optional(),
  });

  const mutation = useMutation({
    mutationKey: ["addSales"],
    mutationFn: addSales,
    onSuccess: (response) => {
      coloredToast(
        "success",
        "Sale Added Successfully !",
        "top",
        null,
        null,
        15000
      );
      navigate(`/sales/all-sales`);
    },
    onError: (error) => {
      console.log(error);
      coloredToast("danger", error?.response?.data?.message, "top");
    },
  });
  const onSubmit = (values, { resetForm }) => {
    // Create FormData to handle file upload
    const formData = new FormData();

    // Add lead ID
    formData.append("lead", leadId);

    // Add comments if present
    if (values?.comments && values.comments.trim()) {
      const comment = {
        text: values.comments.trim(),
        postedBy: user?._id,
      };

      // Stringify the object before appending
      formData.append("comments", JSON.stringify([comment]));
    }


    // Add all other form values
    Object.keys(values).forEach(key => {
      if (key === 'comments') return;
      if (key === 'services') {
        // Handle array of services
        values[key].forEach(service => {
          formData.append('services[]', service);
        });
      } else if (key === 'saleAgreement' && values[key]) {
        // Handle file upload
        formData.append('file', values[key]);
      } else if (values[key] !== null && values[key] !== '') {
        formData.append(key, values[key]);
      }
    });


    // const combinedValues = {
    //   lead: leadId,
    //   ...values,
    // };

    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }


    mutation.mutate(formData, {
      onSuccess: () => resetForm(),
    });
  };
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
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse mb-5">
        <li>
          <Link to="#" className="text-primary hover:underline">
            Sales
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Form</span>
        </li>
      </ul>

      <div className="panel w-full max-w-[600px] mx-auto ">
        {/* <div className="flex items-center bg-white rounded-[20px] p-[20px] space-x-4 shadow-xl "> */}
        <h1 className="screenHeading">
          Add Sales
        </h1>
        <div className="w-full h-full fl:p-1 sm:p-2   ">
          <Formik
            initialValues={{
              amount: "",
              salesPerson: "",
              saleType: "",
              date: new Date(),
              saleAgreement: null,
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
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
                <div className="flex gap-2 flex-col md:flex-row">
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
                </div>
                <div>
                  <label htmlFor="saleDescription">Sale Description</label>
                  <Field
                    as="textarea"
                    name="saleDescription"
                    className="form-textarea protected-content"
                    rows="3"
                    placeholder="Sale Description here... "
                  />
                  <ErrorMessage
                    name="saleDescription"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="flex gap-2 flex-col md:flex-row">

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
                </div>
                <div className="w-full mb-2">
                  <label htmlFor="saleAgreement" >Sale Agreement</label>
                  <UploadFile
                    name="saleAgreement"
                    // label="Sale Agreement"
                    accept=".pdf,.doc,.docx"
                    maxSize={25} // 5MB max
                    allowedTypes={['.pdf', '.doc', '.docx', '.txt']}
                    placeholder="Choose sale agreement file"
                    setFieldValue={setFieldValue}
                    // errors={errors}
                    // touched={touched}
                    values={values}
                    showFileName={true}
                  />
                  <ErrorMessage
                    name="saleAgreement"
                    component="div"
                    className="text-red-500"
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
                    {mutation.isPending ? "Adding Sale..." : "Add Sale"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default AddSalesForm;
