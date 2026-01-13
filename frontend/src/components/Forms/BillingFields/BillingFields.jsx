// import React, { useState } from 'react';
// import { Field } from 'formik';
// // import { useSelector } from 'react-redux';
// export default function BillingFields({ errors, touched, submitCount, setFieldValue, billTo }) {
//     const [editMode, setEditMode] = useState(false);
//     const billingFields = [
//         {
//             label: 'Address',
//             name: 'address',
//             type: 'text',
//         },
//         {
//             label: 'City',
//             name: 'city',
//             type: 'text',
//         },
//         {
//             label: 'State',
//             name: 'state',
//             type: 'text',
//         },
//         {
//             label: 'Zip',
//             name: 'zip',
//             type: 'number',
//         },
//         {
//             label: 'Country',
//             name: 'country',
//             type: 'text',
//         },
//     ];
//     // const { selectedInvoice } = useSelector((state) => state.project);
//     return (
//         <div className="border border-white-light dark:border-[#1b2e4b] panel rounded-md p-3 lg:p-5 shadow-lg">
//             {/* Bill To Fields */}
//             <h1 className="text-xl font-medium mb-4 flex justify-between">
//                 Billing Info :
//                 {billTo ? (
//                     <button type="text" onClick={() => setEditMode(!editMode)}>
//                         {editMode ? 'Cancel' : 'Edit'}
//                     </button>
//                 ) : null}
//             </h1>
//             {!editMode ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
//                     {billingFields.map((field, index) => (
//                         <div key={index} className="form-group">
//                             <label htmlFor={field.name}>{field.label}</label>
//                             <Field
//                                 name={field.name}
//                                 type={field.type}
//                                 id={field.name}
//                                 placeholder={`Please enter ${field.label}`}
//                                 className={`form-input mb-2 ${submitCount ? (errors[field.name] ? 'has-error' : 'has-success') : ''}`}
//                             />
//                             {submitCount > 0 && errors[field.name] && touched[field.name] && <div className="text-danger">{errors[field.name]}</div>}
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 billTo && <div className={`text-base text-gray-600 line-clamp-1`}>{billTo?.address + ' , ' + billTo?.city + ' , ' + billTo?.state + ' , ' + billTo?.zip + ' , ' + billTo?.country}</div>
//             )}
//         </div>
//     );
// }




import React from 'react'

export default function BillingFields() {
  return (
    <div>BillingFields</div>
  )
}
