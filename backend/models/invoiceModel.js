const { db1 } = require("../config/db");
const mongoose = require("mongoose");
const installmentSchema = new mongoose.Schema({
  transactionId: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  dueDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending",
  },
});
// Define a schema for a invoice
const invoiceSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
    },
    invoiceNumber: {
      type: String,
      unique: true,
    },
    invoiceDate: {
      type: Date,
      default: Date.now,
      // required: true,
    },
    dueDate: {
      type: Date,
      // required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paidToDate: {
      type: Number,
      default: 0,
    },
    remainingAmount: {
      type: Number,
    },
    salesPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the salesperson who made the sale
      required: true,
    },
    saleType: {
      type: String,
      enum: ["upSell", "frontSell", "crossSell"],
      required: true,
      default: "frontSell"
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
    companyName: {
      type: String,
      required: [true, "Enter Your Company Name"],
    },
    sale: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sales",
    },
    billTo: {
      name: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      zip: String,
    },
    paidFrom: {
      last4Digits: {
        type: String,
        // required: function () {
        //   return this.paymentStatus === 'Paid';
        // },
      },
      issuer: {
        type: String,
        // required: function () {
        //   return this.paymentStatus === 'Paid';
        // },
      },
      expiry: {
        type: String,
        // required: function () {
        //   return this.paymentStatus === 'Paid';
        // },
      },
      code: {
        type: String,
        // required: function () {
        //   return this.paymentStatus === 'Paid';
        // },
      },
      idNumb: {
        type: String,
        // required: function () {
        //   return this.paymentStatus === 'Paid';
        // },
      },
    },
    services: [
      {
        type: {
          type: String,
          required: true,
        },
        customDescription: String,
        unitPrice: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        total: {
          type: Number,
        },
      },
    ],

    status: {
      type: Boolean,
      default: true,
    },
    note: String,
    paymentStatus: {
      type: String,
      enum: ["Pending", "Partial", "Paid"],
      default: "Pending",
    },
    // installments: [installmentSchema], // Array of installment objects
  },

  {
    timestamps: true,
  }
);
// invoiceSchema.pre("save", function (next) {
//   // Calculate total amount and remaining amount from installments
//   const paidToDate = this.installments.reduce(
//     (acc, installment) => acc + installment.amount,
//     0
//   );
//   const remainingAmount = this.installments.reduce(
//     (acc, installment) =>
//       installment.status === "Pending" ? acc + installment.amount : acc,
//     0
//   );

//   // Update total amount and remaining amount in the invoice
//   this.paidToDate = paidToDate;
//   this.remainingAmount = remainingAmount;

//   // Update payment status based on remaining amount
//   if (remainingAmount === 0) {
//     this.paymentStatus = "Paid";
//   } else if (remainingAmount < paidToDate) {
//     this.paymentStatus = "Partial";
//   } else {
//     this.paymentStatus = "Pending";
//   }
//   next();
// });

///////////////////////////////

// invoiceSchema.pre("save", function (next) {
//   const paidToDate = this.installments.reduce(
//     (acc, installment) => installment.status === "Paid" ? acc + installment.amount : acc,
//     0
//   );

//   const remainingAmount = this.totalAmount - paidToDate;
//   this.paidToDate = paidToDate;
//   this.remainingAmount = remainingAmount;

//   if (remainingAmount === 0) {
//     this.paymentStatus = "Paid";
//   } else if (remainingAmount < this.totalAmount && remainingAmount > 0) {
//     this.paymentStatus = "Partial";
//   } else {
//     this.paymentStatus = "Pending";
//   }

//   next();
// });

///////////////////////

invoiceSchema.pre('save', function (next) {
  this.services.forEach(service => {
    service.total = service.unitPrice * service.quantity;
  });

  this.totalAmount = this.services.reduce((acc, curr) => acc + (curr.total || 0), 0);
  this.remainingAmount = this.totalAmount - this.paidToDate;

  next();
});



invoiceSchema.pre("save", async function (next) {
  // Check if the document is new or being modified
  if (!this.isNew || this.invoiceNumber) {
    return next(); // If not new or already has an invoice number, proceed
  }

  try {
    // Custom function to generate invoice number
    const generatedInvoiceNumber = await generateInvoiceNumber();
    this.invoiceNumber = generatedInvoiceNumber;
    next();
  } catch (error) {
    next(error);
  }
});

// Custom function to generate invoice number
async function generateInvoiceNumber() {
  // Logic to generate the invoice number as per your requirements
  // Example: Generate a random number with a prefix
  const prefix = "INV";
  const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit number
  const invoiceNumber = `${prefix}-${randomNumber}`;
  return invoiceNumber;
}
// Create models for each invoice type
const InvoiceModel = db1.model("invoices", invoiceSchema);

module.exports = InvoiceModel;
