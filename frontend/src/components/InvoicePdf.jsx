// import {
//   Document,
//   Page,
//   Text,
//   View,
//   Image,
//   StyleSheet,
//   Font,
// } from "@react-pdf/renderer";

// // Optional: register a custom font if needed
// // Font.register({ family: 'Open Sans', src: '...' })

// const styles = StyleSheet.create({
//   page: {
//     fontSize: 10,
//     padding: 30,
//     fontFamily: "Helvetica",
//     color: "#000",
//   },
//   header: {
//     borderBottom: "1 solid #eee",
//     paddingBottom: 10,
//     marginBottom: 10,
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   sectionTitle: {
//     fontSize: 14,
//     marginBottom: 8,
//     fontWeight: 700,
//   },
//   tableHeader: {
//     flexDirection: "row",
//     backgroundColor: "#f2f2f2",
//     paddingVertical: 4,
//     paddingHorizontal: 2,
//     fontWeight: "bold",
//   },
//   tableRow: {
//     flexDirection: "row",
//     paddingVertical: 2,
//     paddingHorizontal: 2,
//   },
//   cell: { flex: 1 },
//   right: { textAlign: "right" },
//   totalRow: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     marginTop: 10,
//   },
//   terms: {
//     marginTop: 20,
//     fontSize: 9,
//     lineHeight: 1.4,
//   },
//   footer: {
//     marginTop: 20,
//     fontSize: 9,
//     textAlign: "right",
//     borderTop: "1 solid #ccc",
//     paddingTop: 8,
//   },
// });

// const InvoicePDF = ({ invoiceData, terms }) => {
//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         {/* Header */}
//         <View style={styles.header}>
//           <View style={styles.row}>
//             <Text style={styles.sectionTitle}>INVOICE</Text>
//             <Image
//               src="/assets/images/urban-fav.webp"
//               style={{ width: 40, height: 40 }}
//             />
//           </View>
//           <Text>
//             13 Tetrick Road, Cypress Gardens, Florida, 33884, US {"\n"}
//             +1 (070) 123-4567
//           </Text>
//         </View>

//         {/* Invoice Info */}
//         <View style={styles.row}>
//           <View>
//             <Text style={{ fontWeight: "bold" }}>Issue For:</Text>
//             <Text>{invoiceData.billTo?.name}</Text>
//             <Text>{invoiceData.billTo?.email}</Text>
//             <Text>
//               {invoiceData.billTo?.address}, {invoiceData.billTo?.city}
//             </Text>
//             <Text>{invoiceData.billTo?.phone}</Text>
//           </View>

//           <View>
//             <Text>Invoice : {invoiceData.invoiceNumber}</Text>
//             <Text>
//               Issue Date : {new Date(invoiceData.invoiceDate).toLocaleDateString()}
//             </Text>
//           </View>
//         </View>

//         {/* Table Header */}
//         <View style={[styles.tableHeader, { marginTop: 20 }]}>
//           <Text style={styles.cell}>S.NO</Text>
//           <Text style={styles.cell}>ITEMS</Text>
//           <Text style={styles.cell}>QTY</Text>
//           <Text style={[styles.cell, styles.right]}>PRICE</Text>
//           <Text style={[styles.cell, styles.right]}>AMOUNT</Text>
//         </View>

//         {/* Table Rows */}
//         {invoiceData.services?.map((item, index) => (
//           <View style={styles.tableRow} key={index}>
//             <Text style={styles.cell}>{index + 1}</Text>
//             <Text style={styles.cell}>{item.type}</Text>
//             <Text style={styles.cell}>{item.quantity}</Text>
//             <Text style={[styles.cell, styles.right]}>${item.unitPrice}</Text>
//             <Text style={[styles.cell, styles.right]}>${item.total}</Text>
//           </View>
//         ))}

//         {/* Totals */}
//         <View style={styles.totalRow}>
//           <View style={{ width: "40%" }}>
//             <View style={styles.row}>
//               <Text>Subtotal :</Text>
//               <Text>${invoiceData.totalAmount}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text>Discount :</Text>
//               <Text>$0</Text>
//             </View>
//             <View style={[styles.row, { fontWeight: "bold", fontSize: 11 }]}>
//               <Text>Grand Total :</Text>
//               <Text>${invoiceData.totalAmount}</Text>
//             </View>
//           </View>
//         </View>

//         {/* Terms */}
//         <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Terms:</Text>
//         <View style={styles.terms}>
//           {terms?.map((term, idx) => (
//             <Text key={idx}>• {term}</Text>
//           ))}
//         </View>

//         {/* Footer */}
//         <View style={styles.footer}>
//           <Text>https://s.com/</Text>
//           <Text>billing@bellevuepublishers.com</Text>
//           <Text>(877) 251-</Text>
//         </View>
//       </Page>
//     </Document>
//   );
// };

// export default InvoicePDF;





import React, { Fragment } from "react";
// import logo from "../assets/logo.png";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
} from "@react-pdf/renderer";
import { colors } from "../constants/constants";
// import logo from "../assets/logo.png";


// const fontSizes = {
//   extraBase: "8px",
//   base: "10px",
//   text_xl: "13px",
// };

const fontSizes = {
  extraBase: 8,
  base: 10,
  text_xl: 13,
};


const terms = [
  " All work is 100% original, professionally ghostwritten/editted, and fully owned by you. We provide unlimited revisions during the writing and editing process. Our dedicated in-house U.S.-based writing team works Monday to Friday to ensure consistent progress. Urban Quill Publishing claims no royalties, credit, or rights—you retain full ownership and profits from your book.",
  "Publishing turnaround is typically 10–12 business days after final approval. Should you be dissatisfied or if agreed services are not delivered, you may cancel at any time during the project for a full refund. Please note: Refunds are not issued for change of mind.",
];



const InvoicePDF = ({ invoiceData }) => {
  const styles = StyleSheet.create({
    page: {
      fontSize: 11,
      paddingTop: 20,
      paddingBottom: 10,
      paddingLeft: 40,
      paddingRight: 40,
      lineHeight: 1.5,
      flexDirection: "column",
    },
    between: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      color: "#3E3E3E",
    },
    spaceBetween: {
      flex: 1,
      flexDirection: "row",
      gap: 20,
      color: "#3E3E3E",
    },

    companyColor: {
      color: invoiceData?.customer?.companyName === "Bellevue Publishers" ? colors.primary : colors.secondary,
    },
    titleContainer: {
      flexDirection: "row",
      marginTop: 2,
      paddingTop: 5,
      paddingBottom: 5,
      borderBottom: `1px solid #e5e7eb`,
    },

    logo: { width: 90 },

    reportTitle: { fontSize: 16, textAlign: "center" },

    addressTitle: { fontSize: 11, fontStyle: "bold" },

    invoice: {
      fontWeight: "bold",
      fontSize: fontSizes.text_xl,
      marginTop: 24,
    },

    invoiceNumber: { fontSize: 11, fontWeight: "bold" },

    address: { fontWeight: 400, fontSize: 10 },

    theader: {
      marginTop: 20,
      fontSize: 10,
      // fontStyle: "bold",
      paddingTop: 4,
      paddingLeft: 7,
      flex: 1,
      height: 20,
    },

    theader2: { flex: 2 },

    tbody: {
      fontSize: 9,
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 7,
      backgroundColor: "#f3f4f6",

      flex: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0.1,
    },

    tbody2: { flex: 2 },
  });
  let companyConstants = {};
  switch (invoiceData?.customer?.companyName) {
    case "Bellevue Publishers": {
      companyConstants = {
        companyName: "Bellevue Publishers",
        companyUrl: "https://bellevuepublishers.com/",
        billingEmail: "billing@bellevuepublishers.com",
        phoneNumber: "(877) 251-5759",
        companyAddress: "157 Church st 19th floor New haven, CT 06510 United States",
        cdnLink: "https://bellevue-portal.b-cdn.net/",
      }
      break;
    }
    case "Urban Quill Publishing": {
      companyConstants = {
        companyName: "Urban Quill Publishing",
        companyUrl: "https://urbanquillpublishing.com/",
        billingEmail: "billing@urbanquillpublishing.com",
        phoneNumber: "(888) 927-8219",
        companyAddress: "Mailing Address: 415 Boston Post Rd, Suite 3-1242, Milford, CT 06460, USA",
        cdnLink: "https://bellevue-portal.b-cdn.net/",
      };
      break;
    }
  }




  const InvoiceTitle = () => (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View style={styles.between}>
       
        <View >
          <Text style={[styles.companyColor, { fontSize: fontSizes.base }]}>
            {invoiceData?.customer?.companyName}
          </Text>
          <Text style={{ fontSize: fontSizes.base }}>
            {companyConstants.companyAddress}
          </Text>
        </View>
      </View>
    </View>
  );

  const Address = () => (
    <View>
      <Text style={styles.invoice}>Invoice </Text>
      <View style={styles.titleContainer}>
        <View style={styles.spaceBetween}>
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                // marginBottom: 10,
                gap: 20,
              }}
            >
              <Text style={{ fontSize: fontSizes.base }}>Invoice Number :</Text>
              <Text style={{ fontSize: fontSizes.base, fontWeight: "bold" }}>
                {invoiceData?.invoiceNumber}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                // marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: fontSizes.base }}>Invoice Date :</Text>
              <Text style={{ fontSize: fontSizes.base }}>
                {new Date(invoiceData?.invoiceDate).toLocaleDateString()}
              </Text>
            </View>
            {/* <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: fontSizes.base }}>Balance Due :</Text>
              <Text style={{ fontSize: fontSizes.base }}>
                {invoiceData?.paymentStatus === "Partial"
                  ? invoiceData?.remainingAmount
                  : "0"}
              </Text>
            </View> */}
          </View>

          <View style={{ flexDirection: "column" }}>
            <Text style={{ fontSize: fontSizes.base }}>
              {" "}
              {invoiceData?.customer?.userName}
            </Text>
            <Text style={{ fontSize: fontSizes.base }}>
              {" "}
              {invoiceData?.customer?.userEmail}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const TableHead = () => (
    <View style={{ width: "100%", flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
      <View style={{ flex: 0.5, paddingLeft: 5 }}>
        <Text>Sr.</Text>
      </View>
      <View style={{ flex: 2, textAlign: "center", paddingLeft: 5 }}>
        <Text>Name</Text>
      </View>
      <View style={{ flex: 1, paddingLeft: 5 }}>
        <Text>Qty</Text>
      </View>
      <View style={{ flex: 1, paddingLeft: 5 }}>
        <Text>Price</Text>
      </View>
      <View style={{ flex: 1, paddingLeft: 5 }}>
        <Text>Amount</Text>
      </View>
    </View>
  );

  // const TableHead = () => (
  //   <View style={{ width: "100%", flexDirection: "row" }}>
  //     <View style={[styles.theader]}>
  //       <Text>Sr.</Text>
  //     </View>
  //     <View style={[styles.theader]}>
  //       <Text>Name</Text>
  //     </View>
  //     <View style={styles.theader}>
  //       <Text>Qty</Text>
  //     </View>

  //     <View style={styles.theader}>
  //       <Text>Price</Text>
  //     </View>
  //     <View style={styles.theader}>
  //       <Text>Amount</Text>
  //     </View>
  //   </View>
  // );

  const TableBody = () => (
    <Fragment>
      {invoiceData?.services?.map((term, index) => (
        <View key={index} style={{ width: "100%", flexDirection: "row" }} >
          <View style={styles.tbody}>
            <Text>{index + 1} </Text>
          </View>
          <View style={[styles.tbody, styles.tbody2]}>
            <Text style={styles.companyColor}>
              {term.type}
            </Text>
          </View>

          <View style={styles.tbody}>
            <Text>{term.quantity} </Text>
          </View>
          <View style={styles.tbody}>
            <Text>${term.unitPrice} </Text>
          </View>
          <View style={styles.tbody}>
            <Text>${term.total} </Text>
          </View>
        </View>
      ))}
    </Fragment>
  );
  const Services = () => (
    <View
      style={{
        flexDirection: "row",
        marginTop: 25,
        gap: 10,
        justifyContent: "space-between",
        alignItems: "baseline",
      }}
    >
      {invoiceData?.services?.some(service => service.customDescription) && (
        <View style={{ flex: 2, flexDirection: "column", marginBottom: 10 }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: fontSizes.base,
            }}
          >
            Service Description:
          </Text>
          <View>
            {invoiceData?.services?.map((term, index) => (
              <View
                style={{
                  marginTop: 2,
                  flexDirection: "row",
                  gap: 4,
                  alignItems: "flex-start",
                }}
                key={index}
              >
                <View
                  style={{
                    padding: 1.5,
                    borderRadius: 50,
                    backgroundColor: "black",
                    marginTop: 3,
                  }}
                ></View>
                <Text key={index} style={{ fontSize: fontSizes.extraBase }}>
                  {term.customDescription}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
      <View style={{ flex: 1, alignSelf: "flex-end", marginLeft: 10 }}>

        
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 20,
            }}
          >
            <Text style={{ fontSize: fontSizes.base }}>Subtotal :</Text>
            <Text style={{ fontSize: fontSizes.base, fontWeight: "bold" }}>
              {invoiceData?.totalAmount}
            </Text>
          </View>
         
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 20,
            }}
          >
            <Text style={{ fontSize: fontSizes.base }}>Status :</Text>
            <Text style={{ fontSize: fontSizes.base, fontWeight: "bold" }}>
              {invoiceData?.paymentStatus}
            </Text>
          </View>
        
      </View>
    </View>
  );
  const Terms = () => (
    <View style={{ marginBottom: 10 }}>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: fontSizes.base,
        }}
      >
        Terms:
      </Text>
      {terms?.map((term, index) => (
        <View
          style={{
            marginTop: 2,
            flexDirection: "row",
            gap: 4,
            alignItems: "flex-start",
          }}
          key={index}
        >
          <View
            style={{
              padding: 1.5,
              borderRadius: 50,
              backgroundColor: "black",
              marginTop: 3,
            }}
          ></View>
          <Text key={index} style={{ fontSize: fontSizes.extraBase }}>
            {term}
          </Text>
        </View>
      ))}
      <View
        style={{
          flexDirection: "column",
          alignItems: "flex-end",
          fontSize: fontSizes.base,
          // borderTop: `1px solid #e5e7eb`,
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          borderTopStyle: 'solid',
          marginTop: 10,
          paddingTop: 10,
        }}
      >
        <Text>{companyConstants.companyUrl}</Text>
        <Text>{companyConstants.billingEmail}</Text>
        <Text>{companyConstants.phoneNumber}</Text>
      </View>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <InvoiceTitle />
        <Address />
        <TableHead />
        <TableBody />
        <Services />
        <Terms />
      </Page>
    </Document>
  );
};

export default InvoicePDF;


// export default function Invoice({ invoiceData }) {
//   const fontSizes = {
//     base: "text-[13px]",
//   };
//   return (
//     <div>
//       <div className={` md:mt-8 md:p-4  bg-white ${fontSizes.base} `}>
//         <div className="grid  md:grid-cols-3  gap-5 mb-8">
//           <div className="col-span-2">
//             <img
//               src={logo}
//               alt="Company Logo"
//               className={" h-18 w-32  md:h-24 md:w-44 px-2  py-4"}
//             />
//           </div>
//           <div className="col-span-1">
//             <p className={` text-[${colors.primary}] ${fontSizes.base}`}>
//               Bellevue Publishers
//             </p>
//             <p className={`${fontSizes.base}`}>
//               {companyConstants.companyAddress}
//             </p>
//           </div>
//         </div>

//         <p
//           className={` font-medium mb-2 sm:px-5 md:px-10 ${fontSizes.text_xl} text-[${colors.primary}]`}
//         >
//           INVOICE
//         </p>
//         <div className="grid   md:grid-cols-3  gap-10 py-4  border-t-2 border-b-2 mb-4  sm:px-5 md:px-10">
//           <div className=" gap-5 ">
//             <div className="col-span-1 flex justify-between">
//               <p>Invoice Number :</p>
//               <p className="font-bold">{invoiceData?.invoiceNumber}</p>
//             </div>
//             <div className="col-span-1 flex justify-between">
//               <p>Invoice Date :</p>
//               <p>{new Date(invoiceData?.invoiceDate).toLocaleDateString()}</p>
//               {/* <p>{invoiceData?.invoiceDate}</p> */}
//             </div>
//             <div className="col-span-1 flex justify-between">
//               <p>Balance Due :</p>
//               <p>
//                 {invoiceData?.paymentStatus === "Partial"
//                   ? invoiceData?.remainingAmount
//                   : "0"}
//               </p>
//             </div>
//           </div>

//           <div className="col-span-1 ">
//             <p className={`font-semibold `}>
//               {invoiceData?.customer?.userName}
//             </p>
//             <p>{invoiceData?.customer?.userEmail}</p>
//           </div>
//         </div>
//         <table className="overflow-x-scroll w-full border-collapse text-left my-5">
//           <thead>
//             <tr>
//               <th className={`py-3 md:py-5 md:px-4 `}>Name</th>
//               <th className={`py-3 md:py-5 md:px-4 `}>Type</th>
//               <th className={`py-3 md:py-5 md:px-4 `}>Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr className={`bg-gray-100  border-b-2 border-t-2`}>
//               <td
//                 className={`py-4 md:py-8  px-2 md:px-4 ${fontSizes.base} text-[${colors.primary}]`}
//               >
//                 {invoiceData?.project?.projectName}
//               </td>
//               <td className="py-4 md:py-8 px-2 md:px-4">
//                 {invoiceData?.project?.projectType}
//               </td>
//               <td className="py-4 md:py-8 px-2 md:px-4">
//                 {invoiceData?.totalAmount}
//               </td>
//             </tr>
//           </tbody>
//         </table>

//         <div className=" flex flex-col-reverse  md:grid    md:grid-cols-3   gap-8 mt-8">
//           <div className="col-span-2 ">
//             <p className="font-bold">Services Includes :</p>
//             <ul className="list-disc pl-4   ">
//               {invoiceData?.project?.services?.map((item, index) => (
//                 <li className="text-xs font-medium my-2" key={index}>
//                   {item}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="col-span-1 md:px-5  text-right">
//             <div className="grid grid-cols-1 gap-1">
//               {invoiceData &&
//                 invoiceData?.installments?.length > 0 &&
//                 invoiceData.remainingAmount !== 0 &&
//                 invoiceData?.installments?.map((item, index) => (
//                   <>
//                     <div
//                       className={` !text-left font-bold   ${fontSizes.text_xl} text-[${colors.primary}] uppercase`}
//                       key={index}
//                     >
//                       Installment {index + 1}
//                     </div>
//                     <div className="col-span-1 flex justify-between">
//                       <p>Transaction ID :</p>
//                       <p className="font-bold">{item?.transactionId}</p>
//                     </div>
//                     <div className="col-span-1 flex justify-between">
//                       <p>Amount :</p>
//                       <p className="font-bold">{item?.amount}</p>
//                     </div>
//                   </>
//                 ))}
//             </div>
//             {/* <Divider /> */}
//             <div className="grid grid-cols-1 gap-1 ">
//               <div className="col-span-1 flex justify-between">
//                 <p>Subtotal :</p>
//                 <p className="font-bold">{invoiceData?.totalAmount}</p>
//               </div>
//               <div className="col-span-1 flex justify-between">
//                 <p>Paid To Date :</p>
//                 <p>{invoiceData?.paidToDate}</p>
//               </div>

//               <div className="col-span-1 flex justify-between">
//                 <p>Balance Due :</p>
//                 <p>
//                   {invoiceData?.paymentStatus === "Partial"
//                     ? invoiceData?.remainingAmount
//                     : "0"}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className=" grid  md:grid-cols-3  gap-8 mt-8">
//           <div className="col-span-2 ">
//             <p className="font-bold">Terms:</p>
//             <ul className="list-disc pl-4   ">
//               {terms?.map((item, index) => (
//                 <li className="text-xs font-medium my-2" key={index}>
//                   {item}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* <Divider /> */}
//         <div className={` col-span-1 flex flex-col items-end md:px-5`}>
//           <p className={`${fontSizes.base}`}>{companyConstants.companyUrl}</p>
//           <p className={`${fontSizes.base}`}>{companyConstants.billingEmail}</p>
//           <p className={`${fontSizes.base}`}>{companyConstants.phoneNumber}</p>
//         </div>
//       </div>
//       {/* <div>
//         <PDFViewer style={{ height: "100vh", width: "100%" }}>
//           <PdfInvoice invoiceData={invoiceData} />
//         </PDFViewer>
//       </div> */}
//       <div className="w-1/4">
//         <PDFDownloadLink
//           document={<PdfInvoice invoiceData={invoiceData} />}
//           fileName={`${invoiceData?.invoiceNumber}.pdf`}
//         >
//           <button AdditionalStyle={"flex gap-3 justify-center items-center"}>
//             download
//             <IconDownload />
//           </button>
//         </PDFDownloadLink>
//       </div>
//     </div>
//   );
// }
