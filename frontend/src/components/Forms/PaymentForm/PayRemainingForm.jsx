// // import React, { useEffect } from 'react';
// // import { useSelector, useDispatch } from 'react-redux';
// import * as Yup from 'yup';
// import { Form, Formik } from 'formik';
// import authorizeLogo from '../../../assets/authorizeLogo.webp';
// import { useMutation, useQuery } from '@tanstack/react-query';
// import BillingFields from '../BillingFields/BillingFields';
// import { getTransaction, invoiceApi } from '../../../api/invoiceApi';
// import { coloredToast } from '../../Alerts/SimpleAlert';
// import PaymentCardFields from '../PaymentCardFields/PaymentCardFields';
// import { useParams } from 'react-router-dom';

// export default function PayRemainingForm() {
//     const { id } = useParams()

//     // const dispatch = useDispatch();
//     // const { selectedPackage } = useSelector((state) => state.package);
//     // const { selectedInvoice } = useSelector((state) => state.project);
//     const billToData = {}
//     // const {
//     //     isLoading,
//     //     data: billToData,
//     //     status,
//     // } = useQuery({
//     //     queryKey: ['billTo'],
//     //     queryFn: () => getTransaction(selectedInvoice?.installments[0]?.transactionId),
//     //     enabled: !!selectedInvoice?.paymentStatus === 'Partial',
//     // });
//     // console.log('billto data', billToData, isLoading, status);

//     const billTo = billToData?.response?.transaction?.billTo;

//     const validationSchema = Yup.object().shape({
//         address: Yup.string().required('Please input your address!'),
//         city: Yup.string().required('Please input your city!'),
//         state: Yup.string().required('Please input your state!'),
//         zip: Yup.number().required('Please input your zip code!'),
//         country: Yup.string().required('Please input your country!'),
//         number: Yup.string().required('Card Number is required').min(12, 'Invalid Card Number').max(19, 'Invalid Card Number'),
//         name: Yup.string().required('Name is required'),
//         expiry: Yup.string()
//             .required('Expiry date is required')
//             .matches(/\d\d\/\d\d/, 'Invalid Expiry Date'),
//         cvc: Yup.string().required('CVC is required').length(3, 'CVC must be 3 digits'),
//     });

//     const mutation = useMutation({
//         mutationKey: ['payment'],
//         mutationFn: invoiceApi,
//         onSuccess: (response) => {
//             localStorage.removeItem('selectedPackage');
//             coloredToast('success', response?.data?.message, 'top', null, null, 15000);
//         },
//         onError: (error) => {
//             console.log(error);
//             coloredToast('danger', error?.response?.data?.message, 'top');
//         },
//     });

//     const submitForm = (values) => {
//         const combinedValues = {
//             billTo: {
//                 ...values,
//             },
//             creditCardNumber: values.number,
//             Name: values.name,
//             cardCode: values.cvc,
//             expirationDate: values.expiry,
//             // paidToDate: selectedPackage?.price,
//             // amount: selectedPackage?.price,
//             // project: {
//             //     projectName: selectedPackage?.packageName,
//             //     projectType: selectedPackage?.packageType,
//             //     services: selectedPackage?.services,
//             // },
//         };
//         console.log('combined values', values, combinedValues);
//         // mutation.mutate(combinedValues);
//     };
//     return (
//         <div className=" p-2 lg:p-3 rounded-2xl">
//             <div className=" p-3 lg:p-8">
//                 <div className="mb-5 flex flex-col  justify-between sm:flex-row  sm:gap-5 md:gap-10 gap-0">
//                     <h1 className="text-xl font-bold">Payment Info</h1>
//                     <div>
//                         <img src={authorizeLogo} alt="authorize-logo" />
//                     </div>
//                 </div>

//                 <Formik
//                     initialValues={{
//                         address: billTo?.address || '',
//                         city: billTo?.city || '',
//                         state: billTo?.state || '',
//                         zip: billTo?.zip || '',
//                         country: billTo?.country || '',
//                         number: '',
//                         name: '',
//                         expiry: '',
//                         cvc: '',
//                     }}
//                     validationSchema={validationSchema}
//                     onSubmit={submitForm}
//                 >
//                     {({ errors, touched, submitCount, setFieldValue }) => (
//                         <Form className="space-y-5">
//                             <BillingFields errors={errors} submitCount={submitCount} touched={touched} setFieldValue={setFieldValue} billTo={billTo} />
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
//                 {/* <Formik
//                     initialValues={{
//                         address: billTo?.address || '',
//                         city: billTo?.city || '',
//                         state: billTo?.state || '',
//                         zip: billTo?.zip || '',
//                         country: billTo?.country || '',
//                         number: '',
//                         name: '',
//                         expiry: '',
//                         cvc: '',
//                     }}
//                     validationSchema={validationSchema}
//                     onSubmit={submitForm}
//                     enableReinitialize
//                 >
//                     {({ errors, touched, submitCount, setFieldValue }) => {
//                         // useEffect(() => {
//                         //     if (billTo) {
//                         //         Object.keys(billTo).forEach((key) => {
//                         //             setFieldValue(key, billTo[key]);
//                         //         });
//                         //     }
//                         // }, [billTo, setFieldValue]);

//                         // return (
//                         <Form className="space-y-5">
//                             <BillingFields errors={errors} submitCount={submitCount} touched={touched} setFieldValue={setFieldValue} billTo={billTo} />
//                             <PaymentCardFields errors={errors} touched={touched} setFieldValue={setFieldValue} />
//                             <button disabled={mutation.isPending} type="submit" className="btn btn-primary !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
//                                 {mutation.isPending && (
//                                     <span className="animate-spin border-2 border-primary border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
//                                 )}{' '}
//                                 Submit
//                             </button>
//                         </Form>;
//                         // );
//                     }}
//                 </Formik> */}
//             </div>
//         </div>
//     );
// }



import React from 'react'

export default function PayRemainingForm() {
  return (
    <div>PayRemainingForm</div>
  )
}
