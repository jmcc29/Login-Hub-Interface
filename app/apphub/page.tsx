import Software from "@/components/software";

export default function AppHub() {
  return (
    <div className="max-w-full gap-7 grid grid-cols-10 px-20 py-20">
      <Software
        name="Beneficiarios"
        subtitle="Software Beneficiarios"
        url="http://192.168.2.201:3001"
      />
    </div>
  );
}
