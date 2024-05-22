import { AdminLayout } from "@components/layouts/adminLayout"
import { API_ENDPOINT, DataWithPagination } from "@models/api"
import { BOOK_LANGUAGES, Book } from "@models/book"
import {
  Avatar,
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
  Image,
  Checkbox,
} from "@nextui-org/react"
import { DatePicker } from "@nextui-org/date-picker"
import { parseDate, getLocalTimeZone, DateValue } from "@internationalized/date"
import React, { ChangeEvent, useEffect, useState } from "react"
import { Response } from "@models/api"
import { CustomButton } from "@components/common/CustomButton"
import moment from "moment"
import Icon from "@components/icons"
import { useBoundStore } from "@zustand/total"
import { NOTIFICATION_TYPE, notify } from "@utils/notify"
import { Category } from "@models/category"
import { ROLE_ACCOUNT, User } from "@models/user"

type Column = {
  name: string
  uid: string
}

type Price = {
  duration: string
  price: number
}

type BookSelected = {
  title: string
  author: string
  published_date?: string
  isbn: string
  summary: string
  cover_image: string
  total_book_pages: number
  digital_content: number
  prices: Price[]
  languange: BOOK_LANGUAGES
  price: number
}

const columns: Column[] = [
  { name: "NAME", uid: "name" },
  { name: "EMAIL", uid: "email" },
  { name: "ROLE", uid: "role" },
  { name: "REFER CODE", uid: "refer_code" },
  { name: "IS EMAIL VERIFIED", uid: "is_email_verified" },
  { name: "ACTION", uid: "action" },
]

const ManageUsers = () => {
  const [search, setSearch] = useState<string>("")
  const [page, setPage] = useState<number>(1)
  const [users, setBooks] = useState<DataWithPagination<User[]>>()
  const [limit, setLimit] = useState<number>(5)
  const [isStaleData, setIsStaleData] = useState<boolean>(false)
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const [userSelected, setUserSelected] = useState<User | null>(null)
  const [userId, setUserId] = useState<string>("")
  const [previewImage, setPreviewImage] = useState<string>()
  const [password, setPassword] = useState<string>("")

  const { authInfo } = useBoundStore((state) => ({
    authInfo: state.authInfo,
  }))

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleDeleteUser = async (userId: string) => {
    const response = await fetch(API_ENDPOINT + `/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authInfo.access?.token}`,
      },
    })
    if (response.status === 204) {
      notify(NOTIFICATION_TYPE.SUCCESS, "Tài khoản đã được xoá thành công")
      setIsStaleData(!isStaleData)
    } else {
      notify(NOTIFICATION_TYPE.ERROR, "Có lỗi xảy ra, vui lòng thử lại")
    }
  }

  const handleUpdateUser = async () => {
    const response = await fetch(API_ENDPOINT + `/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authInfo.access?.token}`,
      },
      body: JSON.stringify({
        name: userSelected?.name,
        email: userSelected?.email,
        role: userSelected?.role,
        isActive: userSelected?.isActive,
        isEmailVerified: userSelected?.isEmailVerified,
        image: previewImage,
      }),
    })
    if (response.status === 200) {
      notify(NOTIFICATION_TYPE.SUCCESS, "Cập nhật thông tin sách thành công")
      handleCloseModal()
      setIsStaleData(!isStaleData)
    } else {
      handleCloseModal()
      const raw = (await response.json()) as Response<any>
      notify(NOTIFICATION_TYPE.ERROR, raw?.message ? raw?.message : "Có lỗi xảy ra, vui lòng thử lại")
    }
  }

  const handleCreateUser = async () => {
    const response = await fetch(API_ENDPOINT + `/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authInfo.access?.token}`,
      },
      body: JSON.stringify({
        name: userSelected?.name,
        email: userSelected?.email,
        role: userSelected?.role,
        my_refer_code: userSelected?.my_refer_code,
        isEmailVerified: userSelected?.isEmailVerified,
        image: previewImage,
        password,
      }),
    })
    if (response.status === 201) {
      notify(NOTIFICATION_TYPE.SUCCESS, "Tạo tài khoản thành công")
      setIsStaleData(!isStaleData)
    } else {
      const raw = (await response.json()) as Response<any>
      notify(NOTIFICATION_TYPE.ERROR, raw?.message ? raw.message : "Có lỗi xảy ra, vui lòng thử lại")
    }
    handleCloseModal()
    setPassword("")
  }

  useEffect(() => {
    const handleFetchBook = async () => {
      let params = `/users?page=${page}&limit=${limit}`
      if (search) {
        params += `&name=${search}`
      }
      const response = await fetch(API_ENDPOINT + params, {
        headers: {
          authorization: `Bearer ${authInfo?.access?.token}`,
        },
      })
      const raw = (await response.json()) as Response<any>
      console.log(raw)
      if (raw.status === "success") {
        setBooks(raw.data.result as DataWithPagination<User[]>)
      }
    }
    handleFetchBook()
  }, [page, search, isStaleData])

  const handleEdit = (user: User) => {
    setUserSelected(user)
    setUserId(user?.id?.toString() ?? "")
    onOpen()
  }

  const handleChangeUserSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value
    setUserSelected({
      ...userSelected,
      [name]: value,
    })
  }

  const handleCloseModal = () => {
    setUserId("")
    setUserSelected(null)
    setPreviewImage("")
    onClose()
  }

  const handleUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0]
      const reader = new FileReader()

      reader.onload = () => {
        const dataUrl = reader.result as string
        console.log(dataUrl)
        setPreviewImage(dataUrl)
      }

      if (selectedFile) {
        reader.readAsDataURL(selectedFile)
      }
    }
  }

  return (
    <AdminLayout>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        placement="center"
        size="5xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {userId ? "Update Account" : "Create New Account"}
              </ModalHeader>
              <ModalBody>
                <Input label="Name" name="name" value={userSelected?.name} onChange={handleChangeUserSelected} />
                <Input label="Email" name="email" value={userSelected?.email} onChange={handleChangeUserSelected} />
                {!userId && (
                  <Input
                    label="Password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                )}
                <div className="flex items-center gap-2">
                  <p className="text-sm">Role</p>
                  <CustomButton
                    isGhost={userSelected?.role !== ROLE_ACCOUNT.USER}
                    onClick={() => setUserSelected({ ...userSelected, role: ROLE_ACCOUNT.USER })}
                  >
                    USER
                  </CustomButton>
                  <CustomButton
                    isGhost={userSelected?.role !== ROLE_ACCOUNT.ADMIN}
                    onClick={() => setUserSelected({ ...userSelected, role: ROLE_ACCOUNT.ADMIN })}
                  >
                    ADMIN
                  </CustomButton>
                </div>
                <p className="-mb-2 text-sm">Ảnh đại diện của bạn</p>
                <input type="file" name="image" accept="image/*" onChange={handleUploadFile} />
                {previewImage ? (
                  <Image src={previewImage} alt="Ảnh đại diện" width={200} />
                ) : (
                  userSelected?.image && <Image src={userSelected?.image} width={200} />
                )}
                {userId && (
                  <Checkbox
                    isSelected={userSelected?.isActive}
                    onValueChange={(isSelected: boolean) => setUserSelected({ ...userSelected, isActive: isSelected })}
                  >
                    Active
                  </Checkbox>
                )}
                <Checkbox
                  isSelected={userSelected?.isEmailVerified}
                  onValueChange={(isSelected: boolean) =>
                    setUserSelected({ ...userSelected, isEmailVerified: isSelected })
                  }
                >
                  Verify Email
                </Checkbox>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleCloseModal}>
                  Close
                </Button>
                {userId ? (
                  <CustomButton color="green" onPress={handleUpdateUser}>
                    Update
                  </CustomButton>
                ) : (
                  <CustomButton color="green" onPress={handleCreateUser}>
                    Create
                  </CustomButton>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="px-8 py-4">
        <div className="mb-8 flex items-center gap-4">
          <Input label="Search by name" size="sm" onChange={handleChangeSearch} />
          <CustomButton color="green" onClick={onOpen}>
            Add New
          </CustomButton>
        </div>
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-400">Total: {users?.totalResults} users</p>
            <Pagination showControls total={users?.totalPages ?? 1} page={page} color="success" onChange={setPage} />
          </div>
          <Table aria-label="Example table with custom cells">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            {users?.results?.length ? (
              <TableBody items={users.results}>
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell className="flex items-center gap-2">
                      {item?.image === "default.jpg" ? (
                        <Avatar size="sm" src={`http://localhost:3000/img/users/${item?.image}`} className="border-2" />
                      ) : (
                        <Avatar size="sm" src={item?.image} className="border-2" />
                      )}
                      {item.name}
                    </TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell className="font-semibold uppercase">
                      <Chip color={item.role === ROLE_ACCOUNT.ADMIN ? "success" : "warning"}>{item.role}</Chip>
                    </TableCell>
                    <TableCell>{item.my_refer_code}</TableCell>
                    <TableCell>
                      <Chip color={item.isEmailVerified ? "success" : "danger"}>
                        {item.isEmailVerified ? <Icon name="check" /> : <Icon name="x" />}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Chip color="success" className="cursor-pointer text-white" onClick={() => handleEdit(item)}>
                          Edit
                        </Chip>
                        <Chip
                          color="danger"
                          className="cursor-pointer"
                          onClick={() => handleDeleteUser(item?.id?.toString() ?? "")}
                        >
                          Delete
                        </Chip>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            ) : (
              <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
            )}
          </Table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default ManageUsers
