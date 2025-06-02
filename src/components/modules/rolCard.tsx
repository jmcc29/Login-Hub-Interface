"use client";

import { Card } from "@heroui/card";
import { useParams } from "next/navigation";

import { RolInfo } from "./rolInfo";

import { ModuleRoles } from "@/utils/interfaces";
import { getDeployEnvironment, getLocalUrl } from "@/utils/envs";

interface Props {
  module: ModuleRoles;
}

export const RolCard = ({ module }: Props) => {
  const deployEnv = getDeployEnvironment();
  const { id: moduleId } = useParams<{ id: string }>();

  function handleCardClick(roleId: string, url: string) {
    document.cookie = `currentRol${moduleId}=${roleId}; path=/; max-age=14400; SameSite=Strict`;
    window.location.href = url || "";
  }
  if (!module) return null;
  const roles = module.roles || [];

  return (
    <>
      {roles.map((rol) => {
        return (
          <Card
            key={rol.id}
            isPressable
            shadow="sm"
            onPress={() => {
              let url = ``;

              switch (deployEnv) {
                case "prod":
                  url = module.urlProd ?? "";
                  break;
                case "test":
                  url = module.urlTest ?? "";
                  break;
                case "dev":
                  url = module.urlDev ?? "";
                  break;
                case "local":
                  if (module.urlDev) {
                    const dev = new URL(module.urlDev);

                    url = `http://${getLocalUrl()}:${dev.port}${dev.pathname}/`;
                  }
                  break;
                default:
                  console.error("Invalid environment");
              }
              handleCardClick(module.id, url);
            }}
          >
            <RolInfo rol={rol} />
          </Card>
        );
      })}
    </>
  );
};
