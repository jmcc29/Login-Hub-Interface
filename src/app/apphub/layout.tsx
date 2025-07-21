import { Navbar } from "@/components/header/navbar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-neutral-950 container">
        <section className="flex flex-col flex-wrap h-[calc(100vh-110px)]">
          {children}
        </section>
      </main>
    </div>
  );
}
