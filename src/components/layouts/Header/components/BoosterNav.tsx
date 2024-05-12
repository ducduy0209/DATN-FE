import { Avatar } from "@nextui-org/react"
import Link from "next/link"
import React, { useRef, useState } from "react"
import { useClickOutside } from "@hooks/useClickOutside"
import { useBoundStore } from "@zustand/total"
import DropDownMenu from "./DropDownMenu"
import { CustomButton } from "@components/common/CustomButton"
const BoosterNav = () => {
  const [isOpenDropDownMenu, setIsOpenDropDownMenu] = useState<boolean>(false)
  const toggleRef = useRef<HTMLDivElement>(null)
  const dropDownRef = useRef<HTMLDivElement>(null)
  useClickOutside(dropDownRef, toggleRef, () => setIsOpenDropDownMenu(false))

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    setIsOpenDropDownMenu((prev) => !prev)
  }

  const { accountInfo, removeAccountInfo } = useBoundStore((store) => ({
    accountInfo: store.accountInfo,
    removeAccountInfo: store.removeAccountInfo,
  }))

  return (
    <div className="flex items-center gap-4 font-semibold">
      <Link href="/cart">
        <CustomButton>Giỏ Sách</CustomButton>
      </Link>
      <div className="relative" ref={toggleRef} onMouseDown={handleMouseDown}>
        <div className="bg-green flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-1 text-sm font-semibold text-black transition-all delay-75 hover:border-white hover:bg-green-400 hover:text-white">
          {accountInfo?.image ? (
            <Avatar size="sm" src={accountInfo?.image} className="border-2" />
          ) : (
            <Avatar size="sm" name={accountInfo?.name} />
          )}
          {accountInfo?.name?.slice(0, 7)}...
        </div>
        <div
          className={`absolute left-0 top-14 shadow-xl ${isOpenDropDownMenu ? "menu-show" : "menu-hidden"}`}
          ref={dropDownRef}
        >
          <DropDownMenu />
        </div>
      </div>
    </div>
  )
}

export default BoosterNav
