import Icon from "@components/icons"
import { cn } from "@utils/cn"
import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Textarea,
  useDisclosure,
} from "@nextui-org/react"
import Slider from "react-slick"
import { Star } from "lucide-react"
import RateStar from "@components/common/RateStar"
import { formatCurrency } from "@utils/formatCurrency"
import { CustomButton } from "@components/common/CustomButton"
import { MOCK_BOOKS } from "@constants/book"
import { Book } from "@models/book"
import { API_ENDPOINT } from "@models/api"
import { Response } from "@models/api"
import moment from "moment"
import { detectLanguage } from "@utils/detectLanguage"
import { useBoundStore } from "@zustand/total"
import { NOTIFICATION_TYPE, notify } from "@utils/notify"
import BookType from "@components/common/BookType"
import PdfViewer from "@components/common/PdfViewer"

type Props = {
  id: string
}
const settings = {
  dots: false,
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  vertical: true,
  verticalSwiping: true,
  swipeToSlide: true,
}

const MOCK_BOOK = {
  images: [
    "https://images.nxbxaydung.com.vn/Picture/2020/biasach-0604092220.png",
    "https://images.nxbxaydung.com.vn/Picture/2020/bt-he-thong-bang-tra-t3-0519095005.png",
    "https://images.nxbxaydung.com.vn/Picture/2020/biasach-0610095013.jpg",
    "https://images.nxbxaydung.com.vn/Picture/2020/biasach-0604092220.png",
    "https://images.nxbxaydung.com.vn/Picture/2020/bt-he-thong-bang-tra-t3-0519095005.png",
    "https://images.nxbxaydung.com.vn/Picture/2020/biasach-0610095013.jpg",
  ],
  title: "Tập sách về Bài tập và hệ thống bảng tra thủy văn công trình giao thông",
  star: 5,
  view: 1836,
  sold_amount: 39,
  price: "90000",
}

const BookScreen = ({ id }: Props) => {
  const sliderRef = useRef<any>(null)
  const [selectImage, setSelectImage] = useState<string>(MOCK_BOOK.images[0])
  const [isPreview, setIsPreview] = useState<boolean>(false)
  const [comment, setComment] = useState<string>("")
  const [isCommentNull, setIsCommentNull] = useState<boolean>(false)
  const [rating, setRating] = useState<number>(5)
  const [book, setBook] = useState<Book>()
  const [duration, setDuration] = useState<string>("1 month")
  const { authInfo } = useBoundStore((state) => ({
    authInfo: state.authInfo,
  }))
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer>()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const handleAddToCart = async () => {
    const priceCalculated = book?.prices.find((price) => price.duration === duration)?.price
    const response = await fetch(API_ENDPOINT + "/carts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authInfo.access?.token}`,
      },
      body: JSON.stringify({
        book_id: book?.id,
        duration: duration,
        price: priceCalculated,
      }),
    })
    const raw = (await response.json()) as Response<null>
    if (raw.status === "success") {
      notify(NOTIFICATION_TYPE.SUCCESS, "Thêm vào giỏ hàng thành công")
    } else {
      notify(NOTIFICATION_TYPE.ERROR, "Có lỗi xảy ra, vui lòng thử lại!")
    }
  }

  const handleReview = async () => {
    if (comment) {
      const response = await fetch(API_ENDPOINT + "/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authInfo.access?.token}`,
        },
        body: JSON.stringify({
          book_id: book?.id,
          comment,
          rating,
        }),
      })
      const raw = (await response.json()) as Response<null>
      if (raw.status !== "success") {
        notify(NOTIFICATION_TYPE.ERROR, raw.message ? raw.message : "Có lỗi xảy ra, vui lòng thử lại!")
      } else {
        notify(NOTIFICATION_TYPE.SUCCESS, "Bình luận thành công")
      }
    } else {
      setIsCommentNull(true)
    }
  }

  const handleChangeComment = (e: ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value)
    if (e.target.value) {
      setIsCommentNull(false)
    }
  }

  useEffect(() => {
    if (id) {
      const handleFetchBook = async () => {
        const response = await fetch(API_ENDPOINT + `/books/search/${id}`)
        const raw = (await response.json()) as Response<{ book: Book }>
        if (raw.data?.book) {
          setBook(raw.data.book)
        }
      }
      handleFetchBook()
    }
  }, [id])

  useEffect(() => {
    if (book?.id) {
      const handleFetchPreviewPDF = async () => {
        const response = await fetch(API_ENDPOINT + `/books/preview/${book.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authInfo.access?.token}`,
          },
        })
        if (response.ok) {
          const blob = await response.blob
          console.log(blob)
        }
      }
      handleFetchPreviewPDF()
    }
  }, [book])

  const next = () => {
    sliderRef.current.slickNext()
  }

  const prev = () => {
    sliderRef.current.slickPrev()
  }

  // useEffect(() => {
  //   if (book?.id) {
  //     const fetchPdfUrl = async () => {
  //       try {
  //         const response = await fetch(API_ENDPOINT + `/books/preview/${book?.id}`, {
  //           headers: {
  //             "Content-Type": "application/pdf",
  //             Authorization: `Bearer ${authInfo.access?.token}`,
  //           },
  //         })
  //         const buffer = await response.arrayBuffer()
  //         setPdfBuffer(buffer)
  //       } catch (error) {
  //         console.error("Error fetching PDF:", error)
  //       }
  //     }
  //     fetchPdfUrl()
  //   }
  // }, [book])

  return (
    <div className="px-40 py-4">
      {book?.id && (
        <PdfViewer title={book.title} bookId={book.id} isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} />
      )}
      <p>Trang chủ / {book?.title}</p>
      <div className="my-8 flex gap-8 rounded-lg bg-white p-8">
        <div className="slider-container flex w-[140px] flex-col items-center rounded-lg bg-gray-100">
          <Icon name="chevron-up" onClick={prev} />
          <Slider {...settings} className="mx-auto flex" ref={sliderRef}>
            {MOCK_BOOK.images.map((image) => (
              <div
                key={image}
                onClick={() => setSelectImage(image)}
                className="ml-[25%] w-full justify-center"
                style={{ display: "flex !important" }}
              >
                <Image src={image} width={60} className="rounded-none" />
              </div>
            ))}
          </Slider>
          <Icon name="chevron-down" onClick={next} />
        </div>
        <div className="flex flex-col items-center gap-4">
          <Image src={selectImage} width={200} className="rounded-none" />
          <CustomButton color="default" onClick={onOpen}>
            Preview
          </CustomButton>
        </div>
        <div>
          <p className="text-lg font-semibold">{book?.title}</p>
          <div className="my-4 flex gap-8">
            <div className="flex items-center gap-1 border-r-2 px-2">
              <p className="font-semibold">{book?.rating}</p>
              <RateStar rate={book?.rating ?? 0} />
            </div>
            <div className="flex items-center gap-1 border-r-2 px-2">
              <p className="font-semibold">{book?.access_times}</p>
              <p>Luợt xem</p>
            </div>
            <div className="flex items-center gap-1 border-r-2 px-2">
              <p className="font-semibold">{book?.amount_borrowed}</p>
              <p>Đã thuê</p>
            </div>
            <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300">
              <Icon name="share" width={20} />
            </div>
          </div>
          <div className="rounded-lg bg-gray-100 p-8">
            <p className="pb-4 text-lg font-semibold">Chọn sản phẩm</p>
            <div className="flex items-center gap-4 rounded-lg bg-white p-4">
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered">
                    {duration === "forever" ? "Vĩnh viễn" : duration.split(" ")[0] + " tháng"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  {!!book?.prices.length ? (
                    book.prices.map((price) => (
                      <DropdownItem key={price.duration} onPress={() => setDuration(price.duration)}>
                        {price.duration === "forever" ? "Vĩnh viễn" : `${price.duration.split(" ")[0]} tháng`}
                      </DropdownItem>
                    ))
                  ) : (
                    <DropdownItem></DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
              <p>
                {formatCurrency(book?.prices.find((price) => price.duration === duration)?.price.toString() ?? "0")}
              </p>
            </div>
            <div className="my-4 border-t-2 py-4">
              <p className="pb-2 font-semibold">Thành tiền</p>
              <div className="flex w-full gap-2">
                <CustomButton color="green" className="basis-1/2">
                  Mua ngay
                </CustomButton>
                <CustomButton color="green" className="basis-1/2" isGhost onClick={handleAddToCart}>
                  Thêm vào giỏ
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-lg bg-white p-8">
        <div className="flex gap-4">
          <div className="basis-1/2 border-r-2">
            <p>Tác giả: </p>
            <div className="flex items-center gap-2 pt-2">
              <Avatar />
              <p className="font-semibold">{book?.author}</p>
            </div>
          </div>
          <div className="basis-1/2">
            <p>Được bán bởi: </p>
            <div className="flex items-center gap-2 pt-2">
              <Image src="/images/logo.png" width={40} />
              <p className="font-semibold">Merchize Book Store</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4 pt-6">
          <div className="basis-1/2 border-r-2">
            <p className="text-xl">Thông tin xuất bản</p>
            <div className="ml-2">
              <div>
                <span className="font-semibold">- Năm XB: </span>
                <span>{moment(book?.published_date).format("L")}</span>
              </div>
              <div>
                <span className="font-semibold">- Mã ISBN: </span>
                <span>{book?.isbn}</span>
              </div>
              <div>
                <span className="font-semibold">- Loại sách: </span>
                <span>{book?.genres[0].name}</span>
              </div>
              <div>
                <span className="font-semibold">- Số trang: </span>
                <span>{book?.total_book_pages}</span>
              </div>
              <div>
                <span className="font-semibold">- Ngôn ngữ: </span>
                <span>{detectLanguage(book?.languange)}</span>
              </div>
            </div>
          </div>
          <div className="basis-1/2">
            <p className="text-xl">Giới thiệu</p>
            <p>{book?.summary}</p>
          </div>
        </div>
      </div>
      <div className="mt-8 rounded-lg bg-white p-8">
        <p className="mb-4 text-xl font-semibold">Bình luận</p>
        <Textarea placeholder="Để lại bình luận của bạn" className="mb-4 max-w-xs" onChange={handleChangeComment} />
        {isCommentNull && (
          <p className="-mt-2 mb-2 text-xs text-red-400">Vui lòng ghi nhận xét trước khi gửi bình luận.</p>
        )}
        <div className="mb-2 flex gap-1">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <Icon
                name="star"
                key={index}
                onClick={() => setRating(index + 1)}
                className={`${index <= rating - 1 ? "text-yellow-400" : ""} cursor-pointer`}
              />
            ))}
        </div>
        <CustomButton onClick={handleReview} isDisabled={isCommentNull}>
          Gửi bình luận
        </CustomButton>
      </div>
      <div>
        <BookType />
      </div>
    </div>
  )
}

export default BookScreen
