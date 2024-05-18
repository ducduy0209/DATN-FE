import React, { memo } from "react"
import { Avatar, Tooltip } from "@nextui-org/react"
import { usePathname } from "next/navigation"
import { SidebarItem } from "./SidebarItem"
import Icon from "@components/icons"
import { SidebarMenu } from "./SidebarMenu"
import { CollapseItems } from "./CollapseItem"
import { Sidebar } from "./sidebar.style"

export const SidebarWrapper = memo(() => {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 z-[20] h-screen border-r-2 px-8">
      <div>
        <div className="flex h-full flex-col justify-between">
          <div className={Sidebar.Body()}>
            <SidebarItem title="Trang chủ" icon={<Icon name="home" />} isActive={pathname === "/admin"} href="/admin" />
            <SidebarMenu title="Management">
              <SidebarItem
                isActive={pathname === "/admin/manage-users"}
                title="Manage Users"
                icon={<Icon name="user" />}
                href="/admin/manage-users"
              />
              <SidebarItem
                isActive={pathname === "/admin/manage-books"}
                title="Manage Books"
                icon={<Icon name="user" />}
                href="/admin/manage-books"
              />
              <SidebarItem
                isActive={pathname === "/admin/manage-genres"}
                title="Manage Genres"
                icon={<Icon name="user" />}
                href="/admin/manage-genres"
              />
              <SidebarItem
                isActive={pathname === "/admin/manage-records"}
                title="Manage Records"
                icon={<Icon name="user" />}
                href="/admin/manage-records"
              />
              <SidebarItem
                isActive={pathname === "/admin/manage-banners"}
                title="Manage Banners"
                icon={<Icon name="user" />}
                href="/admin/manage-banners"
              />
              <SidebarItem
                isActive={pathname === "/admin/manage-affiliates"}
                title="Manage Affiliates"
                icon={<Icon name="user" />}
                href="/admin/manage-affiliates"
              />
            </SidebarMenu>
            <SidebarMenu title="Thống kê">
              <SidebarItem
                isActive={pathname === "/admin/top-seller-books"}
                title="Top 10 sách bán chạy"
                icon={<Icon name="book" />}
                href="/admin/top-seller-books"
              />
              <SidebarItem
                isActive={pathname === "/admin/top-bad-seller-books"}
                title="Top 10 sách bán chậm"
                href="/admin/top-bad-seller-books"
                icon={<Icon name="book-dashed" />}
              />
            </SidebarMenu>
          </div>
          <div className={Sidebar.Footer()}>
            <Tooltip content={"Settings"} color="primary">
              <div className="max-w-fit">
                <Icon name="settings" />
              </div>
            </Tooltip>
            <Tooltip content={"Adjustments"} color="primary">
              <div className="max-w-fit">
                <Icon name="filter" />
              </div>
            </Tooltip>
            <Tooltip content={"Profile"} color="primary">
              <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" size="sm" />
            </Tooltip>
          </div>
        </div>
      </div>
    </aside>
  )
})
