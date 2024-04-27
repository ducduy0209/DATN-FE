import React from 'react'
import { Button } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

const HomePageScreen = () => {
  const router = useRouter();
  const moveToPrice = () => {
    router.push('/prices');
  }
  return (
    <div className="w-screen h-screen bg-theme text-white relative flex justify-center items-center">
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <img src='/images/get-started.jpg' width="100%" height="100%" alt="get started" />
      </motion.div>
      <Button className="absolute px-12 py-6 font-semibold text-lg border-black border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none" color="danger" onClick={moveToPrice}>Get Start</Button>
    </div>
  )
}

export default HomePageScreen