/* This gives us ability to use jest-dom matchers with Vitest, like toBeInTheDocument, toBeDisabled...*/
import "@testing-library/jest-dom/vitest"

import { afterEach } from "vitest" // Vitest's hook that runs after each test
import { cleanup } from "@testing-library/react" // Function to clean up the DOM after each test

// Runs `cleanup` after each test case to prevent memory leaks and ensure tests are isolated
afterEach(() => {
  cleanup()
})
