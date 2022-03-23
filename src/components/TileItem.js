import React, { useState } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import spinner from "../assets/icons/spinner.svg";
import { DocumentTextIcon, CalendarIcon } from "@heroicons/react/outline";

export default function TileItem(props) {
  console.log(props);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // const getDateFromTimestamp = (ts) => {
  //   const data = new Date(ts);
  //   const month = [
  //     "Gennaio",
  //     "Febbraio",
  //     "Marzo",
  //     "Aprile",
  //     "Maggio",
  //     "Giugno",
  //     "Luglio",
  //     "Agosto",
  //     "Settembre",
  //     "Ottobre",
  //     "Novembre",
  //     "Dicembre",
  //   ];
  //   const format = {
  //     dd: data.getDate() < 10 ? "0" + data.getDate() : data.getDate(),
  //     mm: month[data.getMonth()],
  //     yy: data.getFullYear(),
  //   };
  //   return format;
  // };

  return (
    <div className="flex rounded-lg bg-lime-300 dark:bg-slate-600  overflow-clip cursor-pointer mr-5 transition-all last:mr-0">
      <div className="flex flex-col flex-1 py-4 px-4 text-white">
        <h2 className="text-lg font-semibold text-white w-40 max-w-md flex-1">
          {props.title}
        </h2>
        <div className="flex flex-col gap-2 pt-3">
          <div className="flex items-center justify-between gap-4">
            <p className="flex items-center text-normal font-Def opacity-70">
              <DocumentTextIcon className="w-4 mr-1" />
              {props.pages}
            </p>
            {/* <p className="flex items-center text-sm font-Def">
              <CalendarIcon className="w-4 mr-1" />
              {getDateFromTimestamp(props.upDate).dd +
                " " +
                getDateFromTimestamp(props.upDate).mm +
                " " +
                getDateFromTimestamp(props.upDate).yy}
            </p> */}
            {props.authorAvatar ? (
              <img
                src={props.authorAvatar}
                alt=""
                className="w-5 h-5 aspect-square"
              />
            ) : null}
          </div>
        </div>
      </div>
      {props.file ? (
        <div className="w-max min-w-max mr-3 ml-5 translate-y-4 overflow-clip rounded-t-sm pointer-events-none select-none">
          <Document
            file={props.file}
            onLoadSuccess={onDocumentLoadSuccess}
            className="w-max min-w-max"
            loading={
              <div className="block">
                <img src={spinner} alt="Loading" className="w-8" />
              </div>
            }
            renderMode={"svg"}
          >
            <Page
              pageNumber={pageNumber}
              width={100}
              loading={"Loading page..."}
            />
          </Document>
        </div>
      ) : null}
    </div>
  );
}
