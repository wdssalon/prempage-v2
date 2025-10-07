// AUTO-GENERATED FILE. DO NOT EDIT.
// Run `python public-sites/templates/horizon/scripts/generate_section_catalog.py`

export const SITE_PLACEHOLDER = "{slug}";

export type SectionCategory =
  | "navigation"
  | "hero"
  | "services"
  | "story"
  | "cta"
  | "testimonials"
  | "footer"
  | "utility";

export type SlotSource =
  | {
      kind: "ppid_template";
      template: string;
    }
  | {
      kind: "data_file";
      file: string;
      export: string;
      path?: string;
    }
  | {
      kind: "component";
      file: string;
      identifier?: string;
      notes?: string;
    }
  | {
      kind: "static";
      notes: string;
    };

export type SectionSlotField = {
  key: string;
  type: string;
  description?: string;
  recommendedLength?: string;
  optional?: boolean;
  source?: SlotSource;
};

export type SectionSlot = {
  name: string;
  type: string;
  description?: string;
  recommendedLength?: string;
  optional?: boolean;
  source?: SlotSource;
  fields?: SectionSlotField[];
};

export type SectionDefinition = {
  key: string;
  label: string;
  category: SectionCategory;
  description: string;
  componentPath: string;
  sectionId?: string;
  dataDependencies?: string[];
  tags?: string[];
  contentSlots: SectionSlot[];
};

export const HORIZON_SECTIONS: SectionDefinition[] =
[
  {
    key: "horizon_navigation_primary",
    label: "Top navigation with dropdowns and quick contact",
    category: "navigation",
    description: "Fixed navigation bar with primary links, services mega menu, supportive resources drop-down, and quick call-to-action buttons.",
    componentPath: "public-sites/templates/horizon/app-boilerplate/src/components/Navigation.jsx",
    contentSlots: [
      {
        name: "logo",
        type: "image",
        description: "Primary logo displayed in the header.",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Navigation.jsx#Navigation.image.1"
        }
      },
      {
        name: "menu_links",
        type: "list",
        description: "Direct navigation anchors shown on desktop (non-dropdown).",
        fields: [
          {
            key: "about_label",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Navigation.jsx#Navigation.link.2"
            }
          },
          {
            key: "about_href",
            type: "url",
            source: {
              kind: "component",
              file: "public-sites/templates/horizon/app-boilerplate/src/components/Navigation.jsx",
              notes: "Update the About anchor href."
            }
          },
          {
            key: "client_portal_label",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Navigation.jsx#Navigation.link.19"
            }
          },
          {
            key: "client_portal_href",
            type: "url",
            source: {
              kind: "component",
              file: "public-sites/templates/horizon/app-boilerplate/src/components/Navigation.jsx",
              notes: "Update the Client Portal anchor href."
            }
          },
          {
            key: "contact_label",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Navigation.jsx#Navigation.link.20"
            }
          },
          {
            key: "contact_href",
            type: "url",
            source: {
              kind: "component",
              file: "public-sites/templates/horizon/app-boilerplate/src/components/Navigation.jsx",
              notes: "Update the Contact anchor href."
            }
          }
        ]
      },
      {
        name: "services_dropdown",
        type: "repeater",
        description: "Three-column services drop-down that appears under the Services menu.",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Navigation.jsx#Navigation.cta.1"
        },
        fields: [
          {
            key: "column_one_heading",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Navigation.jsx#Navigation.heading.1"
            }
          },
          {
            key: "column_one_links",
            type: "list",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Navigation.jsx#Navigation.list.2"
            }
          },
          {
            key: "column_two_heading",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Navigation.jsx#Navigation.heading.2"
            }
          },
          {
            key: "column_two_links",
            type: "list",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Navigation.jsx#Navigation.list.3"
            }
          },
          {
            key: "column_three_heading",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Navigation.jsx#Navigation.heading.3"
            }
          },
          {
            key: "column_three_links",
            type: "list",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Navigation.jsx#Navigation.list.4"
            }
          }
        ]
      },
      {
        name: "secondary_dropdown",
        type: "repeater",
        description: "Secondary assistance drop-down (Get Started menu).",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Navigation.jsx#Navigation.list.5"
        },
        fields: [
          {
            key: "label",
            type: "text",
            recommendedLength: "1-4 words"
          },
          {
            key: "href",
            type: "url",
            source: {
              kind: "component",
              file: "public-sites/templates/horizon/app-boilerplate/src/components/Navigation.jsx",
              notes: "Adjust href values in the Get Started drop-down list."
            }
          }
        ]
      },
      {
        name: "header_primary_cta",
        type: "cta",
        description: "Primary call-to-action button displayed to the right of the navigation links.",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Navigation.jsx#Navigation.link.21"
        },
        fields: [
          {
            key: "label",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Navigation.jsx#Navigation.link.21"
            }
          },
          {
            key: "href",
            type: "url",
            source: {
              kind: "component",
              file: "public-sites/templates/horizon/app-boilerplate/src/components/Navigation.jsx",
              notes: "Update the header CTA Link href."
            }
          }
        ]
      }
    ],
    sectionId: "global--navigation",
    dataDependencies: [
      "public-sites/templates/horizon/app-boilerplate/src/components/MobileNavigation.jsx"
    ]
  },
  {
    key: "horizon_home_hero",
    label: "Hero with video backdrop and dual call-to-action",
    category: "hero",
    description: "Immersive hero section featuring animated video background, eyebrow, split headline, supporting copy, value props, and stacked call-to-actions.",
    componentPath: "public-sites/templates/horizon/app-boilerplate/src/components/Hero.jsx",
    contentSlots: [
      {
        name: "eyebrow",
        type: "text",
        recommendedLength: "\u226440 characters",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Hero.jsx#Hero.inline.1"
        }
      },
      {
        name: "headline_primary",
        type: "rich_text",
        recommendedLength: "\u226490 characters",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Hero.jsx#Hero.inline.2"
        }
      },
      {
        name: "headline_accent",
        type: "text",
        recommendedLength: "1-3 words",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Hero.jsx#Hero.inline.3"
        }
      },
      {
        name: "supporting_copy",
        type: "text",
        recommendedLength: "\u2264160 characters",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Hero.jsx#Hero.body.1"
        }
      },
      {
        name: "value_props",
        type: "list",
        description: "Three supporting value statements rendered with heart icons.",
        fields: [
          {
            key: "item_1",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Hero.jsx#Hero.inline.4"
            }
          },
          {
            key: "item_2",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Hero.jsx#Hero.inline.5"
            }
          },
          {
            key: "item_3",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Hero.jsx#Hero.inline.6"
            }
          }
        ]
      },
      {
        name: "primary_cta",
        type: "cta",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Hero.jsx#Hero.link.1"
        },
        fields: [
          {
            key: "label",
            type: "text",
            recommendedLength: "2-4 words",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Hero.jsx#Hero.link.1"
            }
          },
          {
            key: "href",
            type: "url",
            source: {
              kind: "component",
              file: "public-sites/templates/horizon/app-boilerplate/src/components/Hero.jsx",
              notes: "Update the consultation Link href in the primary CTA."
            }
          }
        ]
      },
      {
        name: "secondary_cta",
        type: "cta",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Hero.jsx#Hero.link.2"
        },
        fields: [
          {
            key: "label",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Hero.jsx#Hero.link.2"
            }
          },
          {
            key: "href",
            type: "url",
            source: {
              kind: "component",
              file: "public-sites/templates/horizon/app-boilerplate/src/components/Hero.jsx",
              notes: "Adjust the learn more anchor href."
            }
          }
        ]
      },
      {
        name: "credential_banner",
        type: "list",
        description: "Professional credentials displayed beneath the CTAs.",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Hero.jsx#Hero.body.2"
        },
        fields: [
          {
            key: "headline",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Hero.jsx#Hero.body.2"
            }
          },
          {
            key: "credential_primary",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Hero.jsx#Hero.inline.7"
            }
          },
          {
            key: "credential_secondary",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Hero.jsx#Hero.inline.9"
            }
          },
          {
            key: "credential_tertiary",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Hero.jsx#Hero.inline.11"
            }
          }
        ]
      }
    ],
    sectionId: "home--liberation-hero",
    tags: [
      "variant:default",
      "variant:ada"
    ]
  },
  {
    key: "horizon_home_services",
    label: "Services grid with repeater data",
    category: "services",
    description: "Service overview featuring three animated cards sourced from the services data file and a secondary composition describing specialized treatments.",
    componentPath: "public-sites/templates/horizon/app-boilerplate/src/components/Services.jsx",
    contentSlots: [
      {
        name: "section_heading",
        type: "text",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Services.jsx#Services.heading.1"
        }
      },
      {
        name: "section_body",
        type: "text",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Services.jsx#Services.body.1"
        }
      },
      {
        name: "service_groups",
        type: "repeater",
        description: "Cards populated from serviceGroups in src/data/services.js.",
        source: {
          kind: "data_file",
          file: "public-sites/templates/horizon/app-boilerplate/src/data/services.js",
          export: "serviceGroups"
        },
        fields: [
          {
            key: "title",
            type: "text",
            recommendedLength: "2-4 words"
          },
          {
            key: "description",
            type: "text",
            recommendedLength: "\u2264180 characters"
          },
          {
            key: "services",
            type: "list",
            description: "Bullet list under each card."
          },
          {
            key: "cta_label",
            type: "text",
            recommendedLength: "2-3 words"
          },
          {
            key: "cta_href",
            type: "url"
          }
        ]
      },
      {
        name: "specialized_heading",
        type: "text",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Services.jsx#Services.heading.2"
        }
      },
      {
        name: "specialized_subheading",
        type: "text",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Services.jsx#Services.body.2"
        }
      },
      {
        name: "modality_cards_left",
        type: "repeater",
        description: "Detail cards in the left column of the specialized treatments grid.",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Services.jsx#Services.heading.3"
        },
        fields: [
          {
            key: "title_primary",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Services.jsx#Services.heading.3"
            }
          },
          {
            key: "body_primary",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Services.jsx#Services.body.3"
            }
          },
          {
            key: "title_secondary",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Services.jsx#Services.heading.4"
            }
          },
          {
            key: "body_secondary",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Services.jsx#Services.body.4"
            }
          }
        ]
      },
      {
        name: "modality_cards_right",
        type: "repeater",
        description: "Detail cards in the right column of the specialized treatments grid.",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Services.jsx#Services.heading.5"
        },
        fields: [
          {
            key: "title_primary",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Services.jsx#Services.heading.5"
            }
          },
          {
            key: "body_primary",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Services.jsx#Services.body.5"
            }
          },
          {
            key: "title_secondary",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Services.jsx#Services.heading.6"
            }
          },
          {
            key: "body_secondary",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Services.jsx#Services.body.6"
            }
          }
        ]
      }
    ],
    sectionId: "home--services-overview",
    dataDependencies: [
      "public-sites/templates/horizon/app-boilerplate/src/data/services.js"
    ]
  },
  {
    key: "horizon_home_why_choose_us",
    label: "Why choose us feature grid",
    category: "story",
    description: "Four-up reason grid with supporting lead copy and stat bar that reinforces trust signals.",
    componentPath: "public-sites/templates/horizon/app-boilerplate/src/components/WhyChooseUs.jsx",
    contentSlots: [
      {
        name: "section_heading",
        type: "text",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/WhyChooseUs.jsx#WhyChooseUs.heading.1"
        }
      },
      {
        name: "section_body",
        type: "text",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/WhyChooseUs.jsx#WhyChooseUs.body.1"
        }
      },
      {
        name: "reasons",
        type: "repeater",
        description: "Four feature cards explaining the differentiators.",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/WhyChooseUs.jsx#WhyChooseUs.reasons.progressive-values.title"
        },
        fields: [
          {
            key: "title_progressive_values",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/WhyChooseUs.jsx#WhyChooseUs.reasons.progressive-values.title"
            }
          },
          {
            key: "description_progressive_values",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/WhyChooseUs.jsx#WhyChooseUs.reasons.progressive-values.description"
            }
          },
          {
            key: "title_inclusive_safe",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/WhyChooseUs.jsx#WhyChooseUs.reasons.inclusive-safe.title"
            }
          },
          {
            key: "description_inclusive_safe",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/WhyChooseUs.jsx#WhyChooseUs.reasons.inclusive-safe.description"
            }
          },
          {
            key: "title_secure_telehealth",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/WhyChooseUs.jsx#WhyChooseUs.reasons.secure-telehealth.title"
            }
          },
          {
            key: "description_secure_telehealth",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/WhyChooseUs.jsx#WhyChooseUs.reasons.secure-telehealth.description"
            }
          },
          {
            key: "title_easy_scheduling",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/WhyChooseUs.jsx#WhyChooseUs.reasons.easy-scheduling.title"
            }
          },
          {
            key: "description_easy_scheduling",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/WhyChooseUs.jsx#WhyChooseUs.reasons.easy-scheduling.description"
            }
          }
        ]
      },
      {
        name: "stat_bar",
        type: "list",
        description: "Four trust-building stats displayed below the reason grid.",
        fields: [
          {
            key: "years_experience",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/WhyChooseUs.jsx#WhyChooseUs.body.2"
            }
          },
          {
            key: "years_experience_label",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/WhyChooseUs.jsx#WhyChooseUs.body.3"
            }
          },
          {
            key: "emdr",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/WhyChooseUs.jsx#WhyChooseUs.body.4"
            }
          },
          {
            key: "emdr_label",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/WhyChooseUs.jsx#WhyChooseUs.body.5"
            }
          },
          {
            key: "confidential",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/WhyChooseUs.jsx#WhyChooseUs.body.6"
            }
          },
          {
            key: "confidential_label",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/WhyChooseUs.jsx#WhyChooseUs.body.7"
            }
          },
          {
            key: "licensed",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/WhyChooseUs.jsx#WhyChooseUs.body.8"
            }
          },
          {
            key: "licensed_label",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/WhyChooseUs.jsx#WhyChooseUs.body.9"
            }
          }
        ]
      }
    ],
    sectionId: "home--why-choose"
  },
  {
    key: "horizon_home_testimonials",
    label: "Rotating testimonials carousel",
    category: "testimonials",
    description: "Auto-advancing testimonial slider with pause control, navigation buttons, and disclosure note.",
    componentPath: "public-sites/templates/horizon/app-boilerplate/src/components/Testimonials.jsx",
    contentSlots: [
      {
        name: "section_heading",
        type: "text",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Testimonials.jsx#Testimonials.heading.1"
        }
      },
      {
        name: "section_body",
        type: "text",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Testimonials.jsx#Testimonials.body.1"
        }
      },
      {
        name: "testimonials",
        type: "repeater",
        description: "List of testimonial entries powering the carousel.",
        source: {
          kind: "data_file",
          file: "public-sites/templates/horizon/app-boilerplate/src/data/testimonials.js",
          export: "testimonials"
        },
        fields: [
          {
            key: "quote",
            type: "text"
          },
          {
            key: "name",
            type: "text"
          },
          {
            key: "identity",
            type: "text"
          },
          {
            key: "rating",
            type: "number"
          }
        ]
      },
      {
        name: "controls",
        type: "cta",
        description: "Carousel control labels and button text.",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Testimonials.jsx#Testimonials.cta.3"
        },
        fields: [
          {
            key: "pause_label",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Testimonials.jsx#Testimonials.cta.3"
            }
          }
        ]
      },
      {
        name: "disclosure",
        type: "text",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Testimonials.jsx#Testimonials.body.2"
        }
      }
    ],
    sectionId: "home--stories",
    dataDependencies: [
      "public-sites/templates/horizon/app-boilerplate/src/data/testimonials.js"
    ]
  },
  {
    key: "horizon_home_final_cta",
    label: "Final call-to-action with contact methods",
    category: "cta",
    description: "Closing section providing three engagement cards, availability details, and crisis disclaimer over a gradient background.",
    componentPath: "public-sites/templates/horizon/app-boilerplate/src/components/FinalCTA.jsx",
    contentSlots: [
      {
        name: "headline",
        type: "rich_text",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/FinalCTA.jsx#FinalCTA.heading.1"
        }
      },
      {
        name: "headline_accent",
        type: "text",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/FinalCTA.jsx#FinalCTA.inline.1"
        }
      },
      {
        name: "supporting_copy",
        type: "text",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/FinalCTA.jsx#FinalCTA.body.1"
        }
      },
      {
        name: "cta_cards",
        type: "repeater",
        description: "Three cards offering consultation, contact form, and scheduling options.",
        fields: [
          {
            key: "consultation_title",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/FinalCTA.jsx#FinalCTA.heading.2"
            }
          },
          {
            key: "consultation_body",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/FinalCTA.jsx#FinalCTA.body.2"
            }
          },
          {
            key: "consultation_cta",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/FinalCTA.jsx#FinalCTA.link.1"
            }
          },
          {
            key: "consultation_href",
            type: "url",
            source: {
              kind: "component",
              file: "public-sites/templates/horizon/app-boilerplate/src/components/FinalCTA.jsx",
              notes: "Update the consultation Link href attribute."
            }
          },
          {
            key: "message_title",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/FinalCTA.jsx#FinalCTA.heading.3"
            }
          },
          {
            key: "message_body",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/FinalCTA.jsx#FinalCTA.body.3"
            }
          },
          {
            key: "message_cta",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/FinalCTA.jsx#FinalCTA.link.2"
            }
          },
          {
            key: "message_href",
            type: "url",
            source: {
              kind: "component",
              file: "public-sites/templates/horizon/app-boilerplate/src/components/FinalCTA.jsx",
              notes: "Update the contact form Link href attribute."
            }
          },
          {
            key: "calendar_title",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/FinalCTA.jsx#FinalCTA.heading.4"
            }
          },
          {
            key: "calendar_body",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/FinalCTA.jsx#FinalCTA.body.4"
            }
          },
          {
            key: "calendar_cta",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/FinalCTA.jsx#FinalCTA.link.3"
            }
          },
          {
            key: "calendar_href",
            type: "url",
            source: {
              kind: "component",
              file: "public-sites/templates/horizon/app-boilerplate/src/components/FinalCTA.jsx",
              notes: "Update the calendar Link href attribute."
            }
          }
        ]
      },
      {
        name: "service_area",
        type: "text",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/FinalCTA.jsx#FinalCTA.inline.2"
        }
      },
      {
        name: "availability",
        type: "list",
        description: "Hours of operation.",
        fields: [
          {
            key: "heading",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/FinalCTA.jsx#FinalCTA.heading.5"
            }
          },
          {
            key: "weekday_hours",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/FinalCTA.jsx#FinalCTA.body.5"
            }
          },
          {
            key: "friday_hours",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/FinalCTA.jsx#FinalCTA.body.6"
            }
          },
          {
            key: "weekend_hours",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/FinalCTA.jsx#FinalCTA.body.7"
            }
          }
        ]
      },
      {
        name: "expectations",
        type: "list",
        description: "Bullet list describing what clients can expect.",
        fields: [
          {
            key: "heading",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/FinalCTA.jsx#FinalCTA.heading.6"
            }
          },
          {
            key: "item_1",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/FinalCTA.jsx#FinalCTA.body.8"
            }
          },
          {
            key: "item_2",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/FinalCTA.jsx#FinalCTA.body.9"
            }
          },
          {
            key: "item_3",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/FinalCTA.jsx#FinalCTA.body.10"
            }
          }
        ]
      },
      {
        name: "crisis_disclaimer",
        type: "text",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/FinalCTA.jsx#FinalCTA.body.11"
        }
      }
    ],
    sectionId: "home--closing-invite",
    tags: [
      "variant:default",
      "variant:ada"
    ]
  },
  {
    key: "horizon_footer_primary",
    label: "Comprehensive footer with resource links",
    category: "footer",
    description: "Footer spanning brand summary, quick links, resources, client portal access, licensing details, and legal text.",
    componentPath: "public-sites/templates/horizon/app-boilerplate/src/components/Footer.jsx",
    contentSlots: [
      {
        name: "brand_heading",
        type: "text",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Footer.jsx#Footer.heading.1"
        }
      },
      {
        name: "brand_tagline",
        type: "text",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Footer.jsx#Footer.body.1"
        }
      },
      {
        name: "brand_summary",
        type: "text",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Footer.jsx#Footer.body.2"
        }
      },
      {
        name: "contact_details",
        type: "list",
        description: "Contact and location entries.",
        fields: [
          {
            key: "service_area",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Footer.jsx#Footer.inline.1"
            }
          },
          {
            key: "phone",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Footer.jsx#Footer.inline.2"
            }
          },
          {
            key: "email",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Footer.jsx#Footer.inline.3"
            }
          }
        ]
      },
      {
        name: "quick_links",
        type: "list",
        description: "First column of navigational links.",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Footer.jsx#Footer.list.1"
        }
      },
      {
        name: "resources_links",
        type: "list",
        description: "Second column of resources links.",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Footer.jsx#Footer.list.2"
        }
      },
      {
        name: "cta_buttons",
        type: "list",
        description: "Client portal and get started buttons above the legal strip.",
        fields: [
          {
            key: "client_portal_label",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Footer.jsx#Footer.link.11"
            }
          },
          {
            key: "get_started_label",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Footer.jsx#Footer.link.12"
            }
          }
        ]
      },
      {
        name: "license_statement",
        type: "text",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Footer.jsx#Footer.body.3"
        }
      },
      {
        name: "copyright",
        type: "text",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Footer.jsx#Footer.body.4"
        }
      },
      {
        name: "legal_links",
        type: "list",
        description: "Terms, privacy, accessibility links.",
        fields: [
          {
            key: "terms",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Footer.jsx#Footer.link.13"
            }
          },
          {
            key: "privacy",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Footer.jsx#Footer.link.14"
            }
          },
          {
            key: "accessibility",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Footer.jsx#Footer.link.15"
            }
          }
        ]
      },
      {
        name: "legal_disclosures",
        type: "list",
        description: "Screen-reader only legal text.",
        fields: [
          {
            key: "terms_details",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Footer.jsx#Footer.body.5"
            }
          },
          {
            key: "privacy_details",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Footer.jsx#Footer.body.6"
            }
          },
          {
            key: "accessibility_details",
            type: "text",
            source: {
              kind: "ppid_template",
              template: "code:public-sites/sites/{slug}/src/components/Footer.jsx#Footer.body.7"
            }
          }
        ]
      },
      {
        name: "crisis_footer",
        type: "text",
        source: {
          kind: "ppid_template",
          template: "code:public-sites/sites/{slug}/src/components/Footer.jsx#Footer.body.8"
        }
      }
    ],
    sectionId: "global--footer"
  }
];
