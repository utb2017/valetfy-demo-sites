"use client";

import Link from "next/link";
import { useState } from "react";

import { LoginPanel } from "@/components/auth/LoginPanel";
import { useAuth } from "@/components/auth/AuthProvider";
import type { DemoSitePublic } from "@/lib/demoSiteTypes";
import {
  getEffectivePriceUsd,
  isGiftMonetization,
  siteClaimActive,
} from "@/lib/monetization";
import { trackDemoSiteEvent } from "@/components/analytics/trackDemoSiteEvent";

type Props = {
  site: DemoSitePublic;
};

export function ClaimBar({ site }: Props) {
  const { user, loading, getIdToken } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isGift = isGiftMonetization(site.monetization);
  const priceUsd = getEffectivePriceUsd(site);
  const active = siteClaimActive(site, user?.uid);

  async function startPaidCheckout() {
    setBusy(true);
    setError(null);
    try {
      const token = await getIdToken();
      if (!token) {
        setShowLogin(true);
        return;
      }

      const res = await fetch("/api/claim/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ siteId: site.siteId }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.redirect === "/connect") {
          window.location.href = "/connect";
          return;
        }
        throw new Error(data.error ?? "Checkout failed");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setBusy(false);
    }
  }

  async function startGiftClaim() {
    setBusy(true);
    setError(null);
    try {
      const token = await getIdToken();
      if (!token) {
        setShowLogin(true);
        return;
      }

      const res = await fetch("/api/claim/gift", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ siteId: site.siteId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Claim failed");
      }

      window.location.href = data.redirect ?? "/connect";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Claim failed");
    } finally {
      setBusy(false);
    }
  }

  async function afterLogin() {
    if (isGift) {
      await startGiftClaim();
    } else {
      await startPaidCheckout();
    }
  }

  function handleClaimClick() {
    trackDemoSiteEvent(site.siteId, "claim");
    if (!user) {
      setShowLogin(true);
      return;
    }
    void (isGift ? startGiftClaim() : startPaidCheckout());
  }

  if (
    site.ownerUid &&
    site.ownerUid !== user?.uid &&
    site.dnsRevealUnlocked
  ) {
    return null;
  }

  return (
    <>
      <div className="claim-bar" role="note" aria-label="Claim this site">
        <div className="claim-bar-inner">
          {active ? (
            <>
              <span>
                ✓ Yours — <strong>{site.businessName}</strong>
                {isGift ? " (gift)" : ""}
              </span>
              <Link href="/connect" className="claim-cta claim-cta-active">
                Connect your domain →
              </Link>
            </>
          ) : isGift ? (
            <>
              <span>
                This site&apos;s yours — free, courtesy of Valetfy
              </span>
              <button
                type="button"
                className="claim-cta claim-cta-active"
                onClick={handleClaimClick}
                disabled={busy || loading}
              >
                {busy ? "Claiming…" : "Claim it →"}
              </button>
            </>
          ) : (
            <>
              <span>
                Like this site for <strong>{site.businessName}</strong>?
              </span>
              <button
                type="button"
                className="claim-cta claim-cta-active"
                onClick={handleClaimClick}
                disabled={busy || loading}
              >
                {busy
                  ? "Redirecting…"
                  : `Claim this site — $${priceUsd.toFixed(2)}/mo`}
              </button>
            </>
          )}
        </div>
        {error ? <p className="claim-error">{error}</p> : null}
      </div>

      {showLogin ? (
        <div
          className="login-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Sign in"
        >
          <div className="login-modal">
            <button
              type="button"
              className="login-close"
              onClick={() => setShowLogin(false)}
              aria-label="Close"
            >
              ×
            </button>
            <LoginPanel
              onClose={() => {
                setShowLogin(false);
                void afterLogin();
              }}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
