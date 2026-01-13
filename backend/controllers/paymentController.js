const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleWare/asyncErrors");
const Invoice = require("../models/invoiceModel");
// const Project = require("../models/leadModel");
const {
  chargeCreditCard,
  getTransactionDetails,
} = require("../src/paymentService");
const { sendPaymentSuccessEmailByInvoiceId } = require("../utils/emailService");
// const sendEmail = require("../utils/sendEmail");
// const CardInfo = require("../models/cardInfoModel");

exports.chargeCreditCard = catchAsyncError(async (req, res, next) => {
  const paymentDetails = req.body;

  if (!paymentDetails.invoiceId) {
    console.log("payment details else condition", paymentDetails);
    return next(new ErrorHandler("invoiceId is required", 400));
  }

  chargeCreditCard(paymentDetails, async (response) => {
    const tr = response?.transactionResponse;

    if (tr?.responseCode === "1") {
      const cardType = tr.accountType;

      const updated = await Invoice.findByIdAndUpdate(
        paymentDetails.invoiceId,
        {
          $set: {
            paymentStatus: "Paid",
            transactionId: tr.transId,
            paidFrom: {
              last4Digits:
                paymentDetails?.data?.cardNumber ||
                tr?.accountNumber?.slice(-4),
              issuer: cardType,
              expiry: paymentDetails?.expiry,
              idNumb: paymentDetails?.numb,
            },
            billTo: {
              name: paymentDetails.billTo.name,
              email: paymentDetails.billTo.email,
              address: paymentDetails.billTo.address,
              city: paymentDetails.billTo.city,
              state: paymentDetails.billTo.state,
              zip: paymentDetails.billTo.zip,
            },
          },
        },
        { new: true }
      );
      if (!updated) return next(new ErrorHandler("Invoice not found", 404));

      await sendPaymentSuccessEmailByInvoiceId(updated?._id);

      res.status(200).json({
        success: true,
        response,
      });
    } else {
      const msg =
        tr?.errors?.error?.[0]?.errorText ||
        tr?.messages?.message?.[0]?.text ||
        "Payment failed";
      return next(new ErrorHandler(msg, 400));
    }
  });
});

/////////////////////////////////////

// invoice = await Invoice.create({
//   invoiceDate: Date.now(),
//   dueDate: Date.now(),
//   totalAmount: paymentDetails.amount,
//   customer: req.user._id,
//   installments: [
//     {
//       amount: paymentDetails.paidToDate,
//       dueDate: Date.now(),
//       status: "Pending",
//     },
//   ],
// });
// project = await Project.create({
//   projectName: paymentDetails.project.projectName,
//   projectType: paymentDetails.project.projectType,
//   // assignedProjectManagers : paymentDetails.project.assignedProjectManagers,
//   customer: req.user._id,
//   // currentStage : paymentDetails.project.currentStage,
//   services: paymentDetails.project.services,
//   status: false,
// });
// chargeCreditCard(paymentDetails, async (response) => {
//   if (response.transactionResponse.responseCode === "1") {
//     project.status = true;
//     await project.save();
//     invoice.project = project._id;
//     invoice.paidToDate = paymentDetails.paidToDate;
//     invoice.installments[0].amount = paymentDetails.paidToDate;
//     invoice.dueDate = Date.now();
//     invoice.installments[0].transactionId =
//       response.transactionResponse.transId;
//     invoice.installments[0].status = "Paid";
//     await invoice.save();
//     let emailBody = `
//     <h2>Invoice Details</h2>
//     <p>Invoice Number: ${invoice.invoiceNumber}</p>
//     <p>Package Name: ${project.projectName}</p>
//     <p>Amount: ${invoice.totalAmount}</p>
//     <p>Payment Status: ${invoice.paymentStatus}</p>
//     <h3>Services Included</h3>
//     <ul>
//     ${project.services.map((service, index) => {
//       return `<li> ${index + 1} . ${service}</li>`;
//     })}
// `;
//     // Adding each item to the email body
//     // items.forEach((item) => {
//     //   emailBody += `<li>${item.name}: ${item.price}</li>`;
//     // });
//     // Closing the email body
//     emailBody += `</ul>`;
//     sendEmail({
//       email: req.user.userEmail,
//       cc: [
//         // "sherwin.shakir@gmail.com",
//         "saif42r@gmail.com",
//       ],
//       subject: `Invoice Payment Successful`,
//       html: emailBody,
//     });
//     res.status(200).json({
//       success: true,
//       response,
//     });
//   }
//   invoice.project = project._id;
//   console.log(invoice);
//   // invoice.paymentStatus = "Failed";
//   await invoice.save();
//   return next(
//     new ErrorHandler(
//       response.transactionResponse?.errors?.error[0]?.errorText,
//       400
//     )
//   );
// });

///////////////////////////////////////

// exports.chargeCreditCard = catchAsyncError(async (req, res, next) => {
//   console.log(req.body);
//   const paymentDetails = req.body;
//   let invoice;
//   let project;
//   if (paymentDetails.invoiceId) {
//     // invoice = await Invoice.findById(paymentDetails.invoiceId);
//     // project = await Project.findById(invoice.project);
//     console.log(paymentDetails);
//     chargeCreditCard(paymentDetails, async (response) => {
//       if (response.transactionResponse.responseCode === "1") {
//         const updatedInvoice = await Invoice.findByIdAndUpdate(
//           paymentDetails.invoiceId,
//           {
//             $set: {
//               "installments.$[elem].status": "Paid",
//               "installments.$[elem].transactionId":
//                 response.transactionResponse.transId,
//             },
//           },
//           {
//             new: true,
//             arrayFilters: [{ "elem.status": "Pending" }], // Update only the installments with status "Pending"
//           }
//         );
//         await updatedInvoice.save();
//         const updatedProjects = await Project.findByIdAndUpdate(
//           updatedInvoice?.project?._id,
//           {
//             status: true,
//           },
//           {
//             new: true,
//           }
//         );
//         console.log(updatedProjects);
//         res.status(200).json({
//           success: true,
//           response,
//         });
//       }
//       return next(
//         new ErrorHandler(
//           response.transactionResponse?.errors?.error[0]?.errorText,
//           400
//         )
//       );
//     });
//   } else {
//     invoice = await Invoice.create({
//       invoiceDate: Date.now(),
//       dueDate: Date.now(),
//       totalAmount: paymentDetails.amount,
//       customer: req.user._id,
//       installments: [
//         {
//           amount: paymentDetails.paidToDate,
//           dueDate: Date.now(),
//           status: "Pending",
//         },
//       ],
//     });
//     project = await Project.create({
//       projectName: paymentDetails.project.projectName,
//       projectType: paymentDetails.project.projectType,
//       // assignedProjectManagers : paymentDetails.project.assignedProjectManagers,
//       customer: req.user._id,
//       // currentStage : paymentDetails.project.currentStage,
//       services: paymentDetails.project.services,
//       status: false,
//     });
//     chargeCreditCard(paymentDetails, async (response) => {
//       if (response.transactionResponse.responseCode === "1") {
//         project.status = true;
//         await project.save();
//         invoice.project = project._id;
//         invoice.paidToDate = paymentDetails.paidToDate;
//         invoice.installments[0].amount = paymentDetails.paidToDate;
//         invoice.dueDate = Date.now();
//         invoice.installments[0].transactionId =
//           response.transactionResponse.transId;
//         invoice.installments[0].status = "Paid";
//         await invoice.save();
//         let emailBody = `
//         <h2>Invoice Details</h2>
//         <p>Invoice Number: ${invoice.invoiceNumber}</p>
//         <p>Package Name: ${project.projectName}</p>
//         <p>Amount: ${invoice.totalAmount}</p>
//         <p>Payment Status: ${invoice.paymentStatus}</p>
//         <h3>Services Included</h3>
//         <ul>
//         ${project.services.map((service, index) => {
//           return `<li> ${index + 1} . ${service}</li>`;
//         })}
//     `;
//         // Adding each item to the email body
//         // items.forEach((item) => {
//         //   emailBody += `<li>${item.name}: ${item.price}</li>`;
//         // });
//         // Closing the email body
//         emailBody += `</ul>`;
//         sendEmail({
//           email: req.user.userEmail,
//           cc: [
//             // "sherwin.shakir@gmail.com",
//             "saif42r@gmail.com",
//           ],
//           subject: `Invoice Payment Successful`,
//           html: emailBody,
//         });
//         res.status(200).json({
//           success: true,
//           response,
//         });
//       }
//       invoice.project = project._id;
//       console.log(invoice);
//       // invoice.paymentStatus = "Failed";
//       await invoice.save();
//       return next(
//         new ErrorHandler(
//           response.transactionResponse?.errors?.error[0]?.errorText,
//           400
//         )
//       );
//     });
//   }
// });

exports.payInstallment = catchAsyncError(async (req, res, next) => {
  const { amount, transId, invoice } = req.body;
  // capturePreviouslyAuthorizedAmount(
  //   { amount, transId, invoice },
  //   (response) => {
  //     if (response.transactionResponse.responseCode === "1") {
  //       const invoice = Invoice.findByIdAndUpdate(invoice._id, {
  //         $push: {
  //           installments: {
  //             amount: amount,
  //             dueDate: Date.now(),
  //             status: "Paid",
  //             transactionId: response.transactionResponse.transId,
  //           },
  //         },
  //       });
  //       res.status(200).json({
  //         success: true,
  //         response,
  //       });
  //     }
  //     return next(
  //       new ErrorHandler(
  //         response.transactionResponse?.errors?.error[0]?.errorText,
  //         400
  //       )
  //     );
  //   }
  // );

  chargeCreditCard(paymentDetails, async (response) => {
    if (response.transactionResponse.responseCode === "1") {
    }
    return next(
      new ErrorHandler(
        response.transactionResponse?.errors?.error[0]?.errorText,
        400
      )
    );
  });
});

exports.getTransactionDetails = catchAsyncError(async (req, res, next) => {
  const transactionId = req.params.transactionId;
  console.log(transactionId);
  const transactionDetails = getTransactionDetails(
    transactionId,
    (response) => {
      return res.status(200).json({
        success: true,
        response,
      });
    }
  );
});
