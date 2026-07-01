import { Leaf, Heart, Star, MapPin } from 'lucide-react'

const items = [
  { icon: Leaf, label: 'Eco-Friendly' },
  { icon: Heart, label: 'Cage-Free & Force-Free' },
  { icon: Star, label: 'One-on-One Care' },
  { icon: MapPin, label: 'We Come to You' },
]

export function TrustStrip() {
  return (
    <section
      aria-label="Why Woof Wash"
      style={{ backgroundColor: '#00a2ee' }}
      className="py-4"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          role="list"
          aria-label="Trust highlights"
        >
          {items.map(({ icon: Icon, label }, index) => (
            <li key={label} className="flex items-center gap-2">
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="hidden h-1 w-1 rounded-full bg-white/60 sm:block"
                />
              )}
              <span className="flex items-center gap-2">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ backgroundColor: '#0077c0' }}
                  aria-hidden="true"
                >
                  <Icon className="h-4 w-4 text-white" />
                </span>
                {/* Deep blue text on #00a2ee — passes WCAG AA at large size; use bold + navy */}
                <span className="text-sm font-bold" style={{ color: '#003b6f' }}>
                  {label}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
