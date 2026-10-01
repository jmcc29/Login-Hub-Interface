import Software from "@/components/apphub/software";
export default function AppHub() {
  const tools = [
    {
      name: "BENEFICIARIOS",
      url: `http://${process.env.NEXT_PUBLIC_FRONTEND_HOST || "localhost"}:3002/persons`,
      image: "/beneficiary.jpg",
      description: "Herramienta Tecnológica de Beneficiarios",
    },
    {
      name: "VENTAS",
      url: `http://${process.env.NEXT_PUBLIC_FRONTEND_HOST || "localhost"}:3003`,
      image: "/sales.png",
      description: "Herramienta Tecnológica de Ventas",
    },
    {
      name: "RECAUDACIONES",
      url: `http://${process.env.NEXT_PUBLIC_FRONTEND_HOST || "localhost"}:3004`,
      image: "/collections.png",
      description: "Herramienta Tecnológica de Recaudaciones",
    },
  ];

  return (
    <div className="max-w-full gap-5 grid grid-cols-6 p-5">
      {tools.map((computerTool, index) => (
        <Software
          key={index}
          description={computerTool.description}
          image={computerTool.image}
          name={computerTool.name}
          url={computerTool.url}
        />
      ))}
    </div>
  );
}
