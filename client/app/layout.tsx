import type { Metadata } from "next";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AppSidebar, userButtonAppearance } from "@/components/app-sidebar";
import BreadCrumbs from "@/components/BreadCrumbs";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/toggle-button";
import { Toaster } from "@/components/ui/toaster";
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "700"], // Include the weights you need
});

export const metadata: Metadata = {
  title: "MedClover",
  description: "Connecting healthcare providers with patients.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
            <SignedIn>
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                      <SidebarTrigger className="-ml-1" />
                      <Separator orientation="vertical" className="mr-2 h-4" />
                      <BreadCrumbs />
                    </div>
                    <div className="ml-auto mr-2 flex items-center gap-3">
                      
                      
                      <ModeToggle/>
                      
                      <UserButton appearance={userButtonAppearance} />

                      </div>
                    
                  </header>
                  {children}
                  <Toaster />

                </SidebarInset>
              </SidebarProvider>
            </SignedIn>
          </ClerkProvider></ThemeProvider>
      </body>
    </html>
  );
}
