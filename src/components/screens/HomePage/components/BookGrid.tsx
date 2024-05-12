import React from "react"
import Slider from "react-slick"
import { BentoGridItem } from "@components/common/BentoGrid"
import { SETTINGS } from "@constants/slick"
import { Image } from "@nextui-org/react"

const IMAGES = [
  "https://static01.nyt.com/images/2021/04/04/pageoneplus/bookreview_itt_lede/bookreview_itt_lede-superJumbo.jpg",
  "https://media.npr.org/assets/img/2021/02/05/gettyimages-1250276752-832bdef38dd1834d8190b0dafba4049084cd7edf.jpg",
]

export function BookGrid() {
  return (
    <div className="w-full py-2 pl-4">
      <div className="mb-4 flex w-full">
        <div className="relative mr-4 h-[420px] w-[540px] px-4">
          <Slider {...SETTINGS} className="z-1 h-full w-full">
            {IMAGES.map((image) => (
              <Image key={image} src={image} alt="image" className="h-[420px]" />
            ))}
          </Slider>
        </div>
        <div className="flex w-full flex-col gap-4">
          <BentoGridItem title="Book1" description="Book Description" header={<Skeleton />} />
          <BentoGridItem title="Book2" description="Book Description" header={<Skeleton />} />
        </div>
      </div>
    </div>
  )
}

const Skeleton = () => (
  <div className="flex h-full min-h-[6rem] w-full flex-1 rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800"></div>
)
