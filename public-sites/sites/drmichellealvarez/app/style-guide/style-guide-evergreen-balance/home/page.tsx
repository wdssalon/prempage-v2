import { VariantHomePage, createVariantHomeMetadata } from "../../variant-home-renderer";

const SLUG = "style-guide-evergreen-balance" as const;

export const metadata = createVariantHomeMetadata(SLUG);

export default function StyleGuideEvergreenBalanceHome() {
  return <VariantHomePage slug={SLUG} />;
}
