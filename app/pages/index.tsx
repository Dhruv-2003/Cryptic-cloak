import Modal from "@/components/modal";
import Navbar from "@/components/navbar";
import { useEffect } from "react";
import axios from "axios";

export default function Home() {
  // useEffect(() => {
  //   callApi();
  // }, []);

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-white via-blue-100 to-rose-200">
      <div className="flex flex-col justify-center mx-auto w-full">
        <Navbar />
        <div className="mx-auto w-full">
          <button onClick={() => getStealthMetaAddress()}>Call Api</button>
          <Modal />
        </div>
      </div>
    </div>
  );
}
