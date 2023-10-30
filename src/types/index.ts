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

export type { Mesh, Tree };
