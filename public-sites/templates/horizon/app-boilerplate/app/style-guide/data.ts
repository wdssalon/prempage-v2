export type StyleOption = {
  id: string;
  name: string;
  description: string;
  isSelected?: boolean;
};

export const fontOptions: StyleOption[] = [
  {
    id: "serif-sans",
    name: "Serif display + Sans body",
    description: "Playfair Display paired with Inter keeps headlines expressive and body copy highly legible.",
    isSelected: true,
  },
  {
    id: "modern-serif",
    name: "Modern serif",
    description: "Fraunces with Work Sans for an editorial tone with soft edges.",
  },
  {
    id: "rounded-sans",
    name: "Rounded sans",
    description: "Outfit with Plus Jakarta Sans for a friendly, product-focused voice.",
  },
];

export const colorOptions: StyleOption[] = [
  {
    id: "sunrise",
    name: "Sunrise",
    description: "Warm peach gradients with calming slate neutrals.",
    isSelected: true,
  },
  {
    id: "coastal",
    name: "Coastal",
    description: "Sea glass blues balanced by crisp whites for a spa-like palette.",
  },
  {
    id: "noir",
    name: "Noir",
    description: "Moody charcoal base punctuated with gold call-to-actions.",
  },
];

export const writingStyleOptions: StyleOption[] = [
  {
    id: "affirming",
    name: "Affirming & Direct",
    description: "Warm encouragement paired with actionable next steps.",
    isSelected: true,
  },
  {
    id: "reflective",
    name: "Reflective & Narrative",
    description: "Story-driven copy that welcomes the reader into shared experiences.",
  },
  {
    id: "research",
    name: "Research-informed",
    description: "Clinical grounding with approachable explanation of modalities.",
  },
];
