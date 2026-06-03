import type { Metadata } from "next";
import { Libre_Baskerville, Source_Sans_3 } from "next/font/google";

import "./globals.css";

const serif = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
});

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Faultline AI — Campaign Red-Team",
  description:
    "Predict marketing campaign backlash before launch with AI red-team analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-stone-100 font-sans text-stone-900 antialiased">
        {children}
      </body>
    </html>
  );
}
