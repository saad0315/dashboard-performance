// import React from 'react';
// import { useSelector } from 'react-redux';
// export default function PaymentDetails() {
//     const { selectedInvoice } = useSelector((state) => state.project);
//     return (
//         <div className="w-full h-full">
//             <h2 className={`text-2xl  font-bold mb-4`}>Order Summary</h2>
//             <div className="mb-4">
//                 <p className="text-gray-600">Items:</p>
//                 <p className={`text-base font-medium`}>{selectedInvoice?.project?.projectName}</p>
//             </div>
//             <div className="border-t border-gray-300 py-4">
//                 <p className={`text-[#07ae98] text-base font-bold`}>Total:</p>
//                 <p className={`text-base font-medium`}>${selectedInvoice?.totalAmount}</p>
//                 {selectedInvoice?.installments?.length > 0 && selectedInvoice?.installments.filter((item) => item?.status === 'Pending') && (
//                     <>
//                         <p className={`text-[#07ae98] text-base font-bold`}>Amount Due:</p>
//                         <p className={`text-base font-medium`}>${selectedInvoice?.installments.filter((item) => item?.status === 'Pending' && item?.amount)[0]?.amount}</p>
//                     </>
//                 )}
//                 <p className={`text-[#07ae98] text-base font-bold`}>Remaining Amount:</p>
//                 <p className={`text-base font-medium`}>${selectedInvoice?.remainingAmount - selectedInvoice?.installments?.filter((item) => item?.status === 'Pending' && item?.amount)[0]?.amount}</p>
//             </div>
//         </div>
//     );
// }



import React from 'react'

export default function PaymentDetails() {
  return (
    <div>PaymentDetails</div>
  )
}
