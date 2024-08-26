import { useMemo } from "react"
import * as THREE from "three"

const useGroupedMeshes = (model: THREE.Object3D | null) => {
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

  const groupedMeshes = useMemo(() => {
    if (model) {
      return groupMeshesByUserDataName(model)
    }
    return null
  }, [model])

  return groupedMeshes
}

export default useGroupedMeshes
