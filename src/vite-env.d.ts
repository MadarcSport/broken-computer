/// <reference types="vite/client" />

import "@react-three/fiber";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mesh: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      boxGeometry: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      meshPhongMaterial: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      meshStandardMaterial: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ambientLight: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pointLight: any;
    }
  }
}
