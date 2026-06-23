import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { SiteSettings } from "@/lib/data";
import { billDisplayDate, billRs, instagramForBill, phoneForBill } from "@/lib/bill/format";
import { parseRatePerKg } from "@/lib/bill/calc";
import type { BillPayload } from "@/lib/bill/types";
import { billSubtotal, billTotal } from "@/lib/bill/types";
import type { PdfWatermarkSet } from "@/lib/menu-pdf/watermarks";
import { PDF_THEME as t } from "@/lib/menu-pdf/theme";

export type BillPdfProps = {
  settings: SiteSettings;
  bill: BillPayload;
  logo: string;
  watermarks: PdfWatermarkSet;
};

const WATERMARK_PLACEMENTS = [
  { top: 180, left: -36, size: 190, rotate: -14, opacity: 0.05 },
  { top: 380, right: -44, size: 210, rotate: 12, opacity: 0.045 },
  { top: 580, left: 12, size: 170, rotate: -9, opacity: 0.04 },
] as const;

const s = StyleSheet.create({
  page: {
    backgroundColor: t.cream,
    color: t.text,
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingBottom: 44,
    paddingHorizontal: 40,
    paddingTop: 0,
  },
  watermark: {
    position: "absolute",
  },
  logoBar: {
    alignItems: "center",
    backgroundColor: t.paper,
    borderBottomColor: t.line,
    borderBottomWidth: 1,
    marginBottom: 0,
    marginHorizontal: -40,
    paddingBottom: 14,
    paddingHorizontal: 40,
    paddingTop: 20,
  },
  logo: {
    height: 88,
    objectFit: "contain",
    width: 280,
  },
  shopTitle: {
    color: t.ink,
    fontFamily: "Times-Bold",
    fontSize: 15,
    marginTop: 6,
    textAlign: "center",
  },
  shopByline: {
    color: t.muted,
    fontSize: 9,
    marginTop: 2,
    textAlign: "center",
  },
  shopMeta: {
    color: t.text,
    fontSize: 8.5,
    lineHeight: 1.45,
    marginTop: 8,
    textAlign: "center",
  },
  shopMetaAccent: {
    color: t.accent,
  },
  invoiceBand: {
    backgroundColor: t.ink,
    marginBottom: 18,
    marginHorizontal: -40,
    paddingHorizontal: 40,
    paddingVertical: 14,
  },
  invoiceBandEyebrow: {
    color: t.accent,
    fontSize: 8,
    letterSpacing: 2.5,
    textTransform: "uppercase",
  },
  invoiceBandTitle: {
    color: t.onInk,
    fontFamily: "Times-Bold",
    fontSize: 22,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: "row",
    gap: 20,
    marginTop: 2,
  },
  metaCol: {
    flex: 1,
  },
  metaColRight: {
    flex: 1,
  },
  blockTitle: {
    borderBottomColor: t.accent,
    borderBottomWidth: 1,
    color: t.ink,
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    letterSpacing: 1.5,
    marginBottom: 8,
    paddingBottom: 4,
    textTransform: "uppercase",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  detailLabel: {
    color: t.muted,
    fontSize: 9,
    width: 58,
  },
  detailValue: {
    color: t.text,
    flex: 1,
    fontSize: 9,
    lineHeight: 1.4,
  },
  invoiceMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  invoiceMetaLabel: {
    color: t.muted,
    fontSize: 9,
    width: 72,
  },
  invoiceMetaValue: {
    color: t.text,
    flex: 1,
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    textAlign: "right",
  },
  table: {
    borderColor: t.line,
    borderRadius: 4,
    borderWidth: 1,
    marginTop: 4,
    overflow: "hidden",
  },
  tableHeader: {
    backgroundColor: t.ink,
    flexDirection: "row",
  },
  tableRow: {
    backgroundColor: t.paper,
    borderBottomColor: t.line,
    borderBottomWidth: 1,
    flexDirection: "row",
  },
  tableRowAlt: {
    backgroundColor: "rgba(248, 250, 241, 0.65)",
    borderBottomColor: t.line,
    borderBottomWidth: 1,
    flexDirection: "row",
  },
  tableRowLast: {
    backgroundColor: t.paper,
    flexDirection: "row",
  },
  colDesc: {
    flex: 2.5,
    paddingHorizontal: 8,
    paddingVertical: 7,
  },
  colQty: {
    flex: 1,
    paddingHorizontal: 6,
    paddingVertical: 7,
    textAlign: "center",
  },
  colRate: {
    flex: 1.1,
    paddingHorizontal: 6,
    paddingVertical: 7,
    textAlign: "right",
  },
  colAmount: {
    flex: 1.2,
    paddingHorizontal: 8,
    paddingVertical: 7,
    textAlign: "right",
  },
  headerText: {
    color: t.onInk,
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  cellText: {
    fontSize: 9,
    lineHeight: 1.35,
  },
  cellAmount: {
    color: t.ink,
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },
  totalsBox: {
    alignSelf: "flex-end",
    backgroundColor: t.paper,
    borderColor: t.line,
    borderRadius: 4,
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    width: 220,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  summaryLabel: {
    color: t.muted,
    fontSize: 9,
  },
  summaryValue: {
    fontSize: 9,
    textAlign: "right",
  },
  totalRow: {
    borderTopColor: t.line,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    paddingTop: 6,
  },
  totalLabel: {
    color: t.ink,
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
  totalValue: {
    color: t.accent,
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
  },
  bankBlock: {
    backgroundColor: t.paper,
    borderColor: t.line,
    borderLeftColor: t.accent,
    borderLeftWidth: 3,
    borderRadius: 4,
    borderWidth: 1,
    marginTop: 18,
    padding: 12,
  },
  bankTitle: {
    color: t.accent,
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    letterSpacing: 1.5,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  bankGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  bankItem: {
    flexDirection: "row",
    marginBottom: 3,
    width: "48%",
  },
  bankLabel: {
    color: t.muted,
    fontSize: 8.5,
    width: 78,
  },
  bankValue: {
    color: t.text,
    flex: 1,
    fontSize: 8.5,
  },
  thankYou: {
    color: t.ink,
    fontFamily: "Times-Bold",
    fontSize: 11,
    marginTop: 16,
    textAlign: "center",
  },
  footer: {
    borderTopColor: t.line,
    borderTopWidth: 1,
    color: t.muted,
    fontSize: 7.5,
    lineHeight: 1.5,
    marginTop: 14,
    paddingTop: 10,
    textAlign: "center",
  },
  footerAccent: {
    color: t.accent,
  },
  centerLogoWatermark: {
    height: 340,
    left: 127,
    opacity: 0.04,
    position: "absolute",
    top: 280,
    width: 340,
  },
});

function WatermarkLayer({ images }: { images: string[] }) {
  return (
    <>
      {WATERMARK_PLACEMENTS.map((slot, i) => {
        const src = images[i % images.length];
        const side = "left" in slot ? { left: slot.left } : { right: slot.right };
        return (
          <View
            key={i}
            fixed
            style={[
              s.watermark,
              {
                top: slot.top,
                ...side,
                width: slot.size,
                height: slot.size,
                opacity: slot.opacity,
                transform: `rotate(${slot.rotate}deg)`,
              },
            ]}
          >
            <Image src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </View>
        );
      })}
    </>
  );
}

function ShopHeader({ settings, logo }: { settings: SiteSettings; logo: string }) {
  const phone = phoneForBill(settings.whatsapp);
  const ig = instagramForBill(settings.instagram);

  return (
    <View style={s.logoBar} wrap={false}>
      <Image src={logo} style={s.logo} />
      <Text style={s.shopTitle}>
        {settings.name} {settings.byline}
      </Text>
      <Text style={s.shopByline}>{settings.tagline}</Text>
      <Text style={s.shopMeta}>{settings.address}</Text>
      <Text style={s.shopMeta}>
        <Text style={s.shopMetaAccent}>Alex</Text> · {phone}
        {"   "}
        <Text style={s.shopMetaAccent}>Instagram</Text> · {ig}
      </Text>
    </View>
  );
}

function CustomerDetail({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <View style={s.detailRow}>
      <Text style={s.detailLabel}>{label}</Text>
      <Text style={s.detailValue}>{value}</Text>
    </View>
  );
}

function InvoiceMetaBlock({ bill }: { bill: BillPayload }) {
  const displayDate = billDisplayDate(bill.date);

  return (
    <View style={s.metaColRight}>
      <Text style={s.blockTitle}>Invoice details</Text>
      <View style={s.invoiceMetaRow}>
        <Text style={s.invoiceMetaLabel}>Invoice #</Text>
        <Text style={s.invoiceMetaValue}>{bill.invoiceNumber}</Text>
      </View>
      {displayDate ? (
        <View style={s.invoiceMetaRow}>
          <Text style={s.invoiceMetaLabel}>Date</Text>
          <Text style={s.invoiceMetaValue}>{displayDate}</Text>
        </View>
      ) : null}
    </View>
  );
}

function BillToBlock({ customer }: { customer: BillPayload["customer"] }) {
  const hasCustomer =
    customer.name || customer.address || customer.city || customer.zipCode;

  if (!hasCustomer) return <View style={s.metaCol} />;

  const cityLine = [customer.city, customer.zipCode].filter(Boolean).join(", ");

  return (
    <View style={s.metaCol}>
      <Text style={s.blockTitle}>Bill to</Text>
      <CustomerDetail label="Name" value={customer.name} />
      <CustomerDetail label="Address" value={customer.address} />
      <CustomerDetail label="City" value={cityLine} />
    </View>
  );
}

function LineItemsTable({ items }: { items: BillPayload["lineItems"] }) {
  return (
    <View>
      <Text style={s.blockTitle}>Products (materials)</Text>
      <View style={s.table}>
        <View style={s.tableHeader}>
          <View style={s.colDesc}>
            <Text style={s.headerText}>Description</Text>
          </View>
          <View style={s.colQty}>
            <Text style={s.headerText}>Qty</Text>
          </View>
          <View style={s.colRate}>
            <Text style={s.headerText}>Rate / kg</Text>
          </View>
          <View style={s.colAmount}>
            <Text style={s.headerText}>Amount</Text>
          </View>
        </View>

        {items.map((row, i) => {
          const isLast = i === items.length - 1;
          const rowStyle = isLast
            ? s.tableRowLast
            : i % 2 === 1
              ? s.tableRowAlt
              : s.tableRow;

          return (
            <View key={`${row.description}-${i}`} style={rowStyle}>
              <View style={s.colDesc}>
                <Text style={s.cellText}>{row.description}</Text>
              </View>
              <View style={s.colQty}>
                <Text style={s.cellText}>{row.quantity || "—"}</Text>
              </View>
              <View style={s.colRate}>
                <Text style={s.cellText}>
                  {(() => {
                    const rate = parseRatePerKg(row.rate);
                    return rate != null ? billRs(rate) : row.rate || "—";
                  })()}
                </Text>
              </View>
              <View style={s.colAmount}>
                <Text style={s.cellAmount}>{billRs(row.amount)}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function TotalsBlock({ bill }: { bill: BillPayload }) {
  const subtotal = billSubtotal(bill.lineItems);
  const total = billTotal(bill.lineItems, bill.discount);

  return (
    <View style={s.totalsBox}>
      <View style={s.summaryRow}>
        <Text style={s.summaryLabel}>Subtotal</Text>
        <Text style={s.summaryValue}>{billRs(subtotal)}</Text>
      </View>
      {bill.discount > 0 ? (
        <View style={s.summaryRow}>
          <Text style={s.summaryLabel}>Discount</Text>
          <Text style={s.summaryValue}>− {billRs(bill.discount)}</Text>
        </View>
      ) : null}
      <View style={s.totalRow}>
        <Text style={s.totalLabel}>Total</Text>
        <Text style={s.totalValue}>{billRs(total)}</Text>
      </View>
    </View>
  );
}

function BankBlock({ bank }: { bank: BillPayload["bank"] }) {
  return (
    <View style={s.bankBlock} wrap={false}>
      <Text style={s.bankTitle}>Account details</Text>
      <View style={s.bankGrid}>
        <View style={s.bankItem}>
          <Text style={s.bankLabel}>Holder</Text>
          <Text style={s.bankValue}>{bank.accountHolder}</Text>
        </View>
        <View style={s.bankItem}>
          <Text style={s.bankLabel}>Type</Text>
          <Text style={s.bankValue}>{bank.accountType}</Text>
        </View>
        <View style={s.bankItem}>
          <Text style={s.bankLabel}>Account #</Text>
          <Text style={s.bankValue}>{bank.accountNumber}</Text>
        </View>
        <View style={s.bankItem}>
          <Text style={s.bankLabel}>IFSC</Text>
          <Text style={s.bankValue}>{bank.ifsc}</Text>
        </View>
        <View style={[s.bankItem, { width: "100%" }]}>
          <Text style={s.bankLabel}>Branch</Text>
          <Text style={s.bankValue}>{bank.branch}</Text>
        </View>
      </View>
    </View>
  );
}

export function BillPdfDocument({ settings, bill, logo, watermarks }: BillPdfProps) {
  return (
    <Document
      title={`${settings.name} — Invoice ${bill.invoiceNumber}`}
      author={settings.byline}
      subject="Invoice"
    >
      <Page size="A4" style={s.page}>
        <ShopHeader settings={settings} logo={logo} />

        <View style={s.invoiceBand} wrap={false}>
          <Text style={s.invoiceBandEyebrow}>Tax invoice</Text>
          <Text style={s.invoiceBandTitle}>Invoice</Text>
        </View>

        <View style={s.metaRow} wrap={false}>
          <BillToBlock customer={bill.customer} />
          <InvoiceMetaBlock bill={bill} />
        </View>

        <LineItemsTable items={bill.lineItems} />
        <TotalsBlock bill={bill} />
        <BankBlock bank={bill.bank} />

        <Text style={s.thankYou}>Thank you for ordering!</Text>

        <View style={s.footer} wrap={false}>
          <Text>
            <Text style={s.footerAccent}>{settings.name}</Text> · {settings.hours}
          </Text>
          <Text>{settings.address}</Text>
        </View>

        <Image src={logo} style={s.centerLogoWatermark} fixed />
        <WatermarkLayer images={watermarks.accents} />
      </Page>
    </Document>
  );
}
