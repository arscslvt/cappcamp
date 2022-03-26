import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import spinner from "../assets/icons/spinner.svg";
import { DocumentTextIcon } from "@heroicons/react/outline";
// import { db } from "../firebase/server";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export default function TileItem(props) {
  console.log(props);
  const [data, setData] = useState({
    title: props.book.title,
    authorId: props.author.id,
    authorUser: props.author.user,
    authorAvatar: props.author.avatar,
    publishDate: props.book.publishDate,
  });

  useEffect(() => {
    if (props.book.file) {
      const storage = getStorage();
      const pathReference = ref(
        storage,
        "users/" + props.author.id + "/files/" + props.book.file
      );
      console.log("File received: " + props.book.file);
      getDownloadURL(pathReference).then((url) => {
        console.log("File PDF url: " + url);
        setData((d) => ({
          ...d,
          file: url,
        }));
      });
    }
  }, [props]);

  function onDocumentLoadSuccess({ numPages }) {
    setData((d) => ({
      ...d,
      pages: numPages,
    }));
  }

  if (data)
    return (
      <div className="flex rounded-lg bg-blue-500 dark:bg-slate-600  overflow-clip cursor-pointer mr-5 transition-all last:mr-0 w-full md:w-auto">
        <div className="flex flex-col flex-1 py-4 px-4 text-white">
          <h2 className="text-lg font-semibold text-white w-40 max-w-md flex-1">
            {data.title}
          </h2>
          <div className="flex flex-col gap-2 pt-3">
            <div className="flex items-center justify-between gap-4">
              <p className="flex items-center text-normal font-Def opacity-70">
                <DocumentTextIcon className="w-4 mr-1" />
                {data.pages ? (
                  data.pages
                ) : (
                  <div className="block">
                    <img src={spinner} alt="Loading" className="w-8" />
                  </div>
                )}
              </p>
              {data.authorAvatar ? (
                <img
                  src={data.authorAvatar}
                  alt=""
                  className="w-5 h-5 aspect-square"
                />
              ) : null}
            </div>
          </div>
        </div>
        {data.file ? (
          <div className="w-max min-w-max mr-3 ml-5 translate-y-4 overflow-clip rounded-t-sm pointer-events-none select-none">
            <Document
              file={data.file}
              className="w-max min-w-max"
              loading={
                <div className="block">
                  <img src={spinner} alt="Loading" className="w-8" />
                </div>
              }
              renderMode={"canvas"}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page pageNumber={1} width={100} loading={"Loading page..."} />
            </Document>
            {/* <embed src={data.file} width="800px" height="2100px" /> */}
          </div>
        ) : null}
      </div>
    );
}
