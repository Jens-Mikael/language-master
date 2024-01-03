import Providers from "@/components/Providers";
import "./globals.css";
import { ubuntu } from "./fonts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
 
export const metadata = {
  title: 'Language Master',
  description: 'A App built with the puerpose of language mastery',
}


export default function RootLayout({ children }) {
  return (
    <html lang="en" className="">
      <Providers>
        <body
          className={`${ubuntu.className} bg-[#0A092D] text-white overflow-x-hidden`}
        >
          <div className="bg-[#0A092D] min-h-screen flex flex-col">
            <Navbar />
            <div className="px-7 py-10 sm:p-10 flex-1">{children}</div>
            <Footer />
          </div>
        </body>
      </Providers>
    </html>
  );
}
