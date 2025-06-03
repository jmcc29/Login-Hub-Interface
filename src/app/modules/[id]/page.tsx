import { RolCard } from "@/components/modules/rolCard";
import { getModIdCookie } from "@/utils/helpers/cookies";
import { AlertServer } from "@/components/common";
import { baseURLFrontend } from "@/utils/services";
export default async function Page({ params }: { params: { id: string } }) {
  const pageParams = await params;
  const { error, message, data } = await getModIdCookie(pageParams.id);

  if (error) {
    return (
      <AlertServer
        color="danger"
        description={message}
        href={`${baseURLFrontend}/modules`}
      />
    );
  }

  return (
    <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
      <RolCard module={data} />
    </div>
  );
}
