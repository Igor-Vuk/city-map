import { FC, useMemo } from "react"
import * as THREE from "three"
import { AssetProps } from "../canvasComponents.types"

const CityBorder: FC<AssetProps> = ({
  groupedMeshes = null,
  textures = null,
}) => {
  console.log("CITY BORDERS", groupedMeshes)

  // Memoize the material to avoid re-creating it on each render
  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial()

    if (textures && textures.length > 0) {
      textures.forEach((texture) => {
        if (texture.name === "diffuseTexture") {
          mat.map = texture
        } else if (texture.name === "roughnessTexture") {
          mat.roughnessMap = texture
        } else if (texture.name === "normalTexture") {
          mat.normalMap = texture
          // mat.normalScale = new THREE.Vector2(1.0, 1.0) // Adjust as needed
        } else if (texture.name === "aoTexture") {
          mat.aoMap = texture
          // Handle any additional textures here
        }
      })
    }

    return mat
  }, [textures])

  const renderNode = useMemo(() => {
    /* safeguard that ensures the component only attempts to render content when groupedMeshes has been properly initialized and populated */
    if (!groupedMeshes) return null

    /* when we export mesh from blender that has none or one material and we import it in Three.js we get THREE.Mesh but when we export a mesh that has multiple materials
    we get THREE.Group with "children" property where every material turns into a separate mesh. Makes it much more complicated to work with instances so we don't use them*/
    const renderMeshInstances = (meshGroup: THREE.Mesh[]) => {
      /* custom condition if we don't want to render something here we exclude it using name */
      if (meshGroup[0].name === "border") {
        return (
          <mesh
            key={meshGroup[0].uuid}
            geometry={meshGroup[0].geometry}
            material={material}
            position={meshGroup[0].position}
            rotation={meshGroup[0].rotation}
            scale={meshGroup[0].scale}
          />
        )
      }
      return null
    }

    return (
      <group position={[218, 0, 112]}>
        {/* groupedMeshes[0] are all meshes grouped by the name and groupedMeshes[1] are groups */}
        {groupedMeshes[0].length > 0 && (
          <group>{groupedMeshes[0].map(renderMeshInstances)}</group>
        )}
      </group>
    )
  }, [material, groupedMeshes])

  return renderNode
}

export default CityBorder
