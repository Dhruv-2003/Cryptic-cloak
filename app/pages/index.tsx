import Modal from "@/components/modal";
import Navbar from "@/components/navbar";
import { getAnnouncements } from "@/utils/rollupMethods";
import {
  getStealthAddress,
  getStealthMetaAddress,
  revealStealthKey,
} from "@/utils/stealthMethods";
import { useState } from "react";

export default function Home() {
  const spendingKey =
    "0x6d2f70a47ddf455feb6a785b9787265f28897546bd1316224300aed627ef8cfc";
  const viewingKey =
    "0xa2e9f98f845bb6a8d2db0a2a17a9d185fc97afd1b7949983ee367f9f08a5e0b7";
  const [stealthMetaAddress, setStealthMetaAddress] = useState<string>();
  const [stealthAddress, setStealthAddress] = useState<string>(
    "0xc5a6eb3391ad9659da31b02ef3a9f025bc24f9f3"
  );
  const [ephemeralPublicKey, setEphemeralPublicKey] = useState<string>(
    "0x027bee7bdcff4aaf354ccf31c4ca9c8a7039e2b8eaafa933dd3043a276d3d33765"
  );

  const checkFlow = async () => {
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
    const data = getAnnouncements();
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-white via-blue-100 to-rose-200">
      <div className="flex flex-col justify-center mx-auto w-full">
        <Navbar />
        <div className="mx-auto w-full">
          <button
            onClick={() => {
              checkFlow();
            }}
          >
            Call Api
          </button>
          <Modal />
        </div>
      </div>
    </div>
  );
}
