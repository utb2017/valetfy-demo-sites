"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle2,
  Globe2,
  MailCheck,
  ServerCog,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

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

const paidBenefits = [
  "Keep the finished site and unlock the owner handoff",
  "See the domain-provider steps before checkout",
  "Route leads, edits, and launch details through your Valetfy account",
];

const giftBenefits = [
  "Sign in to connect this site to your Valetfy account",
  "Unlock domain connection instructions",
  "Keep the launch handoff in one place",
];

const domainHandoffSteps = [
  {
    icon: Globe2,
    title: "Keep your provider",
    body: "No domain transfer is needed. You keep Network Solutions, GoDaddy, Squarespace, or whoever already holds the domain.",
  },
  {
    icon: ServerCog,
    title: "Update exact DNS records",
    body: "After checkout, Valetfy adds the domain in Vercel and gives you the exact A record and CNAME to paste into Advanced DNS.",
  },
  {
    icon: MailCheck,
    title: "Do not touch email",
    body: "MX, TXT, and verification records stay in place unless we specifically flag a conflict.",
  },
];

export function ClaimBar({ site }: Props) {
  const { user, loading, getIdToken } = useAuth();
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isGift = isGiftMonetization(site.monetization);
  const priceUsd = getEffectivePriceUsd(site);
  const active = siteClaimActive(site, user?.uid);
  const priceLabel = `$${priceUsd.toFixed(2)}/mo`;

  async function startPaidCheckout() {
    setBusy(true);
    setError(null);
    try {
      const token = await getIdToken();
      if (!token) {
        setShowClaimModal(true);
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
        setShowClaimModal(true);
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
    setError(null);
    setShowClaimModal(true);
  }

  function handleModalPrimaryClick() {
    void (isGift ? startGiftClaim() : startPaidCheckout());
  }

  if (site.ownerUid && site.ownerUid !== user?.uid && site.dnsRevealUnlocked) {
    return null;
  }

  return (
    <>
      <div className="claim-bar" role="note" aria-label="Claim this site">
        <div className="claim-bar-inner">
          {active ? (
            <>
              <span className="claim-bar-copy">
                <span className="claim-bar-kicker">Site claimed</span>
                <strong>{site.businessName}</strong>
                {isGift ? " (gift)" : ""}
              </span>
              <Link href="/connect" className="claim-cta claim-cta-active">
                <span className="claim-cta-label-full">Connect your domain</span>
                <span className="claim-cta-label-mobile">Domain</span>
              </Link>
            </>
          ) : isGift ? (
            <>
              <span className="claim-bar-copy">
                <span className="claim-bar-kicker">Ready to claim</span>
                <strong>{site.businessName}</strong> is yours, free from
                Valetfy
              </span>
              <button
                type="button"
                className="claim-cta claim-cta-active"
                onClick={handleClaimClick}
                disabled={busy || loading}
              >
                {busy ? "Claiming..." : "Open claim"}
              </button>
            </>
          ) : (
            <>
              <span className="claim-bar-copy">
                <span className="claim-bar-kicker">Like this site?</span>
                <strong>{site.businessName}</strong> can claim it today
              </span>
              <button
                type="button"
                className="claim-cta claim-cta-active"
                onClick={handleClaimClick}
                disabled={busy || loading}
              >
                {busy ? (
                  "Redirecting..."
                ) : (
                  <>
                    <span className="claim-cta-label-full">
                      Claim site - {priceLabel}
                    </span>
                    <span className="claim-cta-label-mobile">
                      Claim {priceLabel}
                    </span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
        {error ? <p className="claim-error">{error}</p> : null}
      </div>

      {showClaimModal ? (
        <div
          className="claim-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="claim-modal-title"
        >
          <div className="claim-modal">
            <button
              type="button"
              className="claim-modal-close"
              onClick={() => setShowClaimModal(false)}
              aria-label="Close"
            >
              x
            </button>

            <div className="claim-modal-grid">
              <section className="claim-sales-panel" aria-label="Claim summary">
                <div className="claim-sales-mark">
                  <Sparkles aria-hidden="true" />
                </div>
                <p className="claim-sales-eyebrow">
                  {isGift ? "Courtesy claim" : "Valetfy demo site"}
                </p>
                <h2 id="claim-modal-title">
                  Claim the finished site for {site.businessName}
                </h2>
                <p className="claim-sales-lede">
                  Keep this preview, unlock the owner handoff, and know the
                  domain-provider step before you continue through Stripe.
                </p>

                <div className="claim-price-card">
                  <span>{isGift ? "Gifted" : "Monthly site plan"}</span>
                  <strong>{isGift ? "$0" : priceLabel}</strong>
                  <small>
                    {isGift
                      ? "No Stripe checkout required."
                      : "You will see the DNS handoff before checkout opens."}
                  </small>
                </div>

                <ul className="claim-benefits" role="list">
                  {(isGift ? giftBenefits : paidBenefits).map((benefit) => (
                    <li key={benefit}>
                      <CheckCircle2 aria-hidden="true" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="claim-action-panel" aria-label="Claim action">
                <div className="claim-valetfy-lockup">
                  <img
                    src="/favblk.svg"
                    alt="Valetfy"
                    className="tip-terminal-brand-logo"
                    draggable={false}
                  />
                </div>

                <div className="claim-step-card">
                  <div className="claim-step-icon">
                    <ShieldCheck aria-hidden="true" />
                  </div>
                  <div>
                    <p className="claim-step-label">Step 1</p>
                    <h3>
                      {user
                        ? "Ready for checkout"
                        : "Create or unlock your Valetfy account"}
                    </h3>
                  </div>
                </div>

                <div
                  className="claim-domain-card"
                  aria-label="Domain handoff before checkout"
                >
                  <div className="claim-domain-card-heading">
                    <p className="claim-step-label">Before you pay</p>
                    <h3>How the domain switch works</h3>
                  </div>
                  <div className="claim-domain-steps">
                    {domainHandoffSteps.map((step) => {
                      const Icon = step.icon;
                      return (
                        <div className="claim-domain-step" key={step.title}>
                          <span className="claim-domain-icon">
                            <Icon aria-hidden="true" />
                          </span>
                          <span>
                            <strong>{step.title}</strong>
                            <small>{step.body}</small>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="claim-domain-note">
                    For Network Solutions, the usual path is Domain Management,
                    then Advanced DNS. Delete only conflicting parking or
                    website records, not mail records.
                  </p>
                </div>

                {user ? (
                  <div className="claim-authenticated">
                    <p>
                      You are signed in. Continue to{" "}
                      {isGift ? "finish the claim" : "secure Stripe checkout"}.
                    </p>
                    <button
                      type="button"
                      className="claim-modal-primary"
                      onClick={handleModalPrimaryClick}
                      disabled={busy || loading}
                    >
                      {busy
                        ? isGift
                          ? "Claiming..."
                          : "Opening Stripe..."
                        : isGift
                          ? "Finish free claim"
                          : `Continue - ${priceLabel}`}
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="claim-login-copy">
                      Sign in by phone first. After verification, this modal
                      continues automatically to{" "}
                      {isGift ? "the site handoff" : "Stripe Checkout"}.
                    </p>
                    <LoginPanel
                      onClose={() => {
                        setShowClaimModal(false);
                        void afterLogin();
                      }}
                    />
                  </>
                )}

                {error ? <p className="claim-modal-error">{error}</p> : null}
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
