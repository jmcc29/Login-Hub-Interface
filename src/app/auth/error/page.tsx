import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Link } from "@heroui/link";
import { MuserpolLogo } from "@/components/icons";

export default function AuthenticationErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
      <Card className="w-full max-w-md border border-gray-300 p-6">
        <CardHeader className="flex flex-col gap-3">
          <MuserpolLogo />
          <h1 className="text-xl font-bold">No se pudo iniciar sesión</h1>
        </CardHeader>
        <CardBody className="gap-4 text-center">
          <p>Intenta nuevamente. Si el problema continúa, vuelve más tarde.</p>
          <Button as={Link} color="success" href="/api/auth/login">
            Reintentar
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
