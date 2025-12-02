import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BNK 챌린지",
  description: "BNK 챌린지 - AI 추천 미션을 완료하고 코인을 받으세요!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} antialiased`}>
        <div className="max-w-lg mx-auto bg-white min-h-screen shadow-lg">
          {children}
        </div>
      </body>
    </html>
  );
}
