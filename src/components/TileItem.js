import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import LoadingIcon from "../assets/icons/spinnerLight.svg";
import { DocumentTextIcon } from "@heroicons/react/outline";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export default function TileItem(props) {
  const [data, setData] = useState({
    title: props.book.title,
    authorId: props.author.id,
    authorUser: props.author.user,
    authorAvatar: props.author.avatar,
    publishDate: props.book.publishDate,
    pages: props.book.pages,
  });

  useEffect(() => {
    if (props.book.file && props.mobile === false) {
      const storage = getStorage();
      const pathReference = ref(
        storage,
        "users/" + props.author.id + "/files/" + props.book.file
      );
      // console.log("File received: " + props.book.file);
      getDownloadURL(pathReference).then((url) => {
        // console.log("File PDF url: " + url);
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
      <Link
        to={props.link || "/"}
        className="md:mr-5 md:first:ml-4 md:last:mr-4 w-full md:max-w-md md:min-h-max md:w-max"
      >
        <div className="flex rounded-lg bg-slate-800 overflow-clip cursor-pointer transition-all w-full md:max-w-md md:min-h-max md:w-max">
          <div className="flex flex-col flex-1 text-white p-4">
            <p className="text-xs font-semibold uppercase text-white w-min max-w-md md:max-w-xxs whitespace-nowrap overflow-hidden text-ellipsis block p-1 bg-slate-50 bg-opacity-20 rounded-md mb-2">
              {props.book.courseName || "generic"}
            </p>
            <h2 className="text-lg font-semibold text-white flex-1">
              {data.title.length > 40
                ? data.title.substring(0, 40) + "..."
                : data.title}
            </h2>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                <p className="flex items-center text-sm font-Def opacity-70">
                  <DocumentTextIcon className="w-4 mr-1" />
                  {data.pages ? (
                    data.pages
                  ) : (
                    <div className="block">
                      <img
                        src={LoadingIcon}
                        alt="Loading"
                        className="w-5 animate-spin"
                      />
                    </div>
                  )}
                </p>
                <div className="flex items-center">
                  {data.authorUser ? (
                    <span className="text-sm font-Def opacity-70">
                      by {data.authorUser}
                    </span>
                  ) : null}
                  {data.authorAvatar ? (
                    <img
                      src={data.authorAvatar}
                      alt=""
                      className="w-5 h-5 aspect-square ml-1"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          {data.file ? (
            <div className="flex justify-center items-center w-min min-w-max overflow-clip rounded-t-sm select-none p-3">
              <Document
                file={data.file}
                className="w-auto overflow-hidden rounded-md"
                loading={
                  <div className="block">
                    <img
                      src={LoadingIcon}
                      alt="Loading"
                      className="w-5 animate-spin"
                    />
                  </div>
                }
                renderMode={"canvas"}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page
                  pageNumber={1}
                  width={100}
                  loading={"Loading page..."}
                  className="w-full overflow-hidden"
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
              </Document>
            </div>
          ) : null}
        </div>
      </Link>
    );
}
