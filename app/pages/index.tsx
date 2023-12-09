import Modal from "@/components/modal";
import Navbar from "@/components/navbar";
import { getAnnouncements, getRegisters } from "@/utils/rollupMethods";
import {
  getStealthAddress,
  getStealthMetaAddress,
  revealStealthKey,
} from "@/utils/stealthMethods";
import { useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import sha256 from "sha256";

import { privateKeyToAccount } from "viem/accounts";
export default function Home() {
  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  // const spendingKey =
  //   "0x6d2f70a47ddf455feb6a785b9787265f28897546bd1316224300aed627ef8cfc";
  // const viewingKey =
  //   "0xa2e9f98f845bb6a8d2db0a2a17a9d185fc97afd1b7949983ee367f9f08a5e0b7";

  const [spendingKey, setSpendingKey] = useState<string>();
  const [viewingKey, setViewingKey] = useState<string>();
  const [stealthMetaAddress, setStealthMetaAddress] = useState<string>();
  const [stealthAddress, setStealthAddress] = useState<string>();
  const [ephemeralPublicKey, setEphemeralPublicKey] = useState<string>(
    "0x027bee7bdcff4aaf354ccf31c4ca9c8a7039e2b8eaafa933dd3043a276d3d33765"
  );

  const checkFlow = async () => {
    if (!spendingKey) {
      console.log("No Spending Key Found");
      return;
    }
    if (!viewingKey) {
      console.log("No Viewing Key Found");
      return;
    }
    const stealthMetaAddress = await getStealthMetaAddress(
      spendingKey,
      viewingKey
    );
    if (!stealthMetaAddress) {
      return;
      console.log("No Metadata address found");
    }
    setStealthMetaAddress(stealthMetaAddress);
    const data = await getStealthAddress(stealthMetaAddress);
    if (!data) {
      console.log("No Metadata address found");
      return;
    }
    const { schemeId, stealthAddress, ephemeralPublicKey, viewTag } = data;
    setStealthAddress(stealthAddress);
    setEphemeralPublicKey(ephemeralPublicKey);

    const revealData = await revealStealthKey(
      spendingKey,
      viewingKey,
      stealthAddress,
      ephemeralPublicKey
    );
    if (!revealData) {
      console.log("No Reveal Stealth Key Found");
      return;
    }

    const stealthPrivateKey = revealData;
    console.log(stealthPrivateKey);
  };

  const checkFlow2 = async () => {
    const announcemetnData = await getAnnouncements();
    console.log(announcemetnData);
    const registerData = await getRegisters();
    console.log(registerData);
  };

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

      setSpendingKey(`0x${privateKey}`);
      setViewingKey(`0x${privateKey}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-white via-blue-100 to-rose-200">
      <div className="flex flex-col justify-center mx-auto w-full">
        <Navbar />
        <div className="mx-auto w-full">
          <button
            onClick={() => {
              signAndGenerateKey();
            }}
          >
            Sign And Generate Key
          </button>
          <button
            onClick={() => {
              checkFlow();
            }}
          >
            checkFlow
          </button>
          <button
            onClick={() => {
              checkFlow2();
            }}
          >
            checkFlow2
          </button>
          <Modal />
        </div>
      </div>
    </div>
  );
}
