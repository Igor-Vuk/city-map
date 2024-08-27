import { FC, useState, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { AssetProps } from "../canvasComponents.types"
import { Instances, Instance, Outlines } from "@react-three/drei"
import * as THREE from "three"
/* import instanceTransformsData from "../../data/instanceTransforms.json" */

const CityModels: FC<AssetProps> = ({
  groupedMeshes = null,
  textures = null,
}) => {
  console.log("CITY MODELS", groupedMeshes)

  const [ready, setReady] = useState(false)
  const instancesGroupRef = useRef<THREE.Group | null>(null)

  // Memoize the material to avoid re-creating it on each render
  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial() // Use MeshStandardMaterial or MeshPhysicalMaterial for more advanced features
    /* Use texture if we pass it as a prop */
    if (textures) {
      Object.assign(mat, textures) // This will spread all texture properties onto the material
    }
    return mat
  }, [textures])

  const outlines = useMemo(
    () => <Outlines screenspace={true} thickness={0.1} angle={Math.PI} />,
    [],
  )

  /* We use useFrame here instead of useEffect because useEffect runs after React renders the component
    tree but before WebGL assets (like textures, geometries, or instances) are fully processed by Three.js,
    which can lead to timing issues. On the other hand, useFrame runs on every frame before the scene is
    rendered, making it more reliable for tasks that depend on the full readiness of WebGL objects, such
   as applying Outlines. */
  useFrame(() => {
    if (!ready && instancesGroupRef.current) {
      setReady(true)
    }
  })

  const renderNode = useMemo(() => {
    /* safeguard that ensures the component only attempts to render content when groupedMeshes has been properly initialized and populated */
    if (!groupedMeshes) return null

    /* when we export mesh from blender that has none or one material and we import it in Three.js we get THREE.Mesh but when we export a mesh that has multiple materials
    we get THREE.Group with "children" property where every material turns into a separate mesh. Makes it much more complicated to work with instances so we don't use them*/
    const renderMeshInstances = (meshGroup: THREE.Mesh[]) => {
      /* custom condition if we don't want to render something here we exclude it using name */
      if (meshGroup[0].name !== "border") {
        return (
          <Instances
            key={meshGroup[0].uuid}
            geometry={meshGroup[0].geometry}
            material={material}
            castShadow // be careful, shadows increase draw calls
            receiveShadow
          >
            {/* We can use this to render if we have extracted just transform data of Instances from Blender inside of JSON file */}
            {/* {instanceTransformsData
          .filter((mesh) => mesh.name === meshGroup[0].name)
          .map((mesh) => (
            <Instance
              key={mesh.uuid}
              position={mesh.position}
              rotation={mesh.rotation}
              scale={mesh.scale}
            />
          ))} */}
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
        )
      }
    }

    const renderGroups = (groupGroup: THREE.Group[]) =>
      groupGroup.map((group) => (
        <group key={group.uuid} position={group.position} scale={group.scale}>
          {group.children
            /* inside of children we can have THREE.Mesh which we will render but also THREE.Light, THREE.Camera, even THREE.Group again */
            .filter((child): child is THREE.Mesh => child instanceof THREE.Mesh)
            .map((child) => (
              <mesh
                key={child.uuid}
                name={child.name}
                geometry={child.geometry}
                material={child.material} // child.material will use material that is exported from blender
                position={child.position}
                rotation={child.rotation}
                scale={child.scale}
              >
                {ready && outlines}
              </mesh>
            ))}
        </group>
      ))

    /* We can render groups more simply as primitive if we don't need control over every mesh like above where we add Outlines */
    // const renderGroups = (groupGroup: THREE.Group[]) => {
    //   return groupGroup.map((group) => {
    //     return <primitive object={group} key={group.uuid} material={material} />
    //   })
    // }

    return (
      /* Only after the entire subtree (the <group> and all its children) has been mounted into the DOM will instancesGroupRef.current be populated. */
      <group position={[218, 0, 112]} ref={instancesGroupRef}>
        {/* groupedMeshes[0] are all meshes grouped by the name and groupedMeshes[1] are groups */}
        {groupedMeshes[0].length > 0 && (
          <group>{groupedMeshes[0].map(renderMeshInstances)}</group>
        )}
        {groupedMeshes[1].length > 0 && (
          <group>{groupedMeshes[1].map(renderGroups)}</group>
        )}
      </group>
    )
  }, [material, outlines, ready, groupedMeshes])

  return renderNode
}

export default CityModels
