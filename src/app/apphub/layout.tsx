import { Navbar } from "@/components/header/navbar";
import { Metadata } from "next";


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
export default function AppHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen overflow-y-scroll">
      <Navbar />
      <main className="container">{children}</main>
    </div>
  );
}
