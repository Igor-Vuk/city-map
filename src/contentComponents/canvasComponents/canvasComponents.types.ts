import { GLTF } from "three-stdlib"
import * as THREE from "three"

export type AssetProps = {
  model?: GLTF
  groupedMeshes: [THREE.Mesh[][], THREE.Group[][]] | null
  textures?: THREE.Texture[] | null
  actions?: Record<string, THREE.AnimationAction | null>
}

export type ZoomLevel = "minLevel" | "middleLevel" | "maxLevel"

export type BigNameValue = {
  text: string
  ref: React.RefObject<THREE.Mesh>
  textPosition: [number, number, number]
  lineStart: [number, number, number]
  lineEnd: [number, number, number]
}
