/// <reference types="vite/client" />

declare module "*.svg?react" {
  import type { FunctionComponent, SVGProps } from "react";
  const component: FunctionComponent<SVGProps<SVGSVGElement>>;
  export default component;
}

declare module "*.glsl" {
  const src: string;
  export default src;
}
