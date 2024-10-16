import AlertProvider from "@/context/AlertProvider"

export default function LoginLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return (
      <AlertProvider>
         { children }
      </AlertProvider>
   )
}