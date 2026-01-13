import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addLeads } from "../../api/leadsApi";
import MaskedInput from "react-text-mask";
import IconPhone from "../../components/Icon/IconPhone";
import { coloredToast } from "../../components/Alerts/SimpleAlert";
import { getAllUsers } from "../../api/userApi";
import SweetAlert from "../../components/SweetAlert/SweetAlert";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import IconXCircle from "../../components/Icon/IconXCircle";

function AddLeads() {
  const navigate = useNavigate();
  const {
    isLoading: usersLoading,
    data: usersData,
    status: usersStatus,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });
  const { user } = useSelector((state) => state.user);
  const [phone, setPhone] = useState("");
  const validationSchema = Yup.object({
    userName: Yup.string().required("Required"),
    userEmail: Yup.string().email("Invalid email address").required("Required"),
    userPhone: Yup.string().required("Required"),
    companyName: Yup.string().required("Required"),
  });
  const mutation = useMutation({
    mutationKey: ["register"],
    mutationFn: addLeads,
    onSuccess: (response) => {

      coloredToast(
        "success",
        "Lead Added Successfully",
        "top",
        null,
        null,
        1500
      );

      if (response?.form?.status === "Converted") {
        navigate(`/add-sales/${response.form._id}`);
      } else {
        navigate(`/leads`);
      }
    },
    onError: (error) => {
      coloredToast("danger", error?.response?.data?.message, "top");
    },
  });

  const onSubmit = async (values, { resetForm }) => {
    SweetAlert.loading("Loading...");
    const combinedValues = {
      ...values,
      comments: values?.comments && values.comments.trim() ? [
        {
          text: values.comments,
          postedBy: user?._id,
        },
      ] : ([]),
    };

    // console.log('combined values', combinedValues)
    mutation.mutate(combinedValues, {
      onSuccess: () => resetForm(),
    });
  };
  const userOptions =
    Array.isArray(usersData?.users)
      ? usersData?.users
        .filter((item) => item.role !== "admin" && item.role !== "ppc")
        .map((item) => ({
          value: item._id,
          label: item.userName,
        }))
      : [];

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse mb-5">
        <li>
          <Link to="#" className="text-primary hover:underline">
            Add Lead
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Form</span>
        </li>
      </ul>

      <div className="panel w-full max-w-[800px] mx-auto">
        <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">
          Add Leads
        </h1>
        <div className="w-full h-full fl:p-1 sm:p-2  flex flex-col justify-center">
          <Formik
            initialValues={{
              userName: "",
              userEmail: "",
              userPhone: phone,
              companyName: "",
              leadType: "",
              source: "",
              status: "",
              assigned: [
                {
                  user: "",
                  role: "",
                  status: "New",
                  followUpEndDate: null,
                },
              ],
              comments: "",
              date: new Date(),
            }}

            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <div className="flex flex-col md:flex-row justify-between gap-4 pt-2 ">
                  <div className="form-group mb-2 flex-1">
                    <label htmlFor="userName">Full Name</label>
                    <Field
                      name="userName"
                      className="form-input"
                      placeholder="Full Name"
                    />
                    <ErrorMessage
                      name="userName"
                      component="div"
                      className="text-red-600"
                    />
                  </div>

                  <div className="form-group mb-2 flex-1">
                    <label htmlFor="userEmail">E-mail</label>
                    <Field
                      name="userEmail"
                      type="email"
                      className="form-input"
                      placeholder="User Email"
                    />
                    <ErrorMessage
                      name="userEmail"
                      component="div"
                      className="text-red-600"
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between gap-4 pt-2 ">
                  <div className="flex-1">
                    <label htmlFor="userPhone">Phone Number</label>
                    <div className="relative text-white-dark">
                      <MaskedInput
                        id="phoneMask"
                        type="text"
                        name="userPhone"
                        required
                        placeholder="(___) ___-____"
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setFieldValue("userPhone", e.target.value);
                        }}
                        className="form-input ps-10 placeholder:text-white-dark"
                        mask={[
                          "(",
                          /[0-9]/,
                          /[0-9]/,
                          /[0-9]/,
                          ")",
                          " ",
                          /[0-9]/,
                          /[0-9]/,
                          /[0-9]/,
                          "-",
                          /[0-9]/,
                          /[0-9]/,
                          /[0-9]/,
                          /[0-9]/,
                        ]}
                      />{" "}
                      <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconPhone fill={true} />
                      </span>
                    </div>
                    <ErrorMessage
                      name="userPhone"
                      component="div"
                      className="text-red-600"
                    />
                  </div>
                  <div className="form-group mb-2 flex-1">
                    <label htmlFor="companyName">Select Brand</label>
                    <Field as="select" name="companyName" className="form-input">
                      <option value="" disabled selected hidden>
                        Select Brand
                      </option>
                      <option value="Bellevue Publishers">Bellevue Publishers</option>
                      <option value="American Writers Association">American Writers Association</option>
                      <option value="The Pulp House Publishing">The Pulp House Publishing</option>
                      <option value="Book Publishings">Book Publishings</option>
                      <option value="Urban Quill Publishing">Urban Quill Publishing</option>
                      <option value="Amazon Book Publishing Agency">Amazon Book Publishing Agency</option>
                    </Field>
                    <ErrorMessage
                      name="companyName"
                      component="div"
                      className="text-red-600"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-4 pt-2 ">
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
                      <option value="" disabled selected hidden>
                        Select Lead Source
                      </option>
                      <option value="ppc">PPC</option>
                      <option value="smm">SMM</option>
                      <option value="referral">Referral</option>
                      <option value="cold">Cold</option>
                    </Field>
                    <ErrorMessage
                      name="source"
                      component="div"
                      className="text-red-600"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-4 pt-2 ">

                  <div className="form-group mb-2 flex-1">
                    <label htmlFor="status">Select Status</label>
                    <Field as="select" name="status" className="form-input">
                      <option value="" disabled selected hidden>
                        Select Status
                      </option>
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
                  <div className="flex-1">
                    <label htmlFor="date">Date</label>
                    <Flatpickr
                      name="date"
                      placeholder="Select the Date"
                      options={{ dateFormat: "Y-m-d", position: "auto left" }}
                      className="form-input"
                      onChange={(selectedDate) => {
                        setFieldValue("date", selectedDate[0]);  // Update Formik's state with the selected date
                      }}
                    />
                  </div>
                </div>
                <div className="">
                  <div className="border dark:border-white-dark my-2 px-5 py-3 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-semibold text-primary text-xl">Assigned To</label>
                    </div>
                    <FieldArray name="assigned">
                      {({ push, remove, form }) => (
                        <div className="space-y-4">
                          {values.assigned.map((assignee, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 relative border p-4 rounded-md dark:border-white-dark">
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
                <div className="flex justify-center items-center">
                  <button
                    disabled={mutation.isPending}
                    type="submit"
                    className="btn btn-primary !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                  >
                    {mutation.isPending && (
                      <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                    )}
                    Add
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

export default AddLeads;
