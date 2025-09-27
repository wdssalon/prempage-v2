import { VariantHomePage, createVariantHomeMetadata } from "../../variant-home-renderer";

const SLUG = "style-guide-nocturne-focus" as const;

export const metadata = createVariantHomeMetadata(SLUG);

export default function StyleGuideNocturneFocusHome() {
  return <VariantHomePage slug={SLUG} />;
}
