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

export type DemoSiteDoc = {
  businessName: string;
  slug: string;
  owner?: DemoSiteContact;
  sourceUrl?: string;
  registrar?: string;
  status: DemoSiteStatus;
  generatedPages: string[];
  theme: DemoSiteTheme;
  contentBlocks: ContentBlock[];
  backlinkEnabled: boolean;
  subscriptionStatus?: string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  dnsRevealUnlocked: boolean;
  createdAt?: FirebaseFirestore.Timestamp;
  updatedAt?: FirebaseFirestore.Timestamp;
};

export type DemoSitePublic = Omit<
  DemoSiteDoc,
  "createdAt" | "updatedAt"
> & {
  siteId: string;
};
