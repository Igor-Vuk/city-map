import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import TestComp from "./TestComp.tsx"

/**
 * ? if Vitest runner in VS code is not reloading tests on file change, try to disable "TypeScript > Tsserver > Experimental" in settings
 */

// TODO - don+t forget to exclude test from final bundle. Do this after testing component that has imports
describe("test render", () => {
  it("find elements by role", async () => {
    render(<TestComp number={10} />)
    const navigation = screen.getByRole("heading", { name: "10 Big" })
    expect(navigation).toBeTruthy()
  })
})
