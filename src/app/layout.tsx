import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LoveValentine — Presente digital personalizado para casais",
    template: "%s · LoveValentine",
  },
  description:
    "Crie um presente digital com a música, as fotos e a história de vocês. Pronto em 5 minutos, enviado por link no WhatsApp. Perfeito para Dia dos Namorados, aniversário de namoro e surpresas.",
  openGraph: {
    title: "LoveValentine — Presente digital personalizado para casais",
    description:
      "Uma página com a música, as fotos e a história de vocês. Pronta em 5 minutos, enviada por link no WhatsApp.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','1016548024058582');
          fbq('track','PageView');
        `}</Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{display:'none'}} src="https://www.facebook.com/tr?id=1016548024058582&ev=PageView&noscript=1" alt="" />
        </noscript>
      </body>
    </html>
  );
}
