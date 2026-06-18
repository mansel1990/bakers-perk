import { getAdminMenu, getAdminAddons } from "@/lib/admin-data";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  setCategoryImage,
  createItem,
  updateItem,
  deleteItem,
  setItemImage,
  addVariant,
  updateVariant,
  deleteVariant,
  setDefaultVariant,
  createAddon,
  updateAddon,
  deleteAddon,
} from "@/app/admin/actions";
import BlobImageField from "@/components/admin/BlobImageField";
import ConfirmButton from "@/components/admin/ConfirmButton";

export const dynamic = "force-dynamic";

const INPUT =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none transition-colors focus:border-accent";
const BTN = "rounded-full bg-ink px-4 py-2 text-xs font-medium text-on-ink transition-transform hover:scale-[1.02]";
const BTN_GHOST =
  "rounded-full border border-line bg-paper px-4 py-2 text-xs text-muted transition-colors hover:border-accent hover:text-accent";
const BTN_DANGER =
  "inline-flex items-center gap-1.5 rounded-full border border-accent/40 px-4 py-2 text-xs font-medium text-accent transition-colors hover:bg-accent hover:text-on-ink";
const CHK = "h-4 w-4 accent-[var(--accent)]";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink">{label}</span>
      {hint && <span className="ml-1.5 text-[11px] text-muted">{hint}</span>}
      <div className="mt-1">{children}</div>
    </label>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] font-semibold uppercase tracking-[2px] text-accent">{children}</div>;
}

export default async function AdminMenuPage() {
  const [menu, addons] = await Promise.all([getAdminMenu(), getAdminAddons()]);
  const categoryOptions = menu.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-ink">Menu &amp; pricing</h1>
        <p className="mt-2 text-sm text-muted">
          Tap a row to expand and edit. Changes go live on the site within a minute.
        </p>
      </div>

      {/* ------------------------------ Add-ons ------------------------------ */}
      <section className="rounded-2xl border border-line bg-paper p-5">
        <h2 className="font-serif text-xl font-semibold">Add-ons</h2>
        <p className="mt-1 text-sm text-muted">Extras shown on the custom-cakes page (e.g. fondant, toppers).</p>

        <div className="mt-4 space-y-2">
          {addons.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-end gap-3 rounded-xl border border-line bg-cream/50 p-3"
            >
              <form action={updateAddon} className="flex flex-1 flex-wrap items-end gap-3">
                <input type="hidden" name="id" value={a.id} />
                <div className="min-w-[10rem] flex-1">
                  <Field label="Add-on">
                    <input name="name" defaultValue={a.name} className={INPUT} />
                  </Field>
                </div>
                <div className="w-28">
                  <Field label="Price ₹">
                    <input name="priceInr" type="number" defaultValue={a.priceInr} className={INPUT} />
                  </Field>
                </div>
                <label className="flex items-center gap-1.5 pb-2 text-xs text-muted">
                  <input type="checkbox" name="isActive" defaultChecked={a.isActive} className={CHK} /> Active
                </label>
                <button className={`${BTN} mb-0.5`}>Save</button>
              </form>
              <form action={deleteAddon} className="mb-0.5">
                <input type="hidden" name="id" value={a.id} />
                <ConfirmButton confirmText={`Delete add-on "${a.name}"?`} className={BTN_DANGER}>
                  🗑 Delete
                </ConfirmButton>
              </form>
            </div>
          ))}
        </div>

        <form action={createAddon} className="mt-4 flex flex-wrap items-end gap-3 border-t border-line pt-4">
          <div className="min-w-[12rem] flex-1">
            <Field label="New add-on name">
              <input name="name" placeholder="e.g. Edible photo print" className={INPUT} required />
            </Field>
          </div>
          <div className="w-28">
            <Field label="Price ₹">
              <input name="priceInr" type="number" placeholder="0" className={INPUT} />
            </Field>
          </div>
          <button className={BTN}>+ Add</button>
        </form>
      </section>

      {/* ---------------------------- Categories ----------------------------- */}
      <section className="rounded-2xl border border-line bg-paper p-5">
        <h2 className="font-serif text-xl font-semibold">Categories</h2>
        <p className="mt-1 text-sm text-muted">Group items into sections shown on the menu page.</p>

        <div className="mt-4 space-y-2.5">
          {menu.map((c) => (
            <details key={c.id} className="group overflow-hidden rounded-xl border border-line">
              <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 hover:bg-cream/40">
                <span className="text-muted transition-transform group-open:rotate-90">›</span>
                <span className="text-sm font-medium text-ink">{c.name}</span>
                <span className="text-xs text-muted">· {c.items.length} items</span>
                {!c.isVisible && (
                  <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                    Hidden
                  </span>
                )}
              </summary>

              <div className="space-y-5 border-t border-line bg-cream/40 p-4">
                <div>
                  <SectionLabel>Category details</SectionLabel>
                  <form action={updateCategory} className="mt-3 space-y-3">
                    <input type="hidden" name="id" value={c.id} />
                    <input type="hidden" name="imageUrl" defaultValue={c.imageUrl ?? ""} />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Name">
                        <input name="name" defaultValue={c.name} className={INPUT} />
                      </Field>
                      <Field label="Sort order" hint="lower = higher up">
                        <input name="sort" type="number" defaultValue={c.sort} className={INPUT} />
                      </Field>
                    </div>
                    <Field label="Blurb" hint="optional, shown under the heading">
                      <input name="blurb" defaultValue={c.blurb ?? ""} className={INPUT} />
                    </Field>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <label className="flex items-center gap-2 text-xs text-muted">
                        <input type="checkbox" name="isVisible" defaultChecked={c.isVisible} className={CHK} />
                        Visible on the site
                      </label>
                      <button className={BTN}>Save category</button>
                    </div>
                  </form>
                </div>

                <div className="border-t border-line pt-4">
                  <SectionLabel>Banner image</SectionLabel>
                  <div className="mt-2">
                    <BlobImageField currentUrl={c.imageUrl} folder="menu" onUpload={setCategoryImage.bind(null, c.id)} />
                  </div>
                </div>

                <div className="border-t border-line pt-4">
                  <SectionLabel>Danger zone</SectionLabel>
                  <form action={deleteCategory} className="mt-2">
                    <input type="hidden" name="id" value={c.id} />
                    <ConfirmButton
                      confirmText={`Delete "${c.name}" and all ${c.items.length} of its items? This cannot be undone.`}
                      className={BTN_DANGER}
                    >
                      🗑 Delete category
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            </details>
          ))}
        </div>

        <form action={createCategory} className="mt-4 flex flex-wrap items-end gap-3 border-t border-line pt-4">
          <div className="min-w-[12rem] flex-1">
            <Field label="New category name">
              <input name="name" placeholder="e.g. Cheesecakes" className={INPUT} required />
            </Field>
          </div>
          <div className="w-24">
            <Field label="Sort">
              <input name="sort" type="number" placeholder="0" className={INPUT} />
            </Field>
          </div>
          <button className={BTN}>+ Add</button>
        </form>
      </section>

      {/* ------------------------------- Items ------------------------------- */}
      {menu.map((c) => (
        <section key={c.id} className="rounded-2xl border border-line bg-paper p-5">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-xl font-semibold">{c.name}</h2>
            <span className="text-[11px] uppercase tracking-[1.5px] text-muted">{c.items.length} items</span>
          </div>

          <div className="mt-4 space-y-2.5">
            {c.items.map((item) => (
              <details key={item.id} className="group overflow-hidden rounded-xl border border-line">
                <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 hover:bg-cream/40">
                  <span className="text-muted transition-transform group-open:rotate-90">›</span>
                  <span className="text-sm font-medium text-ink">{item.name}</span>
                  {item.isEggless && (
                    <span className="rounded-full border border-line px-2 py-0.5 text-[9px] uppercase tracking-[1.5px] text-muted">
                      Eggless
                    </span>
                  )}
                  {!item.isVisible && (
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                      Hidden
                    </span>
                  )}
                  <span className="ml-auto text-xs text-muted">
                    {item.isPriceOnRequest
                      ? "On request"
                      : item.variants.map((v) => `${v.label} ₹${v.priceInr}`).join(" · ") || "No price set"}
                  </span>
                </summary>

                <div className="space-y-5 border-t border-line bg-cream/40 p-4">
                  {/* Details */}
                  <div>
                    <SectionLabel>Details</SectionLabel>
                    <form action={updateItem} className="mt-3 space-y-3">
                      <input type="hidden" name="id" value={item.id} />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Item name">
                          <input name="name" defaultValue={item.name} className={INPUT} />
                        </Field>
                        <Field label="Category">
                          <select name="categoryId" defaultValue={item.categoryId} className={INPUT}>
                            {categoryOptions.map((o) => (
                              <option key={o.id} value={o.id}>
                                {o.name}
                              </option>
                            ))}
                          </select>
                        </Field>
                      </div>
                      <Field label="Description" hint="optional, one line">
                        <input name="description" defaultValue={item.description ?? ""} className={INPUT} />
                      </Field>
                      <Field label="Search tags" hint="space-separated words customers might search">
                        <input
                          name="tags"
                          defaultValue={item.tags ?? ""}
                          placeholder="chocolate fudge eggless birthday"
                          className={INPUT}
                        />
                      </Field>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex flex-wrap items-center gap-4 rounded-lg border border-line bg-paper px-3 py-2.5">
                          <label className="flex items-center gap-2 text-xs text-muted">
                            <input type="checkbox" name="isEggless" defaultChecked={item.isEggless} className={CHK} />
                            Eggless
                          </label>
                          <label className="flex items-center gap-2 text-xs text-muted">
                            <input
                              type="checkbox"
                              name="isPriceOnRequest"
                              defaultChecked={item.isPriceOnRequest}
                              className={CHK}
                            />
                            Price on request
                          </label>
                          <label className="flex items-center gap-2 text-xs text-muted">
                            <input type="checkbox" name="isVisible" defaultChecked={item.isVisible} className={CHK} />
                            Visible
                          </label>
                        </div>
                        <Field label="Sort order" hint="lower = higher up">
                          <input name="sort" type="number" defaultValue={item.sort} className={INPUT} />
                        </Field>
                      </div>
                      <div className="text-right">
                        <button className={BTN}>Save details</button>
                      </div>
                    </form>
                  </div>

                  {/* Photo */}
                  <div className="border-t border-line pt-4">
                    <SectionLabel>Item photo</SectionLabel>
                    <div className="mt-2">
                      <BlobImageField currentUrl={item.imageUrl} folder="menu" onUpload={setItemImage.bind(null, item.id)} />
                    </div>
                  </div>

                  {/* Prices */}
                  <div className="border-t border-line pt-4">
                    <SectionLabel>Prices &amp; sizes</SectionLabel>
                    <p className="mt-1 text-xs text-muted">
                      One row per size. The <strong>Default</strong> price is the one highlighted on the menu.
                    </p>
                    <div className="mt-3 space-y-2">
                      {item.variants.map((v) => (
                        <div
                          key={v.id}
                          className="flex flex-wrap items-end gap-2.5 rounded-lg border border-line bg-paper p-2.5"
                        >
                          <form action={updateVariant} className="flex flex-1 flex-wrap items-end gap-2.5">
                            <input type="hidden" name="id" value={v.id} />
                            <div className="w-32">
                              <Field label="Size label">
                                <input name="label" defaultValue={v.label} className={INPUT} />
                              </Field>
                            </div>
                            <div className="w-28">
                              <Field label="Price ₹">
                                <input name="priceInr" type="number" defaultValue={v.priceInr} className={INPUT} />
                              </Field>
                            </div>
                            <div className="w-20">
                              <Field label="Sort">
                                <input name="sort" type="number" defaultValue={v.sort} className={INPUT} />
                              </Field>
                            </div>
                            <button className={`${BTN} mb-0.5`}>Save</button>
                          </form>
                          <div className="mb-0.5 flex items-center gap-2">
                            {v.isDefault ? (
                              <span className="rounded-full bg-accent/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[1px] text-accent">
                                ★ Default
                              </span>
                            ) : (
                              <form action={setDefaultVariant}>
                                <input type="hidden" name="id" value={v.id} />
                                <input type="hidden" name="itemId" value={item.id} />
                                <button className={BTN_GHOST}>Make default</button>
                              </form>
                            )}
                            <form action={deleteVariant}>
                              <input type="hidden" name="id" value={v.id} />
                              <ConfirmButton
                                confirmText={`Delete the "${v.label}" price?`}
                                aria-label="Delete price"
                                className={BTN_DANGER}
                              >
                                🗑
                              </ConfirmButton>
                            </form>
                          </div>
                        </div>
                      ))}
                    </div>

                    <form action={addVariant} className="mt-3 flex flex-wrap items-end gap-2.5 border-t border-line pt-3">
                      <input type="hidden" name="itemId" value={item.id} />
                      <div className="w-40">
                        <Field label="New size label">
                          <input name="label" placeholder="½ kg / 1 kg / each" className={INPUT} required />
                        </Field>
                      </div>
                      <div className="w-28">
                        <Field label="Price ₹">
                          <input name="priceInr" type="number" placeholder="0" className={INPUT} />
                        </Field>
                      </div>
                      <button className={BTN_GHOST}>+ Add price</button>
                    </form>
                  </div>

                  {/* Danger zone */}
                  <div className="border-t border-line pt-4">
                    <SectionLabel>Danger zone</SectionLabel>
                    <form action={deleteItem} className="mt-2">
                      <input type="hidden" name="id" value={item.id} />
                      <ConfirmButton
                        confirmText={`Delete "${item.name}"? This cannot be undone.`}
                        className={BTN_DANGER}
                      >
                        🗑 Delete item
                      </ConfirmButton>
                    </form>
                  </div>
                </div>
              </details>
            ))}

            {c.items.length === 0 && (
              <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
                No items in this category yet.
              </p>
            )}
          </div>

          {/* Add item */}
          <form action={createItem} className="mt-4 flex flex-wrap items-end gap-3 border-t border-line pt-4">
            <input type="hidden" name="categoryId" value={c.id} />
            <div className="min-w-[14rem] flex-1">
              <Field label={`New item in ${c.name}`}>
                <input name="name" placeholder="e.g. Belgian Chocolate Truffle" className={INPUT} required />
              </Field>
            </div>
            <label className="flex items-center gap-2 pb-2 text-xs text-muted">
              <input type="checkbox" name="isEggless" className={CHK} /> Eggless
            </label>
            <button className={BTN}>+ Add item</button>
          </form>
        </section>
      ))}
    </div>
  );
}
