import { useRouter } from "next/router"
import CustomButton from "@components/common/CustomButton"
import MainLayout from "@components/layouts/MainLayout"

const Page498 = () => {
  const router = useRouter()

  const backToHome = () => {
    void router.push("/")
  }

  return (
    <MainLayout className="h-full" title="Access Denied">
      <div className="text-primary -mt-20 flex h-[calc(100vh-120px)] flex-col items-center justify-center">
        <p className="text-center text-[5rem] font-bold sm:text-[6rem]">Access Denied</p>
        <p className="mb-4 text-3xl font-semibold">You don't have permission to access this page</p>
        <CustomButton label="Back To Home" onClick={backToHome} />
      </div>
    </MainLayout>
  )
}

export default Page498
