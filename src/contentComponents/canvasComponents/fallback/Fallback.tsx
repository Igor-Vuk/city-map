import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

const Fallback = () => {
  const meshRef = useRef<THREE.Mesh>(null)

  // This function updates every frame, rotating the mesh
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.1 // Spin on the x-axis
    }
  })

  return (
    <mesh ref={meshRef} scale={[20, 20, 20]} position={[27, -120, 0]}>
      <torusGeometry args={[1, 0.3, 16, 100]} />
      <meshStandardMaterial color="#A8B99F" />
    </mesh>
  )
}
export default Fallback
