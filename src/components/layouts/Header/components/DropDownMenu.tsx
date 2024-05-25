import { Avatar } from "@nextui-org/react"
import Link from "next/link"
import React, { ChangeEvent, useState } from "react"
import colors from "tailwindcss/colors"
import { useBoundStore } from "@zustand/total"
import { useRouter } from "next/router"
import { ROLE_ACCOUNT } from "@models/user"
import { CustomButton } from "@components/common/CustomButton"

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
    route.push("/")
  }

  return (
    <div className="z-[999] h-fit w-52 rounded-lg bg-white text-black">
      <div className="p-8 text-center">
        <div className="flex flex-col items-center gap-1 text-center text-sm font-normal text-gray-400">
          {accountInfo?.image ? (
            <Avatar size="sm" src={`  http://localhost:3000/img/users/${accountInfo?.image}`} name={accountInfo?.name} isBordered color="success" />
          ) : (
            <Avatar size="sm" name={accountInfo?.name} isBordered color="success" />
          )}
        </div>
        <p className="my-2 font-medium">{accountInfo?.name}</p>
      </div>
      <div className="flex flex-col gap-4 border-t border-gray-300 p-4">
        <div>
          <Link
            className="hover cursor-pointer rounded-md border-b-1 px-4 py-2 hover:bg-white hover:text-black"
            href={"/profile/purchased-books"}
          >
            <p>Sách đã mua</p>
          </Link>
          <Link
            href={"/profile/my-account"}
            className="hover mb-2 cursor-pointer rounded-md border-b-1 px-4 py-2 hover:bg-white hover:text-black"
          >
            <p>Thông tin tài khoản</p>
          </Link>
          <Link
            href={"/profile/change-password"}
            className="hover mb-2 cursor-pointer rounded-md border-b-1 px-4 py-2 hover:bg-white hover:text-black"
          >
            <p>Đổi mật khẩu</p>
          </Link>
          <Link
            href={"/profile/purchase-history"}
            className="hover mb-2 cursor-pointer rounded-md border-b-1 px-4 py-2 hover:bg-white hover:text-black"
          >
            <p>Lịch sự mua hàng</p>
          </Link>
          <Link
            href={"/profile/referral"}
            className="hover mb-2 cursor-pointer rounded-md border-b-1 px-4 py-2 hover:bg-white hover:text-black"
          >
            <div>Tiếp thị liên kết</div>
          </Link>
        </div>

        <br />
        <CustomButton onClick={onLogout} color="green">
          Đăng xuất
        </CustomButton>
      </div>
    </div>
  )
}

export default DropDownMenu
