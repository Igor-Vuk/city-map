import { GLTF } from "three-stdlib"
import * as THREE from "three"

export type AssetProps = {
  model: GLTF
  textures?: Record<string, THREE.Texture>
  actions?: Record<string, THREE.AnimationAction | null>
}
