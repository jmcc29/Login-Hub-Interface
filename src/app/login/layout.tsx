import AlertProvider from "@/utils/context/AlertProvider";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AlertProvider>{children}</AlertProvider>;
}
