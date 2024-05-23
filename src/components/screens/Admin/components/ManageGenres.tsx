import { AdminLayout } from "@components/layouts/adminLayout"
import { API_ENDPOINT, DataWithPagination } from "@models/api"
import { BOOK_LANGUAGES, Book } from "@models/book"
import {
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
  { name: "PRIORITY", uid: "priority" },
  { name: "SLUG", uid: "slug" },
  { name: "ACTION", uid: "action" },
]

const ManageGenres = () => {
  const [search, setSearch] = useState<string>("")
  const [page, setPage] = useState<number>(1)
  const [genres, setGenres] = useState<DataWithPagination<Category[]>>()
  const [limit, setLimit] = useState<number>(5)
  const [isStaleData, setIsStaleData] = useState<boolean>(false)
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const [genreSelected, setGenreSelected] = useState<Category>({
    priority: 0,
    name: "",
    slug: "",
    id: "",
  })
  const [genreId, setGenreId] = useState<string>("")

  const { authInfo } = useBoundStore((state) => ({
    authInfo: state.authInfo,
  }))

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    // setPage(1)
  }

  const handleDeleteGenre = async (genreId: string) => {
    const response = await fetch(API_ENDPOINT + `/genres/${genreId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authInfo.access?.token}`,
      },
    })
    if (response.status === 200) {
      notify(NOTIFICATION_TYPE.SUCCESS, "Chủ đề đã được xoá thành công")
      setIsStaleData(!isStaleData)
    } else {
      notify(NOTIFICATION_TYPE.ERROR, "Có lỗi xảy ra, vui lòng thử lại")
    }
  }

  const handleUpdateGenre = async () => {
    const response = await fetch(API_ENDPOINT + `/genres/${genreId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authInfo.access?.token}`,
      },
      body: JSON.stringify({
        name: genreSelected.name,
        priority: genreSelected.priority,
      }),
    })
    if (response.status === 200) {
      notify(NOTIFICATION_TYPE.SUCCESS, "Cập nhật thông tin sách thành công")
      handleCloseModal()
      setIsStaleData(!isStaleData)
    } else {
      notify(NOTIFICATION_TYPE.ERROR, "Có lỗi xảy ra, vui lòng thử lại")
      handleCloseModal()
    }
  }

  const handleCreateGenre = async () => {
    const response = await fetch(API_ENDPOINT + `/genres`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authInfo.access?.token}`,
      },
      body: JSON.stringify({
        name: genreSelected.name,
        priority: genreSelected.priority,
      }),
    })
    if (response.status === 201) {
      notify(NOTIFICATION_TYPE.SUCCESS, "Tạo mới chủ đề thành công")
      handleCloseModal()
      setIsStaleData(!isStaleData)
    } else {
      notify(NOTIFICATION_TYPE.ERROR, "Có lỗi xảy ra, vui lòng thử lại")
      handleCloseModal()
    }
  }

  useEffect(() => {
    const handleFetchGenres = async () => {
      let params = `/genres?page=${page}&limit=${limit}`
      if (search) {
        params += `&name=${search}`
      }
      const response = await fetch(API_ENDPOINT + params)
      const raw = (await response.json()) as Response<any>
      if (raw.status === "success" && raw?.data?.results.length) {
        setGenres(raw.data)
      }
    }
    handleFetchGenres()
  }, [search, isStaleData, page, limit])

  const handleEdit = (genreSelect: Category) => {
    setGenreSelected(genreSelect)
    setGenreId(genreSelect.id)
    onOpen()
  }

  const handleChangeItemSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value
    setGenreSelected({
      ...genreSelected,
      [name]: value,
    })
  }

  const handleCloseModal = () => {
    setGenreId("")
    onClose()
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
              <ModalHeader className="flex flex-col gap-1">{genreId ? "Update Genre" : "Create New Genre"}</ModalHeader>
              <ModalBody>
                <Input label="Name" value={genreSelected.name} name="name" onChange={handleChangeItemSelected} />
                <Input
                  label="Priority"
                  value={genreSelected.priority.toString()}
                  name="priority"
                  onChange={handleChangeItemSelected}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleCloseModal}>
                  Close
                </Button>
                {genreId ? (
                  <CustomButton color="green" onPress={handleUpdateGenre}>
                    Update
                  </CustomButton>
                ) : (
                  <CustomButton color="green" onPress={handleCreateGenre}>
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
            <p className="text-sm text-gray-400">Total: {genres?.totalResults} genres</p>
            <Pagination showControls total={genres?.totalPages ?? 1} page={page} color="success" onChange={setPage} />
          </div>
          <Table aria-label="Example table with custom cells">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            {genres?.results?.length ? (
              <TableBody items={genres.results}>
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Link href={`/book/${item.slug}`} className="text-black hover:text-gray-600">
                        {item.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Chip>{item.priority}</Chip>
                    </TableCell>
                    <TableCell>{item.slug}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Chip color="success" className="cursor-pointer text-white" onClick={() => handleEdit(item)}>
                          Edit
                        </Chip>
                        <Chip color="danger" className="cursor-pointer" onClick={() => handleDeleteGenre(item.id)}>
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

export default ManageGenres