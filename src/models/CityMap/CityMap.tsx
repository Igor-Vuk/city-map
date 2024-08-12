import { FC, useState, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { AssetProps } from "../models.types"
import { Instances, Instance, Outlines } from "@react-three/drei"
import * as THREE from "three"

const CityMap: FC<AssetProps> = ({ model }) => {
  console.log("CITY MAP", model)

  const [ready, setReady] = useState(false)
  const instancesGroupRef = useRef<THREE.Group | null>(null)

  /* We use useFrame here instead of useEffect because useEffect runs after React renders the component
  tree but before WebGL assets (like textures, geometries, or instances) are fully processed by Three.js,
  which can lead to timing issues. On the other hand, useFrame runs on every frame before the scene is
  rendered, making it more reliable for tasks that depend on the full readiness of WebGL objects, such
  as applying Outlines.  */

  useFrame(() => {
    if (ready) return // Early return if ready is true

    if (instancesGroupRef.current) {
      setReady(true)
    }
  })

  // Memoize the material to avoid re-creating it on each render
  const material = useMemo(() => new THREE.MeshBasicMaterial(), [])

  const outlines = useMemo(
    () => (
      <Outlines screenspace={false} thickness={1.0} angle={Math.PI / 0.6} />
    ),
    [],
  )

  // Memoize the renderNode function to avoid redefining it on each render
  const renderNode = useMemo(() => {
    const renderMeshes = (node: THREE.Object3D) => {
      const isMeshType = (node: THREE.Object3D): node is THREE.Mesh => {
        return node instanceof THREE.Mesh
      }

      // userData.name was added in Blender as a custom property. This property was added to original object and to instances of that object. It's the same name for both.
      // Based on that name we group all the meshes to the same array
      const groupMeshesByUserDataName = (): THREE.Mesh[][] => {
        const meshGroups = node.children.reduce(
          (acc, child) => {
            if (isMeshType(child) && child.userData.name) {
              const name = child.userData.name
              if (!acc[name]) {
                acc[name] = []
              }
              acc[name].push(child)
            }
            return acc
          },
          {} as { [key: string]: THREE.Mesh[] },
        )

        // Convert the object of arrays into an array of arrays
        return Object.values(meshGroups)
      }

      const groupedMeshes = groupMeshesByUserDataName()

      return (
        /* Only after the entire subtree (the <group> and all its children) has been mounted into the DOM 
        will instancesGroupRef.current be populated. */
        <group position={[218, 0, 112]} ref={instancesGroupRef}>
          {groupedMeshes.map((meshGroup) => (
            <Instances
              key={meshGroup[0].uuid}
              geometry={meshGroup[0].geometry}
              material={material}
            >
              {meshGroup.map((mesh) => (
                <Instance
                  key={mesh.uuid}
                  position={mesh.position}
                  rotation={mesh.rotation}
                  scale={mesh.scale}
                />
              ))}

              {ready && outlines}
            </Instances>
          ))}
        </group>
      )
    }
    return renderMeshes
  }, [material, outlines, ready])

  return renderNode(model.scene)
}

export default CityMap
