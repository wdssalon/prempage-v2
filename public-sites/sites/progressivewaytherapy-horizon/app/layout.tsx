import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Progressive Way Therapy | Warmway Connect",
  description: "Progressive, inclusive therapy for LGBTQIA+, BIPOC, and marginalized communities across Texas.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground font-body">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
