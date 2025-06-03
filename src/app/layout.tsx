import "@/utils/styles/globals.css";
import { Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { fontSans } from "@/utils/fonts";
import { getDeployEnvironment } from "@/utils/envs";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};
export const metadata = {
  icons: {
    icon: "/icono_muserpol.svg",
  },
};

const environment = getDeployEnvironment();
const envConfig: Record<string, { bgColor: string; label: string }> = {
  dev: {
    bgColor: "bg-red-600",
    label: "Versión de desarrollo",
  },
  test: {
    bgColor: "bg-red-500",
    label: "Versión de pruebas",
  },
  local: {
    bgColor: "bg-blue-500",
    label: "Versión de desarrollo - local",
  },
};
const currentEnv = envConfig[environment];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <div className="relative flex flex-col h-screen">
            <main className="w-full flex-grow">{children}</main>
            {currentEnv && (
              <footer
                className={`fixed bottom-0 left-0 w-full ${currentEnv.bgColor} text-white text-center py-2 text-sm z-50`}
              >
                <span className="uppercase text-sm font-semibold">
                  {currentEnv.label}
                </span>
              </footer>
            )}
          </div>
        </Providers>
      </body>
    </html>
  );
}
