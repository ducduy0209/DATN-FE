import React from 'react'
import { ROLE_ACCOUNT } from '@models/common'
import { useBoundStore } from '@zustand/total'
import AdminNav from './AdminNav'
import BoosterNav from './BoosterNav'
import GuestNav from './GuestNav'
import ManagerNav from './ManagerNav'
import CustomerNav from './CustomerNav'

const Navigation = () => {
  const { accountInfo } = useBoundStore((store) => ({
    accountInfo: store.accountInfo,
  }))

  if (accountInfo.role === "booster") {
    return <BoosterNav />
  }
  if (accountInfo.role === "customer") {
    return <CustomerNav />
  }
  if (accountInfo.role === "manager") {
    return <ManagerNav />
  }
  if (accountInfo.role === "admin") {
    return <AdminNav />
  }

  return <GuestNav />
}

export default Navigation