import { Button } from '@nextui-org/react'
import { useRouter } from 'next/router'
import React from 'react'

const Information = () => {
  const router = useRouter();
  const moveToPrice = () =>{
    router.push('/prices');
  }
  return (
    <div className="hero min-h-screen bg-theme">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hello there</h1>
          <p className="py-6">Boostera is the best place to boost your rank and meet a high-level players</p>
          <Button color="danger" onClick={()=>{moveToPrice()}}>Get Started!!!</Button>
        </div>
      </div>
    </div>
  )
}

export default Information