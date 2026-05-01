import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const SITE_KEY = "ts6zcypbx5mjybwa";
const GTM_ID = "GTM-TWQQT5LF";
const PIXEL_ID = "894485915971225";

export const metadata: Metadata = {
  title: "Custom Blinds, Shades & Motorized Window Treatments | Free Installation — Blinds Crafter NJ",
  description:
    "Northern NJ's premium window treatment specialists. Custom blinds, shades, and motorized treatments with free professional installation, BOGO free motorization, and free smart home integration. Request your free in-home consultation.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.png", sizes: "270x270", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  openGraph: {
    title: "Free Installation + BOGO Motorization | Blinds Crafter NJ",
    description:
      "Custom blinds, shades & motorized window treatments for NJ homes valued $700k+. Free installation, BOGO motorization, free smart home integration (Alexa, Google Home, HomeKit).",
    images: ["/images/logo-white.webp"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        {/* MegaTag config */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.MEGA_TAG_CONFIG={siteKey:"${SITE_KEY}",gtmId:"${GTM_ID}",pixelId:"${PIXEL_ID}"};`,
          }}
        />
        {/* MegaTag optimizer */}
        <script src="https://cdn.gomega.ai/scripts/optimizer.min.js" async />
        {/* GTM */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        {/* CTM */}
        <script src="https://572388.tctm.co/t.js" async />
      </head>
      <body className="antialiased">
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
