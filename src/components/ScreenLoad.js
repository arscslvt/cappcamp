import React from "react";
import spinner from "../assets/icons/spinner.svg";

export default function ScreenLoad() {
  return (
    <div className="flex items-center justify-center fixed top-0 left-0 w-screen h-screen bg-slate-100 bg-opacity-50">
      <img src={spinner} alt="Spinner" className="w-20 h-20" />
    </div>
  );
}
