import { GLTF } from "three-stdlib"
import * as THREE from "three"

export type AssetProps = {
  model?: GLTF
  groupedMeshes: [THREE.Mesh[][], THREE.Group[][]] | null
  textures?: Record<string, THREE.Texture> | null
  actions?: Record<string, THREE.AnimationAction | null>
}

export type ZoomLevel = "minLevel" | "middleLevel" | "maxLevel"
