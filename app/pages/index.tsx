import Modal from "@/components/modal";
import Navbar from "@/components/navbar";
import { useEffect } from "react";
import axios from "axios";

export default function Home() {
  const callApi = async () => {
    try {
      const res = await fetch("http://localhost:3030/getMetadataAddress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spendingKey:
            "0x6d2f70a47ddf455feb6a785b9787265f28897546bd1316224300aed627ef8cfc",
          viewingKey:
            "0xa2e9f98f845bb6a8d2db0a2a17a9d185fc97afd1b7949983ee367f9f08a5e0b7s",
        }),
      })
        .then(async (res) => {
          console.log(res);
          const data = await res.json();
          console.log(data.stdout.trim());
          return res;
        })
        .catch((err) => {
          console.log(err);
        });

      // await axios
      // .post("http://localhost:3030/getMetadataAddress", {
      //   spendingKey:
      //     "0x6d2f70a47ddf455feb6a785b9787265f28897546bd1316224300aed627ef8cfc",
      //   viewingKey:
      //     "0xa2e9f98f845bb6a8d2db0a2a17a9d185fc97afd1b7949983ee367f9f08a5e0b7s",
      // })
      console.log(res);
      // console.log(await res);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   callApi();
  // }, []);

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-white via-blue-100 to-rose-200">
      <div className="flex flex-col justify-center mx-auto w-full">
        <Navbar />
        <div className="mx-auto w-full">
          <button onClick={() => callApi()}>Call Api</button>
          <Modal />
        </div>
      </div>
    </div>
  );
}
