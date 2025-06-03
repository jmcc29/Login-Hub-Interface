import "@/utils/styles/globals.css";
import { Metadata, Viewport } from "next";

import { subtitle, BreadcrumbsState } from "@/components/common";

export const metadata: Metadata = {
  title: {
    default: "Control de usuarios",
    template: `%s - Control de usuarios`,
  },
  description: "Herramienta Informático - Control de usuarios",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen px-10 py-5">
      <main className="container mx-auto max-w-7xl flex-grow">
        <div className={subtitle()}>
          <BreadcrumbsState />
        </div>
        {children}
      </main>
    </div>
  );
}
