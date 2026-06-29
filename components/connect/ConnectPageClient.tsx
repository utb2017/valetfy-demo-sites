"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { LoginPanel } from "@/components/auth/LoginPanel";
import { useAuth } from "@/components/auth/AuthProvider";
import type { DemoSitePublic } from "@/lib/demoSiteTypes";
import type { RegistrarGuide } from "@/lib/registrarGuides";

type Props = {
  site: DemoSitePublic;
};

type AccessPayload = {
  allowed: boolean;
  site?: {
    customDomain?: string | null;
    registrar?: string | null;
  };
  guide?: RegistrarGuide;
  reason?: string;
};

export function ConnectPageClient({ site }: Props) {
  const { user, loading, getIdToken } = useAuth();
  const [access, setAccess] = useState<AccessPayload | null>(null);
  const [domain, setDomain] = useState(site.customDomain ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setAccess({ allowed: false, reason: "Sign in required" });
      return;
    }

    void (async () => {
      const token = await getIdToken();
      if (!token) return;
      const res = await fetch(
        `/api/connect/access?siteId=${encodeURIComponent(site.siteId)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = (await res.json()) as AccessPayload;
      setAccess(data);
      if (data.site?.customDomain) setDomain(data.site.customDomain);
    })();
  }, [user, loading, getIdToken, site.siteId]);

  async function saveDomain(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const token = await getIdToken();
      if (!token) throw new Error("Sign in required");

      const res = await fetch("/api/connect/domain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ siteId: site.siteId, domain }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save domain");
      setMessage(data.message ?? "Domain saved.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function openPortal() {
    const token = await getIdToken();
    if (!token) return;
    const res = await fetch("/api/billing/portal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ siteId: site.siteId }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  if (loading) {
    return <p className="connect-loading">Loading…</p>;
  }

  if (!user) {
    return (
      <div className="connect-gate">
        <h1>Connect your domain</h1>
        <p>Sign in with your Valetfy account to unlock DNS instructions.</p>
        <LoginPanel />
        <p>
          <Link href="/">← Back to demo</Link>
        </p>
      </div>
    );
  }

  if (!access?.allowed) {
    return (
      <div className="connect-gate">
        <h1>Connect your domain</h1>
        <p>
          {access?.reason ??
            "Complete your subscription to unlock DNS instructions."}
        </p>
        <Link href="/" className="connect-back">
          ← Back to demo
        </Link>
      </div>
    );
  }

  const guide = access.guide!;

  return (
    <div className="connect-page">
      <header className="connect-header">
        <div className="container">
          <h1>Connect {site.businessName}</h1>
          <p className="connect-lede">
            Registrar detected: <strong>{guide.label}</strong>
            {site.registrar ? ` (${site.registrar})` : ""}
          </p>
        </div>
      </header>

      <div className="container connect-body">
        <section className="connect-card">
          <h2>1. Your domain</h2>
          <form onSubmit={saveDomain} className="connect-domain-form">
            <input
              type="text"
              placeholder="yourbusiness.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
            />
            <button type="submit" disabled={busy}>
              {busy ? "Saving…" : "Save & attach on Vercel"}
            </button>
          </form>
          {message ? <p className="connect-msg">{message}</p> : null}
        </section>

        {guide.supportsDomainConnect ? (
          <section className="connect-card connect-highlight">
            <h2>2. Connect automatically</h2>
            <p>{guide.domainConnectLabel}</p>
            {guide.domainConnectUrl ? (
              <a
                href={guide.domainConnectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="connect-dc-btn"
              >
                Open Domain Connect guide →
              </a>
            ) : null}
          </section>
        ) : null}

        <section className="connect-card">
          <h2>
            {guide.supportsDomainConnect ? "3" : "2"}. DNS records to add
          </h2>
          <table className="dns-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Host</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {guide.records.map((r) => (
                <tr key={`${r.type}-${r.host}`}>
                  <td>{r.type}</td>
                  <td>{r.host}</td>
                  <td>
                    <code>{r.value}</code>
                    {r.note ? <span className="dns-note">{r.note}</span> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {guide.extraNotes?.map((note) => (
            <p key={note} className="connect-note">
              {note}
            </p>
          ))}
        </section>

        <section className="connect-card">
          <h2>Step-by-step</h2>
          <ol className="connect-steps">
            {guide.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          {guide.videoUrl ? (
            <p>
              <a href={guide.videoUrl} target="_blank" rel="noopener noreferrer">
                Watch how-to video →
              </a>
            </p>
          ) : (
            <p className="connect-video-slot">
              Video walkthrough for {guide.label} — coming soon.
            </p>
          )}
        </section>

        <section className="connect-card connect-manage">
          <button type="button" onClick={openPortal} className="portal-btn">
            Manage subscription / cancel
          </button>
          <Link href="/" className="connect-back">
            ← Back to site preview
          </Link>
        </section>
      </div>
    </div>
  );
}
