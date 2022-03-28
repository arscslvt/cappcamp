import React from "react";
import { LightningBoltIcon } from "@heroicons/react/solid";

export default function Button(props) {
  return (
    <button
      className={`items-center gap-2 ${
        props.dark
          ? "bg-slate-900 text-white hover:ring-gray-300"
          : "text-slate-900 bg-gray-100 hover:ring-gray-200"
      } ${
        props.premium && "bg-slate-900 !text-white hover:ring-gray-300"
      } py-2 px-3 rounded-lg hover:ring-4 transition flex`}
      onClick={() => (props.action() ? props.action() : null)}
    >
      {props.icon && <props.icon className="w-4" />}
      {props.premium && <LightningBoltIcon className="w-4 text-yellow-300" />}
      <span className="font-medium text-sm">{props.text || "Button text"}</span>
    </button>
  );
}
