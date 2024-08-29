import { FC } from "react"
import { CameraNavigationProps } from "../../regularComponents/regularComponents.types.ts"

const CameraNavigation: FC<CameraNavigationProps> = ({ mapRef }) => {
  // Moved handleDivClick here
  const handleDivClick = (): void => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [15.934696, 45.756005],
        zoom: 15.5,
        speed: 1.2,

        curve: 1,
        // essential: true, // If true, animation remains even if user interacts with map
      })
    } else {
      console.warn("Map instance is not available!")
    }
  }

  return (
    <div
      onClick={handleDivClick}
      className="fixed p-20 border-2 border-gray-700 m-10 bg-white"
      style={
        {
          // position: "fixed",
          // top: "10px",
          // right: "10px",
          // padding: "10px",
          // backgroundColor: "white",
          // cursor: "pointer",
          // zIndex: 1000, // Ensure it's above the map and other elements
        }
      }
    >
      <h2>Map Control</h2>
    </div>
  )
}

export default CameraNavigation
