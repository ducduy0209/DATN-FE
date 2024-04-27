import { memo } from 'react'
import SpinnerLoading from '../SpinnerLoading'

type Props = {
  customClassName?: string
  label: string
  labelDisable?: string
  isLoading?: boolean
  isDisable?: boolean
  onClick?: () => void
}

const CustomButton = ({ customClassName, label, labelDisable = "Loading...", isLoading = false, isDisable = false, onClick }: Props) => {
  // const handleClick = () => {
  //   if (!isDisable && !isLoading && typeof onClick === "function") {
  //     onClick()
  //   }
  // }
  return (
    <button
      disabled={isDisable}
      className={`px-4 py-2 bg-primary-400 text-white text-sm rounded-lg transition-all delay-[30ms] w-full ${isDisable ? 'cursor-not-allowed opacity-80' : 'hover:bg-primary-300'} ${customClassName}`}
      onClick={onClick}
    >
      {!isLoading ? label :
        <div className="flex items-center justify-center">
          <SpinnerLoading
            size={4}
          />
          <span>{labelDisable}</span>
        </div>
      }
    </button>
  )
}

export default memo(CustomButton)