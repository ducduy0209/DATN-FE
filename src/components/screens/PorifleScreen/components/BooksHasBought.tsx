import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react"
import React, { useEffect, useState } from "react"
import { Book } from "@models/book"
import { API_ENDPOINT, DataWithPagination, Response } from "@models/api"
import RateStar from "@components/common/RateStar"
import { useBoundStore } from "@zustand/total"
import Link from "next/link"
import moment from "moment"
import { CustomButton } from "@components/common/CustomButton"
import ReadBook from "@components/common/ReadBook"

type BookResponse = {
  books: DataWithPagination<Book[]>
  status: string
}

const columns = [
  {
    key: "title",
    label: "Tên sách",
  },
  {
    key: "author",
    label: "Tác giả",
  },
  {
    key: "rating",
    label: "Đánh giá",
  },
  {
    key: "action",
    label: "Đọc sách",
  },
]

const BooksHasBought = () => {
  const [books, setBooks] = useState<DataWithPagination<Book[]>>()
  const [page, setPage] = useState<number>(1)
  const { authInfo } = useBoundStore((state) => ({
    authInfo: state.authInfo,
  }))
  const [bookRead, setBookRead] = useState<string>("")

  useEffect(() => {
    const handleFetchBooks = async () => {
      const token = "Bearer " + authInfo.access?.token
      const response = await fetch(API_ENDPOINT + `/users/my-books?page=${page}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
      const raw = (await response.json()) as BookResponse
      if (raw.status === "success") {
        setBooks(raw.books)
      }
    }
    handleFetchBooks()
  }, [])

  return (
    <div>
      {bookRead && <ReadBook bookId={bookRead} />}
      <div className="flex items-center justify-between border-b-1 px-10 py-6">
        <p className="font-semibold">Sách bạn đã mua</p>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered">Sắp xếp theo</Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="time">Theo thời gian</DropdownItem>
            <DropdownItem key="price-asc">Theo giá từ thấp đến cao</DropdownItem>
            <DropdownItem key="price-desc">Theo giá từ cao đến thấp</DropdownItem>
            <DropdownItem key="date">Theo năm xuất bản</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="px-10">
        <Table aria-label="Example table with dynamic content">
          <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
          </TableHeader>
          {books?.results ? (
            <TableBody items={books?.results}>
              {(item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Link href={`/book/${item?.slug}`}>{item?.title}</Link>
                  </TableCell>
                  <TableCell>{item.author}</TableCell>
                  <TableCell>
                    <RateStar rate={item.rating} />
                  </TableCell>
                  <TableCell>
                    <CustomButton onClick={() => setBookRead(item.id)}>Đọc sách</CustomButton>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          ) : (
            <TableBody emptyContent={"Bạn chưa có lịch sử mượn sách."}>{[]}</TableBody>
          )}
        </Table>
        {books?.totalPages && books.totalPages > 1 ? (
          <Pagination
            color="success"
            className="mt-4"
            showControls
            total={books.totalPages}
            initialPage={page}
            onChange={(pageChanged: number) => setPage(pageChanged)}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  )
}

export default BooksHasBought
