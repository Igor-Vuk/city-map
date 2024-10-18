import { FC, useRef, Fragment, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import assetsPath from "../../../data/assetsPath.json"
import { Text, Line } from "@react-three/drei"
import * as THREE from "three"
import { BigNameValue } from "../canvasComponents.types"

const CityText: FC = () => {
  const schoolRef = useRef<THREE.Mesh>(null)
  const footballRef = useRef<THREE.Mesh>(null)
  const jeruzalemRef = useRef<THREE.Mesh>(null)
  const betlehemRef = useRef<THREE.Mesh>(null)
  const kindergartenRef = useRef<THREE.Mesh>(null)
  const doctorRef = useRef<THREE.Mesh>(null)
  const churchRef = useRef<THREE.Mesh>(null)

  useFrame(({ camera }) => {
    const refs = [
      schoolRef,
      footballRef,
      jeruzalemRef,
      betlehemRef,
      kindergartenRef,
      doctorRef,
      churchRef,
    ]

    refs.forEach((ref) => {
      if (ref.current) {
        ref.current.quaternion.copy(camera.quaternion)
      }
    })
  })

  const defaultValues: BigNameValue[] = useMemo(
    () => [
      {
        text: "OŠ Braće Radić",
        ref: schoolRef,
        textPosition: [-30, 45, 100],
        lineStart: [-30, 40, 100],
        lineEnd: [-30, 15, 100],
      },
      {
        text: "NK Botinec",
        ref: footballRef,
        textPosition: [-315, 45, 290],
        lineStart: [-315, 40, 290],
        lineEnd: [-315, 10, 290],
      },
      {
        text: "Park Jeruzalem",
        ref: jeruzalemRef,
        textPosition: [-225, 45, 310],
        lineStart: [-225, 40, 310],
        lineEnd: [-225, 10, 310],
      },
      {
        text: "Park Betlehem",
        ref: betlehemRef,
        textPosition: [140, 45, -150],
        lineStart: [140, 40, -150],
        lineEnd: [140, 10, -150],
      },
      {
        text: "Dječji vrtić Botinec",
        ref: kindergartenRef,
        textPosition: [290, 45, 250],
        lineStart: [290, 40, 250],
        lineEnd: [290, 15, 250],
      },
      {
        text: "Dom zdravlja",
        ref: doctorRef,
        textPosition: [330, 45, 155],
        lineStart: [330, 40, 155],
        lineEnd: [330, 15, 155],
      },
      {
        text: "Crkva sv.Stjepan",
        ref: churchRef,
        textPosition: [145, 45, 220],
        lineStart: [145, 40, 220],
        lineEnd: [145, 15, 220],
      },
    ],
    [],
  )

  const renderBigNames = () => {
    return defaultValues.map((value, index) => (
      <Fragment key={index}>
        <Text
          ref={value.ref}
          font={assetsPath.cityFonts}
          fontSize={8}
          position={value.textPosition}
          rotation={[0, 0, 0]}
          outlineWidth={0.4}
          outlineColor={new THREE.Color("#000000")}
        >
          {value.text}
          <meshBasicMaterial side={THREE.DoubleSide} color={"#FFD700"} />
        </Text>
        <Line
          points={[
            value.lineStart, // Start point of the line (slightly below the text)
            value.lineEnd, // End point of the line (further down)
          ]}
          color="black"
          lineWidth={1.2}
        />
      </Fragment>
    ))
  }
  return <>{renderBigNames()}</>
}

export default CityText
