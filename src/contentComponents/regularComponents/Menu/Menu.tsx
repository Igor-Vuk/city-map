import { FC } from "react"
import { MenuProps } from "../regularComponents.types.ts"
/* shadcn components */
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import {
  HomeIcon,
  LinkedInLogoIcon,
  GitHubLogoIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons"
import { useToast } from "@/components/hooks/use-toast"
/* -------------------------------------------------------------- */

const Menu: FC<MenuProps> = ({ mapRef }) => {
  const { toast } = useToast()

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

  const handleToastOpen = (): void => {
    toast({
      className:
        "rounded-3xl border-2 border-black bg-white px-10 py-4 font-menu text-4xl shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)]",
      title: "NAVIGATION",
      description: (
        <div className="space-y-2 text-sm">
          {/* Adds spacing between lines */}
          <p>Left Mouse - Move</p>
          <p>Right Mouse - Rotate</p>
          <p>SHIFT + Left Mouse(Drag) - Select location</p>
        </div>
      ),
    })
  }
  return (
    <div className="m-4 flex items-center justify-center md:m-12 md:justify-start">
      <DropdownMenu>
        <DropdownMenuTrigger
          className={`z-10 rounded-3xl border-2 border-black bg-white px-6 py-2 font-menu text-3xl font-semibold 
            shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)]  
          `}
        >
          Menu
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={`
            mt-2 min-w-52 rounded-3xl border-2 border-black bg-white font-menu text-lg 
            shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] 
            `}
        >
          <Accordion type="single" collapsible className="p-2">
            <AccordionItem value="item-1">
              <AccordionTrigger className="px-3 hover:no-underline">
                Navigation
              </AccordionTrigger>

              <AccordionContent onClick={handleDivClick}>
                <Button variant="ghost">
                  <HomeIcon className="mr-2 size-4" />
                  Botinec
                </Button>
                <DropdownMenuSeparator />
              </AccordionContent>

              <AccordionContent className="flex justify-end pb-2">
                <Button
                  className="z-10 h-4 rounded-full p-0"
                  onClick={handleToastOpen}
                >
                  <InfoCircledIcon className=" size-4" />
                </Button>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-none">
              <AccordionTrigger className="px-3  hover:no-underline">
                Made By
              </AccordionTrigger>
              <AccordionContent>
                <Button variant="ghost" asChild>
                  <a
                    href="https://www.linkedin.com/in/igorvukelic/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedInLogoIcon className="size-6" />
                  </a>
                </Button>
                <Button variant="ghost" asChild>
                  <a
                    href="https://github.com/Igor-Vuk"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GitHubLogoIcon className="size-6" />
                  </a>
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default Menu
