"use client";

import { useCallback, useEffect, useState } from "react";

import { LoginPanel } from "@/components/auth/LoginPanel";
import { useAuth } from "@/components/auth/AuthProvider";
import type { DemoSiteStatus } from "@/lib/demoSiteTypes";
import type { AdminDemoSiteRow } from "@/lib/listDemoSitesAdmin";

type SubscriptionsSummary = {
  priceUsd: number;
  mrrUsd: number;
  activeCount: number;
  canceledCount: number;
  totalWithSubscription: number;
};

type AdminPayload = {
  sites: AdminDemoSiteRow[];
  subscriptions: SubscriptionsSummary;
};

const STATUSES: DemoSiteStatus[] = [
  "draft",
  "demo",
  "live",
  "sold",
  "archived",
];

function demoUrl(slug: string) {
  const base =
    process.env.NEXT_PUBLIC_DEMO_SITES_BASE_DOMAIN ?? "dev.sites.valetfy.com";
  return `https://${slug}.${base}`;
}

export function AdminDashboard() {
  const { user, loading, getIdToken } = useAuth();
  const [tab, setTab] = useState<"sites" | "subscriptions">("sites");
  const [data, setData] = useState<AdminPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [outreachBusy, setOutreachBusy] = useState<string | null>(null);
  const [selectedLeadsSiteId, setSelectedLeadsSiteId] = useState<string | null>(
    null
  );

  const load = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const token = await getIdToken();
      if (!token) throw new Error("Sign in required");
      const res = await fetch("/api/admin/sites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.status === 403) {
        setError("Forbidden");
        setData(null);
        return;
      }
      if (!res.ok) throw new Error(json.error ?? "Failed to load admin data");
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
      setData(null);
    } finally {
      setBusy(false);
    }
  }, [getIdToken]);

  useEffect(() => {
    if (user) void load();
  }, [user, load]);

  async function changeStatus(siteId: string, status: DemoSiteStatus) {
    const token = await getIdToken();
    if (!token) return;
    const res = await fetch(`/api/admin/sites/${siteId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (res.ok) void load();
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
  }

  async function sendOutreach(siteId: string) {
    const token = await getIdToken();
    if (!token) return;
    setOutreachBusy(siteId);
    try {
      const res = await fetch(`/api/admin/sites/${siteId}/outreach`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Send failed");
      void load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Outreach send failed");
    } finally {
      setOutreachBusy(null);
    }
  }

  function formatOutreach(site: AdminDemoSiteRow) {
    if (site.outreachStatus === "sent" && site.outreachSentAt) {
      return `Sent ${new Date(site.outreachSentAt).toLocaleDateString()}`;
    }
    if (site.outreachStatus === "failed") return "Failed";
    return "—";
  }

  if (loading) {
    return <p className="admin-loading">Loading…</p>;
  }

  if (!user) {
    return (
      <div className="admin-gate">
        <h1>Demo Sites Admin</h1>
        <p>Valetfy SSO required.</p>
        <LoginPanel />
      </div>
    );
  }

  if (error === "Forbidden" || (error && !data)) {
    return (
      <div className="admin-gate">
        <h1>403 — Admin only</h1>
        <p>{error ?? "Your account is not on the admin allowlist."}</p>
        <p className="admin-hint">
          Set <code>DEMO_SITES_ADMIN_UIDS</code> with your Firebase UID.
        </p>
      </div>
    );
  }

  const sites = data?.sites ?? [];
  const subs = data?.subscriptions;
  const subscribedSites = sites.filter((s) => s.subscriptionStatus);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="container admin-header-inner">
          <div>
            <h1>Demo Sites Admin</h1>
            <p className="admin-sub">Aaron&apos;s cockpit · {user.email}</p>
          </div>
          <button type="button" className="admin-refresh" onClick={() => void load()} disabled={busy}>
            Refresh
          </button>
        </div>
      </header>

      <div className="container admin-tabs">
        <button
          type="button"
          className={tab === "sites" ? "admin-tab active" : "admin-tab"}
          onClick={() => setTab("sites")}
        >
          Sites
        </button>
        <button
          type="button"
          className={tab === "subscriptions" ? "admin-tab active" : "admin-tab"}
          onClick={() => setTab("subscriptions")}
        >
          Subscriptions
        </button>
      </div>

      {tab === "sites" ? (
        <div className="container admin-panel">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Business</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Registrar</th>
                  <th>Domain</th>
                  <th>Unlock</th>
                  <th>Owner UID</th>
                  <th>Created</th>
                  <th>Outreach</th>
                  <th>Leads</th>
                  <th>Stats</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sites.map((site) => (
                  <tr key={site.siteId}>
                    <td>{site.businessName}</td>
                    <td>
                      <code>{site.slug}</code>
                    </td>
                    <td>
                      <select
                        value={site.status}
                        onChange={(e) =>
                          void changeStatus(
                            site.siteId,
                            e.target.value as DemoSiteStatus
                          )
                        }
                        className="admin-select"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{site.registrar ?? "—"}</td>
                    <td>{site.customDomain ?? "—"}</td>
                    <td>{site.dnsRevealUnlocked ? "✓" : "—"}</td>
                    <td className="admin-uid">
                      {site.ownerUid ? (
                        <code title={site.ownerUid}>
                          {site.ownerUid.slice(0, 8)}…
                        </code>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="admin-date">
                      {site.createdAt
                        ? new Date(site.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="admin-outreach">{formatOutreach(site)}</td>
                    <td className="admin-leads">
                      <button
                        type="button"
                        className="admin-leads-btn"
                        onClick={() =>
                          setSelectedLeadsSiteId(
                            selectedLeadsSiteId === site.siteId
                              ? null
                              : site.siteId
                          )
                        }
                      >
                        {site.stats.leads} lead{site.stats.leads === 1 ? "" : "s"}
                      </button>
                    </td>
                    <td className="admin-stats">
                      <span title="views">{site.stats.views}v</span>{" "}
                      <span title="book">{site.stats.book}b</span>{" "}
                      <span title="claim">{site.stats.claim}c</span>{" "}
                      <span title="text">{site.stats.text}t</span>{" "}
                      <span title="call">{site.stats.call}☎</span>
                    </td>
                    <td className="admin-actions">
                      <a href={demoUrl(site.slug)} target="_blank" rel="noopener noreferrer">
                        Demo
                      </a>
                      <a
                        href={`${demoUrl(site.slug).replace(/\/$/, "")}/connect`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Connect
                      </a>
                      <button
                        type="button"
                        onClick={() => void copyUrl(demoUrl(site.slug))}
                      >
                        Copy URL
                      </button>
                      <button
                        type="button"
                        disabled={outreachBusy === site.siteId}
                        onClick={() => void sendOutreach(site.siteId)}
                      >
                        {outreachBusy === site.siteId
                          ? "Sending…"
                          : "Send outreach"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedLeadsSiteId ? (
            <div className="admin-leads-panel">
              <h3>
                Recent leads —{" "}
                {sites.find((s) => s.siteId === selectedLeadsSiteId)
                  ?.businessName ?? selectedLeadsSiteId}
              </h3>
              {(() => {
                const site = sites.find((s) => s.siteId === selectedLeadsSiteId);
                if (!site?.recentLeads.length) {
                  return <p>No leads yet.</p>;
                }
                return (
                  <ul className="admin-leads-list">
                    {site.recentLeads.map((lead) => (
                      <li key={lead.leadId}>
                        <strong>{lead.name}</strong> · {lead.email}
                        {lead.phone ? ` · ${lead.phone}` : ""}
                        {lead.createdAt ? (
                          <span className="admin-leads-date">
                            {" "}
                            — {new Date(lead.createdAt).toLocaleString()}
                          </span>
                        ) : null}
                        <p className="admin-leads-msg">{lead.message}</p>
                      </li>
                    ))}
                  </ul>
                );
              })()}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="container admin-panel">
          <div className="admin-metrics">
            <div className="admin-metric">
              <span className="admin-metric-label">MRR (test)</span>
              <strong>${subs?.mrrUsd ?? 0}</strong>
              <span className="admin-metric-note">
                {subs?.activeCount ?? 0} active × ${subs?.priceUsd ?? 19}/mo
              </span>
            </div>
            <div className="admin-metric">
              <span className="admin-metric-label">Active subs</span>
              <strong>{subs?.activeCount ?? 0}</strong>
            </div>
            <div className="admin-metric">
              <span className="admin-metric-label">Canceled</span>
              <strong>{subs?.canceledCount ?? 0}</strong>
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Site</th>
                  <th>Status</th>
                  <th>Subscription</th>
                  <th>Stripe</th>
                </tr>
              </thead>
              <tbody>
                {subscribedSites.length === 0 ? (
                  <tr>
                    <td colSpan={4}>No subscriptions yet.</td>
                  </tr>
                ) : (
                  subscribedSites.map((site) => (
                    <tr key={site.siteId}>
                      <td>{site.businessName}</td>
                      <td>{site.subscriptionStatus}</td>
                      <td>
                        {site.dnsRevealUnlocked ? "DNS unlocked" : "Locked"}
                      </td>
                      <td className="admin-actions">
                        {site.stripeCustomerId ? (
                          <a
                            href={`https://dashboard.stripe.com/test/customers/${site.stripeCustomerId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Customer
                          </a>
                        ) : null}
                        {site.stripeSubscriptionId ? (
                          <a
                            href={`https://dashboard.stripe.com/test/subscriptions/${site.stripeSubscriptionId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Subscription
                          </a>
                        ) : null}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
