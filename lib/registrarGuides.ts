import { normalizeRegistrar, type RegistrarKey } from "@/lib/normalizeRegistrar";

export type DnsRecord = {
  type: "A" | "CNAME" | "ALIAS";
  host: string;
  value: string;
  note?: string;
};

export type RegistrarGuide = {
  key: RegistrarKey;
  label: string;
  supportsDomainConnect: boolean;
  domainConnectLabel?: string;
  /** Placeholder — wire provider-specific Domain Connect in a later pass. */
  domainConnectUrl?: string;
  steps: string[];
  records: DnsRecord[];
  videoUrl?: string;
  extraNotes?: string[];
};

const DEFAULT_RECORDS: DnsRecord[] = [
  {
    type: "A",
    host: "@",
    value: "76.76.21.21",
    note: "Root / apex domain",
  },
  {
    type: "CNAME",
    host: "www",
    value: "cname.vercel-dns.com",
    note: "WWW subdomain",
  },
];

function guide(
  key: RegistrarKey,
  label: string,
  opts: Partial<Omit<RegistrarGuide, "key" | "label">> & {
    steps: string[];
  }
): RegistrarGuide {
  return {
    key,
    label,
    supportsDomainConnect: false,
    records: DEFAULT_RECORDS,
    ...opts,
  };
}

export const REGISTRAR_GUIDES: Record<RegistrarKey, RegistrarGuide> = {
  cloudflare: guide("cloudflare", "Cloudflare", {
    steps: [
      "Log in to Cloudflare → select your domain.",
      "Open DNS → Records → Add record.",
      "Add the A record for @ (proxied status: DNS only / grey-cloud).",
      "Add the CNAME for www pointing to cname.vercel-dns.com (DNS only).",
      "Save. SSL on your domain may take a few minutes after DNS propagates.",
    ],
    extraNotes: [
      "Important: set both records to DNS only (grey cloud). Orange-cloud proxy breaks Vercel SSL verification.",
    ],
    videoUrl: undefined,
  }),
  godaddy: guide("godaddy", "GoDaddy", {
    supportsDomainConnect: true,
    domainConnectLabel: "Connect automatically with Domain Connect",
    domainConnectUrl: "https://www.godaddy.com/help/manage-dns-records-680",
    steps: [
      "GoDaddy → My Products → DNS for your domain.",
      "Add an A record: Host @, Points to 76.76.21.21, TTL 600s.",
      "Add a CNAME: Host www, Points to cname.vercel-dns.com.",
      "Remove conflicting A/CNAME records for @ or www if present.",
    ],
  }),
  namecheap: guide("namecheap", "Namecheap", {
    steps: [
      "Namecheap → Domain List → Manage → Advanced DNS.",
      "Add A Record: Host @, Value 76.76.21.21.",
      "Add CNAME: Host www, Value cname.vercel-dns.com.",
      "Save changes (propagation can take up to 30 minutes).",
    ],
  }),
  squarespace: guide("squarespace", "Squarespace Domains", {
    steps: [
      "Squarespace → Settings → Domains → select domain → DNS Settings.",
      "Add custom records (Default records may need to be removed if conflicting).",
      "A record: Host @ → 76.76.21.21.",
      "CNAME: Host www → cname.vercel-dns.com.",
    ],
  }),
  wix: guide("wix", "Wix", {
    steps: [
      "Wix → Domains → Manage DNS Records.",
      "Add A record @ → 76.76.21.21.",
      "Add CNAME www → cname.vercel-dns.com.",
      "If Wix site is still connected, disconnect or point only DNS as needed.",
    ],
  }),
  google: guide("google", "Google Domains / Squarespace", {
    steps: [
      "Open Google Domains (now Squarespace Domains) → DNS.",
      "Custom records → Create new record.",
      "A @ → 76.76.21.21.",
      "CNAME www → cname.vercel-dns.com.",
    ],
  }),
  porkbun: guide("porkbun", "Porkbun", {
    steps: [
      "Porkbun → Domain Management → DNS → Add record.",
      "A record: name blank/@, content 76.76.21.21.",
      "CNAME: name www, content cname.vercel-dns.com.",
    ],
  }),
  ionos: guide("ionos", "IONOS", {
    supportsDomainConnect: true,
    domainConnectLabel: "Connect automatically with Domain Connect",
    domainConnectUrl: "https://www.ionos.com/help/domains/dns-settings/",
    steps: [
      "IONOS → Domains & SSL → select domain → DNS.",
      "Add A record @ → 76.76.21.21.",
      "Add CNAME www → cname.vercel-dns.com.",
    ],
  }),
  other: guide("other", "Your registrar", {
    steps: [
      "Open your domain's DNS management panel at your registrar or DNS host.",
      "Add an A record for the root (@): 76.76.21.21.",
      "Add a CNAME for www → cname.vercel-dns.com.",
      "Remove old A/CNAME records that conflict with these values.",
    ],
  }),
};

export function getRegistrarGuide(registrar?: string | null): RegistrarGuide {
  const key = normalizeRegistrar(registrar);
  return REGISTRAR_GUIDES[key];
}
