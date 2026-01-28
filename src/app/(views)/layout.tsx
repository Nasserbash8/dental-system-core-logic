'use client'
import NextTopLoader from 'nextjs-toploader';
import { ArrowUpIcon } from '@/icons';
import Footer from '@/layout/viewsLayout/Footer';
import MainHeader from '@/layout/viewsLayout/Header';
import type { ReactNode } from 'react';
import ScrollToTop from "react-scroll-to-top";
import GlobalLoader from '@/components/ui/GlobalLoader';


export default function WebsiteLayout({ children }: { children: ReactNode }) {
  return (

      <div>
        <NextTopLoader 
        color="#d3ab49" 
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        showSpinner={false} // يمكنك تفعيله إذا أردت سبينر بجانب الخط
      />
      <GlobalLoader />
        <MainHeader />
        <main className="">{children}</main>
        <ScrollToTop smooth 
        style={{
          backgroundColor: "#d3ab49",
          color: "#fff",
          borderRadius: "50%",
          padding: "10px",

        }}
        component={
          <div className="flex items-center justify-center w-full h-full">
            <ArrowUpIcon className="text-white text-xl" />
          </div>
        }
     
        />
        <Footer/>
      </div>
  );
}
