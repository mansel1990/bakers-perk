import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { AddonView, MenuGroup, MenuPricing, SiteSettings } from "@/lib/data";
import { PDF_THEME as t } from "./theme";

export type MenuPdfProps = {
  settings: SiteSettings;
  menu: MenuGroup[];
  addons: AddonView[];
};

const pdfInr = (n: number) => `Rs. ${n.toLocaleString("en-IN")}`;

/** Addon prices arrive pre-formatted with ₹ from the data layer. */
const pdfInrDisplay = (price: string) => price.replace(/₹\s*/g, "Rs. ");

const s = StyleSheet.create({
  page: {
    backgroundColor: t.cream,
    color: t.text,
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 40,
  },
  headerBand: {
    backgroundColor: t.ink,
    marginHorizontal: -40,
    marginTop: -36,
    paddingHorizontal: 40,
    paddingTop: 28,
    paddingBottom: 22,
    marginBottom: 20,
  },
  headerEyebrow: {
    color: t.accent,
    fontSize: 8,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  headerTitle: {
    color: t.onInk,
    fontFamily: "Times-Bold",
    fontSize: 24,
    marginTop: 4,
  },
  headerByline: {
    color: t.darkMuted,
    fontSize: 9,
    marginTop: 3,
  },
  headerNote: {
    color: t.onInk,
    fontSize: 8,
    lineHeight: 1.45,
    marginTop: 8,
  },
  categoryBlock: {
    marginTop: 16,
  },
  categoryHeader: {
    backgroundColor: t.ink,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 4,
  },
  categoryName: {
    color: t.onInk,
    fontFamily: "Times-Bold",
    fontSize: 15,
  },
  categoryBlurb: {
    color: t.darkMuted,
    fontSize: 8,
    lineHeight: 1.4,
    marginTop: 3,
  },
  itemRow: {
    borderBottomColor: t.line,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 7,
  },
  itemName: {
    flex: 1,
    fontFamily: "Times-Bold",
    fontSize: 11,
    paddingRight: 12,
  },
  priceCol: {
    width: 120,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  priceSingle: {
    color: t.accent,
    fontSize: 10,
    fontWeight: "bold",
  },
  priceOnRequest: {
    color: t.muted,
    fontSize: 9,
    fontStyle: "italic",
  },
  priceVariantRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginBottom: 2,
  },
  priceLabel: {
    color: t.muted,
    fontSize: 8,
    textTransform: "uppercase",
    width: 28,
    textAlign: "right",
  },
  priceValue: {
    color: t.accent,
    fontSize: 10,
    fontWeight: "bold",
    width: 52,
    textAlign: "right",
  },
  eggless: {
    color: t.muted,
    fontSize: 7,
    letterSpacing: 1,
    marginLeft: 6,
    textTransform: "uppercase",
  },
  addonsBlock: {
    backgroundColor: t.paper,
    borderColor: t.line,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 22,
    padding: 14,
  },
  addonsTitle: {
    color: t.accent,
    fontSize: 8,
    letterSpacing: 2,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  addonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  footer: {
    borderTopColor: t.line,
    borderTopWidth: 1,
    color: t.muted,
    fontSize: 8,
    lineHeight: 1.5,
    marginTop: 20,
    paddingTop: 12,
    textAlign: "center",
  },
  footerAccent: {
    color: t.accent,
  },
  pageFooter: {
    bottom: 20,
    color: t.muted,
    fontSize: 7,
    left: 40,
    position: "absolute",
    right: 40,
    textAlign: "center",
  },
});

function PriceBlock({ pricing }: { pricing: MenuPricing }) {
  if (pricing.kind === "on-request") {
    return <Text style={s.priceOnRequest}>Enquire for price</Text>;
  }

  if (pricing.kind === "single") {
    return <Text style={s.priceSingle}>{pdfInr(pricing.priceInr)}</Text>;
  }

  return (
    <View>
      {pricing.variants.map((v) => (
        <View key={v.label} style={s.priceVariantRow}>
          <Text style={s.priceLabel}>{v.label}</Text>
          <Text style={s.priceValue}>{pdfInr(v.priceInr)}</Text>
        </View>
      ))}
    </View>
  );
}

function ItemRow({
  name,
  pricing,
  isEggless,
}: {
  name: string;
  pricing: MenuPricing;
  isEggless: boolean;
}) {
  return (
    <View style={s.itemRow} wrap={false}>
      <Text style={s.itemName}>
        {name}
        {isEggless ? <Text style={s.eggless}> · Eggless</Text> : null}
      </Text>
      <View style={s.priceCol}>
        <PriceBlock pricing={pricing} />
      </View>
    </View>
  );
}

function PageFooter({ name }: { name: string }) {
  return (
    <Text style={s.pageFooter} fixed>
      {name} · Menu rate card
    </Text>
  );
}

export function MenuPdfDocument({ settings, menu, addons }: MenuPdfProps) {
  return (
    <Document
      title={`${settings.name} — Menu`}
      author={settings.byline}
      subject="Menu rate card"
    >
      <Page size="A4" style={s.page}>
        <View style={s.headerBand}>
          <Text style={s.headerEyebrow}>The full collection</Text>
          <Text style={s.headerTitle}>Menu</Text>
          <Text style={s.headerByline}>
            {settings.name} — {settings.byline}
          </Text>
          <Text style={s.headerNote}>
            Our current rate card. Cakes come in ½ kg and 1 kg unless noted. {settings.deliveryNote}.
          </Text>
        </View>

        {menu.map((group) => (
          <View key={group.category.id} style={s.categoryBlock}>
            <View style={s.categoryHeader}>
              <Text style={s.categoryName}>{group.category.name}</Text>
              {group.category.blurb ? (
                <Text style={s.categoryBlurb}>{group.category.blurb}</Text>
              ) : null}
            </View>
            {group.items.map((item) => (
              <ItemRow
                key={item.slug}
                name={item.name}
                pricing={item.pricing}
                isEggless={item.isEggless}
              />
            ))}
          </View>
        ))}

        {addons.length > 0 ? (
          <View style={s.addonsBlock} wrap={false}>
            <Text style={s.addonsTitle}>Add-ons</Text>
            {addons.map((a) => (
              <View key={a.label} style={s.addonRow}>
                <Text>{a.label}</Text>
                <Text style={{ color: t.muted }}>{pdfInrDisplay(a.price)}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={s.footer} wrap={false}>
          <Text>
            <Text style={s.footerAccent}>{settings.name}</Text> · {settings.hours}
          </Text>
          <Text>{settings.address}</Text>
          <Text>
            WhatsApp orders · {settings.whatsapp.replace(/^91/, "+91 ")} · {settings.email}
          </Text>
        </View>

        <PageFooter name={settings.name} />
      </Page>
    </Document>
  );
}
