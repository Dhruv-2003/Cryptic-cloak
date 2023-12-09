import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import sha256 from "sha256";
import { privateKeyToAccount } from "viem/accounts";
import { useNetwork } from "wagmi";
import { updateAnnouncement, updateRegister } from "@/utils/rollupMethods";
import { getStealthMetaAddress } from "@/utils/stealthMethods";

const Navbar = () => {
  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [spendingKey, setSpendingKey] = useState<string>();
  const [viewingKey, setViewingKey] = useState<string>();
  const [userAddress, setUserAddress] = useState<string>();
  const [stealthMetaAddress, setStealthMetaAddress] = useState<string>();

  const signAndGenerateKey = async () => {
    try {
      if (!walletClient) {
        return;
      }
      const signature = await walletClient.signMessage({
        account,
        message:
          "Sign this message to get access to your app-specific keys. Only Sign this Message while using this app",
      });
      console.log(signature);
      const portion = signature.slice(2, 66);

      const privateKey = sha256(`0x${portion}`);
      console.log(`0x${privateKey}`);

      const newAccount = privateKeyToAccount(`0x${privateKey}`);
      console.log(newAccount);

      setUserAddress(newAccount.address);
      setSpendingKey(`0x${privateKey}`);
      setViewingKey(`0x${privateKey}`);
    } catch (error) {
      console.log(error);
    }
  };

  const getMetaAddress = async () => {
    try {
      if (!spendingKey || !viewingKey) {
        console.log("Please sign and generate keys");
        return;
      }

      const metaAddress = await getStealthMetaAddress(spendingKey, viewingKey);
      console.log(metaAddress);
      if (metaAddress) {
        setStealthMetaAddress(metaAddress);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const registerMetaAddress = async () => {
    try {
      if (!userAddress || !stealthMetaAddress) {
        console.log("Please sign and generate keys , or get meta address");
        return;
      }
      await updateRegister(userAddress, stealthMetaAddress, 0);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-screen bg-gradient-to-r from-white via-blue-100 to-rose-200">
      <div className="flex mt-4 justify-between mx-6">
        <div className="">
          <p className="font-semibold text-2xl">ProjectName</p>
        </div>
        <div className="flex">
          {/* <select className="bg-white border border-blue-500 rounded-xl px-2 py-1 text-lg text-blue-500 font-semibold">
            <option value="1">usdt</option>
            <option value="2">usdc</option>
          </select> */}
          <button
            onClick={() => registerMetaAddress()}
            className="bg-white mx-3 border border-blue-500 rounded-xl px-6 py-1 text-lg text-blue-500 font-semibold"
          >
            Register
          </button>
          <ConnectButton accountStatus="address" showBalance={false} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
