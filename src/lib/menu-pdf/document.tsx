import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { AddonView, MenuGroup, MenuPricing, SiteSettings } from "@/lib/data";
import type { PdfWatermarkSet } from "./watermarks";
import { PDF_THEME as t } from "./theme";

export type MenuPdfProps = {
  settings: SiteSettings;
  menu: MenuGroup[];
  addons: AddonView[];
  watermarks: PdfWatermarkSet;
  logo: string;
};

const pdfInr = (n: number) => `Rs. ${n.toLocaleString("en-IN")}`;

/** Addon prices arrive pre-formatted with ₹ from the data layer. */
const pdfInrDisplay = (price: string) => price.replace(/₹\s*/g, "Rs. ");

/** Corner accents only — kept below the logo area. */
const WATERMARK_PLACEMENTS = [
  { top: 130, left: -30, size: 200, rotate: -12, opacity: 0.06 },
  { top: 320, right: -40, size: 220, rotate: 10, opacity: 0.055 },
  { top: 520, left: 20, size: 180, rotate: -8, opacity: 0.05 },
  { top: 720, right: 10, size: 190, rotate: 11, opacity: 0.055 },
] as const;

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
  watermark: {
    position: "absolute",
  },
  logoBar: {
    alignItems: "center",
    backgroundColor: t.paper,
    borderBottomColor: t.line,
    borderBottomWidth: 1,
    marginBottom: 16,
    marginHorizontal: -40,
    marginTop: -36,
    paddingBottom: 12,
    paddingHorizontal: 40,
    paddingTop: 16,
  },
  logo: {
    height: 70,
    objectFit: "contain",
    width: 240,
  },
  headerWrap: {
    marginBottom: 22,
    marginHorizontal: -40,
    overflow: "hidden",
    position: "relative",
  },
  headerPhoto: {
    height: 120,
    objectFit: "cover",
    width: "100%",
  },
  headerPhotoWash: {
    backgroundColor: t.ink,
    bottom: 0,
    left: 0,
    opacity: 0.88,
    position: "absolute",
    right: 0,
    top: 0,
  },
  headerBand: {
    paddingBottom: 20,
    paddingHorizontal: 40,
    paddingTop: 24,
    position: "relative",
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
    fontSize: 26,
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
    maxWidth: 420,
  },
  categoryBlock: {
    marginTop: 14,
  },
  categoryBanner: {
    borderRadius: 6,
    height: 52,
    marginBottom: 2,
    overflow: "hidden",
    position: "relative",
  },
  categoryBannerImg: {
    height: "100%",
    objectFit: "cover",
    width: "100%",
  },
  categoryBannerWash: {
    backgroundColor: t.ink,
    bottom: 0,
    left: 0,
    opacity: 0.82,
    position: "absolute",
    right: 0,
    top: 0,
  },
  categoryBannerText: {
    bottom: 0,
    justifyContent: "flex-end",
    left: 0,
    paddingHorizontal: 14,
    paddingVertical: 8,
    position: "absolute",
    right: 0,
    top: 0,
  },
  categoryHeader: {
    backgroundColor: t.ink,
    borderRadius: 6,
    marginBottom: 2,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  categoryName: {
    color: t.onInk,
    fontFamily: "Times-Bold",
    fontSize: 14,
  },
  categoryBlurb: {
    color: t.darkMuted,
    fontSize: 7.5,
    lineHeight: 1.35,
    marginTop: 2,
  },
  itemRow: {
    alignItems: "center",
    borderBottomColor: t.line,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  itemName: {
    flex: 1,
    fontFamily: "Times-Bold",
    fontSize: 10.5,
    paddingRight: 12,
  },
  priceCol: {
    alignItems: "flex-end",
    justifyContent: "center",
    width: 118,
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
    alignItems: "baseline",
    flexDirection: "row",
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
    backgroundColor: "rgba(248, 250, 241, 0.92)",
    borderColor: t.line,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 20,
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
    backgroundColor: "rgba(248, 250, 241, 0.92)",
    borderTopColor: t.line,
    borderTopWidth: 1,
    color: t.muted,
    fontSize: 8,
    lineHeight: 1.5,
    marginTop: 18,
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

function CategoryHeader({ name, blurb, image }: { name: string; blurb: string; image: string | null }) {
  if (image) {
    return (
      <View style={s.categoryBanner}>
        <Image src={image} style={s.categoryBannerImg} />
        <View style={s.categoryBannerWash} />
        <View style={s.categoryBannerText}>
          <Text style={s.categoryName}>{name}</Text>
          {blurb ? <Text style={s.categoryBlurb}>{blurb}</Text> : null}
        </View>
      </View>
    );
  }

  return (
    <View style={s.categoryHeader}>
      <Text style={s.categoryName}>{name}</Text>
      {blurb ? <Text style={s.categoryBlurb}>{blurb}</Text> : null}
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

function MenuHeader({ settings, coverPhoto, logo }: { settings: SiteSettings; coverPhoto: string; logo: string }) {
  return (
    <>
      <View style={s.logoBar} wrap={false}>
        <Image src={logo} style={s.logo} />
      </View>
      <View style={s.headerWrap} wrap={false}>
        <Image src={coverPhoto} style={s.headerPhoto} />
        <View style={s.headerPhotoWash} />
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
      </View>
    </>
  );
}

function AddonsAndFooter({
  settings,
  addons,
}: {
  settings: SiteSettings;
  addons: AddonView[];
}) {
  return (
    <>
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
    </>
  );
}

export function MenuPdfDocument({ settings, menu, addons, watermarks, logo }: MenuPdfProps) {
  return (
    <Document
      title={`${settings.name} — Menu`}
      author={settings.byline}
      subject="Menu rate card"
    >
      <Page size="A4" style={s.page} wrap>
        <MenuHeader settings={settings} coverPhoto={watermarks.pageFill} logo={logo} />

        {menu.map((group) => (
          <View key={group.category.id} style={s.categoryBlock}>
            <CategoryHeader
              name={group.category.name}
              blurb={group.category.blurb}
              image={
                group.category.id === "cupcakes" ? watermarks.cupcakeBanner : group.category.image
              }
            />
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

        <AddonsAndFooter settings={settings} addons={addons} />
        <WatermarkLayer images={watermarks.accents} />
        <PageFooter name={settings.name} />
      </Page>
    </Document>
  );
}
