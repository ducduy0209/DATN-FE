import { AdminLayout } from "@components/layouts/adminLayout"
import { API_ENDPOINT, DataWithPagination } from "@models/api"
import { BOOK_LANGUAGES, Book } from "@models/book"
import {
  Avatar,
  Button,
  Checkbox,
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
import { Borrow } from "@models/borrow"

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
  { name: "TITLE", uid: "title" },
  { name: "DURATION", uid: "duration" },
  { name: "BORROW DATE", uid: "borrow_date" },
  { name: "PRICE", uid: "price" },
]

type CreateRecord = {
  book_id: string
  user_id: string
  price: string
  duration: string
}

const ManageRecords = () => {
  const [search, setSearch] = useState<string>("")
  const [page, setPage] = useState<number>(1)
  const [records, setRecords] = useState<DataWithPagination<Borrow[]>>()
  const [limit, setLimit] = useState<number>(5)
  const [isStaleData, setIsStaleData] = useState<boolean>(false)
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const [recordSelected, setRecordSelected] = useState<CreateRecord>({
    book_id: "",
    user_id: "",
    price: "",
    duration: "",
  })

  const { authInfo } = useBoundStore((state) => ({
    authInfo: state.authInfo,
  }))

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1)
  }

  useEffect(() => {
    const handleFetchRecords = async () => {
      let params = `/borrow-records?page=${page}&limit=${limit}`
      if (search) {
        params += `&title=${search}`
      }
      const response = await fetch(API_ENDPOINT + params, {
        headers: {
          authorization: `Bearer ${authInfo?.access?.token}`,
        },
      })
      const raw = (await response.json()) as Response<any>
      console.log(raw)
      if (raw.status === "success" && raw?.data?.result) {
        setRecords(raw.data.result)
      }
    }
    handleFetchRecords()
  }, [search, isStaleData, page, limit])

  const handleChangeRecordSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value
    setRecordSelected({
      ...recordSelected,
      [name]: value,
    })
  }

  const handleCloseModal = () => {
    setRecordSelected({ book_id: "", user_id: "", price: "", duration: "" })
    onClose()
  }

  const handleCreateRecord = async () => {
    const response = await fetch(API_ENDPOINT + `/borrow-records`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authInfo.access?.token}`,
      },
      body: JSON.stringify({
        ...recordSelected,
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
              <ModalHeader className="flex flex-col gap-1">Create New Record Borrow</ModalHeader>
              <ModalBody>
                {Object.entries(recordSelected).map((item) => (
                  <>
                    {item[0] === "duration" ? (
                      <div className="flex items-center gap-4">
                        <Checkbox
                          isSelected={recordSelected.duration === "1 month"}
                          onValueChange={() => setRecordSelected({ ...recordSelected, duration: "1 month" })}
                        >
                          1 Tháng
                        </Checkbox>
                        <Checkbox
                          isSelected={recordSelected.duration === "3 months"}
                          onValueChange={() => setRecordSelected({ ...recordSelected, duration: "3 months" })}
                        >
                          3 Tháng
                        </Checkbox>
                        <Checkbox
                          isSelected={recordSelected.duration === "6 months"}
                          onValueChange={() => setRecordSelected({ ...recordSelected, duration: "6 months" })}
                        >
                          6 Tháng
                        </Checkbox>
                        <Checkbox
                          isSelected={recordSelected.duration === "forever"}
                          onValueChange={() => setRecordSelected({ ...recordSelected, duration: "forever" })}
                        >
                          Vĩnh viễn
                        </Checkbox>
                      </div>
                    ) : (
                      <Input
                        label={(item[0].slice(0, 1).toUpperCase() + item[0].slice(1)).replace("_", " ")}
                        value={item[1].toString()}
                        name={item[0]}
                        onChange={handleChangeRecordSelected}
                      />
                    )}
                  </>
                ))}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleCloseModal}>
                  Close
                </Button>
                <CustomButton color="green" onPress={handleCreateRecord}>
                  Create
                </CustomButton>
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
            <p className="text-sm text-gray-400">Total: {records?.totalResults} genres</p>
            <Pagination showControls total={records?.totalPages ?? 1} page={page} color="success" onChange={setPage} />
          </div>
          <Table aria-label="Example table with custom cells">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            {records?.results?.length ? (
              <TableBody items={records.results}>
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell className="flex items-center gap-2">
                      {item?.userId?.image === "default.jpg" ? (
                        <Avatar
                          size="sm"
                          src={`http://localhost:3000/img/users/${item?.userId?.image}`}
                          className="border-2"
                        />
                      ) : (
                        <Avatar size="sm" src={item?.userId?.image} className="border-2" />
                      )}
                      {item?.userId?.name}
                    </TableCell>
                    <TableCell>
                      <Chip>{item.book_id?.title}</Chip>
                    </TableCell>
                    <TableCell>{item.duration}</TableCell>
                    <TableCell>{moment(item.borrow_date).format("LL")}</TableCell>
                    <TableCell>${item.price}</TableCell>
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

export default ManageRecords
