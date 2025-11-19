import { Navbar } from "@/components/header/navbar";
import { getProfile } from "@/api";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getProfile();
  return (
    <div className="flex flex-col h-screen">
      <Navbar user={user} />
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-neutral-950 container">
        <section className="flex flex-col flex-wrap h-[calc(100vh-110px)]">
          {children}
        </section>
      </main>
    </div>
  );
}
