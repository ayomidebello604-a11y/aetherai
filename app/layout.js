// import { Inter } from 'next/font/google'
import "./globals.css";

// const inter = Inter({ subsets: ['latin'] }) 
export const metadata = {
  title: "AETHER AI — Precision Intelligence",
  description: "Multi-mode AI workspace. Researcher & Co-Programmer.",
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28"><rect x=".5" y=".5" width="27" height="27" stroke="%23000" stroke-width="1" fill="%23fff"/><rect x="6" y="6" width="6" height="6" fill="%23000"/><rect x="16" y="6" width="6" height="6" fill="%23000"/><rect x="10" y="15" width="8" height="7" fill="%23000"/><line x1="9" y1="12" x2="9" y2="15" stroke="%23000" stroke-width="1.2"/><line x1="19" y1="12" x2="19" y2="15" stroke="%23000" stroke-width="1.2"/></svg>',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  },
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
