import { Navbar } from "@/components/navbar";

export default function AppHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen overflow-y-scroll">
      <Navbar/>
      <main className="container">
        {children}
      </main>
    </div>
  )
}