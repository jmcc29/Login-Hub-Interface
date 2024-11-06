import Software from "@/components/software";
import { computerTools } from "@/config/site";

export default function AppHub() {
  return (
    <div className="max-w-full gap-7 grid grid-cols-10 px-20 py-20">
      {
        (computerTools ?? []).map((computerTool, index) => (
          <Software
            key={index}
            name={computerTool.name}
            subtitle={computerTool.subtitle}
            url={computerTool.url}
          />
        ))
      }
    </div>
  );
}