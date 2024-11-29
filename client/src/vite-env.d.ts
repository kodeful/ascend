/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
declare module "@wojtekmaj/react-daterange-picker/dist/entry.nostyle.js";
declare module "robust-websocket";

interface ImportMetaEnv {
  readonly REACT_APP_API_URL: string;
  readonly REACT_APP_MAPBOX_ACCESS_TOKEN: string;
  readonly CYPRESS_BASE_URL: string;
  readonly CYPRESS_AUTH_EMAIL: string;
  readonly CYPRESS_AUTH_PASSWORD: string;
  readonly REACT_APP_STREAMCHAT_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// react-scripts declarations (CRA)
declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  import type * as React from "react";

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  const src: string;
  export default src;
}
