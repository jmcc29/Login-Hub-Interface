import { SVGProps } from "react";

import { Module } from "@/utils/interfaces";
export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type ModulePartial = Partial<Module>;
