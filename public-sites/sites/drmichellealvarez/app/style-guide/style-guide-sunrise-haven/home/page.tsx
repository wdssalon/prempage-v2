import { VariantHomePage, createVariantHomeMetadata } from "../../variant-home-renderer";

const SLUG = "style-guide-sunrise-haven" as const;

export const metadata = createVariantHomeMetadata(SLUG);

export default function StyleGuideSunriseHavenHome() {
  return <VariantHomePage slug={SLUG} />;
}
