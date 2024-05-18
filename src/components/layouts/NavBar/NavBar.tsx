import { Input, Link, Navbar, NavbarContent } from "@nextui-org/react"
import React, { memo } from "react"
import { UserDropdown } from "./UserDropdown"
import Icon from "@components/icons"

interface Props {
  children: React.ReactNode
}

export const NavbarWrapper = memo(({ children }: Props) => {
  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <Navbar
        isBordered
        className="flex w-full justify-end"
        classNames={{
          wrapper: "w-full max-w-full",
        }}
      >
        <NavbarContent className="w-full"></NavbarContent>
        <NavbarContent justify="end" className="flex w-fit justify-end data-[justify=end]:flex-grow-0">
          <UserDropdown />
        </NavbarContent>
      </Navbar>
      {children}
    </div>
  )
})
