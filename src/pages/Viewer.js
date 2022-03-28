import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import pdf from "../assets/pdf/test-light.pdf";
import avatar from "../assets/avatars/sample-6.png";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import Button from "../components/Button";
import ButtonTransparent from "../components/ButtonTransparent";
import { isDesktop } from "react-device-detect";

import {
  DownloadIcon,
  ShareIcon,
  ArrowLeftIcon,
} from "@heroicons/react/outline";

export default function Viewer() {
  const renderSection = useRef();
  const [renderSize, setRenderSize] = useState(0);

  useEffect(() => {
    setRenderSize(renderSection.current.offsetWidth);
    const onResize = () => {
      let time;
      clearTimeout(time);
      time = setTimeout(() => {
        setRenderSize(renderSection.current.offsetWidth);
      }, 100);
    };

    window.addEventListener("resize", onResize);
  }, [renderSection]);

  return (
    <div className="w-screen h-4/5 md:overflow-hidden flex-1 flex flex-col md:flex-row md:px-10 gap-5 md:gap-32">
      <div className="flex flex-col-reverse md:flex-col px-5 py-2 md:py-10">
        <div className="flex-1 flex-col">
          <Tag text="general" />
          <h1 className="text-2xl font-semibold pt-3 pb-5 text-slate-900">
            The Notion Bears.
          </h1>
          <div className="flex flex-col gap-8">
            <div className="flex justify-around md:justify-start flex-row items-center md:items-start md:flex-col gap-5 md:gap-3 ring-2 ring-slate-100 md:ring-0 p-2 md:p-0 rounded-lg">
              <div className="flex flex-col items-center md:items-start text-slate-800">
                <span className="uppercase text-sm font-medium opacity-50">
                  pages
                </span>
                <span className="flex items-center font-Def font-light -mt-0.5">
                  <span>3</span>
                  {/* <span className="pl-1 opacity-50">/ 35</span> */}
                </span>
              </div>
              <div className="flex flex-col items-center md:items-start text-slate-800">
                <span className="uppercase text-sm font-medium opacity-50">
                  last updated
                </span>
                <span className="flex items-center font-Def font-light -mt-0.5">
                  <span>26 Marzo 2022</span>
                </span>
              </div>
              {isDesktop ? (
                <div className="flex flex-col items-center md:items-start text-slate-800">
                  <span className="uppercase text-sm font-medium opacity-50">
                    by
                  </span>
                  <span className="flex items-center font-Def font-light -mt-0.5 cursor-pointer w-min">
                    <img src={avatar} alt="Avatar" className="w-5" />
                    <span className="pl-1">CappCamp</span>
                  </span>
                </div>
              ) : null}
            </div>
            <div className="flex items-center gap-2 justify-start">
              <Button text="Download" icon={DownloadIcon} dark />
              <Button text="Share" icon={ShareIcon} />
            </div>
          </div>
        </div>
        {/* BOTTOM BUTTONS */}
        <div className="pb-5 md:pb-0">
          <ButtonTransparent
            text="Torna indietro"
            icon={ArrowLeftIcon}
            link="/home"
          />
        </div>
      </div>
      {/* RENDER FILE */}
      <div
        className="flex flex-1 justify-end w-full md:w-3/4"
        ref={renderSection}
      >
        <div ref={renderSection} className="flex-1 overflow-y-auto">
          <RenderFile file={pdf} size={renderSize} />
        </div>
      </div>
    </div>
  );
}

const RenderFile = (props) => {
  const [pages, setPages] = useState(0);

  function handleSuccess({ numPages }) {
    setPages(numPages);
  }

  return (
    <div className="overflow-y-auto md:px-5">
      <Document
        file={props.file}
        loading={<p>Loading PDF</p>}
        onLoadSuccess={handleSuccess}
        className="flex flex-col gap-10"
        renderMode="canvas"
      >
        {Array.apply(null, Array(pages))
          .map((x, i) => i + 1)
          .map((page) => (
            <Page
              pageNumber={page}
              loading={"Loading page..."}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              width={props.size - 100 || 200}
              className="w-full shadow-xl shadow-slate-300 first:mt-10 last:mb-10"
              key={page}
            />
          ))}
      </Document>
    </div>
  );
};

const Tag = (props) => {
  const nav = useNavigate();
  return (
    <div
      className={`flex items-center py-2 px-3 bg-slate-100 text-slate-900 rounded-lg w-min ${
        props.link || props.action ? "cursor-pointer" : null
      }`}
      onClick={props.link ? () => nav(props.link) : null}
    >
      <span className="uppercase text-xs font-medium">
        {props.text || "tag"}
      </span>
    </div>
  );
};
