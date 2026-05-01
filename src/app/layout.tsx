import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// SITE_KEY populated after Mega Admin site registration
const SITE_KEY = "PENDING_SITE_KEY";
const GTM_ID = "GTM-TWQQT5LF";
const PIXEL_ID = "894485915971225";

export const metadata: Metadata = {
  title: "Custom Blinds & Shades | Free Installation + Smart Home Integration — Blinds Crafter NJ",
  description:
    "Northern NJ's premium custom window treatment specialists. Get free installation, BOGO free motorization, and free smart home integration (Alexa, Google Home, HomeKit). Request your free consultation today.",
  openGraph: {
    title: "Free Installation + Smart Home Integration | Blinds Crafter NJ",
    description:
      "Custom blinds, shades & motorized window treatments for NJ homes. Free installation, BOGO motorization. Book your free consultation.",
    images: ["/images/logo-white.webp"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* MegaTag + GTM + Pixel config */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.MEGA_TAG_CONFIG={siteKey:"${SITE_KEY}",gtmId:"${GTM_ID}",pixelId:"${PIXEL_ID}"};`,
          }}
        />
        <script
          src="https://cdn.gomega.ai/scripts/optimizer.min.js"
          async
        />
        {/* GTM head snippet */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
      </head>
      <body className="antialiased">
        {/* GTM noscript */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
