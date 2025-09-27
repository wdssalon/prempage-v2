"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "#services", label: "Services" },
  { href: "#why-us", label: "Why Us" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-background/80 backdrop-blur">
      <div className="section-wrapper flex items-center justify-between py-4">
        <Link href="/" className="heading text-xl">
          Horizon Studio
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-foreground/70 hover:text-foreground">
              {item.label}
            </Link>
          ))}
          <Button size="sm">Book a session</Button>
        </nav>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((prev) => !prev)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      <div className={cn("border-t border-foreground/10 bg-background/95 transition-all md:hidden", open ? "max-h-64" : "max-h-0 overflow-hidden")}
        aria-hidden={!open}
      >
        <div className="section-wrapper flex flex-col gap-4 py-4">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="text-base font-medium" onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Button onClick={() => setOpen(false)}>Book a session</Button>
        </div>
      </div>
    </header>
  );
}
