import { useGLTF, useTexture } from "@react-three/drei"
import { AssetProps, ZoomLevel } from "./models.types"
import * as THREE from "three"
import CityModels from "./CityModels/CityModels"
import CityText from "./CityText/CityText"
// import CityBorder from "./CityBorder/CityBorder"
import assetsPath from "../data/assetsPath.json"

const Models = ({ zoomLevel }: { zoomLevel: ZoomLevel }) => {
  console.log("MODELS", zoomLevel)
  /* -----------------------------Files------------------------------- */

  const cityModelsFile = useGLTF(assetsPath.cityModels)
  const testTexture = useTexture(assetsPath.testTexture, (texture) => {
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

  const cityModels: AssetProps = {
    model: cityModelsFile,
    textures: testTexture,
  }

  const isVisible = zoomLevel === "middleLevel" || zoomLevel === "maxLevel"

  return (
    <>
      <group visible={isVisible}>
        <CityModels {...cityModels} key="cityModels" />
        <CityText />
      </group>
      {/* <group visible={!isVisible}>
        <CityBorder />
      </group> */}
    </>
  )
}

export default Models
