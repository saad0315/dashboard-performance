// import React, { Fragment } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const fontSizes = {
  extraBase: 8,
  base: 10,
  text_xl: 13,
};

export const colors = {
  secondary: "#e14226",
  primary: "#2CB9A8",
  white: "#ffffff",
  lightGray: "#BAC4C9",
  red: "red",
};

const terms = [
  " All work is 100% original, professionally ghostwritten/editted, and fully owned by you. We provide unlimited revisions during the writing and editing process. Our dedicated in-house U.S.-based writing team works Monday to Friday to ensure consistent progress. Our Company claims no royalties, credit, or rights—you retain full ownership and profits from your book.",
  "Publishing turnaround is typically 10–12 business days after final approval. Should you be dissatisfied or if agreed services are not delivered, you may cancel at any time during the project for a full refund. Please note: Refunds are not issued for change of mind.",
];

const InvoicePDF = ({ invoiceData }) => {
  const brandColor =
    invoiceData?.primaryColor || invoiceData?.color || colors.primary;
  const successColor = invoiceData?.successColor || "#16a34a";
  const isPaid = (invoiceData?.paymentStatus || "").toLowerCase() === "paid";

  const neutralBorder = "#e5e7eb";
  const neutralBG = "#f9fafb";
  const headerRowBG = "#f3f4f6";
  const textMuted = "#6b7280";
  const textDark = "#111827";

  // helpers
  const money = (v) => `$${Number(v || 0).toFixed(2)}`;
  const subtotal = (invoiceData?.services || []).reduce((sum, s) => {
    const qty = Number(s.quantity || 1);
    const price = Number(s.unitPrice || s.price || s.total || 0);
    const line = s.total != null ? Number(s.total) : qty * price;
    return sum + (isNaN(line) ? 0 : line);
  }, 0);
  const tax = Number(invoiceData?.tax || 0);
  const total = Number(invoiceData?.totalAmount ?? subtotal + tax);

  // company constants (kept close to your original)
  let companyConstants = {};
  switch (invoiceData?.customer?.companyName) {
    case "Bellevue Publishers":
      companyConstants = {
        companyName: "Bellevue Publishers",
        companyUrl: "https://bellevuepublishers.com/",
        billingEmail: "billing@bellevuepublishers.com",
        phoneNumber: "(888) 927-8498",
        companyAddress:
          "157 Church st 19th floor New haven, CT 06510 United States",
        companyLogo: "/bellevueLogo.png",
      };
      break;
    case "Urban Quill Publishing":
      companyConstants = {
        companyName: "Urban Quill Publishing",
        companyUrl: "https://urbanquillpublishing.com/",
        billingEmail: "billing@urbanquillpublishing.com",
        phoneNumber: "(888) 927-8219",
        companyAddress:
          "Mailing Address: 415 Boston Post Rd, Suite 3-1242, Milford, CT 06460, USA",
        companyLogo: "/uqlogo.png",
      };
      break;
    case "Book Publishings":
      companyConstants = {
        companyName: "Book Publishings",
        companyUrl: "https://bookpublishings.com/",
        billingEmail: "billing@bookpublishings.com",
        phoneNumber: "(888) 223-2911",
        companyAddress: "332 S Michigan Ave, Suite 900, Chicago, IL 60604",
        companyLogo: "/bplogo.png",
      };
      break;
    case "The Pulp House Publishing":
      companyConstants = {
        companyName: "The Pulp House Publishing",
        companyUrl: "https://thepulphousepublishing.com/",
        billingEmail: "billing@thepulphousepublishing.com",
        phoneNumber: "(888) 909-9431",
        companyAddress: "5900 Balcones Drive STE 26981 Austin, TX 78731",
        companyLogo: "/pulphLogo.png",
      };
      break;
    default:
      companyConstants = {
        companyName: invoiceData?.customer?.companyName || "Company",
        companyUrl: invoiceData?.companyUrl || "",
        billingEmail:
          invoiceData?.billingEmail || invoiceData?.customer?.userEmail,
        phoneNumber: invoiceData?.phoneNumber || "",
        companyAddress: invoiceData?.companyAddress || "",
        companyLogo: invoiceData?.companyLogo,
      };
  }

  const styles = StyleSheet.create({
    page: {
      fontSize: 11,
      paddingTop: 22,
      paddingBottom: 16,
      paddingLeft: 40,
      paddingRight: 40,
      lineHeight: 1.5,
      flexDirection: "column",
      backgroundColor: "#ffffff",
    },

    // HEADER
    card: {
      borderWidth: 1,
      borderColor: neutralBorder,
      borderRadius: 12,
      padding: 18,
      backgroundColor: "#ffffff",
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    logo: { width: 140, height: "auto" },
    idBlock: { textAlign: "left" },

    // SUMMARY STRIP
    summary: {
      marginTop: 10,
      borderRadius: 10,
      borderWidth: 1,
      padding: 12,
      borderColor: isPaid ? "#bbf7d0" : neutralBorder,
      backgroundColor: isPaid ? "#f0fdf4" : neutralBG,
      flexDirection: "row",
    },
    sumCol: { flex: 1, paddingRight: 10 },
    sumColRight: {
      flex: 1,
      alignItems: "flex-end",
      justifyContent: "center",
    },

    // TABLE
    table: {
      marginTop: 18,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: neutralBorder,
      overflow: "hidden",
    },
    thead: {
      flexDirection: "row",
      backgroundColor: headerRowBG,
      paddingVertical: 8,
    },
    th: { color: textMuted, fontSize: 10, paddingHorizontal: 8 },
    tr: {
      flexDirection: "row",
      borderTopWidth: 1,
      borderTopColor: neutralBorder,
      paddingVertical: 10,
    },
    td: { fontSize: 11, color: textDark, paddingHorizontal: 8 },
    cName: { flex: 1 },
    cSKU: { flex: 2 },
    cPrice: { flex: 1, textAlign: "left" },
    cQty: { flex: 1, textAlign: "center" },
    cAmt: { flex: 1, textAlign: "right" },

    // PERFORATED DIVIDER
    perf: {
      marginTop: 14,
      borderTopWidth: 1.5,
      borderTopColor: neutralBorder,
      borderStyle: "dashed",
    },

    // TOTALS
    totalsWrap: {
      marginTop: 12,
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    totalsCard: {
      minWidth: 240,
      borderRadius: 10,
      borderWidth: 1,
      padding: 10,
      borderColor: isPaid ? "#bbf7d0" : neutralBorder,
      backgroundColor: isPaid ? "#ecfdf5" : neutralBG,
    },
    totalsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 2,
    },
    totalsLabel: {
      fontSize: 11,
      color: isPaid ? "#047857" : textMuted,
    },
    totalsValue: {
      fontSize: 11,
      color: isPaid ? "#064e3b" : textDark,
    },
    totalsDue: {
      marginTop: 6,
      paddingTop: 6,
      borderTopWidth: 1,
      borderTopColor: isPaid ? "#bbf7d0" : neutralBorder,
      flexDirection: "row",
      justifyContent: "space-between",
    },

    // SERVICE INCLUDES
    includesWrap: { marginTop: 18, flexDirection: "row" },
    includesCol: { flex: 2, paddingRight: 10 },
    bulletRow: { flexDirection: "row", alignItems: "flex-start", marginTop: 2 },
    bulletDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: "#000",
      marginTop: 5,
      marginRight: 6,
    },

    // FOOTER
    footer: {
      marginTop: 14,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: neutralBorder,
      flexDirection: "column",
      alignItems: "flex-end",
      fontSize: fontSizes.base,
    },

    // small helpers
    muted: { color: textMuted, fontSize: 10 },
    mutedv2: { color: textMuted, fontSize: 10, alignSelf: "flex-end" },
    mutedv3: { color: textMuted, fontSize: 9 },
    dark: { color: textDark },
    badgePaid: {
      alignSelf: "flex-end",
      marginTop: 6,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: successColor,
      color: "#fff",
      fontSize: 9,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    receipt: {
      fontSize: 12,
      color: textDark,
      fontWeight: "bold",
      letterSpacing: 1,
    },
  });

  const Header = () => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          {companyConstants.companyLogo ? (
            <Image style={styles.logo} src={companyConstants.companyLogo} />
          ) : (
            <Text
              style={[{ fontSize: 16, fontWeight: "bold", color: brandColor }]}
            >
              {invoiceData?.customer?.companyName}
            </Text>
          )}
          {/* <Text style={[styles.muted, { marginTop: 2 }]}>
            {companyConstants.companyAddress}
          </Text> */}
        </View>

        <View style={styles.idBlock}>
          {/* {isPaid && <Text style={styles.receipt}>RECEIPT</Text>} */}
          <Text style={styles.muted}>
            Invoice ID:{" "}
            <Text style={[styles.dark, { fontWeight: "bold" }]}>
              #{invoiceData?.invoiceNumber}
            </Text>
          </Text>
          <Text style={styles.mutedv2}>
            {isPaid ? "Paid on" : "Date"}:{" "}
            <Text style={styles.dark}>
              {new Date(
                isPaid
                  ? invoiceData?.paidAt ||
                    invoiceData?.updatedAt ||
                    invoiceData?.invoiceDate
                  : invoiceData?.invoiceDate
              ).toLocaleDateString()}
            </Text>
          </Text>
          {/* {isPaid && <Text style={styles.badgePaid}>PAID</Text>} */}
        </View>
      </View>

      {/* Summary strip */}
      <View style={styles.summary}>
        <View style={styles.sumCol}>
          <Text style={styles.muted}>
            {isPaid ? "Billed to" : "Invoice to"}
          </Text>
          <Text style={[styles.dark, { fontWeight: "bold" }]}>
            {invoiceData?.customer?.userName}
          </Text>
          <Text style={styles.mutedv3}>{invoiceData?.customer?.userEmail}</Text>
        </View>
        <View style={styles.sumCol}>
          <Text style={styles.muted}>
            Payment {isPaid ? "Method" : "Status"}
          </Text>
          <Text style={[styles.dark, { fontWeight: "bold" }]}>
            {invoiceData?.paidFrom?.issuer ||
              invoiceData?.paymentStatus ||
              "Online payment"}
          </Text>
          {/* {invoiceData?.last4 ? (
            <Text style={styles.muted}>•••• {invoiceData?.last4}</Text>
          ) : null} */}
          {invoiceData?.transactionId ? (
            <Text style={styles.muted}>
              Txn ID: {invoiceData?.transactionId}
            </Text>
          ) : null}
          {/* <Text style={styles.mutedv3}>  <Text style={[styles.dark, { fontWeight: "bold"}]}>Phone no: </Text>
  (206) 384-1660</Text>
          <Text style={styles.mutedv3}>  <Text style={[styles.dark, { fontWeight: "bold"}]}>Address: </Text>
 11724 4th Ave NE Tulalip, WA 98271</Text> */}
        </View>
        <View style={styles.sumColRight}>
          <Text style={styles.muted}>
            {isPaid ? "Amount Paid" : "Total Due"}
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: isPaid ? successColor : brandColor,
            }}
          >
            {isPaid ? money(total) : money(total)}
          </Text>
        </View>
      </View>
    </View>
  );

  const Table = () => (
    <View style={styles.table}>
      <View style={styles.thead}>
        <Text style={[styles.th, { flex: 1 }]}>Sr.</Text>
        <Text style={[styles.th, { flex: 2 }]}>Name</Text>
        <Text style={[styles.th, { flex: 1, textAlign: "left" }]}>Price</Text>
        <Text style={[styles.th, { flex: 1, textAlign: "center" }]}>Qty</Text>
        <Text style={[styles.th, { flex: 1, textAlign: "right" }]}>Amount</Text>
      </View>

      {(invoiceData?.services || []).map((s, idx) => {
        const qty = Number(s.quantity || 1);
        const price = Number(s.unitPrice || s.price || s.total || 0);
        const lineTotal = s.total != null ? Number(s.total) : qty * price;

        return (
          <View key={idx} style={styles.tr}>
            <Text style={[styles.td, styles.cName]}>{idx + 1}</Text>
            <Text style={[styles.td, styles.cSKU, { color: "#374151" }]}>
              {s.sku || s.type || "-"}
            </Text>
            <Text style={[styles.td, styles.cPrice]}>{money(price)}</Text>
            <Text style={[styles.td, styles.cQty]}>{qty}</Text>
            <Text style={[styles.td, styles.cAmt]}>{money(lineTotal)}</Text>
          </View>
        );
      })}
    </View>
  );

  const Totals = () => (
    <View style={styles.totalsWrap}>
      <View style={styles.totalsCard}>
        <View style={styles.totalsRow}>
          <Text style={styles.totalsLabel}>Subtotal</Text>
          <Text style={styles.totalsValue}>{money(subtotal)}</Text>
        </View>
        <View style={styles.totalsRow}>
          <Text style={styles.totalsLabel}>Tax</Text>
          <Text style={styles.totalsValue}>{money(tax)}</Text>
        </View>
        {isPaid ? (
          <>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Amount Paid</Text>
              <Text
                style={[
                  styles.totalsValue,
                  { fontWeight: "bold", color: successColor },
                ]}
              >
                {money(total)}
              </Text>
            </View>
            {/* <View style={styles.totalsDue}>
              <Text style={[styles.totalsLabel, { fontWeight: "bold" }]}>Balance</Text>
              <Text style={{ fontSize: 12, fontWeight: "bold", color: successColor }}>$0.00</Text>
            </View> */}
          </>
        ) : (
          <View style={styles.totalsDue}>
            <Text style={[styles.totalsLabel, { fontWeight: "bold" }]}>
              Total Due
            </Text>
            <Text
              style={{ fontSize: 12, fontWeight: "bold", color: brandColor }}
            >
              {money(total)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const Includes = () => {
    const hasDesc = (invoiceData?.services || []).some(
      (s) => s?.customDescription
    );
    if (!hasDesc) return null;
    return (
      <View style={styles.includesWrap}>
        <View style={styles.includesCol}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: fontSizes.base,
              marginBottom: 4,
            }}
          >
            Services Includes
          </Text>
          {(invoiceData?.services || []).map((s, i) =>
            s?.customDescription ? (
              <View key={i} style={styles.bulletRow}>
                <Text style={{ fontSize: fontSizes.extraBase }}>
                  {s.customDescription}
                </Text>
              </View>
            ) : null
          )}
        </View>
      </View>
    );
  };

  const Terms = () => (
    <View style={{ marginTop: 16 }}>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: fontSizes.base,
          marginBottom: 4,
        }}
      >
        Terms
      </Text>
      {terms.map((t, i) => (
        <View key={i} style={styles.bulletRow}>
          <View style={styles.bulletDot} />
          <Text style={{ fontSize: fontSizes.extraBase }}>{t}</Text>
        </View>
      ))}
      <View style={styles.footer}>
        {companyConstants.companyUrl ? (
          <Text>{companyConstants.companyUrl}</Text>
        ) : null}
        {companyConstants.billingEmail ? (
          <Text>{companyConstants.billingEmail}</Text>
        ) : null}
        {companyConstants.phoneNumber ? (
          <Text>{companyConstants.phoneNumber}</Text>
        ) : null}
      </View>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Header />
        <View style={styles.perf} />
        <Table />
        <Totals />
        <Includes />
        <Terms />
      </Page>
    </Document>
  );
};

export default InvoicePDF;
