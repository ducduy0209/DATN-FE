import React, { useState } from 'react'
import CheckBox from '@components/common/CheckBox'
import Collapse from '@components/common/Collapse'
import CustomButton from '@components/common/CustomButton'
import CustomInput from '@components/common/CustomInput'
import DropdownContainer from '@components/common/DropdownContainer'
import FileInput from '@components/common/FileInput'
import Progress from '@components/common/Progress'
import { RadialProgress } from '@components/common/RadialProgress'
import Radio from '@components/common/Radio'
import Rating from '@components/common/Rating'
import SpinnerLoading from '@components/common/SpinnerLoading'
import Toggle from '@components/common/Toggle'
import Footer from '@components/layouts/Footer'
import Header from '@components/layouts/Header'
import { NOTIFICATION_TYPE, notify } from '@utils/notify'

const TestComponents = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const [selectedRadio, setSelectedRadio] = useState<boolean>(false)
  const [star, setStar] = useState<number>(3)
  const [isToggle, setIsToggle] = useState<boolean>(false)

  const handleRating = (starNum: number) => {
    setStar(starNum)
  }
  return (
    <>
      <Header />
      <div className="flex flex-col items-center py-20 px-40 bg-theme gap-4">
        <CustomButton label="CustomButton" customClassName='w-[200px]' onClick={() => notify(NOTIFICATION_TYPE.SUCCESS, "Test Toast")} />
        <CustomButton label="CustomButton" customClassName='w-[200px]' isLoading={true} />
        <CustomButton label="CustomButton" customClassName='w-[200px]' isDisable={true} />
        <CustomInput placeholder='CustomInput' label='Email' />
        <CustomInput label='Password' isError={true} type="password" value="password" />
        <DropdownContainer label="DropdownContainer" contents={["Item1", "Item2"]} isHover={true} />
        <SpinnerLoading size={10} />
        <CheckBox isChecked={isChecked} label="Remember me" onClick={() => setIsChecked(!isChecked)} />
        <Collapse title="Click me to show/hide content" content="hello" />
        <Progress value={40} />
        <RadialProgress value={70} />
        <FileInput />
        <div className="flex gap-2">
          <Radio isChecked={!selectedRadio} handleSelectRadio={() => setSelectedRadio(!selectedRadio)} />
          <Radio isChecked={selectedRadio} handleSelectRadio={() => setSelectedRadio(!selectedRadio)} />
        </div>
        <Rating star={star} onRate={handleRating} />
        <Toggle title='Remember me' isToggled={isToggle} onToggle={() => setIsToggle(!isToggle)} />
      </div>
      <Footer />
    </>
  )
}

export default TestComponents