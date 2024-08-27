import { Suspense, useEffect, useState, lazy, useRef } from "react"
import { useLoader } from "@react-three/fiber"
import { RGBELoader } from "three-stdlib"
import { useGLTF, useTexture } from "@react-three/drei"
import * as THREE from "three"
import { Leva } from "leva"
import assetsPath from "./data/assetsPath.json"
import { ZoomLevel } from "./contentComponents/canvasComponents/canvasComponents.types.ts"

/* Mapbox imports */
import { ViewStateChangeEvent, Map, MapRef } from "react-map-gl"
import { Canvas } from "react-three-map"
import Mapbox from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// import Fallback from "./contentComponents/canvasComponents/fallback/Fallback" /* use Fallback component on Suspense if needed */
import { CanvasControl, SceneRenderControl } from "./helpers/leva"
import DirectionalLight from "./sceneComponents/DirectionalLight.tsx"
import SoftShadowsModifier from "./sceneComponents/SoftShadowsModifier.tsx"
import AxesHelper from "./sceneComponents/AxesHelper.tsx"
import PerformanceMonitor from "./sceneComponents/PerformanceMonitor.tsx"
import GridHelper from "./sceneComponents/GridHelper.tsx"

/* By lazy loading we are separating bundles that load to the browser */
const EnvironmentMap = lazy(
  () => import("./sceneComponents/EnvironmentMap.tsx"),
)
const Models = lazy(
  () => import("./contentComponents/canvasComponents/Models.tsx"),
)

/* ------------------- Preload ------------------------------- */
useLoader.preload(RGBELoader, assetsPath.environmentMapFiles)
useGLTF.preload(assetsPath.cityModels)
useTexture.preload(
  assetsPath.modelsTexture.map,
) /* If we have for example map and aoMap for the same object we need to preload them separately */
/* ----------------------------------------------------------- */

export default function Experience() {
  console.log("EXPERIENCE")

  const mapRef = useRef<MapRef>(null)

  const sceneRender = SceneRenderControl()
  const canvas = CanvasControl()
  const [showLeva, setShowLeva] = useState<boolean>(true) //  show or hide leva on first load
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>("middleLevel") //  show or hide leva on first load

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

  const handleZoom = (event: ViewStateChangeEvent) => {
    const zoom = event.viewState.zoom

    if (zoom < 15) {
      setZoomLevel("minLevel")
    } else if (zoom <= 17) {
      // Handles both zoom > 15 and zoom <= 17
      setZoomLevel("middleLevel")
    } else {
      setZoomLevel("maxLevel")
    }
  }

  const handleDivClick = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [15.934696, 45.756005],
        zoom: 15,
        speed: 1.2,
        curve: 1,
        essential: true, // If true, animation remains even if user interacts with map
      })
    } else {
      console.warn("Map instance is not available!")
    }
  }

  return (
    <>
      <Leva collapsed hidden={showLeva} />
      <Map
        ref={mapRef}
        antialias
        minZoom={6}
        maxZoom={20}
        maxPitch={70}
        mapStyle={mapStyle}
        initialViewState={{
          longitude: 15.934696,
          latitude: 45.756005,
          zoom: 15.0,
          pitch: 51,
        }}
        onZoom={handleZoom}
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
            <Models zoomLevel={zoomLevel} />
          </Suspense>
        </Canvas>
      </Map>
      <div
        onClick={handleDivClick}
        className="text-3xl font-bold underline"
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          padding: "10px",
          backgroundColor: "white",
          cursor: "pointer",
          zIndex: 1000, // Ensure it's above the map and other elements
        }}
      >
        <h2>Map Control</h2>
      </div>
    </>
  )
}
