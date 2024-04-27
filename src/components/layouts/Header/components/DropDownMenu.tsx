import { Avatar } from "@nextui-org/react"
import Link from "next/link"
import React, { ChangeEvent, useState } from "react"
import colors from "tailwindcss/colors"
import { ROLE_ACCOUNT } from "@models/common"
import { useBoundStore } from "@zustand/total"
import CustomButton from "../../../common/CustomButton"
import { useRouter } from "next/router"
// const colors = require("tailwindcss/colors")



const DropDownMenu = () => {
  const { accountInfo, removeAccountInfo, removeAuthInfo } = useBoundStore((store) => ({
    accountInfo: store.accountInfo,
    removeAccountInfo: store.removeAccountInfo,
    removeAuthInfo: store.removeAuthInfo,
  }))

  const route = useRouter()

  const onLogout = () => {
    removeAccountInfo()
    removeAuthInfo()
    route.push('/')
  }

  return (
    <div className="z-[999] h-fit w-52 rounded-lg bg-gray-900 text-white">
      <div className="p-8 text-center">
        <p className="my-2 font-medium">{accountInfo.username}</p>

        <div className="flex flex-col items-center gap-1 text-center text-sm font-normal text-gray-400">
          <Avatar />
          In-game Name
        </div>
      </div>
      <div className="flex flex-col gap-4 border-t border-gray-300 p-4">
        {accountInfo.role === "customer" && (
          <div>
            <div className="hover cursor-pointer rounded-md px-4 py-2 hover:bg-white hover:text-black">
              <Link href={"/my-jobs"}>My Jobs</Link>
            </div>
            <div className="hover mb-2 cursor-pointer rounded-md px-4 py-2 hover:bg-white hover:text-black">
              <Link href={"/edit-profile"}>Edit Profile</Link>
            </div>
            <hr
              style={{
                borderColor: colors.gray[100],
                height: "0.5px",
              }}
            />
            <div className="hover mt-2 cursor-pointer rounded-md px-4 py-2 hover:bg-white hover:text-black">
              <Link href={"/messages"}>Messages</Link>
            </div>
            <div className="hover mt-2 cursor-pointer rounded-md px-4 py-2 hover:bg-white hover:text-black">
              <Link href="/payment-account">Payment Information</Link>
            </div>
            <div className="hover mt-2 cursor-pointer rounded-md px-4 py-2 hover:bg-white hover:text-black">
              <Link href="/change-password">Change Password</Link>
            </div>
          </div>
        )}

        <br />
        <CustomButton label="Log out" onClick={onLogout} customClassName="bg-red-500 hover:bg-red-600" />
      </div>
    </div>
  )
}

export default DropDownMenu
