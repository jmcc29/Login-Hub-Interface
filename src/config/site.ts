export type ComputerTools = typeof computerTools;

// TODO debería ser una API
export const computerTools = [
  {
    name: "BENEFICIARIOS",
    subtitle: "Herramienta Informático",
    url_prod: `http://${process.env.NEXT_PUBLIC_SERVER_FRONTEND || "localhost"}:3002/persons`,
    url_dev: "http://172.16.1.30:3002/persons",
    url_manual: "http://192.168.2.240:3002/persons",
    image: "beneficiary.jpg",
  },
];
