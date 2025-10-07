"""Canonical section catalog for the Horizon template.

This module lives alongside the template so that the Studio and automation
can generate up-to-date metadata from a single source of truth. The data is
structured to be consumed by `generate_section_catalog.py`, which translates it
into the TypeScript definitions used by the Studio front-end.
"""

from __future__ import annotations

SECTION_CATALOG: list[dict[str, object]] = [
    {
        "key": "horizon_navigation_primary",
        "label": "Top navigation with dropdowns and quick contact",
        "category": "navigation",
        "description": (
            "Fixed navigation bar with primary links, services mega menu, supportive resources "
            "drop-down, and quick call-to-action buttons."
        ),
        "component": "src/components/Navigation.jsx",
        "section_id": "global--navigation",
        "data_dependencies": ["src/components/MobileNavigation.jsx"],
        "content_slots": [
            {
                "name": "logo",
                "type": "image",
                "description": "Primary logo displayed in the header.",
                "source": {
                    "kind": "ppid",
                    "component": "components/Navigation.jsx",
                    "anchor": "Navigation.image.1",
                },
            },
            {
                "name": "menu_links",
                "type": "list",
                "description": "Direct navigation anchors shown on desktop (non-dropdown).",
                "fields": [
                    {
                        "key": "about_label",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Navigation.jsx",
                            "anchor": "Navigation.link.2",
                        },
                    },
                    {
                        "key": "about_href",
                        "type": "url",
                        "source": {
                            "kind": "component",
                            "file": "src/components/Navigation.jsx",
                            "notes": "Update the About anchor href.",
                        },
                    },
                    {
                        "key": "client_portal_label",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Navigation.jsx",
                            "anchor": "Navigation.link.19",
                        },
                    },
                    {
                        "key": "client_portal_href",
                        "type": "url",
                        "source": {
                            "kind": "component",
                            "file": "src/components/Navigation.jsx",
                            "notes": "Update the Client Portal anchor href.",
                        },
                    },
                    {
                        "key": "contact_label",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Navigation.jsx",
                            "anchor": "Navigation.link.20",
                        },
                    },
                    {
                        "key": "contact_href",
                        "type": "url",
                        "source": {
                            "kind": "component",
                            "file": "src/components/Navigation.jsx",
                            "notes": "Update the Contact anchor href.",
                        },
                    },
                ],
            },
            {
                "name": "services_dropdown",
                "type": "repeater",
                "description": "Three-column services drop-down that appears under the Services menu.",
                "source": {
                    "kind": "ppid",
                    "component": "components/Navigation.jsx",
                    "anchor": "Navigation.cta.1",
                },
                "fields": [
                    {
                        "key": "column_one_heading",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Navigation.jsx",
                            "anchor": "Navigation.heading.1",
                        },
                    },
                    {
                        "key": "column_one_links",
                        "type": "list",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Navigation.jsx",
                            "anchor": "Navigation.list.2",
                        },
                    },
                    {
                        "key": "column_two_heading",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Navigation.jsx",
                            "anchor": "Navigation.heading.2",
                        },
                    },
                    {
                        "key": "column_two_links",
                        "type": "list",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Navigation.jsx",
                            "anchor": "Navigation.list.3",
                        },
                    },
                    {
                        "key": "column_three_heading",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Navigation.jsx",
                            "anchor": "Navigation.heading.3",
                        },
                    },
                    {
                        "key": "column_three_links",
                        "type": "list",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Navigation.jsx",
                            "anchor": "Navigation.list.4",
                        },
                    },
                ],
            },
            {
                "name": "secondary_dropdown",
                "type": "repeater",
                "description": "Secondary assistance drop-down (Get Started menu).",
                "source": {
                    "kind": "ppid",
                    "component": "components/Navigation.jsx",
                    "anchor": "Navigation.list.5",
                },
                "fields": [
                    {
                        "key": "label",
                        "type": "text",
                        "recommended_length": "1-4 words",
                    },
                    {
                        "key": "href",
                        "type": "url",
                        "source": {
                            "kind": "component",
                            "file": "src/components/Navigation.jsx",
                            "notes": "Adjust href values in the Get Started drop-down list.",
                        },
                    },
                ],
            },
            {
                "name": "header_primary_cta",
                "type": "cta",
                "description": "Primary call-to-action button displayed to the right of the navigation links.",
                "source": {
                    "kind": "ppid",
                    "component": "components/Navigation.jsx",
                    "anchor": "Navigation.link.21",
                },
                "fields": [
                    {
                        "key": "label",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Navigation.jsx",
                            "anchor": "Navigation.link.21",
                        },
                    },
                    {
                        "key": "href",
                        "type": "url",
                        "source": {
                            "kind": "component",
                            "file": "src/components/Navigation.jsx",
                            "notes": "Update the header CTA Link href.",
                        },
                    },
                ],
            },
        ],
    },
    {
        "key": "horizon_home_hero",
        "label": "Hero with video backdrop and dual call-to-action",
        "category": "hero",
        "description": (
            "Immersive hero section featuring animated video background, eyebrow, split headline, "
            "supporting copy, value props, and stacked call-to-actions."
        ),
        "component": "src/components/Hero.jsx",
        "section_id": "home--liberation-hero",
        "tags": ["variant:default", "variant:ada"],
        "content_slots": [
            {
                "name": "eyebrow",
                "type": "text",
                "recommended_length": "≤40 characters",
                "source": {
                    "kind": "ppid",
                    "component": "components/Hero.jsx",
                    "anchor": "Hero.inline.1",
                },
            },
            {
                "name": "headline_primary",
                "type": "rich_text",
                "recommended_length": "≤90 characters",
                "source": {
                    "kind": "ppid",
                    "component": "components/Hero.jsx",
                    "anchor": "Hero.inline.2",
                },
            },
            {
                "name": "headline_accent",
                "type": "text",
                "recommended_length": "1-3 words",
                "source": {
                    "kind": "ppid",
                    "component": "components/Hero.jsx",
                    "anchor": "Hero.inline.3",
                },
            },
            {
                "name": "supporting_copy",
                "type": "text",
                "recommended_length": "≤160 characters",
                "source": {
                    "kind": "ppid",
                    "component": "components/Hero.jsx",
                    "anchor": "Hero.body.1",
                },
            },
            {
                "name": "value_props",
                "type": "list",
                "description": "Three supporting value statements rendered with heart icons.",
                "fields": [
                    {
                        "key": "item_1",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Hero.jsx",
                            "anchor": "Hero.inline.4",
                        },
                    },
                    {
                        "key": "item_2",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Hero.jsx",
                            "anchor": "Hero.inline.5",
                        },
                    },
                    {
                        "key": "item_3",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Hero.jsx",
                            "anchor": "Hero.inline.6",
                        },
                    },
                ],
            },
            {
                "name": "primary_cta",
                "type": "cta",
                "source": {
                    "kind": "ppid",
                    "component": "components/Hero.jsx",
                    "anchor": "Hero.link.1",
                },
                "fields": [
                    {
                        "key": "label",
                        "type": "text",
                        "recommended_length": "2-4 words",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Hero.jsx",
                            "anchor": "Hero.link.1",
                        },
                    },
                    {
                        "key": "href",
                        "type": "url",
                        "source": {
                            "kind": "component",
                            "file": "src/components/Hero.jsx",
                            "notes": "Update the consultation Link href in the primary CTA.",
                        },
                    },
                ],
            },
            {
                "name": "secondary_cta",
                "type": "cta",
                "source": {
                    "kind": "ppid",
                    "component": "components/Hero.jsx",
                    "anchor": "Hero.link.2",
                },
                "fields": [
                    {
                        "key": "label",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Hero.jsx",
                            "anchor": "Hero.link.2",
                        },
                    },
                    {
                        "key": "href",
                        "type": "url",
                        "source": {
                            "kind": "component",
                            "file": "src/components/Hero.jsx",
                            "notes": "Adjust the learn more anchor href.",
                        },
                    },
                ],
            },
            {
                "name": "credential_banner",
                "type": "list",
                "description": "Professional credentials displayed beneath the CTAs.",
                "source": {
                    "kind": "ppid",
                    "component": "components/Hero.jsx",
                    "anchor": "Hero.body.2",
                },
                "fields": [
                    {
                        "key": "headline",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Hero.jsx",
                            "anchor": "Hero.body.2",
                        },
                    },
                    {
                        "key": "credential_primary",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Hero.jsx",
                            "anchor": "Hero.inline.7",
                        },
                    },
                    {
                        "key": "credential_secondary",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Hero.jsx",
                            "anchor": "Hero.inline.9",
                        },
                    },
                    {
                        "key": "credential_tertiary",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Hero.jsx",
                            "anchor": "Hero.inline.11",
                        },
                    },
                ],
            },
        ],
    },
    {
        "key": "horizon_home_services",
        "label": "Services grid with repeater data",
        "category": "services",
        "description": (
            "Service overview featuring three animated cards sourced from the services data file and "
            "a secondary composition describing specialized treatments."
        ),
        "component": "src/components/Services.jsx",
        "section_id": "home--services-overview",
        "data_dependencies": ["src/data/services.js"],
        "content_slots": [
            {
                "name": "section_heading",
                "type": "text",
                "source": {
                    "kind": "ppid",
                    "component": "components/Services.jsx",
                    "anchor": "Services.heading.1",
                },
            },
            {
                "name": "section_body",
                "type": "text",
                "source": {
                    "kind": "ppid",
                    "component": "components/Services.jsx",
                    "anchor": "Services.body.1",
                },
            },
            {
                "name": "service_groups",
                "type": "repeater",
                "description": "Cards populated from serviceGroups in src/data/services.js.",
                "source": {
                    "kind": "data_file",
                    "file": "src/data/services.js",
                    "export": "serviceGroups",
                },
                "fields": [
                    {
                        "key": "title",
                        "type": "text",
                        "recommended_length": "2-4 words",
                    },
                    {
                        "key": "description",
                        "type": "text",
                        "recommended_length": "≤180 characters",
                    },
                    {
                        "key": "services",
                        "type": "list",
                        "description": "Bullet list under each card.",
                    },
                    {
                        "key": "cta_label",
                        "type": "text",
                        "recommended_length": "2-3 words",
                    },
                    {
                        "key": "cta_href",
                        "type": "url",
                    },
                ],
            },
            {
                "name": "specialized_heading",
                "type": "text",
                "source": {
                    "kind": "ppid",
                    "component": "components/Services.jsx",
                    "anchor": "Services.heading.2",
                },
            },
            {
                "name": "specialized_subheading",
                "type": "text",
                "source": {
                    "kind": "ppid",
                    "component": "components/Services.jsx",
                    "anchor": "Services.body.2",
                },
            },
            {
                "name": "modality_cards_left",
                "type": "repeater",
                "description": "Detail cards in the left column of the specialized treatments grid.",
                "source": {
                    "kind": "ppid",
                    "component": "components/Services.jsx",
                    "anchor": "Services.heading.3",
                },
                "fields": [
                    {
                        "key": "title_primary",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Services.jsx",
                            "anchor": "Services.heading.3",
                        },
                    },
                    {
                        "key": "body_primary",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Services.jsx",
                            "anchor": "Services.body.3",
                        },
                    },
                    {
                        "key": "title_secondary",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Services.jsx",
                            "anchor": "Services.heading.4",
                        },
                    },
                    {
                        "key": "body_secondary",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Services.jsx",
                            "anchor": "Services.body.4",
                        },
                    },
                ],
            },
            {
                "name": "modality_cards_right",
                "type": "repeater",
                "description": "Detail cards in the right column of the specialized treatments grid.",
                "source": {
                    "kind": "ppid",
                    "component": "components/Services.jsx",
                    "anchor": "Services.heading.5",
                },
                "fields": [
                    {
                        "key": "title_primary",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Services.jsx",
                            "anchor": "Services.heading.5",
                        },
                    },
                    {
                        "key": "body_primary",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Services.jsx",
                            "anchor": "Services.body.5",
                        },
                    },
                    {
                        "key": "title_secondary",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Services.jsx",
                            "anchor": "Services.heading.6",
                        },
                    },
                    {
                        "key": "body_secondary",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Services.jsx",
                            "anchor": "Services.body.6",
                        },
                    },
                ],
            },
        ],
    },
    {
        "key": "horizon_home_why_choose_us",
        "label": "Why choose us feature grid",
        "category": "story",
        "description": (
            "Four-up reason grid with supporting lead copy and stat bar that reinforces trust signals."
        ),
        "component": "src/components/WhyChooseUs.jsx",
        "section_id": "home--why-choose",
        "content_slots": [
            {
                "name": "section_heading",
                "type": "text",
                "source": {
                    "kind": "ppid",
                    "component": "components/WhyChooseUs.jsx",
                    "anchor": "WhyChooseUs.heading.1",
                },
            },
            {
                "name": "section_body",
                "type": "text",
                "source": {
                    "kind": "ppid",
                    "component": "components/WhyChooseUs.jsx",
                    "anchor": "WhyChooseUs.body.1",
                },
            },
            {
                "name": "reasons",
                "type": "repeater",
                "description": "Four feature cards explaining the differentiators.",
                "source": {
                    "kind": "ppid",
                    "component": "components/WhyChooseUs.jsx",
                    "anchor": "WhyChooseUs.reasons.progressive-values.title",
                },
                "fields": [
                    {
                        "key": "title_progressive_values",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/WhyChooseUs.jsx",
                            "anchor": "WhyChooseUs.reasons.progressive-values.title",
                        },
                    },
                    {
                        "key": "description_progressive_values",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/WhyChooseUs.jsx",
                            "anchor": "WhyChooseUs.reasons.progressive-values.description",
                        },
                    },
                    {
                        "key": "title_inclusive_safe",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/WhyChooseUs.jsx",
                            "anchor": "WhyChooseUs.reasons.inclusive-safe.title",
                        },
                    },
                    {
                        "key": "description_inclusive_safe",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/WhyChooseUs.jsx",
                            "anchor": "WhyChooseUs.reasons.inclusive-safe.description",
                        },
                    },
                    {
                        "key": "title_secure_telehealth",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/WhyChooseUs.jsx",
                            "anchor": "WhyChooseUs.reasons.secure-telehealth.title",
                        },
                    },
                    {
                        "key": "description_secure_telehealth",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/WhyChooseUs.jsx",
                            "anchor": "WhyChooseUs.reasons.secure-telehealth.description",
                        },
                    },
                    {
                        "key": "title_easy_scheduling",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/WhyChooseUs.jsx",
                            "anchor": "WhyChooseUs.reasons.easy-scheduling.title",
                        },
                    },
                    {
                        "key": "description_easy_scheduling",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/WhyChooseUs.jsx",
                            "anchor": "WhyChooseUs.reasons.easy-scheduling.description",
                        },
                    },
                ],
            },
            {
                "name": "stat_bar",
                "type": "list",
                "description": "Four trust-building stats displayed below the reason grid.",
                "fields": [
                    {
                        "key": "years_experience",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/WhyChooseUs.jsx",
                            "anchor": "WhyChooseUs.body.2",
                        },
                    },
                    {
                        "key": "years_experience_label",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/WhyChooseUs.jsx",
                            "anchor": "WhyChooseUs.body.3",
                        },
                    },
                    {
                        "key": "emdr",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/WhyChooseUs.jsx",
                            "anchor": "WhyChooseUs.body.4",
                        },
                    },
                    {
                        "key": "emdr_label",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/WhyChooseUs.jsx",
                            "anchor": "WhyChooseUs.body.5",
                        },
                    },
                    {
                        "key": "confidential",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/WhyChooseUs.jsx",
                            "anchor": "WhyChooseUs.body.6",
                        },
                    },
                    {
                        "key": "confidential_label",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/WhyChooseUs.jsx",
                            "anchor": "WhyChooseUs.body.7",
                        },
                    },
                    {
                        "key": "licensed",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/WhyChooseUs.jsx",
                            "anchor": "WhyChooseUs.body.8",
                        },
                    },
                    {
                        "key": "licensed_label",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/WhyChooseUs.jsx",
                            "anchor": "WhyChooseUs.body.9",
                        },
                    },
                ],
            },
        ],
    },
    {
        "key": "horizon_home_testimonials",
        "label": "Rotating testimonials carousel",
        "category": "testimonials",
        "description": (
            "Auto-advancing testimonial slider with pause control, navigation buttons, and disclosure note."
        ),
        "component": "src/components/Testimonials.jsx",
        "section_id": "home--stories",
        "data_dependencies": ["src/data/testimonials.js"],
        "content_slots": [
            {
                "name": "section_heading",
                "type": "text",
                "source": {
                    "kind": "ppid",
                    "component": "components/Testimonials.jsx",
                    "anchor": "Testimonials.heading.1",
                },
            },
            {
                "name": "section_body",
                "type": "text",
                "source": {
                    "kind": "ppid",
                    "component": "components/Testimonials.jsx",
                    "anchor": "Testimonials.body.1",
                },
            },
            {
                "name": "testimonials",
                "type": "repeater",
                "description": "List of testimonial entries powering the carousel.",
                "source": {
                    "kind": "data_file",
                    "file": "src/data/testimonials.js",
                    "export": "testimonials",
                },
                "fields": [
                    {"key": "quote", "type": "text"},
                    {"key": "name", "type": "text"},
                    {"key": "identity", "type": "text"},
                    {"key": "rating", "type": "number"},
                ],
            },
            {
                "name": "controls",
                "type": "cta",
                "description": "Carousel control labels and button text.",
                "source": {
                    "kind": "ppid",
                    "component": "components/Testimonials.jsx",
                    "anchor": "Testimonials.cta.3",
                },
                "fields": [
                    {
                        "key": "pause_label",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Testimonials.jsx",
                            "anchor": "Testimonials.cta.3",
                        },
                    },
                ],
            },
            {
                "name": "disclosure",
                "type": "text",
                "source": {
                    "kind": "ppid",
                    "component": "components/Testimonials.jsx",
                    "anchor": "Testimonials.body.2",
                },
            },
        ],
    },
    {
        "key": "horizon_home_final_cta",
        "label": "Final call-to-action with contact methods",
        "category": "cta",
        "description": (
            "Closing section providing three engagement cards, availability details, and crisis disclaimer "
            "over a gradient background."
        ),
        "component": "src/components/FinalCTA.jsx",
        "section_id": "home--closing-invite",
        "tags": ["variant:default", "variant:ada"],
        "content_slots": [
            {
                "name": "headline",
                "type": "rich_text",
                "source": {
                    "kind": "ppid",
                    "component": "components/FinalCTA.jsx",
                    "anchor": "FinalCTA.heading.1",
                },
            },
            {
                "name": "headline_accent",
                "type": "text",
                "source": {
                    "kind": "ppid",
                    "component": "components/FinalCTA.jsx",
                    "anchor": "FinalCTA.inline.1",
                },
            },
            {
                "name": "supporting_copy",
                "type": "text",
                "source": {
                    "kind": "ppid",
                    "component": "components/FinalCTA.jsx",
                    "anchor": "FinalCTA.body.1",
                },
            },
            {
                "name": "cta_cards",
                "type": "repeater",
                "description": "Three cards offering consultation, contact form, and scheduling options.",
                "fields": [
                    {
                        "key": "consultation_title",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/FinalCTA.jsx",
                            "anchor": "FinalCTA.heading.2",
                        },
                    },
                    {
                        "key": "consultation_body",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/FinalCTA.jsx",
                            "anchor": "FinalCTA.body.2",
                        },
                    },
                    {
                        "key": "consultation_cta",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/FinalCTA.jsx",
                            "anchor": "FinalCTA.link.1",
                        },
                    },
                    {
                        "key": "consultation_href",
                        "type": "url",
                        "source": {
                            "kind": "component",
                            "file": "src/components/FinalCTA.jsx",
                            "notes": "Update the consultation Link href attribute.",
                        },
                    },
                    {
                        "key": "message_title",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/FinalCTA.jsx",
                            "anchor": "FinalCTA.heading.3",
                        },
                    },
                    {
                        "key": "message_body",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/FinalCTA.jsx",
                            "anchor": "FinalCTA.body.3",
                        },
                    },
                    {
                        "key": "message_cta",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/FinalCTA.jsx",
                            "anchor": "FinalCTA.link.2",
                        },
                    },
                    {
                        "key": "message_href",
                        "type": "url",
                        "source": {
                            "kind": "component",
                            "file": "src/components/FinalCTA.jsx",
                            "notes": "Update the contact form Link href attribute.",
                        },
                    },
                    {
                        "key": "calendar_title",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/FinalCTA.jsx",
                            "anchor": "FinalCTA.heading.4",
                        },
                    },
                    {
                        "key": "calendar_body",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/FinalCTA.jsx",
                            "anchor": "FinalCTA.body.4",
                        },
                    },
                    {
                        "key": "calendar_cta",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/FinalCTA.jsx",
                            "anchor": "FinalCTA.link.3",
                        },
                    },
                    {
                        "key": "calendar_href",
                        "type": "url",
                        "source": {
                            "kind": "component",
                            "file": "src/components/FinalCTA.jsx",
                            "notes": "Update the calendar Link href attribute.",
                        },
                    },
                ],
            },
            {
                "name": "service_area",
                "type": "text",
                "source": {
                    "kind": "ppid",
                    "component": "components/FinalCTA.jsx",
                    "anchor": "FinalCTA.inline.2",
                },
            },
            {
                "name": "availability",
                "type": "list",
                "description": "Hours of operation.",
                "fields": [
                    {
                        "key": "heading",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/FinalCTA.jsx",
                            "anchor": "FinalCTA.heading.5",
                        },
                    },
                    {
                        "key": "weekday_hours",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/FinalCTA.jsx",
                            "anchor": "FinalCTA.body.5",
                        },
                    },
                    {
                        "key": "friday_hours",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/FinalCTA.jsx",
                            "anchor": "FinalCTA.body.6",
                        },
                    },
                    {
                        "key": "weekend_hours",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/FinalCTA.jsx",
                            "anchor": "FinalCTA.body.7",
                        },
                    },
                ],
            },
            {
                "name": "expectations",
                "type": "list",
                "description": "Bullet list describing what clients can expect.",
                "fields": [
                    {
                        "key": "heading",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/FinalCTA.jsx",
                            "anchor": "FinalCTA.heading.6",
                        },
                    },
                    {
                        "key": "item_1",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/FinalCTA.jsx",
                            "anchor": "FinalCTA.body.8",
                        },
                    },
                    {
                        "key": "item_2",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/FinalCTA.jsx",
                            "anchor": "FinalCTA.body.9",
                        },
                    },
                    {
                        "key": "item_3",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/FinalCTA.jsx",
                            "anchor": "FinalCTA.body.10",
                        },
                    },
                ],
            },
            {
                "name": "crisis_disclaimer",
                "type": "text",
                "source": {
                    "kind": "ppid",
                    "component": "components/FinalCTA.jsx",
                    "anchor": "FinalCTA.body.11",
                },
            },
        ],
    },
    {
        "key": "horizon_footer_primary",
        "label": "Comprehensive footer with resource links",
        "category": "footer",
        "description": (
            "Footer spanning brand summary, quick links, resources, client portal access, licensing details, and legal text."
        ),
        "component": "src/components/Footer.jsx",
        "section_id": "global--footer",
        "content_slots": [
            {
                "name": "brand_heading",
                "type": "text",
                "source": {
                    "kind": "ppid",
                    "component": "components/Footer.jsx",
                    "anchor": "Footer.heading.1",
                },
            },
            {
                "name": "brand_tagline",
                "type": "text",
                "source": {
                    "kind": "ppid",
                    "component": "components/Footer.jsx",
                    "anchor": "Footer.body.1",
                },
            },
            {
                "name": "brand_summary",
                "type": "text",
                "source": {
                    "kind": "ppid",
                    "component": "components/Footer.jsx",
                    "anchor": "Footer.body.2",
                },
            },
            {
                "name": "contact_details",
                "type": "list",
                "description": "Contact and location entries.",
                "fields": [
                    {
                        "key": "service_area",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Footer.jsx",
                            "anchor": "Footer.inline.1",
                        },
                    },
                    {
                        "key": "phone",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Footer.jsx",
                            "anchor": "Footer.inline.2",
                        },
                    },
                    {
                        "key": "email",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Footer.jsx",
                            "anchor": "Footer.inline.3",
                        },
                    },
                ],
            },
            {
                "name": "quick_links",
                "type": "list",
                "description": "First column of navigational links.",
                "source": {
                    "kind": "ppid",
                    "component": "components/Footer.jsx",
                    "anchor": "Footer.list.1",
                },
            },
            {
                "name": "resources_links",
                "type": "list",
                "description": "Second column of resources links.",
                "source": {
                    "kind": "ppid",
                    "component": "components/Footer.jsx",
                    "anchor": "Footer.list.2",
                },
            },
            {
                "name": "cta_buttons",
                "type": "list",
                "description": "Client portal and get started buttons above the legal strip.",
                "fields": [
                    {
                        "key": "client_portal_label",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Footer.jsx",
                            "anchor": "Footer.link.11",
                        },
                    },
                    {
                        "key": "get_started_label",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Footer.jsx",
                            "anchor": "Footer.link.12",
                        },
                    },
                ],
            },
            {
                "name": "license_statement",
                "type": "text",
                "source": {
                    "kind": "ppid",
                    "component": "components/Footer.jsx",
                    "anchor": "Footer.body.3",
                },
            },
            {
                "name": "copyright",
                "type": "text",
                "source": {
                    "kind": "ppid",
                    "component": "components/Footer.jsx",
                    "anchor": "Footer.body.4",
                },
            },
            {
                "name": "legal_links",
                "type": "list",
                "description": "Terms, privacy, accessibility links.",
                "fields": [
                    {
                        "key": "terms",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Footer.jsx",
                            "anchor": "Footer.link.13",
                        },
                    },
                    {
                        "key": "privacy",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Footer.jsx",
                            "anchor": "Footer.link.14",
                        },
                    },
                    {
                        "key": "accessibility",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Footer.jsx",
                            "anchor": "Footer.link.15",
                        },
                    },
                ],
            },
            {
                "name": "legal_disclosures",
                "type": "list",
                "description": "Screen-reader only legal text.",
                "fields": [
                    {
                        "key": "terms_details",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Footer.jsx",
                            "anchor": "Footer.body.5",
                        },
                    },
                    {
                        "key": "privacy_details",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Footer.jsx",
                            "anchor": "Footer.body.6",
                        },
                    },
                    {
                        "key": "accessibility_details",
                        "type": "text",
                        "source": {
                            "kind": "ppid",
                            "component": "components/Footer.jsx",
                            "anchor": "Footer.body.7",
                        },
                    },
                ],
            },
            {
                "name": "crisis_footer",
                "type": "text",
                "source": {
                    "kind": "ppid",
                    "component": "components/Footer.jsx",
                    "anchor": "Footer.body.8",
                },
            },
        ],
    },
]
