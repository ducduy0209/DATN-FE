import { Category } from "./category"

export enum BOOK_LANGUAGES {
  VI = "vi",
  EN = "en",
}

export type Book = {
  id: string
  title: string
  slug: string
  author: string
  published_date: Date
  isbn: string
  genres: Category[]
  summary: string
  cover_image: string
  amount_borrowed: number
  access_times: number
  total_book_pages: number
  digital_content: number
  prices: [
    {
      duration: string
      price: number
    },
  ]
  languange: BOOK_LANGUAGES
  rating: number
  price: number
}
