import React from "react";
import { useNavigate } from "react-router-dom";
import { ChatAlt2Icon } from "@heroicons/react/outline";

export default function ButtonTransparent(props) {
  const nav = useNavigate();

  return (
    <button
      className={`items-center gap-2 transition-all ${
        props.dark
          ? "bg-transparent text-white"
          : "bg-transparent text-slate-900"
      } p-1 rounded-lg transition flex hover:gap-3`}
      onClick={() =>
        props.link ? nav(props.link) : props.action ? props.action : null
      }
    >
      {props.icon ? (
        <props.icon className="w-4" />
      ) : (
        <ChatAlt2Icon className="w-4" />
      )}
      <span className="font-medium text-sm">{props.text || "Button text"}</span>
    </button>
  );
}
