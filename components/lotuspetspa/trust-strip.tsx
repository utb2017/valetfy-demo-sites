import { CreditCard, Heart, Home, Leaf, Store } from "lucide-react";

const items = [
  { icon: Heart, label: "Cage-free" },
  { icon: Store, label: "Locally owned" },
  { icon: Leaf, label: "Eco-friendly products" },
  { icon: Home, label: "We come to you" },
  { icon: CreditCard, label: "Cards, Apple Pay, Android Pay" },
];

export function TrustStrip() {
  return (
    <section aria-label="Lotus Pet Spa highlights" className="bg-white py-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
          role="list"
          aria-label="Trust highlights"
        >
          {items.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-[#E7E0F1] bg-[#FBFAFD] px-4 py-3"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F3EFF8] text-[#4A3B6B]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-black text-[#2E2344]">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
