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
import { Image } from "@nextui-org/react"

type Column = {
  name: string
  uid: string
}

const columns: Column[] = [
  { name: "NAME", uid: "name" },
  { name: "ACTIVE", uid: "active" },
  { name: "DATE", uid: "due_date" },
  { name: "IMAGE", uid: "image" },
  { name: "ACTION", uid: "action" },
]

type Banner = {
  isActive: boolean
  due_date: string
  name: string
  image: string
  id: string
}

const ManageBanners = () => {
  const [search, setSearch] = useState<string>("")
  const [page, setPage] = useState<number>(1)
  const [banners, setBanners] = useState<DataWithPagination<Banner[]>>()
  const [limit, setLimit] = useState<number>(5)
  const [isStaleData, setIsStaleData] = useState<boolean>(false)
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const [bannerId, setBannerId] = useState<string>("")
  const [isActive, setIsActive] = useState<boolean>(true)
  const [bannerSelected, setBannerSelected] = useState<Banner>({
    isActive: true,
    due_date: "",
    name: "",
    image: "",
    id: "",
  })
  const [previewImage, setPreviewImage] = useState<string>()

  const { authInfo } = useBoundStore((state) => ({
    authInfo: state.authInfo,
  }))

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleDeleteBanner = async (bannerId: string) => {
    const response = await fetch(API_ENDPOINT + `/banners/${bannerId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authInfo.access?.token}`,
      },
    })
    if (response.status === 200) {
      notify(NOTIFICATION_TYPE.SUCCESS, "Ảnh bìa đã được xoá thành công")
      setIsStaleData(!isStaleData)
    } else {
      const raw = (await response.json()) as Response<any>
      notify(NOTIFICATION_TYPE.ERROR, raw?.message ? raw.message : "Có lỗi xảy ra, vui lòng thử lại")
    }
  }

  const handleUpdateBanner = async () => {
    const response = await fetch(API_ENDPOINT + `/banners/${bannerId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authInfo.access?.token}`,
      },
      body: JSON.stringify({
        name: bannerSelected.name,
        image: bannerSelected.image,
      }),
    })
    if (response.status === 200) {
      notify(NOTIFICATION_TYPE.SUCCESS, "Cập nhật ảnh bìa thành công")
      handleCloseModal()
      setIsStaleData(!isStaleData)
    } else {
      handleCloseModal()
      const raw = (await response.json()) as Response<any>
      notify(NOTIFICATION_TYPE.ERROR, raw?.message ? raw?.message : "Có lỗi xảy ra, vui lòng thử lại")
    }
  }

  const handleCreateBanner = async () => {
    const response = await fetch(API_ENDPOINT + `/banners`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authInfo.access?.token}`,
      },
      body: JSON.stringify({
        name: bannerSelected?.name,
        image: previewImage,
      }),
    })
    if (response.status === 201) {
      notify(NOTIFICATION_TYPE.SUCCESS, "Tạo ảnh bìa thành công")
      setIsStaleData(!isStaleData)
    } else {
      const raw = (await response.json()) as Response<any>
      notify(NOTIFICATION_TYPE.ERROR, raw?.message ? raw.message : "Có lỗi xảy ra, vui lòng thử lại")
    }
    handleCloseModal()
  }

  useEffect(() => {
    const handleFetchBanners = async () => {
      let params = `/banners?isActive=${isActive}&page=${page}&limit=${limit}`
      if (search) {
        params += `&name=${search}`
      }
      const response = await fetch(API_ENDPOINT + params)
      const raw = (await response.json()) as Response<any>
      if (raw.status === "success") {
        setBanners(raw.data as DataWithPagination<Banner[]>)
      }
    }
    handleFetchBanners()
  }, [page, search, isStaleData, isActive])

  const handleEdit = (banner: Banner) => {
    setBannerSelected(banner)
    setBannerId(banner.id)
    onOpen()
  }

  const handleChangeBannerSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value
    setBannerSelected({
      ...bannerSelected,
      [name]: value,
    })
  }

  const handleCloseModal = () => {
    setBannerId("")
    setBannerSelected({
      isActive: true,
      due_date: "",
      name: "",
      image: "",
      id: "",
    })
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
                {bannerId ? "Update Banner" : "Create New Banner"}
              </ModalHeader>
              <ModalBody>
                <Input label="Name" name="name" value={bannerSelected?.name} onChange={handleChangeBannerSelected} />
                <p className="-mb-2 text-sm">Ảnh bìa</p>
                <input type="file" name="image" accept="image/*" onChange={handleUploadFile} />
                {previewImage ? (
                  <Image src={previewImage} alt="Ảnh đại diện" width={200} />
                ) : (
                  bannerSelected?.image && <Image src={bannerSelected?.image} width={200} />
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleCloseModal}>
                  Close
                </Button>
                {bannerId ? (
                  <CustomButton color="green" onPress={handleUpdateBanner}>
                    Update
                  </CustomButton>
                ) : (
                  <CustomButton color="green" onPress={handleCreateBanner}>
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
            <p className="text-sm text-gray-400">Total: {banners?.totalResults} banners</p>
            <Pagination showControls total={banners?.totalPages ?? 1} page={page} color="success" onChange={setPage} />
          </div>
          <Table aria-label="Example table with custom cells">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            {banners?.results.length ? (
              <TableBody items={banners.results}>
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <Chip color={item.isActive ? "success" : "danger"}>{item.isActive ? "Active" : "Inactive"}</Chip>
                    </TableCell>
                    <TableCell>{item.due_date}</TableCell>
                    <TableCell>
                      {/* <Image key={item.id} src={`http://localhost:3000/img/banners/${item.image}`} alt="image" /> */}
                      <Button>View Image</Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Chip color="success" className="cursor-pointer text-white" onClick={() => handleEdit(item)}>
                          Edit
                        </Chip>
                        <Chip color="danger" className="cursor-pointer" onClick={() => handleDeleteBanner(item.id)}>
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

export default ManageBanners
