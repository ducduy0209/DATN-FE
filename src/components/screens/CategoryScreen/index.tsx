import { CustomButton } from "@components/common/CustomButton"
import RateStar from "@components/common/RateStar"
import Icon from "@components/icons"
import { MOCK_BOOKS } from "@constants/book"
import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Input,
  Pagination,
} from "@nextui-org/react"
import { formatCurrency } from "@utils/formatCurrency"
import { API_ENDPOINT, DataWithPagination, SORT_TYPE } from "@models/api"
import { Book } from "@models/book"
import { Category } from "@models/category"
import { Response } from "@models/api"
import { useRouter } from "next/router"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

type Props = {
  category: string
}

const LIMIT = 10

type ResultBooks = {
  books: DataWithPagination<Book[]>
}

const CategoryScreen = ({ category }: Props) => {
  const [books, setBooks] = useState<DataWithPagination<Book[]>>()
  const [catagories, setCategories] = useState<Category[]>([])
  const [categorySelected, setCategorySelected] = useState<Category>()
  const [page, setPage] = useState<number>(1)
  const [sortBy, setSortBy] = useState<string>("")
  const [sortType, setSortType] = useState<string>("")
  const route = useRouter()
  const [isOpenSort, setIsOpenSort] = useState<boolean>(false)
  const searchParams = useSearchParams()

  const handleSort = (sortBy: string, sortType: string) => {
    setSortBy(sortBy)
    setSortType(sortType)
    const newSearchPrams = new URLSearchParams(searchParams)
    newSearchPrams.set("sortBy", `${sortBy}:${sortType}`)
    route.push(`/category/${category}?${newSearchPrams}`)
  }

  useEffect(() => {
    if (category) {
      const handleGetCategory = async () => {
        const response = await fetch(API_ENDPOINT + `/genres/${category}`, {
          headers: { "Content-Type": "application/json" },
        })
        const raw = (await response.json()) as Response<Category>
        if (raw.data) {
          setCategorySelected(raw.data)
        }
      }
      handleGetCategory()
    }
  }, [category])

  useEffect(() => {
    const parsedSearchParams = new URLSearchParams(searchParams)
    if (parsedSearchParams.get("page")) {
      setPage(Number(parsedSearchParams.get("page")?.toString()))
    }
    if (parsedSearchParams) {
      const sort = parsedSearchParams.get("sortBy")?.split(":")
      console.log(sort)
      if (sort) {
        setSortBy(sort[0])
        setSortType(sort[1])
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (category) {
      const handleFetchBooks = async () => {
        let params = `/books/genres/${category}`
        if (sortBy && sortType) {
          params += `?sortBy=${sortBy}:${sortType}`
        }
        const response = await fetch(API_ENDPOINT + params, {
          headers: { "Content-Type": "application/json" },
        })
        const data = (await response.json()) as Response<ResultBooks>
        console.log(data)
        if (data.data?.books) {
          setBooks(data.data.books)
        }
      }
      handleFetchBooks()
    }
  }, [category, sortBy, sortType])

  useEffect(() => {
    const handleFetchCategorys = async () => {
      const response = await fetch(API_ENDPOINT + "/genres?page=1&limit=8", {
        headers: { "Content-Type": "application/json" },
      })
      const data = (await response.json()) as Response<any>
      console.log(data)
      if (!!data?.data?.results.length) {
        setCategories(data.data.results)
      }
    }
    handleFetchCategorys()
  }, [])

  return (
    <div className="mb-20">
      <div className="bg-green-400 px-40 py-4">
        <Link href="/">Trang chủ</Link>
        <p className="text-lg font-semibold text-white">{categorySelected?.name}</p>
      </div>
      <div className="flex gap-8 px-40 py-8">
        <div className="w-[300px] rounded-lg bg-white p-4">
          <p className="pb-4 text-lg">Chủ đề tiêu biểu</p>
          {catagories.length &&
            catagories.map((categoryItem) => (
              <div
                key={categoryItem.id}
                onClick={() => route.push(`/category/${categoryItem.slug}`)}
                className="flex cursor-pointer items-center gap-1 border-b-2 py-2 text-sm"
              >
                <Icon name="folder-open" />
                <p>{categoryItem.name}</p>
              </div>
            ))}
          <p className="py-4 text-lg">Theo ngôn ngữ</p>
          <div className="flex gap-2">
            <CustomButton>Tiếng Việt</CustomButton>
            <CustomButton>Tiếng Anh</CustomButton>
          </div>
        </div>
        <div className="w-full">
          <div className="mb-4 flex justify-between">
            <div className="mb-4 flex items-center gap-2 text-xl">
              <p className="text-lg font-semibold">{categorySelected?.name}</p>
            </div>
            <Dropdown onOpenChange={(isOpen: boolean) => setIsOpenSort(isOpen)}>
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  endContent={isOpenSort ? <Icon name="chevron-up" /> : <Icon name="chevron-down" />}
                >
                  {sortBy === "price" && sortType === "asc" ? "Theo giá cao dần" : ""}
                  {sortBy === "price" && sortType === "desc" ? "Theo giá thấp dần" : ""}
                  {sortBy === "published_date" ? "Năm xuất bản" : ""}
                  {!sortBy && !sortType ? "Sắp xếp theo" : ""}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem key="price_asc" onPress={() => handleSort("price", SORT_TYPE.ASC)}>
                  Theo giá cao dần
                </DropdownItem>
                <DropdownItem key="price_desc" onPress={() => handleSort("price", SORT_TYPE.DESC)}>
                  Theo giá thấp dần
                </DropdownItem>
                <DropdownItem key="published_date" onPress={() => handleSort("published_date", SORT_TYPE.DESC)}>
                  Năm xuất bản
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="flex h-full w-full flex-wrap justify-center gap-8 rounded-lg bg-white p-4 py-8">
            {books?.results.length ? (
              books.results.map((book) => (
                <div
                  key={book.title}
                  className="flex w-[220px] cursor-pointer justify-center rounded-xl bg-gray-200 py-2 text-center"
                  onClick={() => route.push(`/book/${book.slug}`)}
                >
                  <div className="flex w-[200px] flex-col items-center gap-2">
                    <Image
                      className="h-[200px]"
                      src={`http://localhost:3000/img/books/${book?.cover_image}`}
                      alt={book.title}
                    />
                    <p className="line-clamp-3 text-black">{book.title}</p>
                    <RateStar rate={book.rating} />
                    <p className="uppercase text-black">{book.author}</p>
                    <p className="text-green-400">Chỉ từ {formatCurrency(book.price.toString())}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">
                <p className="mb-1 text-xl font-semibold">Không có kết quả nào</p>
                <p>Hãy thử tìm kiếm với từ khoá khác</p>
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
    </div>
  )
}

export default CategoryScreen
