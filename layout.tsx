import type { Metadata } from "next";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry"
import { ConfigProvider } from "antd";
import theme from "./config/themeConfig";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { rubik } from "@/fonts";
import AuthProvider from "./components/AuthProvider";
import RequireAuth from "./components/RequireAuth";
import { MessageProvider } from "./context/AlertContext";





export const metadata: Metadata = {
  title: {
    default: "EASY HOMES",
    template: "%s | EASY HOMES",
  },
  description: "Finding your Profect Home",
  keywords: [
    " Easy Home Real Estate",

    "Property Listing Platform",

    "Buy and Rent Homes",

    "Apartment and House Listings",

    "Online Property Marketplace",
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={rubik.className}>

        <AuthProvider>

          <ConfigProvider theme={theme}>
            <AntdRegistry>
              <RequireAuth>
                <MessageProvider>
                  <div className="main-container">
                    <Header />
                    <main className="flex-grow">{children}</main>
                    <Footer />
                  </div>
                </MessageProvider>
              </RequireAuth>
            </AntdRegistry>
          </ConfigProvider>

        </AuthProvider>
      </body>
    </html>
  );
}
