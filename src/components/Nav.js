import React, { useEffect, useState } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import noAvatar from "../assets/avatars/sample-10.png";

// Icons
import {
  UserAddIcon,
  QuestionMarkCircleIcon,
  DotsHorizontalIcon,
} from "@heroicons/react/outline";

export default function Nav(props) {
  const [data, setData] = useState({});

  useEffect(() => {
    if (props.userData.avatar) {
      const storage = getStorage();
      const pathReference = ref(
        storage,
        "general/assets/avatars/" + props.userData.avatar
      );
      getDownloadURL(pathReference).then((url) => {
        console.log(url);
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
      <div>
        <p>Loading profile...</p>
      </div>
    );
  } else console.log(data);
  return (
    <div className="flex items-center w-screen p-5 justify-between">
      <div className="flex items-center">
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
        <p className="pl-3 text-slate-900 dark:text-white">
          <span className="font-bold bg-gradient-to-r from-blue-300 to-pink-500 text-transparent bg-clip-text">
            CappCamp
          </span>
          <span className="font-medium"> di {data.user.name.f}</span>
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
