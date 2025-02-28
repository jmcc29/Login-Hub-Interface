import Software from "@/components/software";
import { computerTools } from "@/config/site";

export default function AppHub() {
  return (
    <div className="max-w-full gap-7 grid grid-cols-8 px-10 py-5">
      {(computerTools ?? []).map((computerTool, index) => (
        <Software
          key={index}
          image={computerTool.image}
          name={computerTool.name}
          subtitle={computerTool.subtitle}
          url_dev={computerTool.url_dev}
          url_manual={computerTool.url_manual}
          url_prod={computerTool.url_prod}
        />
      ))}
    </div>
  );
}
