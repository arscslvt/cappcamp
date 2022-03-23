import React from "react";
import Avatar1 from "../assets/avatars/sample-1.png";
import Avatar2 from "../assets/avatars/sample-2.png";
import Avatar3 from "../assets/avatars/sample-3.png";
import Avatar4 from "../assets/avatars/sample-4.png";
import Avatar5 from "../assets/avatars/sample-5.png";

// Icons
import {
  UserAddIcon,
  QuestionMarkCircleIcon,
  DotsHorizontalIcon,
} from "@heroicons/react/outline";

export default function Nav(props) {
  const udata = props.userData;
  const avatars = [Avatar1, Avatar2, Avatar3, Avatar4, Avatar5];
  // console.log(avatars[props.userData.avatar]);
  // console.log(udata);
  if (udata)
    return (
      <div className="flex items-center w-screen p-5 justify-between">
        <div className="flex items-center">
          <button
            className="rounded-full w-8 h-8 cursor-pointer hover:ring-4 transition"
            onClick={props.logout}
          >
            <img
              src={avatars[udata.avatar]}
              alt="User avatar"
              className="w-full h-full"
            />
          </button>
          <p className="pl-3 text-slate-900 dark:text-white">
            <span className="font-bold bg-gradient-to-r from-blue-300 to-pink-500 text-transparent bg-clip-text">
              CappCamp
            </span>
            <span className="font-medium"> di {udata.fname}</span>
          </p>
          <button className="flex items-center gap-2 ml-7 text-slate-900 dark:text-white bg-gray-100 dark:bg-gray-700 py-2 px-3 rounded-lg hover:ring-4 hover:ring-gray-200 transition">
            <UserAddIcon className="w-4" />
            <span className="font-medium text-sm">Invita amici</span>
          </button>
        </div>
        {/* Navigation bar: other buttons */}
        <div className="flex items-center gap-4 text-slate-900">
          <button title="Menu">
            <DotsHorizontalIcon className="w-6 aspect-square" />
          </button>
          <button title="Help">
            <QuestionMarkCircleIcon className="w-6 aspect-square" />
          </button>
        </div>
      </div>
    );
}
