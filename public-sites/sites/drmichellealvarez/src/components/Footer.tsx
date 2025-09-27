import Link from "next/link";

const footerLinks = [
  {
    title: "Company",
    items: [
      { label: "About", href: "#about" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Blog", href: "#" },
      { label: "Style guide", href: "/style-guide" },
      { label: "Support", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-foreground/10 bg-background/80">
      <div className="section-wrapper grid gap-8 py-12 md:grid-cols-3">
        <div>
          <p className="heading text-xl">Horizon Studio</p>
          <p className="text mt-4 max-w-sm">
            Next.js boilerplate with Tailwind, Radix UI, and Sonner notifications so you can focus on adapting copy and
            visuals.
          </p>
        </div>
        {footerLinks.map((group) => (
          <div key={group.title}>
            <p className="heading text-lg">{group.title}</p>
            <ul className="mt-4 space-y-2 text-sm text-foreground/70">
              {group.items.map((item) => (
                <li key={item.label}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-foreground/10 py-6 text-center text-xs text-foreground/60">
        © {new Date().getFullYear()} Prempage. Built with the Horizon template system.
      </div>
    </footer>
  );
}
