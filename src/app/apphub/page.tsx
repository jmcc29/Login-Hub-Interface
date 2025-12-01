import Software from "@/components/apphub/software";
export default function AppHub() {
  const tools = [
    {
      name: "BENEFICIARIOS",
      subtitle: "HERRAMIENTA INFORMÁTICA",
      url: `http://${process.env.NEXT_PUBLIC_SERVER_FRONTEND || "localhost"}:3002/persons`,
      image: "beneficiary.jpg",
      rsname: "beneficiary-interface",
      scope: "launch",
    },
    {
      name: "KIOSCO",
      subtitle: "HERRAMIENTA INFORMÁTICA",
      url: `http://${process.env.NEXT_PUBLIC_SERVER_FRONTEND || "localhost"}:3003`,
      image: "kiosk.jpg",
      rsname: "kiosk-interface",
      scope: "launch",
    },
    {
      name: "RECORDS",
      subtitle: "HERRAMIENTA INFORMÁTICA",
      url: `http://${process.env.NEXT_PUBLIC_SERVER_FRONTEND || "localhost"}:3004`,
      image: "records.jpg",
      rsname: "records-interface",
      scope: "launch",
    },    
  ];

  return (
    <div className="max-w-full gap-7 grid grid-cols-8 p-5">
      {tools.map((computerTool, index) => (
        <Software
          key={index}
          image={computerTool.image}
          name={computerTool.name}
          subtitle={computerTool.subtitle}
          url={computerTool.url}
          rsname={computerTool.rsname}
          scope={computerTool.scope}
        />
      ))}
    </div>
  );
}
