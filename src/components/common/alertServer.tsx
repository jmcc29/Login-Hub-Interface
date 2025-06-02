import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

interface Props {
  color: "default" | "primary" | "danger" | "warning" | "success" | "secondary";
  description: string;
  href?: string;
}

export const AlertServer = ({ color, description, href }: Props) => {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex flex-col w-full">
        <div key={color} className="w-full flex items-center my-3">
          <Alert
            color={color}
            endContent={
              href ? (
                <Button
                  as={Link}
                  color={color}
                  href={href}
                  size="sm"
                  variant="flat"
                >
                  Volver
                </Button>
              ) : undefined
            }
            title={description}
          />
        </div>
      </div>
    </div>
  );
};
