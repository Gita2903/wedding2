import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { ThemeProvider } from "@/context/ThemeContext";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      <ThemeProvider>
        <div className="flex min-h-screen">
          {/* Left Side - Form (children) */}
          <div className="flex w-full flex-col justify-center px-4 sm:px-6 lg:w-1/2 lg:flex-none lg:px-20 xl:px-24">
            <div className="mx-auto w-full max-w-sm lg:w-96">
              {children}
            </div>
          </div>

          {/* Right Side - Image/Gradient */}
          <div className="relative hidden w-0 flex-1 lg:block">
            {/* Soft, romantic gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-theme-pink-500/20 via-brand-500/20 to-orange-300/20 dark:from-theme-pink-900/40 dark:via-brand-900/40 dark:to-orange-900/40" />
            
            {/* Decorative shapes */}
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-theme-pink-400/20 blur-3xl filter dark:bg-theme-pink-500/10" />
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-brand-400/20 blur-3xl filter dark:bg-brand-500/10" />

            <div className="absolute inset-0 flex items-center justify-center p-12">
              <div className="relative max-w-lg rounded-3xl bg-white/40 p-12 text-center shadow-2xl backdrop-blur-md dark:bg-gray-900/40 border border-white/20 dark:border-gray-700/50">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-500 to-theme-pink-500 shadow-lg shadow-brand-500/30">
                    <span className="text-4xl">💍</span>
                  </div>
                </div>
                <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Nol ke Nikah
                </h2>
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  Platform persiapan pernikahan terpadu. Kolaborasi dengan pasangan Anda, atur vendor, kelola budget, dan pantau tugas dari nol sampai hari H dengan mudah dan elegan.
                </p>
                
                {/* Micro-interaction dots */}
                <div className="mt-10 flex justify-center gap-2">
                  <span className="h-2 w-8 rounded-full bg-brand-500" />
                  <span className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-700" />
                  <span className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-700" />
                </div>
              </div>
            </div>
          </div>

          <div className="fixed bottom-6 right-6 z-50">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
