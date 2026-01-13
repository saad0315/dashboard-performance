// // import React, { useState } from 'react'
// // import { Field } from 'formik';
// // import { formatCreditCardNumber, formatCVC, formatExpirationDate } from './utils';

// // import Cards from 'react-credit-cards-2';
// // import 'react-credit-cards-2/dist/es/styles-compiled.css';
// // export default function PaymentCardFields({ errors, touched, setFieldValue }) {
// //     const [cardData, setCardData] = useState({
// //         number: '',
// //         name: '',
// //         expiry: '',
// //         issuer: '',
// //         focused: '',
// //         expiryDate: '',
// //     });

// //     console.log("cardData", cardData)

// //     const handleCallback = ({ issuer }, isValid) => {
// //         if (isValid) {
// //             setCardData((prevData) => ({
// //                 ...prevData,
// //                 issuer,
// //             }));
// //         }
// //     };

// //     const handleInputFocus = (e, setFieldValue) => {
// //         setCardData((prevData) => ({ ...prevData, focused: e.target.name }));
// //     };

// //     const handleInputChange = (e, setFieldValue) => {
// //         const { name, value } = e.target;
// //         let formattedValue = value;

// //         if (name === 'number') {
// //             formattedValue = formatCreditCardNumber(value);
// //         } else if (name === 'expiry') {
// //             formattedValue = formatExpirationDate(value);
// //         } else if (name === 'cvc') {
// //             formattedValue = formatCVC(value);
// //         }
// //         else if (name === 'issuer') {
// //             formattedValue = cardData.issuer;
// //         }

// //         setCardData((prevData) => ({ ...prevData, [name]: formattedValue }));
// //         setFieldValue(name, formattedValue);
// //     };
// //     return (
// //         <div className="border border-white-light dark:border-[#1b2e4b] panel  rounded-md p-3 lg:p-5 shadow-lg">
// //             {/* Bill To Fields */}
// //             <div className="flex flex-col  justify-between sm:flex-row  sm:gap-5 md:gap-10 gap-0">
// //                 <h1 className={`  text-xl font-medium mb-4`}>Payment Method : </h1>
// //             </div>
// //             <div className="flex flex-col-reverse md:flex-row justify-between md:items-center gap-10 my-5">
// //                 <div className="flex-1 grid  md:grid-cols-1 lg:grid-cols-2 gap-x-8">
// //                     <div className="form-group">
// //                         <label htmlFor="number">Card Number</label>
// //                         <Field
// //                             name="number"
// //                             type="number"
// //                             placeholder="Please Enter Card Number"
// //                             onKeyDown={(e) => {
// //                                 const specialCharRegex = new RegExp("[a-zA-Z0-9@.' ,-]");
// //                                 const pressedKey = String.fromCharCode(!e.charCode ? e.which : e.charCode);
// //                                 if (e.key === 'Backspace' || (specialCharRegex.test(pressedKey) && e.target.value.length < 19)) {
// //                                 } else {
// //                                     e.preventDefault();
// //                                     return false;
// //                                 }
// //                             }}
// //                             // onFocus={handleInputFocus}
// //                             // onChange={handleInputChange}
// //                             onFocus={(e) => handleInputFocus(e, setFieldValue)}
// //                             onChange={(e) => handleInputChange(e, setFieldValue)}
// //                             value={cardData.number}
// //                             className="form-input mb-2"
// //                         />
// //                         {touched.number && errors.number && <div className="text-red-500">{errors.number}</div>}
// //                     </div>

// //                     <div className="form-group">
// //                         <label htmlFor="name">Name</label>
// //                         <Field
// //                             name="name"
// //                             type="text"
// //                             placeholder="Please Enter Cardholder Name"
// //                             onFocus={(e) => handleInputFocus(e, setFieldValue)}
// //                             onChange={(e) => handleInputChange(e, setFieldValue)}
// //                             className="form-input mb-2"
// //                         />
// //                         {touched.name && errors.name && <div className="text-red-500">{errors.name}</div>}
// //                     </div>

// //                     <div className="form-group">
// //                         <label htmlFor="expiry">Expiry</label>
// //                         <Field
// //                             name="expiry"
// //                             value={cardData.expiry}
// //                             type="text"
// //                             placeholder="MM/YY"
// //                             onFocus={(e) => handleInputFocus(e, setFieldValue)}
// //                             onChange={(e) => handleInputChange(e, setFieldValue)}
// //                             className="form-input mb-2"
// //                         />
// //                         {touched.expiry && errors.expiry && <div className="text-red-500">{errors.expiry}</div>}
// //                     </div>

// //                     <div className="form-group hidden">
// //                         <label htmlFor="issuer">issuer</label>
// //                         <Field
// //                             name="issuer"
// //                             type="text"
// //                             onFocus={(e) => handleInputFocus(e, setFieldValue)}
// //                             onChange={(e) => handleInputChange(e, setFieldValue)}
// //                             className="form-input mb-2"
// //                         />
// //                         {touched.issuer && errors.issuer && <div className="text-red-500">{errors.issuer}</div>}
// //                     </div>
// //                 </div>
// //                 <div className="flex flex-col gap-5">
// //                     <div>
// //                         <Cards number={cardData.number} name={cardData.name} expiry={cardData.expiry} cvc={cardData.cvc} focused={cardData.focused} callback={handleCallback} />
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     )
// // }





// import React, { useState, useEffect } from 'react';
// import { Field } from 'formik';
// import { formatCreditCardNumber, formatCVC, formatExpirationDate } from './utils';
// import Cards from 'react-credit-cards-2';
// import 'react-credit-cards-2/dist/es/styles-compiled.css';

// export default function PaymentCardFields({ errors, touched, setFieldValue }) {
//     const [cardData, setCardData] = useState({
//         number: '',
//         name: '',
//         expiry: '',
//         cvc: '',
//         issuer: '',  // Store the issuer here
//         focused: '',
//     });

//     // Prevent excessive updates by checking if issuer has changed
//     useEffect(() => {
//         if (cardData.issuer) {
//             setFieldValue('issuer', cardData.issuer);
//         }
//     }, [cardData.issuer, setFieldValue]);  // Only update if issuer changes

//     // This callback captures the issuer (card type) and updates the state
//     const handleCallback = ({ issuer }, isValid) => {
//         if (isValid && issuer !== cardData.issuer) {  // Only update if issuer changes
//             setCardData((prevData) => ({
//                 ...prevData,
//                 issuer,  // Set issuer in state
//             }));
//         }
//     };

//     // Handling form input focus
//     const handleInputFocus = (e) => {
//         setCardData((prevData) => ({ ...prevData, focused: e.target.name }));
//     };

//     // Handling input changes (formatting values)
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         let formattedValue = value;

//         if (name === 'number') {
//             formattedValue = formatCreditCardNumber(value);
//         } else if (name === 'expiry') {
//             formattedValue = formatExpirationDate(value);
//         } else if (name === 'cvc') {
//             formattedValue = formatCVC(value);
//         }

//         setCardData((prevData) => ({ ...prevData, [name]: formattedValue }));
//         setFieldValue(name, formattedValue);  // Update Formik state
//     };

//     return (
//         <div className="border border-white-light dark:border-[#1b2e4b] panel rounded-md p-3 lg:p-5 shadow-lg">
//             <div className="flex flex-col justify-between sm:flex-row sm:gap-5 md:gap-10 gap-0">
//                 <h1 className="text-xl font-medium mb-4">Payment Method: </h1>
//             </div>

//             <div className="flex flex-col-reverse md:flex-row justify-between md:items-center gap-10 my-5">
//                 <div className="flex-1 grid md:grid-cols-1 lg:grid-cols-2 gap-x-8">
//                     <div className="form-group">
//                         <label htmlFor="number">Card Number</label>
//                         <Field
//                             name="number"
//                             type="number"
//                             placeholder="Please Enter Card Number"
//                             onFocus={handleInputFocus}
//                             onChange={handleInputChange}
//                             value={cardData.number}
//                             className="form-input mb-2"
//                         />
//                         {touched.number && errors.number && <div className="text-red-500">{errors.number}</div>}
//                     </div>

//                     <div className="form-group">
//                         <label htmlFor="name">Name</label>
//                         <Field
//                             name="name"
//                             type="text"
//                             placeholder="Please Enter Cardholder Name"
//                             onFocus={handleInputFocus}
//                             onChange={handleInputChange}
//                             className="form-input mb-2"
//                         />
//                         {touched.name && errors.name && <div className="text-red-500">{errors.name}</div>}
//                     </div>

//                     <div className="form-group">
//                         <label htmlFor="expiry">Expiry</label>
//                         <Field
//                             name="expiry"
//                             type="text"
//                             placeholder="MM/YY"
//                             onFocus={handleInputFocus}
//                             onChange={handleInputChange}
//                             className="form-input mb-2"
//                         />
//                         {touched.expiry && errors.expiry && <div className="text-red-500">{errors.expiry}</div>}
//                     </div>

//                     <div className="form-group">
//                         <label htmlFor="cvc">CVC</label>
//                         <Field
//                             name="cvc"
//                             type="text"
//                             placeholder="Please Enter CVC"
//                             onFocus={handleInputFocus}
//                             onChange={handleInputChange}
//                             className="form-input mb-2"
//                         />
//                         {touched.cvc && errors.cvc && <div className="text-red-500">{errors.cvc}</div>}
//                     </div>
//                 </div>

//                 <div className="flex flex-col gap-5">
//                     <div>
//                         <Cards
//                             number={cardData.number}
//                             name={cardData.name}
//                             expiry={cardData.expiry}
//                             cvc={cardData.cvc}
//                             focused={cardData.focused}
//                             callback={handleCallback}
//                         />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }



import React from 'react'

export default function PaymentCardFields() {
  return (
    <div>PaymentCardFields</div>
  )
}
