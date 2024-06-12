"use client";

export default function Navbar() {
  return (
    <nav className="bg-black text-white w-full">
      <div className="max-w-[1280px] mx-auto py-5 px-2 flex justify-between items-center">
        <div className="text-2xl font-medium">
          ML <span className="text-green-500 ">Dojo</span>
        </div>
      </div>
    </nav>
  );
}
