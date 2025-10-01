import { Fraunces, Lora } from "next/font/google";
import "./globals.css";

const serifFont = Fraunces({
  subsets: [
    "latin"
  ],
  display: "swap",
  variable: "--font-serif"
});
const bodyFont = Lora({
  subsets: [
    "latin"
  ],
  display: "swap",
  variable: "--font-body"
});

export const metadata = {
  title: "Horizon Example | Horizon Template",
  description: "Reference site generated for quick regression testing",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${serifFont.variable} ${bodyFont.variable}`}>
      <body className="bg-base text-copy font-body">{children}</body>
    </html>
  );
}
