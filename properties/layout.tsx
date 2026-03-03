import { Metadata } from "next";



export const metadata: Metadata = {
  title: "Properties"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return children
}