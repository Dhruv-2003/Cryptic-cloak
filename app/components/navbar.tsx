import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const Navbar = () => {
  return (
    <div className="w-screen bg-gradient-to-r from-white via-blue-100 to-rose-200">
    <div className="flex mt-4 justify-between mx-6">
      <div className="">
        <p className="font-semibold text-2xl">ProjectName</p>
      </div>
      <div className="">
        <ConnectButton accountStatus="address" showBalance={false}/>
      </div>
    </div>
  </div>
  )
}

export default Navbar