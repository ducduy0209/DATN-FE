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
  const [bookSelected, setBookSelected] = useState<BookSelected>({
    title: "",
    author: "",
    published_date: undefined,
    isbn: "",
    summary: "",
    cover_image: "",
    total_book_pages: 0,
    digital_content: 0,
    prices: [{ duration: "1 month", price: 0 }],
    languange: BOOK_LANGUAGES.VI,
    price: 0,
  })
  const [bookId, setBookId] = useState<string>("")

  const { authInfo } = useBoundStore((state) => ({
    authInfo: state.authInfo,
  }))

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1)
  }

  // const handleDeleteBook = async (bookId: string) => {
  //   const response = await fetch(API_ENDPOINT + `/books/${bookId}`, {
  //     method: "DELETE",
  //     headers: {
  //       "Content-Type": "application/json",
  //       authorization: `Bearer ${authInfo.access?.token}`,
  //     },
  //   })
  //   if (response.status === 204) {
  //     notify(NOTIFICATION_TYPE.SUCCESS, "Sách đã được xoá thành công")
  //     setIsStaleData(!isStaleData)
  //   } else {
  //     notify(NOTIFICATION_TYPE.ERROR, "Có lỗi xảy ra, vui lòng thử lại")
  //   }
  // }

  // const handleFetchBook = async (slug: string) => {
  //   const response = await fetch(API_ENDPOINT + `/books/search/${slug}`)
  //   const raw = (await response.json()) as Response<{ book: Book }>
  //   if (raw.data?.book) {
  //     const newBookSelected = raw.data.book
  //     setBookId(newBookSelected.id)
  //     setBookSelected({
  //       title: newBookSelected.title,
  //       author: newBookSelected.author,
  //       published_date: newBookSelected.published_date.toString(),
  //       isbn: newBookSelected.isbn,
  //       summary: newBookSelected.summary,
  //       cover_image: newBookSelected.cover_image,
  //       total_book_pages: newBookSelected.total_book_pages,
  //       digital_content: newBookSelected.digital_content,
  //       prices: [{ duration: "", price: 0 }],
  //       languange: newBookSelected.languange,
  //       price: newBookSelected.price,
  //     })
  //   }
  // }

  // const handleUpdateBook = async () => {
  //   const response = await fetch(API_ENDPOINT + `/books/${bookId}`, {
  //     method: "PATCH",
  //     headers: {
  //       "Content-Type": "application/json",
  //       authorization: `Bearer ${authInfo.access?.token}`,
  //     },
  //     body: JSON.stringify({
  //       ...bookSelected,
  //     }),
  //   })
  //   if (response.status === 200) {
  //     notify(NOTIFICATION_TYPE.SUCCESS, "Cập nhật thông tin sách thành công")
  //     setIsStaleData(!isStaleData)
  //   } else {
  //     notify(NOTIFICATION_TYPE.ERROR, "Có lỗi xảy ra, vui lòng thử lại")
  //   }
  // }

  // const handleCreateBook = async () => {
  //   const response = await fetch(API_ENDPOINT + `/books`, {
  //     method: "CREATE",
  //     headers: {
  //       "Content-Type": "application/json",
  //       authorization: `Bearer ${authInfo.access?.token}`,
  //     },
  //     body: JSON.stringify({
  //       ...bookSelected,
  //     }),
  //   })
  //   if (response.status === 200) {
  //     notify(NOTIFICATION_TYPE.SUCCESS, "Cập nhật thông tin sách thành công")
  //     setIsStaleData(!isStaleData)
  //   } else {
  //     notify(NOTIFICATION_TYPE.ERROR, "Có lỗi xảy ra, vui lòng thử lại")
  //   }
  // }

  useEffect(() => {
    const handleFetchBook = async () => {
      let params = `/users?page=${page}&limit=${limit}`
      if (search) {
        params += `&search=${search}`
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

  // const handleEdit = (slug: string) => {
  //   handleFetchBook(slug)
  //   onOpen()
  // }

  // const handleChangeBookSelected = (e: ChangeEvent<HTMLInputElement>) => {
  //   const name = e.target.name
  //   const value = e.target.value
  //   setBookSelected({
  //     ...bookSelected,
  //     [name]: value,
  //   })
  // }

  // const handleChangeDate = (e: DateValue) => {
  //   setBookSelected({
  //     ...bookSelected,
  //     published_date: e.toString(),
  //   })
  // }

  // const handleCloseModal = () => {
  //   setBookId("")
  //   setBookSelected({
  //     title: "",
  //     author: "",
  //     published_date: undefined,
  //     isbn: "",
  //     summary: "",
  //     cover_image: "",
  //     total_book_pages: 0,
  //     digital_content: 0,
  //     prices: [{ duration: "", price: 0 }],
  //     languange: BOOK_LANGUAGES.VI,
  //     price: 0,
  //   })
  //   onClose()
  // }

  return (
    <AdminLayout>
      {/* <Modal
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
              <ModalHeader className="flex flex-col gap-1">{bookId ? "Update Book" : "Create New Book"}</ModalHeader>
              <ModalBody>
                {Object.entries(bookSelected).map((item) => (
                  <>
                    {item[0] === "published_date" ? (
                      <DatePicker label="Published Date" onChange={handleChangeDate} />
                    ) : item[0] === "prices" ? (
                      <div>
                        <p className="text-sm">Prices</p>
                        {Object.values(item[1]).map((i) => (
                          <Input
                            label={i.duration}
                            value={i.price}
                            name={`prices_${i.duration}_${i.price}`}
                            onChange={handleChangeBookSelected}
                          />
                        ))}
                      </div>
                    ) : (
                      <Input
                        label={(item[0].slice(0, 1).toUpperCase() + item[0].slice(1)).replace("_", " ")}
                        value={item[1].toString()}
                        name={item[0]}
                        onChange={handleChangeBookSelected}
                      />
                    )}
                  </>
                ))}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleCloseModal}>
                  Close
                </Button>
                {bookId ? (
                  <CustomButton color="green" onPress={handleUpdateBook}>
                    Update
                  </CustomButton>
                ) : (
                  <CustomButton color="green" onPress={handleCreateBook}>
                    Create
                  </CustomButton>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal> */}
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
                        <Chip
                          color="success"
                          className="cursor-pointer text-white"
                          // onClick={() => handleEdit(item.slug)}
                        >
                          Edit
                        </Chip>
                        <Chip
                          color="danger"
                          className="cursor-pointer"
                          // onClick={() => handleDeleteBook(item.id)}
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