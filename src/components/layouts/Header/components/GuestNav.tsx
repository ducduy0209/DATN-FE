import { Key } from "lucide-react";
import Link from "next/link"

const GuestNav = () => {
  return (
    <div className="flex items-center font-semibold">
      <Link href="/prices">
        <p className="cursor-pointer rounded-lg px-4 py-2 text-white transition-all delay-[20ms] hover:text-red-500">
          Prices
        </p>
      </Link>

      <Link href="/boosters">
        <p className="cursor-pointer rounded-lg px-4 py-2 text-white transition-all delay-[20ms] hover:text-red-500">
          Boosters
        </p>
      </Link>

      <Link href="/boosting-history">
        <p className="cursor-pointer rounded-lg px-4 py-2 text-white transition-all delay-[20ms] hover:text-red-500">
          Boosting History
        </p>
      </Link>
      <Link href="/become-booster">
        <p className="cursor-pointer rounded-lg px-4 py-2 text-white transition-all delay-[20ms] hover:text-red-500">
          Become Booster
        </p>
      </Link>
      <Link href="/login" className="rounded-xl bg-red-400 px-4 py-2 hover:bg-red-500">
        <button className="flex items-center text-white gap-2">
          <span className="pl-1">Login</span>
          <Key color="white" />
        </button>
      </Link>
    </div>
  )
}

export default GuestNav;
