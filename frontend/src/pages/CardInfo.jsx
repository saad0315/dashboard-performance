// import React from 'react';
// import { Form, Formik } from 'formik';
// import * as Yup from "yup";
// import { useMutation } from '@tanstack/react-query';
// import { coloredToast } from '../components/Alerts/SimpleAlert';
// import PaymentCardFields from '../components/Forms/PaymentCardFields/PaymentCardFields';
// import { addCardInfo } from '../api/cardInfo';

// export default function CardInfo() {

//     const validationSchema = Yup.object().shape({
//         number: Yup.string().required('Card Number is required').min(12, 'Invalid Card Number').max(19, 'Invalid Card Number'),
//         name: Yup.string().required('Name is required'),
//         expiry: Yup.string()
//             .required('Expiry date is required')
//             .matches(/\d\d\/\d\d/, 'Invalid Expiry Date'),
//         cvc: Yup.string().required('CVC is required').length(3, 'CVC must be 3 digits'),
//     });

//     const mutation = useMutation({
//         mutationKey: ["addCardInfo"],
//         mutationFn: addCardInfo,
//         onSuccess: (response) => {
//             coloredToast(
//                 "success",
//                 "Card Info Added Successfully !",
//                 "top",
//                 null,
//                 null,
//                 15000
//             );
//         },
//         onError: (error) => {
//             console.log(error);
//             coloredToast("danger", error?.response?.data?.message, "top");
//         },
//     });
//     const submitForm = (values) => {
//         console.log("Here is values", values)
//         // mutation.mutate(values);
//     };

//     return (
//         <div className=" p-2 lg:p-3 rounded-2xl">
//             <div className=" p-3 lg:p-8">
//                 <div className="mb-5 flex flex-col  justify-between sm:flex-row  sm:gap-5 md:gap-10 gap-0">
//                     <h1 className="text-xl font-bold">Card Info</h1>
//                 </div>

//                 <Formik initialValues={{ number: '', name: '', expiry: '', cvc: '' }} validationSchema={validationSchema} onSubmit={submitForm}>
//                     {({ errors, touched, submitCount, setFieldValue }) => (
//                         <Form className="space-y-5">
//                             <PaymentCardFields errors={errors} touched={touched} setFieldValue={setFieldValue} />
//                             <button disabled={mutation.isPending} type="submit" className="btn btn-primary !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
//                                 {mutation.isPending && (
//                                     <span className="animate-spin border-2  border-primary border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle "></span>
//                                 )}{' '}
//                                 Submit
//                             </button>
//                         </Form>
//                     )}
//                 </Formik>
//             </div>
//         </div>
//     );
// }




import React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from "yup";
import { useMutation } from '@tanstack/react-query';
import { coloredToast } from '../components/Alerts/SimpleAlert';
import PaymentCardFields from '../components/Forms/PaymentCardFields/PaymentCardFields';
import { addCardInfo } from '../api/cardInfo';
import { useParams } from 'react-router-dom';

export default function CardInfo() {
    const { id: id } = useParams();

    // Validation schema for form fields
    const validationSchema = Yup.object().shape({
        number: Yup.string().required('Card Number is required').min(12, 'Invalid Card Number').max(19, 'Invalid Card Number'),
        name: Yup.string().required('Name is required'),
        expiry: Yup.string()
            .required('Expiry date is required')
            .matches(/\d\d\/\d\d/, 'Invalid Expiry Date'),
    });

    // Mutation for adding card info
    const mutation = useMutation({
        mutationKey: ["addCardInfo"],
        mutationFn: (data) => addCardInfo(data, id),
        onSuccess: (response) => {
            coloredToast(
                "success",
                "Card Info Added Successfully !",
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

    // Form submission logic
    const submitForm = (values, { setSubmitting }) => {
        // We omit the CVV for security reasons, only send relevant card info and issuer
        const cardData = {
            name: values.name,
            number: values.number,
            expiry: values.expiry,
            issuer: values.issuer, // Send issuer (card type)
        };

        mutation.mutate(cardData, {
            onSuccess: () => setSubmitting(false),
            onError: () => setSubmitting(false),
        });
    };

    return (
        <div className="p-2 lg:p-3 rounded-2xl">
            <div className="p-3 lg:p-8">
                <div className="mb-5 flex flex-col justify-between sm:flex-row sm:gap-5 md:gap-10 gap-0">
                    <h1 className="text-xl font-bold">Card Info</h1>
                </div>

                <Formik
                    initialValues={{ number: '', name: '', expiry: '', issuer: '' }} // issuer added to initialValues
                    validationSchema={validationSchema}
                    onSubmit={submitForm}
                >
                    {({ errors, touched, submitCount, setFieldValue, isSubmitting }) => (
                        <Form className="space-y-5">
                            <PaymentCardFields errors={errors} touched={touched} setFieldValue={setFieldValue} />
                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className="btn btn-primary !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                            >
                                {isSubmitting && (
                                    <span className="animate-spin border-2 border-primary border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle "></span>
                                )}
                                {' '}Submit
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
