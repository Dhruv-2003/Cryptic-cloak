import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import sha256 from "sha256";
import { privateKeyToAccount } from "viem/accounts";
import { useNetwork } from "wagmi";
import { updateAnnouncement, updateRegister } from "@/utils/rollupMethods";

const Navbar = () => {
  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [spendingKey, setSpendingKey] = useState<string>();
  const [viewingKey, setViewingKey] = useState<string>();

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

  const registerMetaAddress = async () => {
    try {
      // await updateRegister(
      //   "0xCB5160610F4655B938eE67729fD542AFb5d1586F",
      //   "0x025227b7d6a0163ac13dc25854c8da65ea84a3994e3b0fb56debebac4e75ba2d7e025227b7d6a0163ac13dc25854c8da65ea84a3994e3b0fb56debebac4e75ba2d7e",
      //   0
      // );

      await updateAnnouncement(
        "0xf056c1bbf293799910ac551f405ac91e28e1d831",
        "0x0397fce4b5618ea3c2f125b44e04d708b3318b9e3df4fb733d0002d105288fd54b",
        237
      );
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
          <select className="bg-white border border-blue-500 rounded-xl px-2 py-1 text-lg text-blue-500 font-semibold">
            <option value="1">usdt</option>
            <option value="2">usdc</option>
          </select>
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
