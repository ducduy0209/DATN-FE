import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Pagination } from "@nextui-org/react"
import React, { useEffect, useState } from "react"
import { Book } from "@models/book"
import { API_ENDPOINT, DataWithPagination, Response } from "@models/api"
import RateStar from "@components/common/RateStar"

const BooksHasBought = () => {
  const [books, setBooks] = useState<DataWithPagination<Book[]>>()
  const [page, setPage] = useState<number>(1)

  useEffect(() => {
    const handleFetchBooks = async () => {
      const response = await fetch(API_ENDPOINT + `/users/my-books?page=${page}`)
      const raw = (await response.json()) as Response<DataWithPagination<Book[]>>
      if (raw.data) {
        setBooks(raw.data)
      }
    }
    handleFetchBooks()
  }, [])

  return (
    <div>
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
        <div className="flex flex-wrap gap-4">
          {books?.results.length ? (
            books.results.map((book) => (
              <div key={book.title} className="flex w-[220px] justify-center text-center">
                <div className="flex w-[200px] flex-col gap-2">
                  <Image src={book.cover_image} alt={book.title} />
                  <p className="line-clamp-3 text-black">{book.title}</p>
                  <RateStar rate={book.rating} />
                  <p className="uppercase text-black">{book.author}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="mt-4 w-full text-center font-semibold">
              Bạn chưa có sách nào. Hãy khám phá kho sách của chúng tôi.
            </div>
          )}
        </div>
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
