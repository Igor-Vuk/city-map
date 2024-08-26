import { FC, useState, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { AssetProps } from "../models.types"
import { Instances, Instance, Outlines } from "@react-three/drei"
import * as THREE from "three"
/* import instanceTransformsData from "../../data/instanceTransforms.json" */

const CityModels: FC<AssetProps> = ({ model, textures = null }) => {
  console.log("CITY MODELS", model)

  const [ready, setReady] = useState(false)
  const instancesGroupRef = useRef<THREE.Group | null>(null)
  const groupedMeshesRef = useRef<[THREE.Mesh[][], THREE.Group[][]] | null>(
    null,
  )

  // Memoize the material to avoid re-creating it on each render
  // const material = useMemo(() => new THREE.MeshBasicMaterial(), [])

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

  const groupMeshesByUserDataName = (
    node: THREE.Object3D,
  ): [THREE.Mesh[][], THREE.Group[][]] => {
    const meshGroups: { [key: string]: THREE.Mesh[] } = {}
    const groupGroups: { [key: string]: THREE.Group[] } = {}

    node.children.forEach((child) => {
      /* property "name" inside of userData was added in Blender as a custom object property. This property was added to original object and to all instances of that object.
        It's the same name for original and instances. Based on that name we group all the meshes and groups with the same name to the same array.
        In Blender we also added boolean custom property "original" and set it to true for the original object and to false for instances.
        We don't use it here but could be useful */
      const { name } = child.userData
      if (child instanceof THREE.Mesh && name) {
        /* If meshGroups[name] exists, keep it as it is, if it doesn’t exist set it to an empty array. */
        meshGroups[name] = meshGroups[name] || []
        meshGroups[name].push(child)
      } else if (child instanceof THREE.Group) {
        groupGroups[name] = groupGroups[name] || []
        groupGroups[name].push(child)
      }
    })

    return [Object.values(meshGroups), Object.values(groupGroups)]
  }

  const renderNode = useMemo(() => {
    /* groupedMeshesRef is used to store the result of grouping the meshes and groups from the THREE.Object3D (which is model.scene in this case).
    This grouping operation is relatively expensive, so by storing the result in a ref, it ensures that the grouping is done only once and reused
    across renders. This is run only when component first renders. useMemo will run again if its dependencies change but groupMeshesByUserDataName
    will run only if model.scene changes */
    if (!groupedMeshesRef.current && model.scene) {
      groupedMeshesRef.current = groupMeshesByUserDataName(model.scene)
    }

    const groupedMeshes = groupedMeshesRef.current
    /* safeguard that ensures the component only attempts to render content when groupedMeshes has been properly initialized and populated */
    if (!groupedMeshes) return null

    console.log("CITY MODELS GROUPED MESHES", groupedMeshes)

    /* when we export mesh from blender that has none or one material and we import it in Three.js we get THREE.Mesh but when we export a mesh that has multiple materials
    we get THREE.Group with "children" property where every material turns into a separate mesh. Makes it much more complicated to work with instances so we don't use them*/
    const renderMeshInstances = (meshGroup: THREE.Mesh[]) => (
      <Instances
        key={meshGroup[0].uuid}
        geometry={meshGroup[0].geometry}
        material={material}
        castShadow
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
                material={/* material */ child.material} // child.material will use material that is exported from blender
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
  }, [material, outlines, ready, model.scene])

  return renderNode
}

export default CityModels
