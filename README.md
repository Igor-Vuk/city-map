# CITY MAP

Interactive 3D Map, improved with custom models

## How to use it?

1. run `npm install`
2. run `npm run dev`
3. project will automatically open in your browser
4. to **view it on mobile**, after running `npm install` look for the **Network** address in the console.
5. run `npm run build` to build for deployment. This will also create `stats.html` file which is a **Rollup Visualizer** that we can open in any browser
6. `npm run preview` to locally preview the production build

7. `npm run test` to run vitest
8. `npm run coverage` to generate coverage report

## What does it include?

- `typescript`
- `three`, `react-three/drei` and `react-three-fiber` installed and configure
- `vite` and `vite.config.js` file. `Rollup` is used for bundling
- `tests`configured tests(vitest) for use with typescript. Added node.js.yml file to trigger github actions and run tests on push to main branch.
- `leva` GUI installed and configured to be used with basic features needed for webgl. Make your scene perfect using leva controls for:

  - _canvas control_
  - _camera control_
  - _controls control_
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
  - **action, morph, skinned animation loading** - just play different type of animations
  - **curve loading and follow path** - by loading `.json` file with vertices coordinate and calling the `curveMethod` function we can load curves as a mesh or make object follow them (example included)
  - **assets preloading** - assets like model, texture, hdr... are preloaded so that app starts quicker

- `Custom shaders loading` - create your own custom shaders. Ability to load `.glsl` files is added to vite. Basic fragment and vertex shader example is added and loaded using `shaderMaterial` from drei for ease of use with react components. Hot reload for fragment and vertex shader files is also implemented.

- `Physics` - implement physics easy using **react-three-rapier** library.

- `Custom collection names` - render specific model collections in every components based on custom properties

- `Suspense` for loading included with option to use **fallback** or **Loader** from drei

- `eslint` and `.eslintrc.cjs` configured for linting the files
- `prettier` and `prettierrc.json` configured for code formatting

  - recommended VSCode extensions are: **ESlin** and **Prettier ESLint** in order to make linting and formatting live while typing

- `index.css` file for styling, includes `shadcn` library and `tailwind`
