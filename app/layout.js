// import { Inter } from 'next/font/google'
import "./globals.css";

// const inter = Inter({ subsets: ['latin'] }) 
export const metadata = {
  title: "AETHER AI — Precision Intelligence",
  description: "Multi-mode AI workspace. Researcher & Co-Programmer.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className=  "bg-white text-black dark:bg-gray-900 dark:text-white"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
