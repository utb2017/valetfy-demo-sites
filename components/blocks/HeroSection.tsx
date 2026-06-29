import type { HeroBlock } from "@/lib/demoSiteTypes";

type Props = {
  block: HeroBlock;
  theme: { primaryColor: string; accentColor: string };
};

export function HeroSection({ block, theme }: Props) {
  return (
    <section
      className="hero"
      style={{
        background: block.imageUrl
          ? `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${block.imageUrl}) center/cover`
          : `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
      }}
    >
      <div className="hero-inner">
        <p className="hero-eyebrow">Welcome</p>
        <h1>{block.headline}</h1>
        {block.subheadline ? <p className="hero-sub">{block.subheadline}</p> : null}
        {block.ctaLabel && block.ctaHref ? (
          <a className="hero-cta" href={block.ctaHref}>
            {block.ctaLabel}
          </a>
        ) : null}
      </div>
    </section>
  );
}
