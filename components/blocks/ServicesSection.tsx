import type { ServicesBlock } from "@/lib/demoSiteTypes";

type Props = {
  block: ServicesBlock;
  theme: { primaryColor: string; accentColor: string };
};

export function ServicesSection({ block, theme }: Props) {
  return (
    <section className="section section-muted">
      <div className="container">
        <h2 style={{ color: theme.primaryColor }}>{block.title}</h2>
        <ul className="service-grid">
          {block.items.map((item) => (
            <li key={item.name} className="service-card">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              {item.price ? (
                <span className="service-price" style={{ color: theme.accentColor }}>
                  {item.price}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
