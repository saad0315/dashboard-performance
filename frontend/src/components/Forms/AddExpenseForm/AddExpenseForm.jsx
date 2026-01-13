import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { coloredToast } from "../../Alerts/SimpleAlert";
import { addExpense } from "../../../api/expenseApi";
import { Link } from "react-router-dom";

function AddExpenseForm() {
  const validationSchema = Yup.object({
    amount: Yup.string().required("Please Enter Expense Amount!"),
    category: Yup.string().required("Please select Expense Category !"),
  });

  const mutation = useMutation({
    mutationKey: ["addExpense"],
    mutationFn: addExpense,
    onSuccess: (response) => {
      coloredToast(
        "success",
        "Expense Added Successfully !",
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
  const onSubmit = (values, { resetForm }) => {
    mutation.mutate(values, {
      onSuccess: () => resetForm(),
    });
  };

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse mb-5">
        <li>
          <Link to="#" className="text-primary hover:underline">
            Expense
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Form</span>
        </li>
      </ul>

      <div className="panel w-full max-w-[600px] mx-auto ">
      <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">
                Add Expense
              </h1>
        {/* <div className="flex items-center bg-white rounded-[20px] p-[20px] space-x-4 shadow-xl "> */}
        <div className="w-full h-full fl:p-1 sm:p-2   ">
          <Formik
            initialValues={{
              amount: "",
              category: "",
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
                  <label htmlFor="category">Category</label>
                  <Field
                    as="select"
                    id="category"
                    name="category"
                    className="form-select"
                    onChange={(e) => setFieldValue("category", e.target.value)}
                  >
                    <option disabled value="" label="Select Expense Category" />
                    {[
                      "Advertising",
                      "Travel",
                      "Office Supplies",
                      "Utilities",
                      "Other",
                    ].map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="category"
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
                    Add Expense
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

export default AddExpenseForm;
