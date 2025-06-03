import { Metadata } from "next";

import { Navbar } from "@/components/header/navbar";

export const metadata: Metadata = {
  title: {
    default: "Portal",
    template: `%s - Herramientas Informaticas`,
  },
  description: "Página de seleccion de herramienta informatica",
  icons: {
    icon: "/icono_muserpol.svg",
  },
};
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <main className="container">{children}</main>
    </div>
  );
}
