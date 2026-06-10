import "./globals.css";

// 1. Core metadata configuration (without viewport)
export const metadata = {
  title: "AETHER AI — Precision Intelligence",
  description: "Multi-mode AI workspace. Researcher & Co-Programmer.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: '/apple-touch-icon.svg',
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AETHER AI',
  },
};


// 2. Dedicated viewport configuration (fixes the Next.js warning)
export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="bg-white text-black dark:bg-gray-900 dark:text-white"
    >
      {/* 
        3. Keep <head> empty. Next.js automatically injects 
           the metadata and viewport settings configured above. 
      */}
      <head />
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
