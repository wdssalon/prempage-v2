import { VariantPageContent, createVariantMetadata } from "../variant-renderer";

const SLUG = "style-guide-nocturne-focus" as const;

export const metadata = createVariantMetadata(SLUG);

export default function StyleGuideNocturneFocusPage() {
  return <VariantPageContent slug={SLUG} />;
}
