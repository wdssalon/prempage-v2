import { VariantPageContent, createVariantMetadata } from "../variant-renderer";

const SLUG = "style-guide-sunrise-haven" as const;

export const metadata = createVariantMetadata(SLUG);

export default function StyleGuideSunriseHavenPage() {
  return <VariantPageContent slug={SLUG} />;
}
