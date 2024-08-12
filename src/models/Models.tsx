import { useGLTF } from "@react-three/drei"
import { AssetProps } from "./models.types"
import CityMap from "./CityMap/CityMap"
import assetsPath from "../data/assetsPath.json"

const Models = () => {
  console.log("MODELS")
  /* -----------------------------Files------------------------------- */

  const modelFiles = useGLTF(assetsPath.modelPath)

  /* ----------------------Data--------------------- */

  const cityMapAssets: AssetProps = {
    model: modelFiles,
  }

  return <CityMap {...cityMapAssets} />
}

export default Models
