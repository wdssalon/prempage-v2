import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "Progressive Way Therapy | Horizon Template",
  description:
    "Progressive, inclusive therapy for LGBTQIA+, BIPOC, and marginalized communities across Texas.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-background text-foreground font-body">
        {children}
      </body>
    </html>
  );
}
