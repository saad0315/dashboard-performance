// const InvoiceModel = require("../models/invoiceModel");
// const ErrorHandler = require("./errorHandler");
// const sendEmail = require("./sendEmail");

// function getCompanyConfigs() {
//     return {
//         "urban quill publishing": {
//             smtp: {
//                 service: "gmail",
//                 host: "smtp.gmail.com",
//                 port: 465,
//                 user: process.env.URBAN_SMTP_USER,
//                 pass: process.env.URBAN_SMTP_PASS,
//             },
//             from: `"Urban Quill Publishing" <billing@urbanquillpublishing.com>`,
//             logo: "https://urbanquillpublishing.com/assets/images/logo.png",
//             domain: "billing.urbanquillpublishing.com",
//             // fixed typo from your sample:
//             supportEmail: "support@urbanquillpublishing.com",
//             color: "#e14226",
//         },
//         "bellevue publishers": {
//             smtp: {
//                 service: "gmail",
//                 host: "smtp.gmail.com",
//                 port: 465,
//                 user: process.env.BELLEVUE_SMTP_USER,
//                 pass: process.env.BELLEVUE_SMTP_PASS,
//             },
//             from: `"Bellevue Publishers" <billing@bellevuepublishers.com>`,
//             logo: "https://bellevuepublishers.com/logo-dark.png",
//             domain: "billing.bellevuepublishers.com",
//             supportEmail: "support@bellevuepublishers.com",
//             color: "#2CB9A8",
//         },
//         "book publishings": {
//             smtp: {
//                 service: "gmail",
//                 host: "smtp.gmail.com",
//                 port: 465,
//                 user: process.env.BOOK_SMTP_USER,
//                 pass: process.env.BOOK_SMTP_PASS,
//             },
//             from: `"Book Publishings" <billing@bookpublishings.com>`,
//             logo: "https://bookpublishings.com/assets/bplogo.png",
//             domain: "billing.bookpublishings.com",
//             supportEmail: "support@bookpublishings.com",
//             color: "#192946",
//         },
//     };
// }

// function resolveCompanyConfig(companyNameLower) {
//     const configs = getCompanyConfigs();
//     return Object.entries(configs).find(([key]) => companyNameLower.includes(key))?.[1];
// }

// // ⬇️ Use your exact HTML bIuilder (paidHtmlContent). I wrapped it in a function for reuse.
// function buildPaidHtml(invoice, customer, config) {
//     const brandColor = config.primaryColor || config.color || '#2563EB';
//     const successColor = config.successColor || '#16a34a';

//     // --- PASTE YOUR EXISTING paidHtmlContent TEMPLATE HERE, unchanged ---
//     // Replace `config`, `invoice`, `customer`, `brandColor`, `successColor` variables as needed.
//     const paidHtmlContent = `
//   <div style="margin:0;padding:0;background:#ffffff;">
//     <!-- Success banner -->
//     <div style="width:100%;background:${successColor};color:#ffffff;font:700 13px Arial;padding:10px 16px;text-align:center;">
//       ✓ Payment Received — Thank you for your payment!
//     </div>

//     <div style="padding:24px;background:#ffffff;">
//       <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"
//              style="width:740px;max-width:740px;margin:0 auto;border-collapse:separate;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;box-shadow:0 6px 18px rgba(17,24,39,.06);overflow:hidden;">
//         <tr>
//           <td style="padding:28px 28px 8px 28px;">
//             <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
//               <tr>
//                 <td style="vertical-align:middle;">
//                   <img src="${config.logo}" alt="${customer.companyName} Logo" style="display:block;max-width:200px;border-radius:8px;">
//                 </td>
//                 <td style="text-align:right;vertical-align:middle;">
//                   <div style="font:12px/1.4 Arial;color:#6b7280;">
//                     Invoice ID: <span style="color:#111827;font-weight:700;">#${invoice.invoiceNumber}</span>
//                   </div>
//                   <div style="font:12px/1.4 Arial;color:#6b7280;">
//                     Paid on: <span style="color:#111827;">${invoice.paidAt?.toLocaleDateString?.() || invoice.updatedAt?.toLocaleDateString?.() || ''}</span>
//                   </div>
//                   <span style="display:inline-block;margin-top:6px;padding:5px 12px;font:700 11px/1 Arial;text-transform:uppercase;border-radius:999px;background:${successColor};color:#ffffff;border:1px solid ${successColor};">
//                     PAID
//                   </span>
//                 </td>
//               </tr>
//             </table>
//           </td>
//         </tr>

//         <!-- Top summary strip (green tinted to distinguish from pending) -->
//         <tr>
//           <td style="padding:12px 28px 0 28px;">
//             <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
//                    style="border-collapse:separate;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:14px;">
//               <tr>
//                 <td style="padding:14px 16px;width:40%;border-right:1px solid #bbf7d0;">
//                   <div style="font:12px/1.4 Arial;color:#047857;">Invoice to</div>
//                   <div style="font:700 14px/1.5 Arial;color:#064e3b;">${customer.userName}</div>
//                   <div style="font:12px/1.5 Arial;color:#047857;">${customer.userEmail}</div>
//                 </td>
//                 <td style="padding:14px 16px;width:30%;border-right:1px solid #bbf7d0;">
//                   <div style="font:12px/1.4 Arial;color:#047857;">Payment Method</div>
//                   <div style="font:700 14px/1.5 Arial;color:#064e3b;">${invoice?.paidFrom?.issuer || 'Online payment'}</div>
//                   ${invoice.transactionId ? `<div style="font:12px/1.5 Arial;color:#047857;">Txn ID: ${invoice.transactionId}</div>` : ``}
//                 </td>
//                 <td style="padding:14px 16px;width:30%;text-align:right;">
//                   <div style="font:12px/1.4 Arial;color:#047857;">Amount Paid</div>
//                   <div style="font:700 24px/1.2 Arial;color:${successColor};">
//                     $${Number(invoice.totalAmount || 0).toFixed(2)}
//                   </div>
//                 </td>
//               </tr>
//             </table>
//             <div style="font:13px/1.6 Arial;margin-top:12px;color:#111827;">
//               Thank you! We’ve received your payment of
//               <strong style="color:${successColor};">$${Number(invoice.totalAmount || 0).toFixed(2)}</strong>.
//             </div>
//           </td>
//         </tr>

//         <!-- Line items -->
//         <tr>
//           <td style="padding:22px 28px 6px 28px;">
//             <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
//                    style="border-collapse:separate;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
//               <thead>
//                 <tr style="background:#f3f4f6;">
//                   <th align="left"  style="padding:12px 16px;font:12px Arial;color:#6b7280;">Sr.</th>
//                   <th align="left"  style="padding:12px 16px;font:12px Arial;color:#6b7280;">Name</th>
//                   <th align="center" style="padding:12px 16px;font:12px Arial;color:#6b7280;">Price</th>
//                   <th align="center" style="padding:12px 16px;font:12px Arial;color:#6b7280;">Qty</th>
//                   <th align="right" style="padding:12px 16px;font:12px Arial;color:#6b7280;">Amount</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 ${(invoice.services || []).map((s, idx) => {
//         const qty = Number(s.quantity || 1);
//         const price = Number(s.unitPrice || s.price || s.total || 0);
//         const lineTotal = Number(s.total != null ? s.total : (qty * price));
//         return `
//                     <tr>
//                       <td style="padding:12px 16px;border-top:1px solid #e5e7eb;font:13px Arial;color:#111827;">${idx + 1}</td>
//                       <td style="padding:12px 16px;border-top:1px solid #e5e7eb;font:13px Arial;color:#111827;">${s.name || s.type || 'Service'}</td>
//                       <td align="center" style="padding:12px 16px;border-top:1px solid #e5e7eb;font:13px Arial;color:#111827;">$${Number(price).toFixed(2)}</td>
//                       <td align="center" style="padding:12px 16px;border-top:1px solid #e5e7eb;font:13px Arial;color:#111827;">${qty}</td>
//                       <td align="right" style="padding:12px 16px;border-top:1px solid #e5e7eb;font:13px Arial;color:#111827;">$${Number(lineTotal).toFixed(2)}</td>
//                     </tr>`;
//     }).join('')}
//               </tbody>
//             </table>
//           </td>
//         </tr>

//         <!-- Totals (clearly different: success colored, shows Balance 0) -->
//         <tr>
//           <td style="padding:10px 28px 0 28px;">
//             <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
//               <tr>
//                 <td style="width:50%;"></td>
//                 <td>
//                   <table role="presentation" align="right" cellpadding="0" cellspacing="0"
//                          style="min-width:280px;border-collapse:separate;background:#ecfdf5;border:1px solid #bbf7d0;border-radius:12px;">
//                     <tr>
//                       <td style="padding:10px 14px;font:13px Arial;color:#047857;">Subtotal</td>
//                       <td align="right" style="padding:10px 14px;font:13px Arial;color:#064e3b;">
//                         $${(
//             (invoice.services || []).reduce((sum, s) => {
//                 const qty = Number(s.quantity || 1);
//                 const price = Number(s.unitPrice || s.price || s.total || 0);
//                 const lineTotal = Number(s.total != null ? s.total : qty * price);
//                 return sum + (isNaN(lineTotal) ? 0 : lineTotal);
//             }, 0)
//         ).toFixed(2)}
//                       </td>
//                     </tr>
//                     <tr>
//                       <td style="padding:10px 14px;font:13px Arial;color:#047857;">Tax</td>
//                       <td align="right" style="padding:10px 14px;font:13px Arial;color:#064e3b;">$${Number(invoice.tax || 0).toFixed(2)}</td>
//                     </tr>
//                     <tr>
//                       <td style="padding:10px 14px;font:13px Arial;color:#047857;">Amount Paid</td>
//                       <td align="right" style="padding:10px 14px;font:700 14px Arial;color:${successColor};">$${Number(invoice.totalAmount || 0).toFixed(2)}</td>
//                     </tr>
//                     <tr>
//                       <td style="padding:12px 14px;font:700 14px Arial;color:#064e3b;border-top:1px solid #bbf7d0;">Balance</td>
//                       <td align="right" style="padding:12px 14px;font:700 16px Arial;color:${successColor};border-top:1px solid #bbf7d0;">$0.00</td>
//                     </tr>
//                   </table>
//                 </td>
//               </tr>
//             </table>
//           </td>
//         </tr>

//         ${(invoice.services || []).some(s => s.customDescription) ? `
//         <tr>
//           <td style="padding:24px 28px 0 28px;">
//             <div style="font:700 13px Arial;color:#111827;margin:0 0 6px;">Service Includes</div>
//             <ul style="margin:0;padding:0 0 0 18px;">
//               ${(invoice.services || []).map(s => s.customDescription
//             ? `<li style="font:12px/1.6 Arial;color:#374151;margin:0 0 6px;">${s.customDescription}</li>`
//             : ''
//         ).join('')}
//             </ul>
//           </td>
//         </tr>` : ''}

//         <!-- Footer -->
//         <tr>
//           <td style="padding:20px 28px 28px 28px;">
//             <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
//                    style="border-collapse:collapse;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;">
//               <tr>
//                 <td style="padding:14px 16px;">
//                   <div style="font:12px/1.6 Arial;color:#6b7280;">
//                     You have unlimited free revisions. Our team works Mon–Fri. All content is ghostwritten with 100% ownership. Publishing takes 10–12 working days after approval. You can cancel at any time with a full refund if promises are not met.
//                   </div>
//                   <div style="font:12px/1.6 Arial;color:#9ca3af;margin-top:10px;text-align:center;">
//                     This is an automated message from ${customer.companyName}.
//                   </div>
//                 </td>
//               </tr>
//             </table>
//           </td>
//         </tr>

//       </table>
//     </div>
//   </div>
// `;

//     return paidHtmlContent;
// }

// async function sendPaymentSuccessEmailByInvoiceId(invoiceId) {
//     const invoice = await InvoiceModel.findById(invoiceId).populate("customer");
//     if (!invoice) throw new ErrorHandler("Invoice not found", 404);

//     const customer = invoice.customer;
//     const toEmail = customer?.userEmail;
//     const companyName = customer?.companyName?.toLowerCase();

//     if (!toEmail) throw new ErrorHandler("Customer email not found", 400);
//     if (!companyName) throw new ErrorHandler("Customer company not found", 400);

//     const config = Object.entries(companyName);
//     if (!config) throw new ErrorHandler("Unknown company, cannot send email", 400);

//     const html = buildPaidHtml(invoice, customer, config);

//     await sendEmail({
//         smtp: config.smtp,
//         from: config.from,
//         email: toEmail,
//         subject: `Paid • Invoice #${invoice.invoiceNumber}`,
//         message: `Payment received: $${Number(invoice.totalAmount || 0).toFixed(2)}.`,
//         html,
//     });
// }

// function buildInvoiceHtml(invoice, customer, config) {
//     const brandColor = config.primaryColor || config.color || "#2563EB";
//     const paymentURL = `https://${config.domain}/payment/${invoice._id}`;

//     return `
//    <div style="margin:0;padding:24px;background:#ffffff;">
//     <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"
//            style="width:740px;max-width:740px;margin:0 auto;border-collapse:separate;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;box-shadow:0 6px 18px rgba(17,24,39,.06);overflow:hidden;">
//       <tr>
//         <td style="padding:28px 28px 8px 28px;">
//           <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
//             <tr>
//               <td style="vertical-align:middle;">
//                 <img src="${config.logo}" alt="${customer.companyName} Logo" style="display:block;max-width:200px;border-radius:8px;">
//               </td>
//               <td style="text-align:right;vertical-align:middle;">
//                 <div style="font:12px/1.4 Arial;color:#6b7280;">
//                   Invoice ID:
//                   <span style="color:#111827;font-weight:700;">#${invoice.invoiceNumber}</span>
//                 </div>
//                 <div style="font:12px/1.4 Arial;color:#6b7280;">
//                   Date:
//                   <span style="color:#111827;">${invoice.createdAt?.toLocaleDateString?.() || ''}</span>
//                 </div>
//               </td>
//             </tr>
//           </table>
//         </td>
//       </tr>

//       <!-- Top summary strip -->
//       <tr>
//         <td style="padding:12px 28px 0 28px;">
//           <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
//                  style="border-collapse:separate;background:#f9fafb;border:1px solid #e5e7eb;border-radius:14px;">
//             <tr>
//               <td style="padding:14px 16px;width:40%;border-right:1px solid #e5e7eb;">
//                 <div style="font:12px/1.4 Arial;color:#6b7280;">Invoice to</div>
//                 <div style="font:700 14px/1.5 Arial;color:#111827;">${customer.userName}</div>
//                 <div style="font:12px/1.5 Arial;color:#6b7280;">${customer.userEmail}</div>
//               </td>
//               <td style="padding:14px 16px;width:30%;border-right:1px solid #e5e7eb;">
//                 <div style="font:12px/1.4 Arial;color:#6b7280;">Payment Status</div>
//                 <div style="font:700 14px/1.5 Arial;color:#111827;">${invoice.paymentStatus}</div>
//               </td>
//               <td style="padding:14px 16px;width:30%;text-align:right;">
//                 <div style="font:12px/1.4 Arial;color:#6b7280;">Total Due</div>
//                 <div style="font:700 24px/1.2 Arial;color:${config.primaryColor || config.color || '#2563EB'};">
//                   $${Number(invoice.totalAmount || 0).toFixed(2)}
//                 </div>
//               </td>
//             </tr>
//           </table>
//         </td>
//       </tr>

//       <!-- Line items -->
//       <tr>
//         <td style="padding:22px 28px 6px 28px;">
//           <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
//                  style="border-collapse:separate;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
//             <thead>
//               <tr style="background:#f3f4f6;">
//                 <th align="left"  style="padding:12px 16px;font:12px Arial;color:#6b7280;">Sr.</th>
//                 <th align="left"  style="padding:12px 16px;font:12px Arial;color:#6b7280;">Name</th>
//                 <th align="center" style="padding:12px 16px;font:12px Arial;color:#6b7280;">Price</th>
//                 <th align="center" style="padding:12px 16px;font:12px Arial;color:#6b7280;">Qty</th>
//                 <th align="right" style="padding:12px 16px;font:12px Arial;color:#6b7280;">Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${(invoice.services || []).map((s, idx) => {
//         const qty = Number(s.quantity || 1);
//         const price = Number(s.unitPrice || s.price || s.total || 0);
//         const lineTotal = Number(s.total != null ? s.total : (qty * price));
//         return `
//                     <tr>
//                       <td style="padding:12px 16px;border-top:1px solid #e5e7eb;font:13px Arial;color:#111827;">${idx + 1}</td>
//                       <td style="padding:12px 16px;border-top:1px solid #e5e7eb;font:13px Arial;color:#374151;">${s.name || s.type || 'Service'}</td>
//                       <td align="center" style="padding:12px 16px;border-top:1px solid #e5e7eb;font:13px Arial;color:#111827;">$${Number(price).toFixed(2)}</td>
//                       <td align="center" style="padding:12px 16px;border-top:1px solid #e5e7eb;font:13px Arial;color:#111827;">${qty}</td>
//                       <td align="right" style="padding:12px 16px;border-top:1px solid #e5e7eb;font:13px Arial;color:#111827;">$${Number(lineTotal).toFixed(2)}</td>
//                     </tr>`;
//     }).join('')}
//             </tbody>
//           </table>
//         </td>
//       </tr>

//       <!-- Totals -->
//       <tr>
//         <td style="padding:10px 28px 0 28px;">
//           <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
//             <tr>
//               <td style="width:50%;"></td>
//               <td>
//                 <table role="presentation" align="right" cellpadding="0" cellspacing="0"
//                        style="min-width:260px;border-collapse:separate;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;">
//                   <tr>
//                     <td style="padding:10px 14px;font:13px Arial;color:#6b7280;">Subtotal</td>
//                     <td align="right" style="padding:10px 14px;font:13px Arial;color:#111827;">
//                       $${(
//             (invoice.services || []).reduce((sum, s) => {
//                 const qty = Number(s.quantity || 1);
//                 const price = Number(s.unitPrice || s.price || s.total || 0);
//                 const lineTotal = Number(s.total != null ? s.total : qty * price);
//                 return sum + (isNaN(lineTotal) ? 0 : lineTotal);
//             }, 0)
//         ).toFixed(2)}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td style="padding:10px 14px;font:13px Arial;color:#6b7280;">Tax</td>
//                     <td align="right" style="padding:10px 14px;font:13px Arial;color:#111827;">$${Number(invoice.tax || 0).toFixed(2)}</td>
//                   </tr>
//                   <tr>
//                     <td style="padding:12px 14px;font:700 14px Arial;color:#111827;border-top:1px solid #e5e7eb;">Total Due</td>
//                     <td align="right" style="padding:12px 14px;font:700 16px Arial;color:${config.primaryColor || config.color || '#2563EB'};border-top:1px solid #e5e7eb;">
//                       $${Number(invoice.totalAmount || 0).toFixed(2)}
//                     </td>
//                   </tr>
//                 </table>
//               </td>
//             </tr>
//           </table>
//         </td>
//       </tr>

//       <!-- Optional description / inclusions -->
//       ${(invoice.services || []).some(s => s.customDescription) ? `
//       <tr>
//         <td style="padding:24px 28px 0 28px;">
//           <div style="font:700 13px Arial;color:#111827;margin:0 0 6px;">Service Includes</div>
//           <ul style="margin:0;padding:0 0 0 18px;">
//             ${(invoice.services || []).map(s => s.customDescription
//             ? `<li style="font:12px/1.6 Arial;color:#374151;margin:0 0 6px;">${s.customDescription}</li>`
//             : ''
//         ).join('')}
//           </ul>
//         </td>
//       </tr>` : ''}

//       <tr>
//         <td style="padding:26px 28px 8px 28px;text-align:center;">
//           <a href="${paymentURL}" target="_blank"
//              style="display:inline-block;background:${config.primaryColor || config.color || '#2563EB'};color:#ffffff;text-decoration:none;font:700 14px Arial;padding:14px 22px;border-radius:10px;border:1px solid ${config.primaryColor || config.color || '#2563EB'};">
//             Pay Invoice
//           </a>
//           <div style="font:12px/1.6 Arial;color:#6b7280;margin-top:10px;">
//             If the button doesn't work, copy and paste this link:
//           </div>
//           <div style="font:12px/1.6 Arial;word-break:break-all;">
//             <a href="${paymentURL}" target="_blank" style="color:${config.primaryColor || config.color || '#2563EB'};text-decoration:underline;">${paymentURL}</a>
//           </div>
//         </td>
//       </tr>

//       <!-- Footer -->
//       <tr>
//         <td style="padding:20px 28px 28px 28px;">
//           <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
//                  style="border-collapse:collapse;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;">
//             <tr>
//               <td style="padding:14px 16px;">
//                 <div style="font:12px/1.6 Arial;color:#6b7280;">
//                   You have unlimited free revisions. Our team works Mon–Fri. All content is ghostwritten with 100% ownership. Publishing takes 10–12 working days after approval. You can cancel at any time with a full refund if promises are not met.
//                 </div>
//                 <div style="font:12px/1.6 Arial;color:#9ca3af;margin-top:10px;text-align:center;">
//                   This is an automated message from ${customer.companyName}. Please do not reply.
//                 </div>
//               </td>
//             </tr>
//           </table>
//         </td>
//       </tr>

//     </table>
//   </div>
//   `;
// }

// async function sendInvoiceEmailByInvoiceId(invoiceId) {
//     const invoice = await InvoiceModel.findById(invoiceId).populate("customer");
//     if (!invoice) throw new ErrorHandler("Invoice not found", 404);

//     const customer = invoice.customer;
//     const toEmail = customer?.userEmail;
//     const companyName = customer?.companyName?.toLowerCase();

//     if (!toEmail) throw new ErrorHandler("Customer email not found", 400);
//     if (!companyName) throw new ErrorHandler("Customer company not found", 400);

//     const config = resolveCompanyConfig(companyName);
//     if (!config) throw new ErrorHandler("Unknown company, cannot send email", 400);
//     if (!config.smtp.user || !config.smtp.pass) throw new ErrorHandler("SMTP credentials missing for company", 500);

//     const html = buildInvoiceHtml(invoice, customer, config);

//     await sendEmail({
//         smtp: config.smtp,
//         from: config.from,
//         email: toEmail,
//         subject: `Invoice #${invoice.invoiceNumber}`,
//         message: `Invoice for $${Number(invoice.totalAmount || 0).toFixed(2)} — pay at ${config.domain}`,
//         html,
//     });
// }

// module.exports = {
//     sendPaymentSuccessEmailByInvoiceId,
//     sendInvoiceEmailByInvoiceId
// };




// email.service.js
"use strict";

const path = require("path");
const InvoiceModel = require("../models/invoiceModel");
const ErrorHandler = require("./errorHandler");
const sendEmail = require("./sendEmail");

// read envs lazily so they aren't frozen as undefined
function getCompanyConfigs() {
  return {
    "urban quill publishing": {
      smtp: {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        user: process.env.URBAN_SMTP_USER,
        pass: process.env.URBAN_SMTP_PASS,
      },
      from: `"Urban Quill Publishing" <billing@urbanquillpublishing.com>`,
      logo: "https://urbanquillpublishing.com/assets/images/logo.png",
      domain: "billing.urbanquillpublishing.com",
      // fixed typo from your sample:
      supportEmail: "info@urbanquillpublishing.com",
      color: "#e14226",
    },
    "bellevue publishers": {
      smtp: {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        user: process.env.BELLEVUE_SMTP_USER,
        pass: process.env.BELLEVUE_SMTP_PASS,
      },
      from: `"Bellevue Publishers" <billing@bellevuepublishers.com>`,
      logo: "https://bellevuepublishers.com/logo-dark.png",
      domain: "billing.bellevuepublishers.com",
      supportEmail: "info@bellevuepublishers.com",
      color: "#2CB9A8",
    },
    "the pulp house publishing": {
      smtp: {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        user: process.env.PULP_SMTP_USER,
        pass: process.env.PULP_SMTP_PASS,
      },
      from: `"The Pulp House Publishing" <billing@thepulphousepublishing.com>`,
      logo: "https://thepulphousepublishing.com/pulphLogo.png",
      domain: "billing.thepulphousepublishing.com",
      supportEmail: "info@thepulphousepublishing.com",
      color: "#341e36",
    },
    "book publishings": {
      smtp: {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        user: process.env.BOOK_SMTP_USER,
        pass: process.env.BOOK_SMTP_PASS,
      },
      from: `"Book Publishings" <billing@bookpublishings.com>`,
      logo: "https://bookpublishings.com/assets/bplogo.png",
      domain: "billing.bookpublishings.com",
      supportEmail: "info@bookpublishings.com",
      color: "#192946",
    },
  };
}

function resolveCompanyConfig(companyNameLower) {
  const configs = getCompanyConfigs();
  return Object.entries(configs).find(([key]) => companyNameLower.includes(key))?.[1];
}

/* ----------------------- PAYMENT SUCCESS (already had) ---------------------- */
function buildPaidHtml(invoice, customer, config) {
  const brandColor = config.primaryColor || config.color || "#2563EB";
  const successColor = config.successColor || "#16a34a";

  const paidHtmlContent = `
  <div style="margin:0;padding:0;background:#ffffff;">
    <div style="width:100%;background:${successColor};color:#ffffff;font:700 13px Arial;padding:10px 16px;text-align:center;">
      ✓ Payment Received — Thank you for your payment!
    </div>

    <div style="padding:24px;background:#ffffff;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"
             style="width:740px;max-width:740px;margin:0 auto;border-collapse:separate;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;box-shadow:0 6px 18px rgba(17,24,39,.06);overflow:hidden;">
        <tr>
          <td style="padding:28px 28px 8px 28px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
              <tr>
                <td style="vertical-align:middle;">
                  <img src="${config.logo}" alt="${customer.companyName} Logo" style="display:block;max-width:200px;border-radius:8px;">
                </td>
                <td style="text-align:right;vertical-align:middle;">
                  <div style="font:12px/1.4 Arial;color:#6b7280;">
                    Invoice ID: <span style="color:#111827;font-weight:700;">#${invoice.invoiceNumber}</span>
                  </div>
                  <div style="font:12px/1.4 Arial;color:#6b7280;">
                    Paid on: <span style="color:#111827;">${(invoice.paidAt ? new Date(invoice.paidAt) : new Date(invoice.updatedAt || Date.now())).toLocaleDateString()}</span>
                  </div>
                  <span style="display:inline-block;margin-top:6px;padding:5px 12px;font:700 11px/1 Arial;text-transform:uppercase;border-radius:999px;background:${successColor};color:#ffffff;border:1px solid ${successColor};">PAID</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:12px 28px 0 28px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                   style="border-collapse:separate;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:14px;">
              <tr>
                <td style="padding:14px 16px;width:40%;border-right:1px solid #bbf7d0;">
                  <div style="font:12px/1.4 Arial;color:#047857;">Invoice to</div>
                  <div style="font:700 14px/1.5 Arial;color:#064e3b;">${customer.userName}</div>
                  <div style="font:12px/1.5 Arial;color:#047857;">${customer.userEmail}</div>
                </td>
                <td style="padding:14px 16px;width:30%;border-right:1px solid #bbf7d0;">
                  <div style="font:12px/1.4 Arial;color:#047857;">Payment Method</div>
                  <div style="font:700 14px/1.5 Arial;color:#064e3b;">${invoice?.paidFrom?.issuer || "Online payment"}</div>
                  ${invoice.transactionId ? `<div style="font:12px/1.5 Arial;color:#047857;">Txn ID: ${invoice.transactionId}</div>` : ``}
                </td>
                <td style="padding:14px 16px;width:30%;text-align:right;">
                  <div style="font:12px/1.4 Arial;color:#047857;">Amount Paid</div>
                  <div style="font:700 24px/1.2 Arial;color:${successColor};">$${Number(invoice.totalAmount || 0).toFixed(2)}</div>
                </td>
              </tr>
            </table>
            <div style="font:13px/1.6 Arial;margin-top:12px;color:#111827;">
              Thank you! We’ve received your payment of <strong style="color:${successColor};">$${Number(invoice.totalAmount || 0).toFixed(2)}</strong>.
            </div>
          </td>
        </tr>

        <tr>
          <td style="padding:22px 28px 6px 28px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                   style="border-collapse:separate;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
              <thead>
                <tr style="background:#f3f4f6;">
                  <th align="left"  style="padding:12px 16px;font:12px Arial;color:#6b7280;">Sr.</th>
                  <th align="left"  style="padding:12px 16px;font:12px Arial;color:#6b7280;">Name</th>
                  <th align="center" style="padding:12px 16px;font:12px Arial;color:#6b7280;">Price</th>
                  <th align="center" style="padding:12px 16px;font:12px Arial;color:#6b7280;">Qty</th>
                  <th align="right" style="padding:12px 16px;font:12px Arial;color:#6b7280;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${(invoice.services || []).map((s, idx) => {
                  const qty = Number(s.quantity || 1);
                  const price = Number(s.unitPrice || s.price || s.total || 0);
                  const lineTotal = Number(s.total != null ? s.total : (qty * price));
                  return `
                    <tr>
                      <td style="padding:12px 16px;border-top:1px solid #e5e7eb;font:13px Arial;color:#111827;">${idx + 1}</td>
                      <td style="padding:12px 16px;border-top:1px solid #e5e7eb;font:13px Arial;color:#111827;">${s.name || s.type || "Service"}</td>
                      <td align="center" style="padding:12px 16px;border-top:1px solid #e5e7eb;font:13px Arial;color:#111827;">$${Number(price).toFixed(2)}</td>
                      <td align="center" style="padding:12px 16px;border-top:1px solid #e5e7eb;font:13px Arial;color:#111827;">${qty}</td>
                      <td align="right" style="padding:12px 16px;border-top:1px solid #e5e7eb;font:13px Arial;color:#111827;">$${Number(lineTotal).toFixed(2)}</td>
                    </tr>`;
                }).join("")}
              </tbody>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:10px 28px 0 28px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
              <tr>
                <td style="width:50%;"></td>
                <td>
                  <table role="presentation" align="right" cellpadding="0" cellspacing="0"
                         style="min-width:280px;border-collapse:separate;background:#ecfdf5;border:1px solid #bbf7d0;border-radius:12px;">
                    <tr>
                      <td style="padding:10px 14px;font:13px Arial;color:#047857;">Subtotal</td>
                      <td align="right" style="padding:10px 14px;font:13px Arial;color:#064e3b;">
                        $${((invoice.services || []).reduce((sum, s) => {
                          const qty = Number(s.quantity || 1);
                          const price = Number(s.unitPrice || s.price || s.total || 0);
                          const lineTotal = Number(s.total != null ? s.total : qty * price);
                          return sum + (isNaN(lineTotal) ? 0 : lineTotal);
                        }, 0)).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:10px 14px;font:13px Arial;color:#047857;">Tax</td>
                      <td align="right" style="padding:10px 14px;font:13px Arial;color:#064e3b;">$${Number(invoice.tax || 0).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 14px;font:13px Arial;color:#047857;">Amount Paid</td>
                      <td align="right" style="padding:10px 14px;font:700 14px Arial;color:${successColor};">$${Number(invoice.totalAmount || 0).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="padding:12px 14px;font:700 14px Arial;color:#064e3b;border-top:1px solid #bbf7d0;">Balance</td>
                      <td align="right" style="padding:12px 14px;font:700 16px Arial;color:${successColor};border-top:1px solid #bbf7d0;">$0.00</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        ${(invoice.services || []).some(s => s.customDescription) ? `
        <tr>
          <td style="padding:24px 28px 0 28px;">
            <div style="font:700 13px Arial;color:#111827;margin:0 0 6px;">Service Includes</div>
            <ul style="margin:0;padding:0 0 0 18px;">
              ${(invoice.services || []).map(s => s.customDescription ? `<li style="font:12px/1.6 Arial;color:#374151;margin:0 0 6px;">${s.customDescription}</li>` : "").join("")}
            </ul>
          </td>
        </tr>` : ""}

        <tr>
          <td style="padding:20px 28px 28px 28px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                   style="border-collapse:collapse;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;">
              <tr>
                <td style="padding:14px 16px;">
                  <div style="font:12px/1.6 Arial;color:#6b7280;">
                    You have unlimited free revisions. Our team works Mon–Fri. All content is ghostwritten with 100% ownership. Publishing takes 10–12 working days after approval. You can cancel at any time with a full refund if promises are not met.
                  </div>
                  <div style="font:12px/1.6 Arial;color:#9ca3af;margin-top:10px;text-align:center;">
                    This is an automated message from ${customer.companyName}.
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </div>
  </div>`;
  return paidHtmlContent;
}

async function sendPaymentSuccessEmailByInvoiceId(invoiceId) {
  const invoice = await InvoiceModel.findById(invoiceId).populate("customer");
  if (!invoice) throw new ErrorHandler("Invoice not found", 404);

  const customer = invoice.customer;
  const toEmail = customer?.userEmail;
  const companyName = customer?.companyName?.toLowerCase();
  if (!toEmail) throw new ErrorHandler("Customer email not found", 400);
  if (!companyName) throw new ErrorHandler("Customer company not found", 400);

  const config = resolveCompanyConfig(companyName);
  if (!config) throw new ErrorHandler("Unknown company, cannot send email", 400);
  if (!config.smtp.user || !config.smtp.pass) throw new ErrorHandler("SMTP credentials missing for company", 500);

  const html = buildPaidHtml(invoice, customer, config);

  await sendEmail({
    smtp: config.smtp,
    from: config.from,
    email: toEmail,
    subject: `Paid • Invoice #${invoice.invoiceNumber}`,
    message: `Payment received: $${Number(invoice.totalAmount || 0).toFixed(2)}.`,
    html,
  });
}

/* ------------------------------ INVOICE EMAIL ------------------------------ */
function buildInvoiceHtml(invoice, customer, config) {
  const brandColor = config.primaryColor || config.color || "#2563EB";
  const paymentURL = `https://${config.domain}/payment/${invoice._id}`;

  return `
  <div style="margin:0;padding:24px;background:#ffffff;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"
           style="width:740px;max-width:740px;margin:0 auto;border-collapse:separate;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;box-shadow:0 6px 18px rgba(17,24,39,.06);overflow:hidden;">
      <tr>
        <td style="padding:28px 28px 8px 28px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr>
              <td style="vertical-align:middle;">
                <img src="${config.logo}" alt="${customer.companyName} Logo" style="display:block;max-width:200px;border-radius:8px;">
              </td>
              <td style="text-align:right;vertical-align:middle;">
                <div style="font:12px/1.4 Arial;color:#6b7280;">
                  Invoice ID: <span style="color:#111827;font-weight:700;">#${invoice.invoiceNumber}</span>
                </div>
                <div style="font:12px/1.4 Arial;color:#6b7280;">
                  Date: <span style="color:#111827;">${new Date(invoice.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td style="padding:12px 28px 0 28px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                 style="border-collapse:separate;background:#f9fafb;border:1px solid #e5e7eb;border-radius:14px;">
            <tr>
              <td style="padding:14px 16px;width:40%;border-right:1px solid #e5e7eb;">
                <div style="font:12px/1.4 Arial;color:#6b7280;">Invoice to</div>
                <div style="font:700 14px/1.5 Arial;color:#111827;">${customer.userName}</div>
                <div style="font:12px/1.5 Arial;color:#6b7280;">${customer.userEmail}</div>
              </td>
              <td style="padding:14px 16px;width:30%;border-right:1px solid #e5e7eb;">
                <div style="font:12px/1.4 Arial;color:#6b7280;">Payment Status</div>
                <div style="font:700 14px/1.5 Arial;color:#111827;">${invoice.paymentStatus}</div>
              </td>
              <td style="padding:14px 16px;width:30%;text-align:right;">
                <div style="font:12px/1.4 Arial;color:#6b7280;">Total Due</div>
                <div style="font:700 24px/1.2 Arial;color:${brandColor};">
                  $${Number(invoice.totalAmount || 0).toFixed(2)}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td style="padding:22px 28px 6px 28px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                 style="border-collapse:separate;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
            <thead>
              <tr style="background:#f3f4f6;">
                <th align="left"  style="padding:12px 16px;font:12px Arial;color:#6b7280;">Sr.</th>
                <th align="left"  style="padding:12px 16px;font:12px Arial;color:#6b7280;">Name</th>
                <th align="center" style="padding:12px 16px;font:12px Arial;color:#6b7280;">Price</th>
                <th align="center" style="padding:12px 16px;font:12px Arial;color:#6b7280;">Qty</th>
                <th align="right" style="padding:12px 16px;font:12px Arial;color:#6b7280;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${(invoice.services || []).map((s, idx) => {
                const qty = Number(s.quantity || 1);
                const price = Number(s.unitPrice || s.price || s.total || 0);
                const lineTotal = Number(s.total != null ? s.total : (qty * price));
                return `
                  <tr>
                    <td style="padding:12px 16px;border-top:1px solid #e5e7eb;font:13px Arial;color:#111827;">${idx + 1}</td>
                    <td style="padding:12px 16px;border-top:1px solid #e5e7eb;font:13px Arial;color:#374151;">${s.name || s.type || 'Service'}</td>
                    <td align="center" style="padding:12px 16px;border-top:1px solid #e5e7eb;font:13px Arial;color:#111827;">$${Number(price).toFixed(2)}</td>
                    <td align="center" style="padding:12px 16px;border-top:1px solid #e5e7eb;font:13px Arial;color:#111827;">${qty}</td>
                    <td align="right" style="padding:12px 16px;border-top:1px solid #e5e7eb;font:13px Arial;color:#111827;">$${Number(lineTotal).toFixed(2)}</td>
                  </tr>`;
              }).join("")}
            </tbody>
          </table>
        </td>
      </tr>

      <tr>
        <td style="padding:10px 28px 0 28px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr>
              <td style="width:50%;"></td>
              <td>
                <table role="presentation" align="right" cellpadding="0" cellspacing="0"
                       style="min-width:260px;border-collapse:separate;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;">
                  <tr>
                    <td style="padding:10px 14px;font:13px Arial;color:#6b7280;">Subtotal</td>
                    <td align="right" style="padding:10px 14px;font:13px Arial;color:#111827;">
                      $${((invoice.services || []).reduce((sum, s) => {
                        const qty = Number(s.quantity || 1);
                        const price = Number(s.unitPrice || s.price || s.total || 0);
                        const lineTotal = Number(s.total != null ? s.total : qty * price);
                        return sum + (isNaN(lineTotal) ? 0 : lineTotal);
                      }, 0)).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:10px 14px;font:13px Arial;color:#6b7280;">Tax</td>
                    <td align="right" style="padding:10px 14px;font:13px Arial;color:#111827;">$${Number(invoice.tax || 0).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 14px;font:700 14px Arial;color:#111827;border-top:1px solid #e5e7eb;">Total Due</td>
                    <td align="right" style="padding:12px 14px;font:700 16px Arial;color:${brandColor};border-top:1px solid #e5e7eb;">
                      $${Number(invoice.totalAmount || 0).toFixed(2)}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      ${ (invoice.services || []).some(s => s.customDescription) ? `
      <tr>
        <td style="padding:24px 28px 0 28px;">
          <div style="font:700 13px Arial;color:#111827;margin:0 0 6px;">Service Includes</div>
          <ul style="margin:0;padding:0 0 0 18px;">
            ${(invoice.services || []).map(s => s.customDescription
              ? `<li style="font:12px/1.6 Arial;color:#374151;margin:0 0 6px;">${s.customDescription}</li>` : ""
            ).join("")}
          </ul>
        </td>
      </tr>` : "" }

      <tr>
        <td style="padding:26px 28px 8px 28px;text-align:center;">
          <a href="${paymentURL}" target="_blank"
             style="display:inline-block;background:${brandColor};color:#ffffff;text-decoration:none;font:700 14px Arial;padding:14px 22px;border-radius:10px;border:1px solid ${brandColor};">
            Pay Invoice
          </a>
          <div style="font:12px/1.6 Arial;color:#6b7280;margin-top:10px;">If the button doesn't work, copy and paste this link:</div>
          <div style="font:12px/1.6 Arial;word-break:break-all;">
            <a href="${paymentURL}" target="_blank" style="color:${brandColor};text-decoration:underline;">${paymentURL}</a>
          </div>
        </td>
      </tr>

      <tr>
        <td style="padding:20px 28px 28px 28px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                 style="border-collapse:collapse;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;">
            <tr>
              <td style="padding:14px 16px;">
                <div style="font:12px/1.6 Arial;color:#6b7280;">
                  You have unlimited free revisions. Our team works Mon–Fri. All content is ghostwritten with 100% ownership. Publishing takes 10–12 working days after approval. You can cancel at any time with a full refund if promises are not met.
                </div>
                <div style="font:12px/1.6 Arial;color:#9ca3af;margin-top:10px;text-align:center;">
                  This is an automated message from ${customer.companyName}. Please do not reply.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

    </table>
  </div>`;
}

async function sendInvoiceEmailByInvoiceId(invoiceId) {
  const invoice = await InvoiceModel.findById(invoiceId).populate("customer");
  if (!invoice) throw new ErrorHandler("Invoice not found", 404);

  const customer = invoice.customer;
  const toEmail = customer?.userEmail;
  const companyName = customer?.companyName?.toLowerCase();

  if (!toEmail) throw new ErrorHandler("Customer email not found", 400);
  if (!companyName) throw new ErrorHandler("Customer company not found", 400);

  const config = resolveCompanyConfig(companyName);
  if (!config) throw new ErrorHandler("Unknown company, cannot send email", 400);
  if (!config.smtp.user || !config.smtp.pass) throw new ErrorHandler("SMTP credentials missing for company", 500);

  const html = buildInvoiceHtml(invoice, customer, config);

  await sendEmail({
    smtp: config.smtp,
    from: config.from,
    email: toEmail,
    subject: `Invoice #${invoice.invoiceNumber}`,
    message: `Invoice for $${Number(invoice.totalAmount || 0).toFixed(2)} — pay at ${config.domain}`,
    html,
  });
}

module.exports = {
  sendPaymentSuccessEmailByInvoiceId,
  sendInvoiceEmailByInvoiceId,
};
