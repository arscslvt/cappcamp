import React, { useEffect } from "react";
// import TileItem from "./TileItem";

export default function LatestNote() {
  useEffect(() => {}, []);
  return (
    <div className="max-w-screen flex flex-1 flex-wrap">
      <div className="flex px-5 justify-between items-center">
        <h1 className="font-Playfair text-3xl font-semibold text-slate-900 dark:text-white">
          In base alle tue preferenze
        </h1>
      </div>
      <div className="flex flex-col mt-5 gap-4 md:gap-0 md:flex-row max-w-full overflow-x-auto"></div>
    </div>
  );
}
