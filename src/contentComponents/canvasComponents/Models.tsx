import { useGLTF, useTexture } from "@react-three/drei"
import { ZoomLevel } from "./canvasComponents.types.ts"
import * as THREE from "three"
import { Suspense } from "react"
import CityModels from "./CityModels/CityModels.tsx"
import CityText from "./CityText/CityText.tsx"
import CityBorder from "./CityBorder/CityBorder.tsx"
import assetsPath from "../../data/assetsPath.json"
import useGroupedMeshes from "../../customHooks/useGroupedMeshes.ts"

const Models = ({ zoomLevel }: { zoomLevel: ZoomLevel }) => {
  console.log("MODELS", zoomLevel)
  /* -----------------------------Files------------------------------- */
  const cityModelsFile = useGLTF(assetsPath.cityModels)
  const modelsTexture = useTexture(assetsPath.modelsTexture, (texture) => {
    /* adjustTexture here is just a reference and not executed immediately. By the time useTexture triggers a callback
    and adjustTexture is run, it is already defined. This is why we can "call" it here before it is defined  */
    adjustTexture(texture)
  })

  /* ----------------------Adjust texture--------------------- */
  // we need to flip textures in order to align them
  const adjustTexture = (...texturesArray: Record<string, THREE.Texture>[]) => {
    if (texturesArray.length > 0) {
      texturesArray.forEach((textures) => {
        Object.values(textures).forEach((texture) => {
          texture.flipY = false
          /* Remember that no color Textures(normal maps, roughness...) should use NoColorSpace and most .hdr/.exr LinearSRGBColorSpace*/
          texture.colorSpace = THREE.SRGBColorSpace
        })
      })
    }
  }

  // Use the custom hook to get grouped meshes
  const groupedMeshes = useGroupedMeshes(cityModelsFile.scene)

  const isVisible = zoomLevel === "middleLevel" || zoomLevel === "maxLevel"

  /* Toggling the visible property is generally more efficient than 
  unmounting and remounting components. Using visible keeps all WebGL 
  resources (like geometries, materials, and textures) intact. 
  There's no need to dispose of or recreate them */
  return (
    <>
      <group visible={isVisible}>
        <CityModels groupedMeshes={groupedMeshes} textures={modelsTexture} />
        <Suspense>
          <CityText />
        </Suspense>
      </group>

      <group visible={!isVisible}>
        <CityBorder groupedMeshes={groupedMeshes} textures={modelsTexture} />
      </group>
    </>
  )
}

export default Models
