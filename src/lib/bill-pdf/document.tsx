import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { SiteSettings } from "@/lib/data";
import { billDisplayDate, billRs, instagramForBill, phoneForBill } from "@/lib/bill/format";
import type { BillPayload } from "@/lib/bill/types";
import { billTotal } from "@/lib/bill/types";
import { PDF_THEME as t } from "@/lib/menu-pdf/theme";

export type BillPdfProps = {
  settings: SiteSettings;
  bill: BillPayload;
  logo: string;
};

const s = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    color: t.text,
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingBottom: 40,
    paddingHorizontal: 44,
    paddingTop: 28,
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    height: 72,
    objectFit: "contain",
    width: 240,
  },
  shopTitle: {
    fontFamily: "Times-Bold",
    fontSize: 13,
    marginTop: 2,
    textAlign: "center",
  },
  shopLine: {
    fontSize: 10,
    marginTop: 2,
    textAlign: "center",
  },
  contactHeading: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    marginTop: 10,
    textAlign: "center",
  },
  contactLine: {
    fontSize: 10,
    marginTop: 2,
    textAlign: "center",
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    marginBottom: 6,
    marginTop: 18,
    textTransform: "uppercase",
  },
  table: {
    borderColor: t.line,
    borderWidth: 1,
    marginTop: 2,
  },
  tableHeader: {
    backgroundColor: t.paper,
    borderBottomColor: t.line,
    borderBottomWidth: 1,
    flexDirection: "row",
  },
  tableRow: {
    borderBottomColor: t.line,
    borderBottomWidth: 1,
    flexDirection: "row",
  },
  tableRowLast: {
    flexDirection: "row",
  },
  colDesc: {
    flex: 2.4,
    paddingHorizontal: 6,
    paddingVertical: 5,
  },
  colQty: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 5,
    textAlign: "center",
  },
  colRate: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 5,
    textAlign: "center",
  },
  colAmount: {
    flex: 1.1,
    paddingHorizontal: 4,
    paddingVertical: 5,
    textAlign: "right",
  },
  headerText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },
  cellText: {
    fontSize: 9,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  summaryLabel: {
    fontSize: 10,
    marginRight: 8,
    textAlign: "right",
    width: 80,
  },
  summaryValue: {
    fontSize: 10,
    textAlign: "right",
    width: 90,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 2,
  },
  totalLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    marginRight: 8,
    textAlign: "right",
    width: 80,
  },
  totalValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    textAlign: "right",
    width: 90,
  },
  bankBlock: {
    marginTop: 16,
  },
  bankTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    marginBottom: 4,
  },
  bankLine: {
    fontSize: 9,
    lineHeight: 1.45,
    marginTop: 1,
  },
  thankYou: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    marginTop: 14,
    textAlign: "center",
  },
  footer: {
    marginTop: 18,
  },
  footerLine: {
    fontSize: 9,
    lineHeight: 1.5,
    marginTop: 2,
  },
});

function ShopHeader({ settings, logo }: { settings: SiteSettings; logo: string }) {
  const phone = phoneForBill(settings.whatsapp);
  const ig = instagramForBill(settings.instagram);

  return (
    <View>
      <View style={s.logoWrap}>
        <Image src={logo} style={s.logo} />
      </View>
      <Text style={s.shopTitle}>
        {settings.name} {settings.byline}
      </Text>
      <Text style={s.shopLine}>{settings.address}</Text>
      <Text style={s.contactHeading}>Contact</Text>
      <Text style={s.contactLine}>Alex : {phone}</Text>
      <Text style={s.contactLine}>Instagram : {ig}</Text>
    </View>
  );
}

function LineItemsTable({ items }: { items: BillPayload["lineItems"] }) {
  return (
    <View>
      <Text style={s.sectionTitle}>Products (materials)</Text>
      <View style={s.table}>
        <View style={s.tableHeader}>
          <View style={s.colDesc}>
            <Text style={s.headerText}>Description</Text>
          </View>
          <View style={s.colQty}>
            <Text style={s.headerText}>Quantity</Text>
          </View>
          <View style={s.colRate}>
            <Text style={s.headerText}>Rs /Kg</Text>
          </View>
          <View style={s.colAmount}>
            <Text style={s.headerText}>Amount</Text>
          </View>
        </View>

        {items.map((row, i) => {
          const isLast = i === items.length - 1;
          return (
            <View key={`${row.description}-${i}`} style={isLast ? s.tableRowLast : s.tableRow}>
              <View style={s.colDesc}>
                <Text style={s.cellText}>{row.description}</Text>
              </View>
              <View style={s.colQty}>
                <Text style={s.cellText}>{row.quantity || " "}</Text>
              </View>
              <View style={s.colRate}>
                <Text style={s.cellText}>{row.rate || " "}</Text>
              </View>
              <View style={s.colAmount}>
                <Text style={s.cellText}>{billRs(row.amount)}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function BillPdfDocument({ settings, bill, logo }: BillPdfProps) {
  const total = billTotal(bill.lineItems, bill.discount);
  const displayDate = billDisplayDate(bill.date);

  return (
    <Document
      title={`${settings.name} — Invoice ${bill.invoiceNumber}`}
      author={settings.byline}
      subject="Invoice"
    >
      <Page size="A4" style={s.page}>
        <ShopHeader settings={settings} logo={logo} />
        <LineItemsTable items={bill.lineItems} />

        {bill.discount > 0 ? (
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Discount</Text>
            <Text style={s.summaryValue}>{billRs(bill.discount)}</Text>
          </View>
        ) : null}

        <View style={s.totalRow}>
          <Text style={s.totalLabel}>Total</Text>
          <Text style={s.totalValue}>{billRs(total)}</Text>
        </View>

        <View style={s.bankBlock}>
          <Text style={s.bankTitle}>Account details :</Text>
          <Text style={s.bankLine}>Account Holder: {bill.bank.accountHolder}</Text>
          <Text style={s.bankLine}>Account Type: {bill.bank.accountType}</Text>
          <Text style={s.bankLine}>Account Number: {bill.bank.accountNumber}</Text>
          <Text style={s.bankLine}>IFSC: {bill.bank.ifsc}</Text>
          <Text style={s.bankLine}>Branch: {bill.bank.branch}</Text>
        </View>

        <Text style={s.thankYou}>Thank you for ordering!</Text>

        <View style={s.footer}>
          <Text style={s.footerLine}>
            Invoice # {bill.invoiceNumber}
            {displayDate ? `    Date: ${displayDate}` : ""}
          </Text>
          {bill.customer.name ? <Text style={s.footerLine}>Name: {bill.customer.name}</Text> : null}
          {bill.customer.address ? <Text style={s.footerLine}>Address: {bill.customer.address}</Text> : null}
          {bill.customer.city ? <Text style={s.footerLine}>City: {bill.customer.city}</Text> : null}
          {bill.customer.zipCode ? <Text style={s.footerLine}>Zip Code: {bill.customer.zipCode}</Text> : null}
        </View>
      </Page>
    </Document>
  );
}
