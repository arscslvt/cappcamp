import React, { useState, useEffect, useRef } from "react";
import spinner from "../assets/icons/spinnerDark.svg";

export default function ScreenLoad() {
  const [hint, setHint] = useState(false);
  const el = useRef(false);

  useEffect(() => {
    setTimeout(() => {
      if (el.current) setHint(true);
    }, 3500);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center fixed top-0 left-0 w-screen h-screen bg-slate-100 bg-opacity-50"
      ref={el}
    >
      <div className="flex flex-col items-center">
        <img
          src={spinner}
          alt="Spinner"
          className="mt-5 w-12 h-12 animate-spin"
        />
        <div
          className={`flex flex-col items-center ${
            hint ? "animate-fadeInDown" : "opacity-0"
          }`}
        >
          <span className="mt-5 font-medium">
            🤔 Uhm... non sembra funzionare.
          </span>
          <span className="text-sm">
            Controlla la connessione o riprova più tardi
          </span>
        </div>
      </div>
    </div>
  );
}
