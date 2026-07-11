import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "ペラチャ",
  description: "AIで業務メッセージを整えて一枚画像にするリアルタイムチャット"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
