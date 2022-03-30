import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import noAvatar from "../assets/avatars/sample-10.png";
import { isMobile } from "react-device-detect";

// Icons
import {
  UserAddIcon,
  QuestionMarkCircleIcon,
  DotsHorizontalIcon,
  SearchIcon,
} from "@heroicons/react/outline";

export default function Nav(props) {
  const [data, setData] = useState({});
  // const nav = useNavigate();

  useEffect(() => {
    if (props.userData.avatar) {
      const storage = getStorage();
      const pathReference = ref(
        storage,
        "general/assets/avatars/" + props.userData.avatar
      );
      getDownloadURL(pathReference).then((url) => {
        console.log("Requested avatar URL.");
        setData((d) => ({
          ...d,
          user: {
            avatar: url,
            name: { f: props.userData.fname, l: props.userData.lname },
          },
        }));
      });
    } else {
      setData((d) => ({
        ...d,
        user: {
          avatar: false,
          name: { f: props.userData.fname, l: props.userData.lname },
        },
      }));
    }
  }, [props.avatar, props.userData]);

  if (Object.keys(data).length === 0) {
    return (
      <div className="flex items-center justify-between p-5 animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-100 rounded-full" />
          <div className="h-3 w-20 bg-slate-100 rounded-full" />
        </div>
        <div className="w-4 h-4 rounded-full bg-slate-10" />
      </div>
    );
  }
  return (
    <div className="flex flex-col w-screen">
      <div className="flex items-center w-full p-5 justify-between">
        <div className="flex items-center gap-4">
          <div className="flex gap-3 items-center">
            <button
              className="rounded-full w-8 h-8 cursor-pointer hover:ring-4 transition"
              onClick={props.logout}
            >
              <img
                src={data.user.avatar ? data.user.avatar : noAvatar}
                alt="User avatar"
                className="w-full h-full"
              />
            </button>
            <p className="text-slate-900">
              <span className="font-bold bg-gradient-to-r from-blue-300 to-pink-500 text-transparent bg-clip-text">
                CappCamp
              </span>
              <span className="font-medium"> di {data.user.name.f}</span>
            </p>
          </div>
          <button className="items-center gap-2 ml-7 text-slate-900 dark:text-white bg-gray-100 dark:bg-gray-700 py-2 px-3 rounded-lg hover:ring-4 hover:ring-gray-200 transition hidden md:flex">
            <UserAddIcon className="w-4" />
            <span className="font-medium text-sm">Invita amici</span>
          </button>
          {!isMobile && (
            <div className="group hidden md:flex items-center px-2 text-sm rounded-lg bg-slate-100 overflow-hidden">
              <SearchIcon className="w-4 text-slate-800 opacity-50 group-focus-within:opacity-100 transition-opacity" />
              <input
                type="text"
                className="py-2 px-3 text-sm outline-none bg-transparent w-64 min-w-min"
                placeholder="Cerca per titolo, autore, tags..."
              />
            </div>
          )}
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
      {isMobile && (
        <div className="flex px-4 pb-4">
          <div className="group flex items-center px-2 text-sm rounded-lg bg-slate-100 overflow-hidden w-full">
            <SearchIcon className="w-4 text-slate-800 opacity-50 group-focus-within:opacity-100 transition-opacity" />
            <input
              type="text"
              className="py-2 px-3 text-sm outline-none bg-transparent w-64 min-w-min"
              placeholder="Cerca per titolo, autore, tags..."
            />
          </div>
        </div>
      )}
    </div>
  );
}
