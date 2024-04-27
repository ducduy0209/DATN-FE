import Image from "next/image"
import Link from "next/link"
import React, { memo, useEffect, useRef, useState } from "react"
import { useClickOutside } from "@hooks/useClickOutside"
import Navigation from "./components/Navigation"
import { useBoundStore } from "@zustand/total"

const SCROLL_THRESHOLD = 100

const Header = () => {
  const [isTransParent, setIsTransParent] = useState<boolean>(false)
  const [isOpenDropDownMenu, setIsOpenDropDownMenu] = useState<boolean>(false)
  const toggleRef = useRef<HTMLDivElement>(null)
  const dropDownRef = useRef<HTMLDivElement>(null)

  useClickOutside(dropDownRef, toggleRef, () => setIsOpenDropDownMenu(false))

  useEffect(() => {
    const changeColor = () => {
      if (window.scrollY >= SCROLL_THRESHOLD) {
        setIsTransParent(true)
      } else {
        setIsTransParent(false)
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", changeColor)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", changeColor)
      }
    }
  }, [])

  const { removeAuthInfo } = useBoundStore((store) => ({
    removeAuthInfo: store.removeAuthInfo,
  }))

  return (
    <div
      className={`sticky top-0 z-[999] h-10 ${
        isTransParent ? "bg-black/30 backdrop-blur-lg" : "bg-theme shadow-lg"
      } z-99 flex w-screen items-center justify-between p-8 text-slate-900`}
    >
      <div className="logo-block flex items-center gap-8">
        <div className="logo">
          <Link href="/">
            <Image width={50} height={50} alt="logo" src="/images/logo.png"></Image>
          </Link>
        </div>
        <div className="main-container">
          <Link href="/">
            <p className="text-xl font-bold">
              <span className="text-white">BOOSTERA</span>
            </p>
            <span className="font-bold text-red-500">LOL ELO BOOST</span>
          </Link>
        </div>
      </div>
      <Navigation />
    </div>
  )
}

export default memo(Header)
