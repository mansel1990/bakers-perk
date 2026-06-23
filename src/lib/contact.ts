"use server";

import { gte } from "drizzle-orm";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { sendAdminNotification } from "@/lib/push";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

async function isPhoneRateLimited(phone: string): Promise<boolean> {
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
  const normalized = phone.replace(/\D/g, "");

  const recent = await db
    .select({ phone: contactMessages.phone })
    .from(contactMessages)
    .where(gte(contactMessages.createdAt, since));

  const count = recent.filter((row) => (row.phone ?? "").replace(/\D/g, "") === normalized).length;
  return count >= RATE_LIMIT_MAX;
}

/** Public action — stores a contact-form submission for the admin inbox. */
export async function submitContactMessage(input: {
  name: string;
  message: string;
  phone: string;
  email?: string;
  /** Honeypot — bots fill this; real users never see it. */
  company?: string;
}) {
  if (input.company?.trim()) {
    return { ok: true as const };
  }

  const name = input.name?.trim();
  const message = input.message?.trim();
  const phone = input.phone?.trim();
  if (!name || !message || !phone) return { ok: false as const };

  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return { ok: false as const, error: "invalid_phone" as const };

  if (await isPhoneRateLimited(phone)) {
    return { ok: false as const, error: "rate_limit" as const };
  }

  await db.insert(contactMessages).values({
    name: name.slice(0, 160),
    message: message.slice(0, 4000),
    phone: phone.slice(0, 20),
    email: input.email?.trim().slice(0, 255) || null,
  });

  // Notify admin phones (best-effort — never blocks the submission).
  await sendAdminNotification({
    title: "New enquiry — Baker's Perk",
    body: `${name.slice(0, 40)} · ${phone.slice(0, 16)}: ${message.slice(0, 100)}`,
    url: "/admin/messages",
    tag: "contact",
  });

  return { ok: true as const };
}
