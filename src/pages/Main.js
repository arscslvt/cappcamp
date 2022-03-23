import React from "react";
import { Link } from "react-router-dom";

export default function Main() {
  return (
    <div className="flex select-text">
      {/* Center section */}
      <div className="flex h-screen w-screen items-center justify-center text-slate-900">
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-medium">welcome to</h2>
          <div className="flex flex-col items-center pt-2">
            <h1 className="text-5xl font-extrabold bg-gradient-to-tr from-amber-200 to-orange-400 text-transparent bg-clip-text">
              CappCamp
            </h1>
            <p className="text-lg pt-1">stuck? ask to a friend.</p>
          </div>
          <div className="flex items-center gap-8 mt-6">
            <button className="bg-slate-900 text-white font-medium py-2 px-4 rounded-full hover:ring-4 ring-orange-300 transition-all">
              Take a tour
            </button>
            <Link to={"signup"}>
              <button className="font-medium">skip</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
