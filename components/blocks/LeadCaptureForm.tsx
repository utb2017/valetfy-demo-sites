"use client";

import { useState } from "react";

type Props = {
  siteId: string;
  theme: { primaryColor: string };
};

export function LeadCaptureForm({ siteId, theme }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId, name, email, phone, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send");
      setDone(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <p className="lead-form-success" role="status">
        Thanks — we got your message and will be in touch soon.
      </p>
    );
  }

  return (
    <form className="lead-form" onSubmit={onSubmit}>
      <label>
        Name
        <input
          type="text"
          name="name"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        Email
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Phone <span className="lead-optional">(optional)</span>
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </label>
      <label>
        Message
        <textarea
          name="message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>
      {error ? <p className="lead-form-error">{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        style={{ backgroundColor: theme.primaryColor }}
        className="lead-form-submit"
      >
        {busy ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
