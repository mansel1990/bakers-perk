"use server";

import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { sendAdminNotification } from "@/lib/push";

/** Public action — stores a contact-form submission for the admin inbox. */
export async function submitContactMessage(input: {
  name: string;
  message: string;
  email?: string;
  phone?: string;
}) {
  const name = input.name?.trim();
  const message = input.message?.trim();
  if (!name || !message) return { ok: false };

  await db.insert(contactMessages).values({
    name: name.slice(0, 160),
    message: message.slice(0, 4000),
    email: input.email?.trim().slice(0, 255) || null,
    phone: input.phone?.trim().slice(0, 20) || null,
  });

  // Notify admin phones (best-effort — never blocks the submission).
  await sendAdminNotification({
    title: "New enquiry — Baker's Perk",
    body: `${name.slice(0, 60)}: ${message.slice(0, 120)}`,
    url: "/admin/messages",
    tag: "contact",
  });

  return { ok: true };
}
