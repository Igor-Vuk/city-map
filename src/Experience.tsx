/* Components with preload inside that is executed as soon as the are imported */
import { Suspense, useEffect, useState, lazy } from "react"
import { useLoader } from "@react-three/fiber"
import { RGBELoader } from "three-stdlib"
import { useGLTF } from "@react-three/drei"
import { Leva } from "leva"
import assetsPath from "./data/assetsPath.json"

/* Mapbox imports */
import Map from "react-map-gl"
import { Canvas } from "react-three-map"
import Mapbox from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// import Fallback from "./models/Fallback"  /* use Fallback component on Suspense if needed */
import { SceneRenderControl } from "./helpers/leva"
import DirectionalLight from "./scene/DirectionalLight"
import SoftShadowsModifier from "./scene/SoftShadowsModifier"
import AxesHelper from "./scene/AxesHelper"
import PerformanceMonitor from "./scene/PerformanceMonitor"
import GridHelper from "./scene/GridHelper"

/* By lazy loading we are separating bundles that load to the browser */
const EnvironmentMap = lazy(() => import("./scene/EnvironmentMap"))
const Models = lazy(() => import("./models/Models"))

/* If we have for example map and aoMap for the same object we need to preload them separately */
useLoader.preload(RGBELoader, assetsPath.environmentMapFiles)
useGLTF.preload(assetsPath.modelPath)

export default function Experience() {
  console.log("EXPERIENCE")

  const sceneRender = SceneRenderControl()
  const [showLeva, setShowLeva] = useState<boolean>(true) //  show or hide leva on first load

  useEffect(() => {
    /*  add event listener to show or hide leva when "h" button is pressed */
    const handleLeva = (event: KeyboardEvent) => {
      if (event.key === "h") {
        setShowLeva((showLeva) => !showLeva)
      }
    }
    window.addEventListener("keydown", handleLeva)
    return () => {
      window.removeEventListener("keydown", handleLeva)
    }
  }, [])

  Mapbox.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || ""

  const {
    performance_monitor,
    directional_lights,
    soft_shadows,
    axes_helper,
    grid_helper,
    environment_map,
  } = sceneRender.values

  const mapStyle = import.meta.env.VITE_MAPSTYLE

  return (
    <>
      <Leva collapsed hidden={showLeva} />
      <Map
        antialias
        mapStyle={mapStyle}
        initialViewState={{
          latitude: 45.756005,
          longitude: 15.934696,
          zoom: 16.0,
          pitch: 51,
        }}
      >
        <Canvas latitude={45.756005} longitude={15.934696}>
          {performance_monitor && <PerformanceMonitor />}
          {directional_lights && <DirectionalLight />}
          {soft_shadows && <SoftShadowsModifier />}
          {axes_helper && <AxesHelper />}
          {grid_helper && <GridHelper />}
          {environment_map && (
            <Suspense fallback={null}>
              <EnvironmentMap />
            </Suspense>
          )}
          <Suspense fallback={null}>
            <Models />
          </Suspense>
        </Canvas>
      </Map>
    </>
  )
}
