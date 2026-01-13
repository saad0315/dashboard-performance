const ErrorHandler = require("../utils/errorHandler");
require("dotenv");
const cathAsyncError = require("../middleWare/asyncErrors");
const Invoice = require("../models/invoiceModel");
const sendEmail = require("../utils/sendEmail");
const { getAnAcceptPaymentPage } = require("../src/paymentService");
const Lead = require("../models/leadModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const { sendPaymentSuccessEmailByInvoiceId, sendInvoiceEmailByInvoiceId } = require("../utils/emailService");
const ObjectId = mongoose.Types.ObjectId;


// var ApiContracts = require("authorizenet").APIContracts;
// var ApiControllers = require("authorizenet").APIControllers;
require("dotenv").config();


exports.createInvoice = cathAsyncError(async (req, res, next) => {

  let leadId = req.body?.leadId || null;

  // const { userName, userEmail, userPhone, companyName } = req.body;

  if (!leadId && req.body.userName && req.body.userEmail) {
    const lead = await Lead.create({
      userName: req.body.userName,
      userEmail: req.body.userEmail,
      userPhone: req.body.userPhone,
      companyName: req.body.companyName || "Bellevue Publishers",
    });

    if (!lead) {
      return next(new ErrorHandler("Lead can not be created", 500));
    }

    leadId = lead._id;
  }

  // Step 2: Add lead ID to customer field in invoice if lead was created
  const invoiceData = {
    ...req.body,
    ...(leadId && { customer: leadId })
  };

  const invoice = await Invoice.create(invoiceData);
  if (!invoice) {
    return next(new ErrorHandler("Invoice can not be created", 300));
  }

  res.status(201).json({
    success: true,
    invoice,
  });
});

// exports.createInvoice = cathAsyncError(async (req, res, next) => {
//   let formData = req.body;
//   let leadId = formData.leadId || null;
//   const { salesPerson, totalAmount, saleType, sale: saleId } = formData;

//   // Validate required fields
//   if (!salesPerson || !totalAmount || !saleType) {
//     return next(new ErrorHandler("Missing required fields: salesPerson, totalAmount, or saleType", 400));
//   }

//   // Validate salesPerson
//   const user = await User.findById(salesPerson);
//   if (!user) {
//     return next(new ErrorHandler("Salesperson not found", 404));
//   }

//   // Create lead if leadId is missing but userName and userEmail are provided
//   if (!leadId && formData.userName && formData.userEmail) {
//     const lead = await Lead.create({
//       userName: formData.userName,
//       userEmail: formData.userEmail,
//       userPhone: formData.userPhone,
//       companyName: formData.companyName || "Bellevue Publishers",
//       date: new Date(),
//     });

//     if (!lead) {
//       return next(new ErrorHandler("Lead cannot be created", 500));
//     }
//     leadId = lead._id;
//   }

//   // Determine team
//   let team;
//   if (formData.team) {
//     // Validate provided team
//     team = await Team.findById(formData.team);
//     if (!team) {
//       return next(new ErrorHandler(`Team with ID ${formData.team} not found`, 404));
//     }
//     // Check if salesPerson is in the team
//     const isInTeam = user.teams.some(t => t.team.toString() === formData.team);
//     if (!isInTeam) {
//       return next(new ErrorHandler("Salesperson is not a member of the specified team", 403));
//     }
//   } else if (saleId) {
//     // Use team from associated sale
//     const sale = await Sales.findById(saleId);
//     if (!sale) {
//       return next(new ErrorHandler("Sale not found", 404));
//     }
//     team = await Team.findById(sale.team);
//     if (!team) {
//       return next(new ErrorHandler("Team from sale not found", 404));
//     }
//     formData.team = sale.team;
//   } else if (leadId) {
//     // Use team from lead.assigned
//     const lead = await Lead.findById(leadId).select("assigned");
//     if (!lead) {
//       return next(new ErrorHandler("Lead not found", 404));
//     }
//     const assignment = lead.assigned.find(a => a.user.toString() === salesPerson);
//     if (!assignment || !assignment.team) {
//       return next(new ErrorHandler("No team assigned for this salesperson in the lead", 400));
//     }
//     team = await Team.findById(assignment.team);
//     if (!team) {
//       return next(new ErrorHandler("Team from lead assignment not found", 404));
//     }
//     formData.team = assignment.team;
//   } else {
//     return next(new ErrorHandler("Team cannot be determined: provide team, saleId, or leadId", 400));
//   }

//   // Create invoice
//   const invoiceData = {
//     ...formData,
//     customer: leadId || undefined,
//     team: formData.team || team._id,
//     invoiceDate: new Date(),
//   };

//   const invoice = await Invoice.create(invoiceData);
//   if (!invoice) {
//     return next(new ErrorHandler("Invoice cannot be created", 500));
//   }

//   res.status(201).json({
//     success: true,
//     invoice,
//   });
// });

exports.createInstallment = cathAsyncError(async (req, res, next) => {
  const { invoiceId, amount, dueDate, note } = req.body;

  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) return next(new ErrorHandler("Invoice not found", 404));

  invoice.installments.push({
    amount,
    dueDate,
    status: 'Pending',
  });

  await invoice.save();

  res.status(200).json({
    success: true,
    message: "Installment added",
    invoice,
  });
});

exports.getInvoices = cathAsyncError(async (req, res, next) => {

  //    console.log("User role: ", req.user.role);
  const userRole = req.user.role;
  const userId = req.user._id;

  // Pagination setup
  // const page = Number(req.query.page) || 1;
  // const limit = Number(req.query.limit) || 20;
  // const skip = (page - 1) * limit;

  let filter = {};

  // Logic for Admin / SuperAdmin

  if (!["admin"].includes(userRole)) {
    // Get teams where user is manager
    const teamsManaged = (req.user.teams || [])
      .filter(t => t.role === "manager")
      .map(t => t.team.toString());

    // console.log("Teams managed by user: ", teamsManaged);


    // Always allow viewing own sales
    let allowedSalesPersonIds = [userId];

    // console.log("Allowed sales person Ids: ", allowedSalesPersonIds)

    // If manager of any teams, get team members
    if (teamsManaged.length > 0) {
      const teamUsers = await User.find({
        "teams.team": { $in: teamsManaged }
      }).select("_id");

      const teamUserIds = teamUsers.map(u => u._id.toString());
      allowedSalesPersonIds.push(...teamUserIds);
    }

    filter.salesPerson = { $in: [...new Set(allowedSalesPersonIds)] };
  }

  // Optional saleType filtering
  if (req.query.saleType && req.query.saleType.trim() !== "") {
    filter.saleType = req.query.saleType.trim();
  }

  // console.log("Filter for invoices:", filter);

  // Count total for pagination
  const totalCount = await Invoice.countDocuments(filter);

  const invoices = await Invoice.find(filter)
    // .skip(skip)
    // .limit(limit)
    // .lean()
    .populate("customer")
    .populate({
      path: "sale",
      populate: {
        path: "salesPerson",
        select: "userName userEmail role",
      },
    })
    .populate({
      path: "salesPerson",
      select: "userName userEmail role",
    });

  // if (!invoices || invoices.length === 0) {
  //   return next(new ErrorHandler("Invoices not found", 404));
  // }

  res.status(200).json({
    success: true,
    // totalCount,
    // currentPage: page,
    // totalPages: Math.ceil(totalCount / limit),
    invoices,
  });
});


// exports.getInvoices = cathAsyncError(async (req, res, next) => {
//   const invoices = await Invoice.find()
//     .populate("customer")
//     .populate({
//       path: "sale",
//       populate: {
//         path: "salesPerson",
//         select: "userName userEmail role",
//       },
//     })
//     .populate({
//       path: "salesPerson",
//       select: "userName userEmail role"
//     });
//   if (!invoices) {
//     return next(new ErrorHandler("Invoices not found", 400));
//   }
//   res.status(200).json({
//     success: true,
//     invoices,
//   });
// });

exports.getClientInvoices = cathAsyncError(async (req, res, next) => {
  const clientId = req.params.id;

  const invoices = await Invoice.find({ customer: clientId }).populate("customer");

  if (!invoices || invoices.length === 0) {
    return next(new ErrorHandler("No invoices found for this client", 404));
  }
  res.status(200).json({
    success: true,
    invoices,
  });
});

exports.getMyInvoices = cathAsyncError(async (req, res, next) => {
  const invoices = await Invoice.find({ salesPerson: req.user._id })
    .populate("customer")
    .populate({
      path: "sale",
      populate: {
        path: "salesPerson",
        select: "userName userEmail role",
      },
    })
    .populate({
      path: "salesPerson",
      select: "userName userEmail role"
    });
  if (!invoices) {
    return next(new ErrorHandler("Invoices not found", 400));
  }
  res.status(200).json({
    success: true,
    invoices,
  });
});

exports.deleteInvoice = cathAsyncError(async (req, res, next) => {
  const invoice = await Invoice.findByIdAndDelete(req.params.id);
  if (!invoice) {
    return next(new ErrorHandler("Invoice can not be created", 400));
  }
  res.status(201).json({
    success: true,
    message: "Invoice deleted successfully",
  });
});

exports.getInvoice = cathAsyncError(async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id).populate("customer");
  if (!invoice) {
    return next(new ErrorHandler("Invoice are not found", 400));
  }

  res.status(201).json({
    success: true,
    invoice,
  });
});

exports.updateInvoice = cathAsyncError(async (req, res, next) => {
  const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });


  await invoice.save();
  if (!invoice) {
    return next(new ErrorHandler("Invoice can not be created", 400));
  }

  // console.log("here is invoice", invoice)

  res.status(201).json({
    success: true,
    invoice,
  });
});

exports.getUserPartialInvoices = async (req, res, next) => {
  const invoices = await Invoice.find({ customer: req.params.id, paymentStatus: "Partial" })
    .populate("customer")
    .populate({
      path: "project",
      populate: [
        { path: 'projectManager', model: 'User' },
        { path: 'accountsManager', model: 'User' }
      ],
    });

  if (!invoices) {
    return next(new ErrorHandler("Invoices can not be created", 400));
  }
  res.status(200).json({
    success: true,
    invoices,
  });
};


// exports.sendInvoiceEmail = cathAsyncError(async (req, res, next) => {
//   const { id } = req.params;

//   try {
//     // Fresh invoice with customer
//     const inv = await Invoice.findById(id).populate("customer");
//     const customer = inv?.customer;
//     const toEmail = customer?.userEmail;
//     const companyName = (customer?.companyName || "").toLowerCase();

//     const companyConfigs = {
//       "urban quill publishing": {
//         smtp: {
//           service: "gmail",
//           host: "smtp.gmail.com",
//           port: 465,
//           user: process.env.URBAN_SMTP_USER,
//           pass: process.env.URBAN_SMTP_PASS,
//         },
//         from: `"Urban Quill Publishing" <billing@urbanquillpublishing.com>`,
//         logo: "https://urbanquillpublishing.com/assets/images/logo.png",
//         domain: "billing.urbanquillpublishing.com",
//       },
//       "bellevue publishers": {
//         smtp: {
//           service: "gmail",
//           host: "smtp.gmail.com",
//           port: 465,
//           user: process.env.BELLEVUE_SMTP_USER,
//           pass: process.env.BELLEVUE_SMTP_PASS,
//         },
//         from: `"Bellevue Publishers" <billing@bellevuepublishers.com>`,
//         logo: "https://bellevuepublishers.com/logo-dark.png",
//         domain: "billing.bellevuepublishers.com",
//       },
//     };

//     const config = Object.entries(companyConfigs).find(([key]) =>
//       companyName.includes(key)
//     )?.[1];

//     if (config && toEmail) {
//       const currency = inv.currency || "USD";
//       const amount = Number(inv.totalAmount) || 0;
//       const amountStr = amount.toLocaleString("en-US", {
//         style: "currency",
//         currency,
//         minimumFractionDigits: 2,
//       });

//       // Choose a receipt URL pattern for your app
//       const receiptURL = `https://${config.domain}/receipt/${inv._id}`;

//       // Simple, email-safe HTML (inline styles)
//       const html = `
//     <!doctype html><html><body style="margin:0;background:#f6f7fb;">
//       <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">
//         Payment received for Invoice #${inv.invoiceNumber} — ${amountStr}.
//       </span>
//       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7fb;">
//         <tr><td align="center" style="padding:24px;">
//           <table role="presentation" width="750" cellpadding="0" cellspacing="0" style="max-width:750px;background:#fff;border:1px solid #eee;border-radius:12px;">
//             <tr>
//               <td style="text-align:center;padding:28px 28px 0;">
//                 <img src="${config.logo}" alt="${customer.companyName} Logo" style="max-width:160px;height:auto;" />
//                 <div style="font:700 18px Arial;margin-top:6px;color:#222;">${customer.companyName}</div>
//               </td>
//             </tr>
//             <tr>
//               <td style="padding:22px 28px 0;">
//                 <table role="presentation" width="100%" style="background:${config.brandColor || "#2E7D32"};border-radius:10px;">
//                   <tr><td style="text-align:center;padding:24px 20px;color:#fff;font-family:Arial;">
//                     <div style="font-size:28px;font-weight:700;">✅ Payment Received</div>
//                     <div style="margin-top:6px;font-size:14px;opacity:.95;">Thank you! Your payment was successful.</div>
//                     <div style="margin-top:10px;font-size:20px;font-weight:700;">${amountStr}</div>
//                   </td></tr>
//                 </table>
//               </td>
//             </tr>
//             <tr>
//               <td style="padding:18px 28px 0;">
//                 <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
//                   <tr>
//                     <td style="padding:10px;border:1px solid #eee;border-radius:8px;">
//                       <div style="font:700 12px Arial;color:#6b7280;text-transform:uppercase;">Invoice</div>
//                       <div style="font:700 16px Arial;color:#111827;">#${inv.invoiceNumber}</div>
//                     </td>
//                     <td style="padding:10px;border:1px solid #eee;border-radius:8px;">
//                       <div style="font:700 12px Arial;color:#6b7280;text-transform:uppercase;">Paid On</div>
//                       <div style="font:700 16px Arial;color:#111827;">${new Date().toLocaleDateString()}</div>
//                     </td>
//                     <td style="padding:10px;border:1px solid #eee;border-radius:8px;">
//                       <div style="font:700 12px Arial;color:#6b7280;text-transform:uppercase;">Method</div>
//                       <div style="font:700 16px Arial;color:#111827;">${"-"}</div>
//                     </td>
//                   </tr>
//                 </table>
//               </td>
//             </tr>

//             ${Array.isArray(inv.services) && inv.services.length ? `
//             <tr>
//               <td style="padding:18px 28px 0;">
//                 <div style="font:700 16px Arial;color:#111827;margin-bottom:8px;">Items</div>
//                 <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
//                   <thead>
//                     <tr style="background:#f9fafb;">
//                       <th align="left" style="padding:10px;border:1px solid #e5e7eb;font:700 12px Arial;color:#6b7280;">Name</th>
//                       <th align="left" style="padding:10px;border:1px solid #e5e7eb;font:700 12px Arial;color:#6b7280;">Type</th>
//                       <th align="right" style="padding:10px;border:1px solid #e5e7eb;font:700 12px Arial;color:#6b7280;">Amount</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     ${inv.services.map(s => `
//                       <tr>
//                         <td style="padding:10px;border:1px solid #f3f4f6;font:400 13px Arial;color:#111827;">${s.name || s.type || "-"}</td>
//                         <td style="padding:10px;border:1px solid #f3f4f6;font:400 13px Arial;color:#374151;">${s.type || "-"}</td>
//                         <td align="right" style="padding:10px;border:1px solid #f3f4f6;font:700 13px Arial;color:#111827;">
//                           ${(Number(s.total) || 0).toLocaleString("en-US", { style: "currency", currency: currency })}
//                         </td>
//                       </tr>
//                     `).join("")}
//                   </tbody>
//                 </table>
//               </td>
//             </tr>` : ""}

//             <tr>
//               <td align="center" style="padding:24px 28px 10px;">
//                 <a href="${receiptURL}" target="_blank"
//                    style="background:${config.brandColor || "#2E7D32"};color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font:700 14px Arial;">
//                    View Receipt
//                 </a>
//                 <div style="font:400 12px Arial;color:#6b7280;margin-top:8px;">
//                   If the button doesn’t work, open: <a href="${receiptURL}" style="color:${config.brandColor || "#2E7D32"};">${receiptURL}</a>
//                 </div>
//               </td>
//             </tr>

//             <tr>
//               <td style="padding:0 28px 22px;">
//                 <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f3f4f6;border-radius:8px;">
//                   <tr>
//                     <td style="padding:12px 14px;font:700 12px Arial;color:#6b7280;width:33%;">Transaction ID</td>
//                     <td style="padding:12px 14px;font:400 13px Arial;color:#111827;">${"tr?.transId" || "-"}</td>
//                   </tr>
//                   <tr>
//                     <td style="padding:12px 14px;font:700 12px Arial;color:#6b7280;">Billed To</td>
//                     <td style="padding:12px 14px;font:400 13px Arial;color:#111827;">
//                       ${customer.userName} &lt;${customer.userEmail}&gt;
//                     </td>
//                   </tr>
//                 </table>
//               </td>
//             </tr>

//             <tr><td align="center" style="padding:6px 28px 24px;font:400 11px Arial;color:#9ca3af;">
//               This is an automated message from ${customer.companyName}. Please do not reply.
//             </td></tr>
//           </table>
//           <div style="font:400 11px Arial;color:#9ca3af;margin-top:8px;">© ${new Date().getFullYear()} ${customer.companyName}</div>
//         </td></tr>
//       </table>
//     </body></html>`;

//       const text =
//         `Payment Received — Invoice #${inv.invoiceNumber}\n` +
//         `Amount: ${amountStr}\n` +
//         `Paid On: ${new Date().toLocaleDateString()}\n` +
//         `Method: ${"method" || "-"}\n` +
//         `Transaction ID: ${"tr?.transId" || "-"}\n\n` +
//         `View receipt: ${receiptURL}\n\n` +
//         `Billed To: ${customer.userName} <${customer.userEmail}>\n\n` +
//         `This is an automated message from ${customer.companyName}. Please do not reply.`;

//       await sendEmail({
//         smtp: config.smtp,
//         from: config.from,
//         email: toEmail,
//         subject: `Payment Received — Invoice #${inv.invoiceNumber}`,
//         message: `We received ${amountStr} for Invoice #${inv.invoiceNumber}`,
//         html,
//         text,
//       });
//     } else {
//       console.warn("Receipt email not sent (missing brand config or recipient)");
//     }
//   } catch (emailErr) {
//     console.error("Failed to send payment receipt email:", emailErr);
//     // Don’t throw; payment was successful.
//   }

//   // res.status(200).json({
//   //   success: true,
//   //   message: `Invoice sent to ${toEmail}`,
//   // });
// });


exports.sendInvoiceEmail = cathAsyncError(async (req, res, next) => {
  await sendInvoiceEmailByInvoiceId(req.params.id);
  res.status(200).json({
    success: true,
    message: `Invoice sent`,
  });
});

exports.sendPaymentSuccessEmail = cathAsyncError(async (req, res, next) => {
 await sendPaymentSuccessEmailByInvoiceId(req.params.id);
  res.status(200).json({
    success: true,
    message: `Payment confirmation sent`,
  });
});

exports.payInstallmentHandler = async (req, res) => {
  const { invoiceId, installmentIndex } = req.params;
  const invoice = await Invoice.findById(invoiceId);
  const installment = invoice.installments[installmentIndex];

  if (!installment || installment.status === 'Paid') return res.status(400).send('Installment invalid or already paid');

  const toEmail = invoice.customer.userEmail;
  if (!toEmail) {
    return next(new ErrorHandler("Customer email not found", 400));
  }

  const paymentURL = `http://localhost:4000/api/v1/pay/${invoice._id}`;

  const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 30px; background: #f9f9f9;">
    <h2 style="text-align: center; color: #333;">Invoice Details</h2>
    <table style="width: 100%; margin-bottom: 20px;">
      <tr>
        <td style="padding: 8px;"><strong>Invoice #:</strong></td>
        <td style="padding: 8px;">${invoice.invoiceNumber}</td>
      </tr>
      <tr>
        <td style="padding: 8px;"><strong>Customer:</strong></td>
        <td style="padding: 8px;">${invoice.customer.userName}</td>
      </tr>
      <tr>
        <td style="padding: 8px;"><strong>Email:</strong></td>
        <td style="padding: 8px;">${invoice.customer.userEmail}</td>
      </tr>
      <tr>
        <td style="padding: 8px;"><strong>Amount Due:</strong></td>
        <td style="padding: 8px;">$${invoice.totalAmount}</td>
      </tr>
      <tr>
        <td style="padding: 8px;"><strong>Status:</strong></td>
        <td style="padding: 8px;">${invoice.paymentStatus}</td>
      </tr>
    </table>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${paymentURL}" target="_blank" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">Pay Invoice Now</a>
    </div>

    <p style="font-size: 14px; color: #666;">If the button doesn't work, you can copy and paste the following link into your browser:</p>
    <p style="word-break: break-all; font-size: 13px; color: #555;"><a href="${paymentURL}" target="_blank">${paymentURL}</a></p>

    <hr style="margin-top: 40px;" />
    <p style="font-size: 12px; color: #aaa;">This is an automated message from [Your Company Name].</p>
  </div>
`;

  const mailOptions = {
    email: toEmail,
    subject: `Invoice #${invoice.invoiceNumber}`,
    message: `Invoice for ${invoice.totalAmount}`,
    html: htmlContent,
  };

  await sendEmail(mailOptions);

  res.status(200).json({
    success: true,
    message: `Invoice with payment link sent to ${toEmail}`,
  });
  // Call your getAnAcceptPaymentPage() with installment.amount and custom invoice details
};


exports.payInvoice = cathAsyncError(async (req, res) => {
  const invoice = await Invoice.findById(req.params.invoiceId).populate("customer");
  if (!invoice) return res.status(404).send('Invoice not found');

  getAnAcceptPaymentPage(invoice, (err, response) => {
    if (err || !response || response.getMessages().getResultCode() !== 'Ok') {
      return res.status(500).send('Failed to generate payment token');
    }

    const token = response.getToken();
    res.render('redirectPaymentForm', { token }); // This injects token into the EJS file
  });
});




//   // Prepare invoice content (customize this template)
//   const htmlContent = `
//     <h2>Invoice #${invoice.invoiceNumber}</h2>
//     <p><strong>Customer:</strong> ${invoice.customer.userName}</p>
//     <p><strong>Amount:</strong> ${invoice.totalAmount}</p>
//     <p><strong>Status:</strong> ${invoice.paymentStatus}</p>
//     <p>Thank you for your business.</p>
//   `;

//   const mailOptions = {
//     email: "saad.madcomdigital@gmail.com",
//     subject: `Invoice #${invoice._id}`,
//     message: `Invoice for ${invoice.amount}`, // Add this line
//     html: htmlContent,
//   };

//   await sendEmail(mailOptions);

//   res.status(200).json({
//     success: true,
//     message: `Invoice sent to ${toEmail}`,
//   });
// });


// exports.sendInvoiceEmail = cathAsyncError(async (req, res, next) => {
//   const { id } = req.params;
//   const invoice = await Invoice.findById(id).populate("customer");
//   if (!invoice) {
//     return next(new ErrorHandler("Invoice not found", 404));
//   }
//   const toEmail = invoice.customer.userEmail;
//   if (!toEmail) {
//     return next(new ErrorHandler("Customer email not found", 400));
//   }

//   // Step 1: Generate Hosted Payment Token
//   const merchantAuthentication = new ApiContracts.MerchantAuthenticationType();
//   merchantAuthentication.setName(process.env.AUTH_NET_API_LOGIN_ID);
//   merchantAuthentication.setTransactionKey(process.env.AUTH_NET_TRANSACTION_KEY);

//   const transactionRequestType = new ApiContracts.TransactionRequestType();
//   transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
//   transactionRequestType.setAmount(invoice.totalAmount);
//   transactionRequestType.setOrder(new ApiContracts.OrderType({ invoiceNumber: invoice.invoiceNumber }));

//   const setting1 = new ApiContracts.SettingType();
//   setting1.setSettingName("hostedPaymentReturnOptions");
//   setting1.setSettingValue(JSON.stringify({
//     showReceipt: false,
//     url: "https://yourdomain.com/payment-success",
//     cancelUrl: "https://yourdomain.com/payment-cancel",
//   }));

//   const settings = new ApiContracts.ArrayOfSetting();
//   settings.setSetting([setting1]);

//   const request = new ApiContracts.GetHostedPaymentPageRequest();
//   request.setMerchantAuthentication(merchantAuthentication);
//   request.setTransactionRequest(transactionRequestType);
//   request.setHostedPaymentSettings(settings);

//   const ctrl = new ApiControllers.GetHostedPaymentPageController(request.getJSON());
//   await new Promise((resolve) => ctrl.execute(() => resolve()));

//   const apiResponse = ctrl.getResponse();
//   const response = new ApiContracts.GetHostedPaymentPageResponse(apiResponse);

//   if (response.getMessages().getResultCode() !== ApiContracts.MessageTypeEnum.OK) {
//     return next(new ErrorHandler("Failed to generate payment link", 500));
//   }

//   const token = response.getToken();
//   const hostedPaymentURL = `https://test.authorize.net/payment/paymentform?token=${token}`;


//   // Prepare invoice content (customize this template)
//   const htmlContent = `
//     <h2>Invoice #${invoice.invoiceNumber}</h2>
//     <p><strong>Customer:</strong> ${invoice.customer.userName}</p>
//     <p><strong>Amount:</strong> ${invoice.totalAmount}</p>
//     <p><strong>Status:</strong> ${invoice.paymentStatus}</p>
//     <p>Click below to make a secure payment:</p>
//     <p><a href="${hostedPaymentURL}" style="background:#38a754; color:white; padding:10px 15px; text-decoration:none; border-radius:5px;">Pay Now</a></p>
//     <p>Thank you for your business.</p>
//   `;

//   const mailOptions = {
//     email: "saad.madcomdigital@gmail.com",
//     subject: `Invoice #${invoice._id}`,
//     message: `Invoice for ${invoice.amount}`, // Add this line
//     html: htmlContent,
//   };

//   await sendEmail(mailOptions);

//   res.status(200).json({
//     success: true,
//     message: `Invoice sent to ${toEmail} with payment link`,
//   });
// });