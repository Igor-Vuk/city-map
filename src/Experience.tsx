/* Components with preload inside that is executed as soon as the are imported */
import { Suspense, useEffect, useState, lazy } from "react"
import { useLoader } from "@react-three/fiber"
import { RGBELoader } from "three-stdlib"
import { useGLTF, useTexture } from "@react-three/drei"
import * as THREE from "three"
import { Leva } from "leva"
import assetsPath from "./data/assetsPath.json"

/* Mapbox imports */
import Map from "react-map-gl"
import { Canvas } from "react-three-map"
import Mapbox from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// import Fallback from "./models/Fallback"  /* use Fallback component on Suspense if needed */
import { CanvasControl, SceneRenderControl } from "./helpers/leva"
import DirectionalLight from "./scene/DirectionalLight"
import SoftShadowsModifier from "./scene/SoftShadowsModifier"
import AxesHelper from "./scene/AxesHelper"
import PerformanceMonitor from "./scene/PerformanceMonitor"
import GridHelper from "./scene/GridHelper"

/* By lazy loading we are separating bundles that load to the browser */
const EnvironmentMap = lazy(() => import("./scene/EnvironmentMap"))
const Models = lazy(() => import("./models/Models"))

/* ------------------- Preload ------------------------------- */
useLoader.preload(RGBELoader, assetsPath.environmentMapFiles)
useGLTF.preload(assetsPath.cityBuildings)
useGLTF.preload(assetsPath.cityModels)
useTexture.preload(
  assetsPath.testTexture.map,
) /* If we have for example map and aoMap for the same object we need to preload them separately */
/* ----------------------------------------------------------- */

export default function Experience() {
  console.log("EXPERIENCE")

  const sceneRender = SceneRenderControl()
  const canvas = CanvasControl()
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

  const { toneMapping, colorSpace } = canvas.values

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
        {/* Canvas is imported from react-three-map, not @react-three/fiber. Because the scene now lives in a map, 
        we leave a lot of the render and camera control to the map, rather than to R3F, so the following <Canvas> 
        props are ignored: gl, camera, resize, orthographic, dpr. This is why toneMapping and outputColorSpace will not be 
        updated using leva but will still work on first render*/}
        <Canvas
          shadows
          latitude={45.756005}
          longitude={15.934696}
          gl={{
            toneMapping: THREE[toneMapping],
            outputColorSpace: THREE[colorSpace],
          }}
        >
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
