import React from "react";
import { XIcon } from "@heroicons/react/outline";

export default function Alerts(props) {
  const types = {
    true: { bg: "bg-green-100", text: "text-green-500" },
    false: { bg: "bg-red-100", text: "text-red-500" },
  };

  return (
    <div
      className={`absolute flex items-center top-8 ${
        props.data.type === true ? types.true.bg : types.false.bg
      }  px-4 py-3 rounded-full`}
    >
      <p
        className={`pr-3 ${
          props.data.type === true ? types.true.text : types.false.text
        } font-semibold uppercase text-sm`}
      >
        {props.data.title || "alert"}
      </p>
      <p className="text-gray-800 font-medium text-sm">
        {props.data.text || "Some error occured."}
      </p>
      <button
        onClick={() => {
          props.close
            ? props.close(false)
            : alert("Cannot delete this alert. Try to refresh the page.");
        }}
        className="ml-5 py-1 px-1 uppercase bg-red-600 text-white rounded-full"
      >
        <XIcon className="w-3" />
      </button>
    </div>
  );
}
