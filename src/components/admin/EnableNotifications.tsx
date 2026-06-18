"use client";

import { useEffect, useState } from "react";
import { savePushSubscription, deletePushSubscription, sendTestNotification } from "@/app/admin/actions";

type Status = "loading" | "unsupported" | "needs-install" | "off" | "on" | "denied" | "working";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

function isStandalone(): boolean {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  );
}

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export default function EnableNotifications() {
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        setStatus("unsupported");
        return;
      }
      if (isIos() && !isStandalone()) {
        setStatus("needs-install");
        return;
      }
      if (Notification.permission === "denied") {
        setStatus("denied");
        return;
      }
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        setStatus(sub ? "on" : "off");
      } catch {
        setStatus("off");
      }
    })();
  }, []);

  async function enable() {
    setError("");
    setStatus("working");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        return;
      }
      const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!key) {
        setError("Push isn't configured on the server.");
        setStatus("off");
        return;
      }
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key) as BufferSource,
      });
      const json = sub.toJSON() as { keys?: { p256dh?: string; auth?: string } };
      await savePushSubscription({
        endpoint: sub.endpoint,
        p256dh: json.keys?.p256dh ?? "",
        auth: json.keys?.auth ?? "",
        userAgent: navigator.userAgent,
      });
      setStatus("on");
    } catch (e) {
      setError((e as Error).message || "Couldn't enable notifications.");
      setStatus("off");
    }
  }

  async function disable() {
    setStatus("working");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await deletePushSubscription(sub.endpoint);
        await sub.unsubscribe();
      }
      setStatus("off");
    } catch {
      setStatus("on");
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-serif text-lg font-semibold">Phone notifications</div>
          <p className="mt-1 text-sm text-muted">
            Get a push on this device when a new enquiry or order arrives.
          </p>
        </div>

        {status === "off" && (
          <button onClick={enable} className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-on-ink">
            Enable on this device
          </button>
        )}
        {status === "on" && (
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-wa/15 px-3 py-1 text-xs font-medium text-wa">● On</span>
            <button
              onClick={() => sendTestNotification()}
              className="rounded-full border border-line px-4 py-2 text-xs text-muted hover:text-accent"
            >
              Send test
            </button>
            <button onClick={disable} className="rounded-full border border-line px-4 py-2 text-xs text-muted hover:text-accent">
              Turn off
            </button>
          </div>
        )}
        {status === "working" && <span className="text-sm text-muted">Working…</span>}
        {status === "loading" && <span className="text-sm text-muted">…</span>}
      </div>

      {status === "needs-install" && (
        <p className="mt-3 rounded-xl bg-cream px-4 py-3 text-sm text-muted">
          On iPhone: tap <strong>Share → Add to Home Screen</strong>, open Baker&apos;s Perk from your home
          screen, then come back here to enable notifications.
        </p>
      )}
      {status === "denied" && (
        <p className="mt-3 rounded-xl bg-cream px-4 py-3 text-sm text-accent">
          Notifications are blocked. Enable them for this site in your browser/app settings, then reload.
        </p>
      )}
      {status === "unsupported" && (
        <p className="mt-3 rounded-xl bg-cream px-4 py-3 text-sm text-muted">
          This browser doesn&apos;t support push notifications.
        </p>
      )}
      {error && <p className="mt-3 text-sm text-accent">{error}</p>}
    </div>
  );
}
