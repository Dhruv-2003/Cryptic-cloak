import Modal from "@/components/modal";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div className="w-screen h-screen bg-gradient-to-r from-white via-blue-100 to-rose-200">
      <div className="flex flex-col justify-center mx-auto w-full">
        <Navbar />
        <div className="mx-auto w-full">
          <Modal />
        </div>
      </div>
    </div>
  );
}
