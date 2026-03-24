import Software from "@/components/apphub/software";
import { frontend, externalFrontends} from "@/utils/env";

export default function AppHub() {
  const tools = [
    {
      name: "BENEFICIARIOS",
      subtitle: "HERRAMIENTA INFORMÁTICA",
      url: `${externalFrontends.beneficiary.url}/persons`,
      image: "beneficiary.jpg",
      rsname: "beneficiary-interface",
      scope: "launch",
      targetClientId: externalFrontends.beneficiary.clientId,
    },
    // {
    //   name: "KIOSCO",
    //   subtitle: "HERRAMIENTA INFORMÁTICA",
    //   url: `${frontend.url}/kiosk`,
    //   image: "kiosk.jpg",
    //   rsname: "kiosk-interface",
    //   scope: "launch",
    //   targetClientId: "kiosk-interface",
    // },
    // {
    //   name: "RECORDS",
    //   subtitle: "HERRAMIENTA INFORMÁTICA",
    //   url: `${frontend.url}/records`,
    //   image: "records.jpg",
    //   rsname: "records-interface",
    //   scope: "launch",
    //   targetClientId: "records-interface",
    // },    
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
          targetClientId={computerTool.targetClientId}
        />
      ))}
    </div>
  );
}
