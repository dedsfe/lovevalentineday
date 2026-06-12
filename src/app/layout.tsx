import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
