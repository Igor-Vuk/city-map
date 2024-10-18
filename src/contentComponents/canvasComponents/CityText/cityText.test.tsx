import { describe, expect, it, vi } from "vitest"
import { forwardRef } from "react"
import ReactThreeTestRenderer from "@react-three/test-renderer"

import CityText from "./CityText"

/* Mock must be declared before importing the component but it is hoisted, 
meaning it will always be executed before any other code, regardless of where it's placed in the file. */

/* ------------------------- */
/* Without this we are getting warning "WARNING: Multiple instances of Three.js being imported". This forces Vitest to use the 
same instance of three.js for both the test and the application code. */
vi.mock("three", () => {
  /* require.resolve("three") gives the exact file path where the module is located without actually importing it and require() 
  actually loads that module. This ensures that Vitest uses the exact same instance of three.js across app and the test environment, 
  preventing the "multiple instances of Three.js" */
  return require(require.resolve("three"))
})
/* ------------------------- */

/* This is telling Vitest that anytime we import something from drei , it will use mock instead of library */
vi.mock("@react-three/drei", async () => {
  /* Dynamically import the actual module. This allows us to mock only 
  specific parts of the module while leaving the rest unchanged. In this case we only want to mock Text component*/
  const actual = (await vi.importActual("@react-three/drei")) as any

  /* React.forwardRef allows you to pass a ref through a component to one of its child DOM nodes. 
    This is important because your CityText component relies on the textRef to control the text's orientation. */
  const MockText = forwardRef(({ children, ...props }: any, ref: any) => {
    return (
      /* Instead of rendering Text we change it with mesh and just pass props to it and text */
      <mesh {...props} text={children[0]} ref={ref} name="MockTextMesh">
        {children}
      </mesh>
    )
  })

  MockText.displayName = "MockText"

  return {
    ...actual,
    Text: MockText,
  }
})

describe("CityText Component", () => {
  it('renders text "Hello world!"', async () => {
    const renderer = await ReactThreeTestRenderer.create(<CityText />)

    const meshChildren = renderer.scene.allChildren
    expect(meshChildren.length).toBe(14)
  })
})
