import dynamic from 'next/dynamic'
import Head from 'next/head'
import React, { HTMLAttributes, PropsWithChildren } from 'react'
import Footer from '../Footer'

const Header = dynamic(() => import("../Header/index").then(mod => mod.default), {
  ssr: false,
})

type Props = PropsWithChildren & HTMLAttributes<HTMLDivElement>

const MainLayout: React.FC<Props> = (props) => {
  const { children, className, title } = props
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>{title}</title>
      </Head>
      <main className="sm:flex min-h-screen font-plus bg-theme">
        <div className={`flex-auto container-w ${className || ''}`}>
          <div className="min-h-screen flex flex-col">
            <div className="flex justify-center fixed w-full z-30 ">
              <Header />
            </div>
            <div className="pt-16 grow bg-[#F4F5F6]">{children}</div>
            <Footer />
          </div>
        </div>
      </main>
    </>
  )
}

export default React.memo(MainLayout)
