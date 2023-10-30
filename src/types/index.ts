type Mesh = {
  type: string;
  name: string;
  visible: boolean;
  position: THREE.Vector3;
  scale: THREE.Vector3;
  rotate: THREE.Vector3;
  color: THREE.Color;
  roughness: number;
  shininess: number;
  vectorColor: THREE.Vector3;
  side: THREE.Side;
  opacity: number;
  emissive: number;
  children: Mesh[];
};

type Tree = {
  uuid: string;
  title: string;
  children: Tree[];
};

type Config = {
  type: string;
  name: string;
  vertexCount: number;
  color: THREE.Color;
  triangleCount: number;
  position: THREE.Vector3;
  scale: THREE.Vector3;
  rotation: { x: number; y: number; z: number };
  side: string;
  blending: string;
  opacity: number;
  roughness: number;
  metalness: number;
  map: string;
  emissiveMap: string;
  vertexColors: boolean;
  alphaMap: string;
  bumpMap: string;
  normalMap: string;
  displacementMap: string;
  roughnessMap: string;
  metalnessMap: string;
};

export type { Mesh, Tree, Config };
