import type { AboutBlock } from "@/lib/demoSiteTypes";

type Props = {
  block: AboutBlock;
  theme: { primaryColor: string };
};

export function AboutSection({ block, theme }: Props) {
  return (
    <section className="section">
      <div className="container">
        <h2 style={{ color: theme.primaryColor }}>{block.title}</h2>
        <p className="prose">{block.body}</p>
      </div>
    </section>
  );
}
