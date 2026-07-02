# Task: Replace the demo login modal with Valetfy phone → SMS → verify auth

## Where you are working
You have **two repos open** on this machine:
- `C:\valetfy-demo-sites` — **the app you edit + deploy** (the demo-sites renderer; woof-wash.dev.sites.valetfy.com runs from here).
- `C:\valetfy` — **Valetfy main app, READ-ONLY reference.** Copy patterns from here; do not edit it.

If `C:\valetfy` is not in your workspace, add it before starting — you need its files to port `ensure-baseline`.

## Goal
On https://woof-wash.dev.sites.valetfy.com/ the bottom "Claim this site — $9.99/mo" bar opens a sign-in modal. That modal currently shows **Continue with Google + Email + Password + Sign up**. That is WRONG for Valetfy. Replace it with Valetfy's single auth procedure (same as web/iOS/Android):

**PHONE NUMBER → SMS CODE → VERIFY → Firebase Auth user.**

Brand: write **`Valetfy`** exactly. Never "Valify".

## What already exists (the seam — do not break it)
- `components/ClaimBar.tsx` opens the modal: `<LoginPanel onClose={() => { setShowLogin(false); void afterLogin(); }} />`. After a successful sign-in it calls `onClose()`, which fires `afterLogin()` → the claim/checkout flow. **Keep that contract: on success, call `onClose()`.**
- `components/auth/AuthProvider.tsx` uses `onAuthStateChanged` + `getIdToken()`. **Do NOT change it** — Firebase phone sign-in updates the same auth state, so `ClaimBar`'s `getIdToken()` keeps working.
- `lib/firebaseClient.ts` reads `NEXT_PUBLIC_FIREBASE_*` env (no hardcoded keys) and exposes `getClientAuth()`. Extend it; keep the env pattern.
- The modal styling lives in `app/globals.css` under the `.login-*` classes (`.login-modal` is the white surface, `.login-form`, `.login-submit`, `.login-error`, `.login-sub`, `.login-toggle`).
- There is **no** `/api/account/ensure-baseline` route in this repo yet — you will add one (see step 4).

## Reference files in `C:\valetfy` (copy behavior, do not over-import)
- `lib/phone.ts` → re-exports `onlyDigits10`, `toE164USFrom10`, `displayPhone10` from `lib/util.ts` (exact source embedded below).
- `app/(landing-auth)/signin/page.tsx` → the `RecaptchaVerifier` + `signInWithPhoneNumber` pattern.
- `app/(landing-auth)/verify/page.tsx` → `confirmationResult.confirm(code)` → `getIdToken()` → POST `/api/account/ensure-baseline`.
- `app/api/account/ensure-baseline/route.ts` + its deps (`lib/ensureAccountBaselineAdmin.ts`, `lib/requireUidFromRequest.ts`, `lib/firebaseAdmin.ts`) → the route to port.

---

## Step 1 — `lib/phone.ts` (NEW in demo-sites, verbatim from Valetfy `lib/util.ts`)
```ts
export function onlyDigits10(s: string) {
  return (s || "").replace(/\D/g, "").slice(0, 10);
}
export function toE164USFrom10(d10: string): string | null {
  if (!/^\d{10}$/.test(d10)) return null;
  return `+1${d10}`;
}
export function displayPhone10(e164: string | null) {
  const s = typeof e164 === "string" ? e164.trim() : "";
  if (!/^\+1\d{10}$/.test(s)) return "—";
  return s.replace(/^\+1/, "");
}
```

## Step 2 — `lib/firebaseClient.ts` (edit)
- **Remove** `signInWithGoogle`, `signInWithEmail`, `signUpWithEmail` and the now-unused imports (`GoogleAuthProvider`, `signInWithPopup`, `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`). Keep `getClientFirebaseApp`, `getClientAuth`, `readConfig`, `signOutClient`.
- **Add** phone-auth helpers (verifier owned by the caller so a re-opened modal gets a fresh one):
```ts
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  type Auth,
  type ConfirmationResult,
} from "firebase/auth";

// Invisible reCAPTCHA bound to <div id="recaptcha-container" /> in the modal.
export function createInvisibleRecaptcha(): RecaptchaVerifier {
  const auth = getClientAuth();
  if (!auth) throw new Error("Firebase Auth is not configured");
  return new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
}

export async function startPhoneSignIn(
  phoneE164: string,
  verifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  const auth = getClientAuth();
  if (!auth) throw new Error("Firebase Auth is not configured");
  return signInWithPhoneNumber(auth, phoneE164, verifier);
}
```

## Step 3 — `components/auth/LoginPanel.tsx` (REPLACE the whole file)
Two states in one modal: phone → code. No Google, no email, no password, no sign-up link. On verified code: get the ID token, best-effort call `ensure-baseline`, then `onClose()`.
```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import type { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";

import { createInvisibleRecaptcha, startPhoneSignIn } from "@/lib/firebaseClient";
import { onlyDigits10, toE164USFrom10, displayPhone10 } from "@/lib/phone";

type Props = { onClose?: () => void };

export function LoginPanel({ onClose }: Props) {
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone10, setPhone10] = useState("");
  const [code, setCode] = useState("");
  const [phoneE164Sent, setPhoneE164Sent] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifierRef = useRef<RecaptchaVerifier | null>(null);
  const confirmRef = useRef<ConfirmationResult | null>(null);

  useEffect(() => {
    return () => {
      try { verifierRef.current?.clear(); } catch {}
      verifierRef.current = null;
    };
  }, []);

  function getVerifier() {
    if (!verifierRef.current) verifierRef.current = createInvisibleRecaptcha();
    return verifierRef.current;
  }

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const e164 = toE164USFrom10(phone10);
    if (!e164) { setError("Enter a 10-digit US phone number."); return; }
    setBusy(true);
    try {
      confirmRef.current = await startPhoneSignIn(e164, getVerifier());
      setPhoneE164Sent(e164);
      setStep("code");
    } catch (err) {
      try { verifierRef.current?.clear(); } catch {}
      verifierRef.current = null;
      setError(err instanceof Error ? err.message : "Couldn't send the code. Try again.");
    } finally { setBusy(false); }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const digits = code.replace(/\D/g, "").slice(0, 6);
    if (digits.length !== 6) { setError("Enter the 6-digit code."); return; }
    if (!confirmRef.current) { setError("Send a code first."); setStep("phone"); return; }
    setBusy(true);
    try {
      const cred = await confirmRef.current.confirm(digits);
      const token = await cred.user.getIdToken();
      // Best-effort Valetfy account baseline — never block sign-in on it.
      try {
        await fetch("/api/account/ensure-baseline", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ source: "self-signin" }),
        });
      } catch { /* AuthProvider already holds the signed-in user */ }
      onClose?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "That code didn't work. Try again.");
    } finally { setBusy(false); }
  }

  return (
    <div className="login-panel">
      <h3>Sign in with Valetfy</h3>

      {step === "phone" ? (
        <>
          <p className="login-sub">
            Enter your phone number and we&rsquo;ll text you a verification code.
          </p>
          <form onSubmit={sendCode} className="login-form">
            <input
              type="tel" inputMode="numeric" autoComplete="tel-national"
              placeholder="(555) 123-4567" value={phone10}
              onChange={(e) => setPhone10(onlyDigits10(e.target.value))}
              disabled={busy} required
            />
            {error ? <p className="login-error">{error}</p> : null}
            <button type="submit" className="login-submit" disabled={busy}>
              {busy ? "Sending…" : "Send code"}
            </button>
          </form>
        </>
      ) : (
        <>
          <p className="login-sub">
            We texted a 6-digit code to {displayPhone10(phoneE164Sent)}.
          </p>
          <form onSubmit={verifyCode} className="login-form">
            <input
              type="text" inputMode="numeric" autoComplete="one-time-code"
              placeholder="123456" maxLength={6} value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              disabled={busy} required
            />
            {error ? <p className="login-error">{error}</p> : null}
            <button type="submit" className="login-submit" disabled={busy}>
              {busy ? "Verifying…" : "Verify & continue"}
            </button>
          </form>
          <button
            type="button" className="login-toggle"
            onClick={() => { setStep("phone"); setCode(""); setError(null); }}
          >
            Use a different number
          </button>
        </>
      )}

      {/* invisible reCAPTCHA target — required by Firebase phone auth */}
      <div id="recaptcha-container" />
    </div>
  );
}
```

## Step 4 — `/api/account/ensure-baseline` (decision: port a trimmed, same-origin version)
The demo modal POSTs to the **same origin** (`/api/account/ensure-baseline`). Add that route here. The Valetfy original (`C:\valetfy\app\api\account\ensure-baseline\route.ts`) pulls in account-baseline + admin-broadcast + PostHog. **Port it faithfully but trimmed:**
- Verify the bearer token with **firebase-admin** (this repo already has `firebase-admin`; reuse the existing admin init in `lib/` — search for the admin app used by `/api/claim/*` and `/api/admin/*`; do not create a second admin init, do not hardcode the service account).
- Read `phone_number` from the decoded token.
- Upsert the **same account baseline doc shape** that `C:\valetfy\lib\ensureAccountBaselineAdmin.ts` writes (read that file and match field names/collection), into the shared **dev** Firestore. Return `{ ok: true, created }`.
- Make admin-broadcast + analytics **no-ops** (the original already wraps them in try/catch and treats them as best-effort).
- `export const runtime = "nodejs"; export const dynamic = "force-dynamic";`

If matching the exact account doc shape is risky or time-boxed, it is acceptable to ship the phone-auth UI first with the baseline call left best-effort (it already swallows failure in `LoginPanel`), and wire the route in a follow-up — **but the phone-auth modal itself must be complete and working.**

## Step 5 — Modal styling (Valetfy look)
The modal surface is already white (`.login-modal`). Make the primary button **black** (`#101110`) with white text and warm-gray input borders, matching Valetfy's public auth. The woof-wash route does not set `--color-primary`, so `.login-submit`'s fallback is navy — override it to black for this modal (add a rule or set the button color explicitly). Keep it minimal and clean.

## Step 6 — Firebase project + domain (dev, not prod)
- Confirm `C:\valetfy-demo-sites\.env.local` `NEXT_PUBLIC_FIREBASE_*` points at the **dev** Valetfy Firebase project (e.g. `valetfy-main-dev`), NOT production. If unsure, stop and ask Aaron.
- **Firebase Console (dev project) — human/Aaron steps, list them in your report:**
  1. Authentication → Sign-in method → enable **Phone**.
  2. Authentication → Settings → **Authorized domains** → add `woof-wash.dev.sites.valetfy.com` (and `dev.sites.valetfy.com`).
  3. Authentication → Sign-in method → Phone → **Phone numbers for testing**: add a fixture, e.g. `+1 650-555-0100` → code `123456`, so the demo can be tested without real SMS.

## Step 7 — Build, deploy preview, acceptance test
- `npm install` (if deps changed) → `npm run build` must pass.
- Deploy a **preview** (`vercel deploy`), verify, then promote (`vercel deploy --prod`) once confirmed.
- **Acceptance test** on the live/preview URL:
  - Open the site, click the bottom "Claim this site — $9.99/mo" bar.
  - See **only** phone sign-in — no Google, no email, no password, no sign-up.
  - Enter the dev test phone (`6505550100`) → "Send code" → enter `123456` → "Verify & continue".
  - Confirm a Firebase user is signed in (auth state updates; the claim flow proceeds).
  - Confirm `/api/account/ensure-baseline` is called with the bearer token (200, or best-effort if deferred).
  - Confirm the modal closes / the claim flow continues cleanly.

## Guardrails (hard)
- No Google auth. No email input. No password input. No sign-up link. No second/parallel auth system.
- One identity: Firebase phone sign-in creates/returns the same user — there is no separate "account creation" concept in the UI.
- `Valetfy` spelled exactly, everywhere.
- Dev Firebase project only (never prod) unless Aaron explicitly says otherwise.
- No hardcoded Firebase keys or secrets — reuse the existing `NEXT_PUBLIC_FIREBASE_*` / firebase-admin env pattern.
- Do NOT touch `AuthProvider.tsx`'s contract or `ClaimBar`'s `onClose → afterLogin` flow.
- Do NOT edit `C:\valetfy` (read-only reference).
