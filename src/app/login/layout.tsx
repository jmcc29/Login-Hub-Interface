import AlertProvider from "@/utils/context/AlertProvider";

export const metadata = {
  title: "Login | Muserpol",
  description: "Pagina de inicio de sesión",
};
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AlertProvider>{children}</AlertProvider>;
}
