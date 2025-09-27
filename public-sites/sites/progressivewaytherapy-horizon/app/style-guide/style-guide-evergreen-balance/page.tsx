import { VariantPageContent, createVariantMetadata } from "../variant-renderer";

const SLUG = "style-guide-evergreen-balance" as const;

export const metadata = createVariantMetadata(SLUG);

export default function StyleGuideEvergreenBalancePage() {
  return <VariantPageContent slug={SLUG} />;
}
