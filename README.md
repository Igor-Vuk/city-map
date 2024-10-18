# CITY MAP

Link: https://city-map-chi.vercel.app/

Interactive 3D Map with custom models for desktop and mobile.

![alt text](Botinec.png)

## How to use it?

1. run `npm install`
2. run `npm run dev`
3. project will automatically open in your browser
4. to **view it on mobile**, after running `npm install` look for the **Network** address in the console.
5. run `npm run build` to build for deployment. This will also create `stats.html` file which is a **Rollup Visualizer** that we can open in any browser
6. `npm run preview` to locally preview the production build

7. `npm run test` to run vitest
8. `npm run coverage` to generate coverage report

## Texture size

The biggest files are textures. If faster performance is needed, you can easily reduce the quality of texture images for faster load.

## Controls

`Desktop`

- Left Mouse - Move
- Right Mouse - Rotate
- Scroll Wheel - Zoom In/Out
- SHIFT + Left Mouse(Drag) - Select location

`Mobile`

- One finger - Move
- Two fingers - Rotate
- Pinch - Zoom In/Out

## What does it include?

- `typescript`
- `tailwindcss` for custom styles
- `shadcnui` library for css components
- `threejs`, `react-three/drei`, `react-three-fiber`, `react-map-gl`, `mapbox` installed and configure
- `vite` and `vite.config.js` file. `Rollup` is used for bundling
- `tests`configured tests(vitest) for use with typescript. Added node.js.yml file to trigger github actions and run tests on push to main branch.
- `performance` keep eye on performance using r3f-perf
- `eslint` configured with custom rules
- `leva` GUI installed and configured to be used with basic features needed for webgl. Make your scene perfect using leva controls for:

  - _canvas control_
  - _directional light control_
  - _shadow camera control_
  - _soft shadow control_
  - _environment map control_
  - _background control_
  - _axes helper control_
  - _grid helper control_
  - _performance monitor(Perf) control_

  To show/hide the GUI press **"h"** on the keyboard.

  This features can be easily turned off/on or changed.

  Leva also exports `set` function that can be used to control it outside of GUI

- `preparation` for easy loading and implementation:

  - **model loading** - takes compressed and normal version (.glb),
  - **texture loading** - add any texture (diffuse, AO...),
  - **environment map loading**
  - **assets preloading** - assets like model, texture, hdr... are preloaded so that app starts quicker
