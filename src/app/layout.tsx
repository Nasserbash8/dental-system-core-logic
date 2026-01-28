
import './globals.css';
import type { Metadata } from 'next'
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import ClientSessionProvider from './ClientSessionProvider ';
import { cairo } from '../fonts'




export const metadata: Metadata = {
  title: "Mada Dental Clinic",
  description: "عيادة مدى السنية - الطبيب طبيبين والخبرة خبرتين",
  icons: {
    icon: "/favicon.svg", // Must be in public folder
  },
};




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir='rtl' >
      <body className={cairo.className}>
      <ClientSessionProvider>
        <ThemeProvider>
   
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </ClientSessionProvider>
   
    
      
      </body>
    </html>
  );
}
