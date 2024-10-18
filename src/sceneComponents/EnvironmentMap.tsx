import { Environment, useEnvironment } from "@react-three/drei"
import { EnvironmentMapControl } from "../helpers/leva"
import assetsPath from "../data/assetsPath.json"

const EnvironmentMap = () => {
  const environmentMap = EnvironmentMapControl()

  const environmentMapTexture = useEnvironment({
    files: assetsPath.environmentMapFiles,
  })

  return (
    <Environment
      map={environmentMapTexture}
      background={environmentMap.values.background}
      backgroundIntensity={environmentMap.values.backgroundIntensity}
      backgroundRotation={environmentMap.values.backgroundRotation}
      backgroundBlurriness={environmentMap.values.blur}
      environmentIntensity={environmentMap.values.environmentIntensity}
      environmentRotation={environmentMap.values.environmentRotation}
    />
  )
}

export default EnvironmentMap
