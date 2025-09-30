import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const serifFont = Playfair_Display({
  subsets: [
    "latin"
  ],
  display: "swap",
  variable: "--font-serif"
});
const bodyFont = Inter({
  subsets: [
    "latin"
  ],
  display: "swap",
  variable: "--font-body"
});

export const metadata = {
  title: "Progressive Way Therapy | Horizon Template",
  description: "Progressive, inclusive therapy for LGBTQIA+, BIPOC, and marginalized communities across Texas.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${serifFont.variable} ${bodyFont.variable}`}>
      <body className="bg-base text-copy font-body">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
