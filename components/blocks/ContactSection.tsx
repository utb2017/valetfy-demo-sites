"use client";

import type { ContactBlock } from "@/lib/demoSiteTypes";
import { trackDemoSiteEvent } from "@/components/analytics/trackDemoSiteEvent";
import { LeadCaptureForm } from "@/components/blocks/LeadCaptureForm";

type Props = {
  siteId: string;
  block: ContactBlock;
  theme: { primaryColor: string };
};

export function ContactSection({ siteId, block, theme }: Props) {
  return (
    <section className="section" id="contact">
      <div className="container contact-grid">
        <div>
          <h2 style={{ color: theme.primaryColor }}>{block.title}</h2>
          <p className="prose">We would love to hear from you.</p>
          <LeadCaptureForm siteId={siteId} theme={theme} />
        </div>
        <dl className="contact-list">
          {block.phone ? (
            <>
              <dt>Phone</dt>
              <dd>
                <a
                  href={`tel:${block.phone.replace(/\D/g, "")}`}
                  onClick={() => trackDemoSiteEvent(siteId, "call")}
                >
                  {block.phone}
                </a>
                {" · "}
                <a
                  href={`sms:${block.phone.replace(/\D/g, "")}`}
                  onClick={() => trackDemoSiteEvent(siteId, "text")}
                >
                  Text
                </a>
              </dd>
            </>
          ) : null}
          {block.email ? (
            <>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${block.email}`}>{block.email}</a>
              </dd>
            </>
          ) : null}
          {block.address ? (
            <>
              <dt>Address</dt>
              <dd>{block.address}</dd>
            </>
          ) : null}
          {block.hours ? (
            <>
              <dt>Hours</dt>
              <dd>{block.hours}</dd>
            </>
          ) : null}
        </dl>
      </div>
    </section>
  );
}
