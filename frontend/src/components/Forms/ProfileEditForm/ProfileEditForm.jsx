import React, { useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "../../../api/userApi";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../../store/userSlice";
import { coloredToast } from "../../Alerts/SimpleAlert";
const validationSchema = Yup.object({
  userName: Yup.string().required("Full Name is required"),
});

export default function ProfileEditForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const { user } = useSelector((state) => state.user);

  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setFieldValue("profileImg", file);
      };
      reader.readAsDataURL(file);
    }
  };
  const form = useRef(null);
  const mutation = useMutation({
    mutationKey: ["editProfile"],
    mutationFn: (data) => updateProfile(data, user?._id),
    onSuccess: (response) => {
      dispatch(setUser(response?.data));
      localStorage.setItem("user", JSON.stringify(response?.data?.user));
      navigate("/");
      coloredToast(
        "success",
        "Profile Updated Successfully",
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

  const submitForm = (values, { resetForm }) => {
    mutation.mutate(values);
  };

  return (
    <div>
      <Formik
        initialValues={{
          userName: user?.userName || "",
          userMobile: user?.userMobile || "",
          userEmail: user?.userEmail || "",
        }}
        validationSchema={validationSchema}
        onSubmit={submitForm}
      >
        {({ handleSubmit, setFieldValue, resetForm }) => (
          <Form
            ref={form}
            onSubmit={handleSubmit}
            className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black"
          >
            <h6 className="text-lg font-bold mb-5">General Information</h6>
            <div className="flex flex-col sm:flex-row">
              <div className="ltr:sm:mr-4 rtl:sm:ml-4 w-full sm:w-2/12 mb-5">
                <label
                  htmlFor="image"
                  className="cursor-pointer mx-auto flex justify-center"
                >
                  {/* {user?.profileImgUrl ? (
                    <img
                      className="w-20 h-20 md:w-32 md:h-32 rounded-full mx-auto object-cover"
                      src={`https://bellevue-portal.b-cdn.net/${user?.profileImgUrl}`}
                      alt="userProfile"
                    />
                  ) : (
                    <div className="font-semibold text-6xl rounded-full w-20 h-20 md:w-32 md:h-32 flex items-center justify-center bg-gray-200 text-gray-700">
                      {user?.userName
                        ? user?.userName.charAt(0).toUpperCase()
                        : "N/A"}
                    </div>
                  )} */}
                  {image || user?.profileImgUrl ? (
                    <img
                      className="w-20 h-20 md:w-32 md:h-32 rounded-full mx-auto object-cover"
                      src={
                        image ||
                        `https://bellevue-portal.b-cdn.net/${user?.profileImgUrl}`
                      }
                      alt="userProfile"
                    />
                  ) : (
                    <div className="font-semibold text-6xl rounded-full w-20 h-20 md:w-32 md:h-32 flex items-center justify-center bg-gray-200 text-gray-700">
                      {user?.userName
                        ? user?.userName.charAt(0).toUpperCase()
                        : "N/A"}
                    </div>
                  )}
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, setFieldValue)}
                />
              </div>
              <div className="flex-1 max-w-[800px] space-y-5">
                <div>
                  <label htmlFor="userName">Full Name</label>
                  <Field
                    id="userName"
                    name="userName"
                    type="text"
                    placeholder="Jimmy Turner"
                    className="form-input"
                  />
                  <ErrorMessage
                    name="userName"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <div>
                  <label htmlFor="userMobile">Phone</label>
                  <Field
                    id="userMobile"
                    name="userMobile"
                    type="text"
                    placeholder="+1 (530) 555-12121"
                    className="form-input"
                  />
                  <ErrorMessage
                    name="userMobile"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div>
                  <label htmlFor="userEmail">Email</label>
                  <Field
                    id="userEmail"
                    disabled
                    name="userEmail"
                    type="email"
                    placeholder="Jimmy@gmail.com"
                    className="form-input"
                  />
                  <ErrorMessage
                    name="userEmail"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <div className="sm:col-span-2 mt-3">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
