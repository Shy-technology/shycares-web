import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shycares — Booking & microsites for pet care pros",
  description:
    "Beautiful microsites, online bookings, customer records, and reminders for solo pet groomers, boarders, and vets in India.",
  metadataBase: new URL("https://www.shycares.in"),
  openGraph: {
    title: "Shycares — Run your pet care business online",
    description:
      "Get a beautiful booking page, manage your calendar, and keep customers coming back. Built for solo pet care pros in India.",
    url: "https://www.shycares.in",
    siteName: "Shycares",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shycares",
    description: "Online booking and microsites for solo pet care pros.",
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
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
