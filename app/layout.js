import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import header from "@/components/header";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Traf",
  description: "Your One Stop finance Tracker",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={`${inter.className} min-h-screen relative z-10`}>
          {/*<Background />*/}
          {/* <AnimatedBackground /> */}
        {/*header*/}
        <Header />
        <main className="min-h-screen ">
        {children}
        </main>
        <Toaster richColors />
        <footer className="bg-blue-100 flex justify-center items-center py-12">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>Made with 💗 by Bidhan</p>
          </div>
        </footer>
      </body>
    </html>
    </ClerkProvider>
  );
}
