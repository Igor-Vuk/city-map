import { Environment } from "@react-three/drei"
import { EnvironmentMapControl } from "../helpers/leva"
import assetsPath from "../data/assetsPath.json"

const EnvironmentMap = () => {
  console.log("ENVIRONMENT")
  const environmentMap = EnvironmentMapControl()

  return (
    <Environment
      background={environmentMap.values.background}
      backgroundIntensity={environmentMap.values.backgroundIntensity}
      backgroundRotation={environmentMap.values.backgroundRotation}
      backgroundBlurriness={environmentMap.values.blur}
      environmentIntensity={environmentMap.values.environmentIntensity}
      environmentRotation={environmentMap.values.environmentRotation}
      files={assetsPath.environmentMapFiles}
    />
  )
}

export default EnvironmentMap
