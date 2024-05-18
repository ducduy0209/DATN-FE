import React, { useState, useEffect } from "react"
import { Document, Page } from "react-pdf"
import axios from "axios"
import { API_ENDPOINT } from "@models/api"
import { useBoundStore } from "@zustand/total"

type Props = {
  bookId: string
}

const ReadBook = ({ bookId }: Props) => {
  const [numPages, setNumPages] = useState<number>()
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [pdfUrl, setPdfUrl] = useState<string>()

  const { authInfo } = useBoundStore((state) => ({
    authInfo: state.authInfo,
  }))

  useEffect(() => {
    // Hàm này sẽ gửi yêu cầu API và nhận phản hồi PDF khi component được render
    const fetchPdf = async () => {
      try {
        // Thực hiện yêu cầu API với thông tin xác thực nếu cần
        const response = await axios.get(`${API_ENDPOINT}/books/read/${bookId}`, {
          responseType: "blob", // Đặt kiểu dữ liệu phản hồi là blob để xử lý PDF
          headers: {
            Authorization: `Bearer ${authInfo.access?.token}`, // Thay thế bằng token xác thực thực của bạn
          },
        })

        // Tạo URL cho blob PDF và cập nhật state
        const pdfBlob = new Blob([response.data], { type: "application/pdf" })
        const pdfUrl = URL.createObjectURL(pdfBlob)
        setPdfUrl(pdfUrl)
      } catch (error) {
        console.error("Lỗi khi gửi yêu cầu API:", error)
      }
    }

    fetchPdf() // Gọi hàm fetchPdf khi component được render
  }, [])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  return (
    <div>
      {pdfUrl ? (
        <div>
          <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document>
          <p>
            Trang {pageNumber} của {numPages}
          </p>
        </div>
      ) : (
        <p>Đang tải PDF...</p>
      )}
    </div>
  )
}

export default ReadBook
