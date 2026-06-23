import BillGeneratorForm from "@/components/admin/BillGeneratorForm";

export const dynamic = "force-dynamic";

export default function AdminBillGeneratorPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-ink">Bill generator</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Fill in the invoice details below and download a PDF bill. Invoice numbers are assigned automatically
        and saved to history. Shop name, logo, address, and contact info are pulled from Settings.
      </p>
      <div className="mt-7 max-w-5xl">
        <BillGeneratorForm />
      </div>
    </div>
  );
}
