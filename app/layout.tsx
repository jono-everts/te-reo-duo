// For adding custom fonts with other frameworks, see:
// https://tailwindcss.com/docs/font-family
import type { Metadata } from "next";
import { Outfit, Space_Mono } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";

const fontSans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Te Reo Duo",
  description: "Learn te reo Māori",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontSans.variable} ${fontMono.variable} antialiased`}>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
