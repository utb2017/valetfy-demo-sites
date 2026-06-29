export type DemoSiteStatus =
  | "draft"
  | "demo"
  | "live"
  | "sold"
  | "archived";

export type DemoSiteContact = {
  name?: string;
  email?: string;
  phone?: string;
};

export type DemoSiteTheme = {
  primaryColor: string;
  accentColor: string;
  backgroundColor?: string;
  fontFamily?: "sans" | "serif";
  logoUrl?: string;
};

export type HeroBlock = {
  type: "hero";
  headline: string;
  subheadline?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageUrl?: string;
};

export type AboutBlock = {
  type: "about";
  title: string;
  body: string;
};

export type ServicesBlock = {
  type: "services";
  title: string;
  items: Array<{
    name: string;
    description: string;
    price?: string;
  }>;
};

export type ContactBlock = {
  type: "contact";
  title: string;
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
};

export type ContentBlock =
  | HeroBlock
  | AboutBlock
  | ServicesBlock
  | ContactBlock;

export type DemoSiteSubscriptionStatus =
  | "none"
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete";

export type DemoSiteStats = {
  views: number;
  book: number;
  claim: number;
  text: number;
  call: number;
  leads: number;
};

export type DemoSiteOutreachStatus = "none" | "sent" | "failed";

export type DemoSiteLeadDoc = {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  sourceSiteId: string;
  createdAt?: FirebaseFirestore.Timestamp;
};

export type DemoSiteDoc = {
  businessName: string;
  slug: string;
  owner?: DemoSiteContact;
  /** Firebase Auth uid of the claiming Valetfy account. */
  ownerUid?: string | null;
  sourceUrl?: string;
  registrar?: string | null;
  /** Customer's custom domain after unlock (e.g. scotthomeservices.com). */
  customDomain?: string | null;
  status: DemoSiteStatus;
  generatedPages: string[];
  theme: DemoSiteTheme;
  contentBlocks: ContentBlock[];
  backlinkEnabled: boolean;
  subscriptionStatus?: DemoSiteSubscriptionStatus | string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  dnsRevealUnlocked: boolean;
  stats?: DemoSiteStats;
  /** Admin outreach email tracking. */
  outreachStatus?: DemoSiteOutreachStatus | null;
  outreachSentAt?: FirebaseFirestore.Timestamp;
  welcomeEmailSentAt?: FirebaseFirestore.Timestamp;
  createdAt?: FirebaseFirestore.Timestamp;
  updatedAt?: FirebaseFirestore.Timestamp;
};

export type DemoSitePublic = Omit<
  DemoSiteDoc,
  "createdAt" | "updatedAt"
> & {
  siteId: string;
};
