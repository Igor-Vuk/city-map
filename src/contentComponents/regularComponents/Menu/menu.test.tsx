import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ReactElement, FC, useRef } from "react"
import { MapRef } from "react-map-gl"
import { Toaster } from "@/components/ui/toaster"
import Menu from "./Menu"

/**
 * ? if Vitest runner in VS code is not reloading tests on file change, try to disable "TypeScript > Tsserver > Experimental" in settings
 */

function setup(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  }
}

const MenuMock: FC = () => {
  const mapRef = useRef<MapRef>(null)
  return <Menu mapRef={mapRef} />
}

describe("Menu Component", () => {
  it("shows Menu button", async () => {
    render(<MenuMock />)

    const menuButton = screen.getByRole("button", { name: /Menu/i })
    expect(menuButton).toBeInTheDocument()
  })

  it("should open dropdown menu when Menu button is clicked", async () => {
    const { user } = setup(<MenuMock />)

    const menuButton = screen.getByRole("button", { name: /Menu/i })

    /* We await for userEvent to finishes and dropdown menu to render before continuing. We need this because if we have only 
    `await screen.findAllByRole("button")` it would trigger immediately because there already is a "button" in the DOM that it 
    would find, Menu button */
    await user.click(menuButton)

    /* When we click on Menu button, dropdown opens and Menu button gets wrapped in aria-hidden=true div. 
    In this case that element is not accessible anymore through "getByRole" and "findByRole" methods.
    If we wanna make it accessible again we need to say hidden: true */
    const dropdownMenuButtons = await screen.findAllByRole("button", {
      hidden: true,
    })

    expect(dropdownMenuButtons.length).toBe(3)
  })

  it("should open dropdown menu when Navigation button is clicked", async () => {
    const { user } = setup(<MenuMock />)

    const menuButton = screen.getByRole("button", { name: /Menu/i })

    await user.click(menuButton)

    const dropdownNavigationButton = await screen.findByRole("button", {
      name: /Navigation/i,
    })

    await user.click(dropdownNavigationButton)

    const dropdownBotinecButton = await screen.findByRole("button", {
      name: /Botinec/i,
    })

    expect(dropdownBotinecButton).toBeInTheDocument()
  })

  it("should open toast when click on 'i' button", async () => {
    // Toaster component is in Experience.tsx not Menu.tsx so we must render it  here again in order to show up

    const { user } = setup(
      <>
        <MenuMock />
        <Toaster />
      </>,
    )

    const menuButton = screen.getByRole("button", { name: /Menu/i })

    user.click(menuButton)

    const dropdownNavigationButton = await screen.findByRole("button", {
      name: /Navigation/i,
    })

    await user.click(dropdownNavigationButton)

    const toastNavigationButton = await screen.findByLabelText(
      /Show Navigation controls/i,
    )

    await user.click(toastNavigationButton)

    /* We can use timeout also like this  ```const toastInfo = await screen.findByText(/Left Mouse - Move/i, {}, { timeout: 5000 })``` 
    Max is 5000ms because by default Vitest sets a max duration of 5000ms for each test
    */
    const toastInfo = await screen.findByText(/Left Mouse - Move/i)

    expect(toastInfo).toBeInTheDocument()
  })

  it("links should have expected a tag attributes", async () => {
    const { user } = setup(<MenuMock />)

    const menuButton = screen.getByRole("button", { name: /Menu/i })

    await user.click(menuButton)

    const dropdownMadeByButton = await screen.findByRole("button", {
      name: /Made By/i,
    })

    await user.click(dropdownMadeByButton)

    const linkedInLink = await screen.findByRole("link", {
      name: /LinkedIn/i,
    })

    const GitHubLink = await screen.findByRole("link", {
      name: /GitHub/i,
    })

    const expectedLinkedInAttributes = {
      href: "https://www.linkedin.com/in/igorvukelic/",
      target: "_blank",
      rel: "noopener noreferrer",
    }

    const expectedGitHubAttributes = {
      href: "https://github.com/Igor-Vuk",
      target: "_blank",
      rel: "noopener noreferrer",
    }

    // Create an object of the actual attributes from the DOM element
    const actualLinkedInAttributes = {
      href: linkedInLink.getAttribute("href"),
      target: linkedInLink.getAttribute("target"),
      rel: linkedInLink.getAttribute("rel"),
    }

    const actualGitHubAttributes = {
      href: GitHubLink.getAttribute("href"),
      target: GitHubLink.getAttribute("target"),
      rel: GitHubLink.getAttribute("rel"),
    }

    // Compare the actual attributes with the expected attributes
    expect(actualLinkedInAttributes).toEqual(expectedLinkedInAttributes)
    expect(actualGitHubAttributes).toEqual(expectedGitHubAttributes)
  })
})
