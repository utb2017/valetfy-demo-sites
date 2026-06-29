import type { ContentBlock } from "@/lib/demoSiteTypes";
import { AboutSection } from "@/components/blocks/AboutSection";
import { ContactSection } from "@/components/blocks/ContactSection";
import { HeroSection } from "@/components/blocks/HeroSection";
import { ServicesSection } from "@/components/blocks/ServicesSection";

type Props = {
  blocks: ContentBlock[];
  theme: {
    primaryColor: string;
    accentColor: string;
    fontFamily?: "sans" | "serif";
  };
};

export function BlockRenderer({ blocks, theme }: Props) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "hero":
            return (
              <HeroSection key={`hero-${index}`} block={block} theme={theme} />
            );
          case "about":
            return (
              <AboutSection key={`about-${index}`} block={block} theme={theme} />
            );
          case "services":
            return (
              <ServicesSection
                key={`services-${index}`}
                block={block}
                theme={theme}
              />
            );
          case "contact":
            return (
              <ContactSection
                key={`contact-${index}`}
                block={block}
                theme={theme}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
