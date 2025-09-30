import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Updated Title (Browser Tab)
  title: "SymptomMed - Modern Next.js Project Scaffold", 

  // Updated Description (SEO) - Removed AI references
  description: "A comprehensive modern Next.js scaffold built with TypeScript, Tailwind CSS, and shadcn/ui. Created by Reubenson Adat.",
  
  // Updated Keywords - Removed AI references
  keywords: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "React", "Web Development"],
  
  // Updated Author
  authors: [{ name: "Reubenson Adat" }],
  
  // --- OPEN GRAPH CONFIGURATION (Link Preview) ---
  openGraph: {
    // Updated Title for the Link Preview
    title: "SymptomMed - Project Scaffold", 
    
    // Updated Description for the Link Preview - Removed AI references
    description: "Modern web development project built with React and Next.js.",
    
    // Kept original URL (Update this if the URL changes!)
    url: "https://chat.z.ai",
    
    // Updated Site Name
    siteName: "SymptomMed",
    type: "website",
    // NOTE: You should add an 'images' array here if you want a custom image in the link preview
  },
  
  // --- TWITTER CARD CONFIGURATION ---
  twitter: {
    card: "summary_large_image",
    // Updated Title for Twitter Card
    title: "SymptomMed - Project Scaffold",
    
    // Updated Description for Twitter Card - Removed AI references
    description: "Modern web development project built with React and Next.js.",
    // NOTE: You should add an 'images' property here for the Twitter Card image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
