import { FC, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import assetsPath from "../../data/assetsPath.json"
import { Text, Line } from "@react-three/drei"
import * as THREE from "three"

const CityText: FC = () => {
  const textRef = useRef<THREE.Mesh>(null)

  useFrame(({ camera }) => {
    if (textRef.current) {
      // Make the text follow the camera's rotation
      textRef.current.quaternion.copy(camera.quaternion)
    }
  })

  return (
    <>
      <Text
        ref={textRef}
        font={assetsPath.cityFonts}
        fontSize={10}
        // material-toneMapped={false}
        position={[-200, 45, 208]}
        rotation={[0, -0.55, 0]} // Rotate 45 degrees around the Y-axis

        /* {...textOptions} */
      >
        Hello world!
        <meshNormalMaterial side={THREE.DoubleSide} />
      </Text>
      <Line
        points={[
          [-200, 40, 205], // Start point of the line (slightly below the text)
          [-200, 5, 205], // End point of the line (further down)
        ]}
        color="black"
        lineWidth={1}
      />
    </>
  )
}

export default CityText
