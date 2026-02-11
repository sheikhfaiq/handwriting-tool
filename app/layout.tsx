import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Playfair_Display,
  Pacifico,
  Indie_Flower,
  Caveat,
  Shadows_Into_Light,
  Dancing_Script,
  Permanent_Marker,
  Sacramento,
  Gloria_Hallelujah,
  Kalam,
  Patrick_Hand,
  Architects_Daughter,
  Cedarville_Cursive,
  Homemade_Apple,
  Schoolbell,
  Satisfy,
  Crafty_Girls,
  Swanky_and_Moo_Moo
} from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/admin/AuthProvider";
import ScrollToTop from "@/components/site/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  weight: "400",
  subsets: ["latin"],
});

const indieFlower = Indie_Flower({
  variable: "--font-indie-flower",
  weight: "400",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const shadowsIntoLight = Shadows_Into_Light({
  variable: "--font-shadows",
  weight: "400",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
});

const permanentMarker = Permanent_Marker({
  variable: "--font-permanent",
  weight: "400",
  subsets: ["latin"],
});

const sacramento = Sacramento({
  variable: "--font-sacramento",
  weight: "400",
  subsets: ["latin"],
});

const gloriaHallelujah = Gloria_Hallelujah({
  variable: "--font-gloria",
  weight: "400",
  subsets: ["latin"],
});

const kalam = Kalam({
  variable: "--font-kalam",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

const patrickHand = Patrick_Hand({
  variable: "--font-patrick",
  weight: "400",
  subsets: ["latin"],
});

const architectsDaughter = Architects_Daughter({
  variable: "--font-architects",
  weight: "400",
  subsets: ["latin"],
});

const cedarville = Cedarville_Cursive({
  variable: "--font-cedarville",
  weight: "400",
  subsets: ["latin"],
});

const homemade = Homemade_Apple({
  variable: "--font-homemade",
  weight: "400",
  subsets: ["latin"],
});

const schoolbell = Schoolbell({
  variable: "--font-schoolbell",
  weight: "400",
  subsets: ["latin"],
});

const satisfy = Satisfy({
  variable: "--font-satisfy",
  weight: "400",
  subsets: ["latin"],
});

const craftyGirls = Crafty_Girls({
  variable: "--font-crafty-girls",
  weight: "400",
  subsets: ["latin"],
});

const swankyMoo = Swanky_and_Moo_Moo({
  variable: "--font-swanky-moo",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://textohandwritting.com'),
  title: {
    default: "Text To Handwriting - Free Online Handwriting Converter",
    template: "%s | Text To Handwriting"
  },
  description: "Convert typed text into beautiful handwriting instantly. Free online tool with multiple handwriting styles, customizable fonts, colors, and paper backgrounds.",
  authors: [{ name: "Text To Handwriting" }],
  creator: "Text To Handwriting",
  publisher: "Text To Handwriting",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.png",
  },
  verification: {
    google: "sYyL-HutKxE8l_JAGNFffrEIZeuSYxeva4ibIGTePu8",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://textohandwritting.com",
    title: "Text To Handwriting - Free Online Handwriting Converter",
    description: "Convert text into beautiful handwriting instantly with customizable fonts, colors, and paper backgrounds. Free online tool with various styles.",
    siteName: "Text To Handwriting",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Text To Handwriting Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Text To Handwriting - Free Online Handwriting Converter",
    description: "Convert typed text into beautiful handwriting instantly. Free online tool with multiple handwriting styles.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${pacifico.variable}
          ${indieFlower.variable} ${caveat.variable} ${shadowsIntoLight.variable} ${dancingScript.variable}
          ${permanentMarker.variable} ${sacramento.variable} ${gloriaHallelujah.variable} ${kalam.variable}
          ${patrickHand.variable} ${architectsDaughter.variable}
          ${cedarville.variable} ${homemade.variable} ${schoolbell.variable}
          ${satisfy.variable} ${craftyGirls.variable} ${swankyMoo.variable}
          antialiased
        `}
      >
        <AuthProvider>
          {children}
          <ScrollToTop />
        </AuthProvider>
      </body>
    </html>
  );
}
