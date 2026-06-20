import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shy — Distributors of Rossari Pet Care",
  description:
    "Shy is a distributor of Rossari Pet Care products in India. Premium dog food, cat food, grooming, supplements and more from Sniffy, Zippy, Toptail, Vetsense and Lozalo.",
  metadataBase: new URL("https://www.shycares.in"),
  openGraph: {
    title: "Shy — Rossari Pet Care Distributor",
    description:
      "Premium pet food, grooming, and health products from Rossari. Authorized distributor — Shy.",
    url: "https://www.shycares.in",
    siteName: "Shy",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shy — Rossari Pet Care",
    description: "Authorized distributor of Rossari Pet Care products.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
