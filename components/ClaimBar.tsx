type Props = {
  businessName: string;
};

/** Stub for Phase 2 Stripe claim flow — no payment wired yet. */
export function ClaimBar({ businessName }: Props) {
  return (
    <div className="claim-bar" role="note" aria-label="Claim this site">
      <div className="claim-bar-inner">
        <span>
          Like this site for <strong>{businessName}</strong>?
        </span>
        <button type="button" className="claim-cta" disabled title="Coming soon">
          Claim this site — coming soon
        </button>
      </div>
    </div>
  );
}
