import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/components/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdZone from '@/components/AdZone';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'TechyBlog - Programming for Beginners',
    template: '%s | TechyBlog',
  },
  description: 'Learn programming basics with TechyBlog. Clear, concise, and beginner-friendly guides for aspiring developers.',
  keywords: ['programming', 'coding', 'web development', 'beginners', 'tutorials', 'techyblog'],
  authors: [{ name: 'Ashish Choudhary' }],
  creator: 'Ashish Choudhary',
  publisher: 'TechyBlog',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'TechyBlog',
    title: 'TechyBlog - Programming for Beginners',
    description: 'Learn programming basics with TechyBlog. Clear, concise, and beginner-friendly guides.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TechyBlog - Programming for Beginners',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TechyBlog - Programming for Beginners',
    description: 'Learn programming basics with TechyBlog. Clear, concise, and beginner-friendly guides.',
    images: ['/og-image.png'],
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
  other: {
    '924d5f05cb83fcbf71c10fb12d0d0ae510b5abe5': '924d5f05cb83fcbf71c10fb12d0d0ae510b5abe5',
  },
};

import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme={false}
        >
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              {/* Bottom Ad Slot */}
              <div className="container mx-auto px-4 mt-8">
                <AdZone id="bottom-ad-zone" />
              </div>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>

        {/* Ad Network Script */}
        <Script
          id="ad-network-script"
          src="/ad-script.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
