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
      try {
        verifierRef.current?.clear();
      } catch {
        /* ignore */
      }
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
    if (!e164) {
      setError("Enter a 10-digit US phone number.");
      return;
    }
    setBusy(true);
    try {
      confirmRef.current = await startPhoneSignIn(e164, getVerifier());
      setPhoneE164Sent(e164);
      setStep("code");
    } catch (err) {
      try {
        verifierRef.current?.clear();
      } catch {
        /* ignore */
      }
      verifierRef.current = null;
      setError(
        err instanceof Error ? err.message : "Couldn't send the code. Try again."
      );
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const digits = code.replace(/\D/g, "").slice(0, 6);
    if (digits.length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }
    if (!confirmRef.current) {
      setError("Send a code first.");
      setStep("phone");
      return;
    }
    setBusy(true);
    try {
      const cred = await confirmRef.current.confirm(digits);
      const token = await cred.user.getIdToken();
      try {
        await fetch("/api/account/ensure-baseline", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ source: "self-signin" }),
        });
      } catch {
        /* AuthProvider already holds the signed-in user */
      }
      onClose?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "That code didn't work. Try again."
      );
    } finally {
      setBusy(false);
    }
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
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="(555) 123-4567"
              value={phone10}
              onChange={(e) => setPhone10(onlyDigits10(e.target.value))}
              disabled={busy}
              required
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
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              maxLength={6}
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              disabled={busy}
              required
            />
            {error ? <p className="login-error">{error}</p> : null}
            <button type="submit" className="login-submit" disabled={busy}>
              {busy ? "Verifying…" : "Verify & continue"}
            </button>
          </form>
          <button
            type="button"
            className="login-toggle"
            onClick={() => {
              setStep("phone");
              setCode("");
              setError(null);
            }}
          >
            Use a different number
          </button>
        </>
      )}

      <div id="recaptcha-container" aria-hidden="true" />
    </div>
  );
}
