import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import avatar from "../assets/avatars/sample-6.png";
import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack5";
import Button from "../components/Button";
import ButtonTransparent from "../components/ButtonTransparent";
import { isDesktop, isMobile } from "react-device-detect";
import { storage, db } from "../firebase/server";
import { doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";

import {
  DownloadIcon,
  ShareIcon,
  ArrowLeftIcon,
  XIcon,
  ArrowsExpandIcon,
  LinkIcon,
} from "@heroicons/react/outline";
import { BadgeCheckIcon } from "@heroicons/react/solid";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function Viewer() {
  const nav = useNavigate();
  const { key } = useParams();
  const [fileData, setFileData] = useState({});
  const renderSection = useRef();
  const [fullScreen, setFullScreen] = useState(false);
  const [nowSize, setNowSize] = useState(0);
  const [renderSize, setRenderSize] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [share, setShare] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setRenderSize(renderSection.current.offsetWidth + 60);
    } else setRenderSize(renderSection.current.offsetWidth - 120);
    const onResize = () => {
      let time;
      clearTimeout(time);
      time = setTimeout(() => {
        if (isDesktop) {
          setRenderSize(renderSection.current.offsetWidth);
        }
      }, 100);
    };

    const getFile = async () => {
      const docRef = doc(db, "publishings", key);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const bookData = docSnap.data();
        const authSnap = await getDoc(bookData.author);
        if (authSnap.exists()) {
          const authorData = authSnap.data();
          const month = [
            "Gennaio",
            "Febbraio",
            "Marzo",
            "Aprile",
            "Maggio",
            "Giugno",
            "Luglio",
            "Agosto",
            "Settembre",
            "Ottobre",
            "Novembre",
            "Dicembre",
          ];
          const pub = new Date(bookData.publishDate.toDate());
          const last = new Date(bookData.lastEdit.toDate());
          getDownloadURL(
            ref(storage, `users/${bookData.authorId}/files/${bookData.file}`)
          )
            .then((url) => {
              // `url` is the download URL for 'images/stars.jpg'
              setFileData((f) => ({
                ...f,
                title: bookData.title,
                publish:
                  pub.getDay() +
                  " " +
                  month[pub.getMonth()] +
                  " " +
                  pub.getFullYear(),
                pages: bookData.pages,
                lastEdit:
                  last.getDay() +
                  " " +
                  month[last.getMonth()] +
                  " " +
                  last.getFullYear(),
                file: url,
                authorName: authorData.fname + " " + authorData.lname,
                authorUser: authorData.user,
                authorAvatar: authorData.avatar,
                authorVerified: authorData.verified,
              }));
            })
            .catch((error) => {
              console.warn(error);
            });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      } else {
        console.log("No such document!");
        nav("/home");
      }
    };
    getFile();

    window.addEventListener("resize", onResize);
  }, [renderSection, key, nav]);

  const downloadFile = () => {
    console.log("Downloading...");
    setDownloading(true);
    setTimeout(() => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = "blob";
      xhr.onload = (event) => {
        const blob = new Blob([xhr.response], { type: "image/pdf" });
        let a = document.createElement("a");
        a.style = "display: none";
        document.body.appendChild(a);
        let url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download =
          fileData.title +
          " - @" +
          fileData.authorUser +
          " (from CappCamp).pdf";
        a.click();
        window.URL.revokeObjectURL(url);
      };
      xhr.open("GET", fileData.file);
      xhr.send();

      setDownloading(false);
    }, 1500);
  };

  return (
    <div className="w-screen h-4/5 md:overflow-hidden flex-1 flex flex-col md:flex-row md:px-10 gap-5 md:gap-32">
      <div className="flex flex-col-reverse md:flex-col px-5 py-2 md:py-10">
        <div className="flex-1 flex-col">
          <Tag text="general" />
          <h1 className="text-2xl font-semibold pt-3 pb-5 text-slate-900 md:w-72">
            {fileData.title || "Document title."}
          </h1>
          <div className="flex flex-col gap-8">
            <div className="flex justify-around md:justify-start flex-row items-center md:items-start md:flex-col gap-5 md:gap-3 ring-2 ring-slate-100 md:ring-0 p-2 md:p-0 rounded-lg">
              <div className="flex flex-col items-center md:items-start text-slate-800">
                <span className="uppercase text-sm font-medium opacity-50">
                  pages
                </span>
                <span className="flex items-center font-Def font-light -mt-0.5">
                  <span>{pageNumber || fileData.pages}</span>
                  {/* <span className="pl-1 opacity-50">/ 35</span> */}
                </span>
              </div>
              <div className="flex flex-col items-center md:items-start text-slate-800">
                <span className="uppercase text-sm font-medium opacity-50">
                  last updated
                </span>
                <span className="flex items-center font-Def font-light -mt-0.5">
                  <span>{fileData.lastEdit}</span>
                </span>
              </div>
              {isDesktop ? (
                <div className="flex flex-col items-center md:items-start text-slate-800">
                  <span className="uppercase text-sm font-medium opacity-50">
                    by
                  </span>
                  <span
                    className="flex items-center font-Def font-light -mt-0.5 cursor-pointer w-min"
                    onClick={() => {
                      setFullScreen(true);
                      setNowSize(renderSize);
                    }}
                  >
                    <img src={avatar} alt="Avatar" className="w-5 h-5" />
                    <span className="flex items-center ml-2 whitespace-nowrap">
                      <span>{fileData.authorName}</span>
                      {fileData.authorVerified && (
                        <BadgeCheckIcon className="w-4 h-4 ml-2 text-blue-600" />
                      )}
                    </span>
                  </span>
                </div>
              ) : null}
            </div>
            <div className="flex items-center gap-2 justify-start">
              <Button
                text="Download"
                icon={DownloadIcon}
                dark
                action={() => downloadFile()}
                loading={downloading}
              />
              <div className="relative">
                <Button
                  text="Share"
                  icon={ShareIcon}
                  action={() => {
                    setShare(!share);
                  }}
                />
                {share && (
                  <Share
                    link={
                      "https://cappcamp-beta.netlify.app/home/viewer/" + key
                    }
                    setShare={setShare}
                  />
                )}
              </div>
              {isMobile && (
                <Button
                  text="Immersivo"
                  icon={ArrowsExpandIcon}
                  action={() => {
                    setNowSize(renderSize);
                    setFullScreen(true);
                  }}
                />
              )}
            </div>
          </div>
        </div>
        {/* BOTTOM BUTTONS */}
        <div className="pb-5 md:pb-0">
          <ButtonTransparent
            text="Torna indietro"
            icon={ArrowLeftIcon}
            link="/dashboard"
          />
        </div>
      </div>
      {/* RENDER FILE */}
      <div
        // className="flex flex-1 justify-end w-full md:w-3/4"
        className={
          fullScreen
            ? "fixed flex flex-1 top-0 left-0 w-screen h-screen bg-slate-900 bg-opacity-40 transition"
            : "flex flex-1 justify-end w-full md:w-3/4 transition"
        }
        ref={renderSection}
      >
        {fullScreen && (
          <div className="fixed top-0 left-0 w-screen flex items-center justify-end p-3 z-20">
            <Button
              text={isDesktop ? "Close" : null}
              icon={XIcon}
              dark
              action={() => {
                setFullScreen(false);
              }}
            />
          </div>
        )}

        <RenderFile
          file={fileData.file}
          size={fullScreen ? nowSize : renderSize}
          setPageN={setPageNumber}
          reference={renderSection}
        />
        <div className="flex fixed bottom-8 right-10 z-20">
          {!fullScreen && !isMobile && (
            <Button
              text="Fullscreen"
              icon={ArrowsExpandIcon}
              hoverOpacity
              action={() => {
                setNowSize(renderSize);
                setFullScreen(true);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// fullScreen
//                 ? renderSize > 900
//                   ? (renderSize * 75) / 100
//                   : renderSize < 500
//                   ? (renderSize * 100) / 90
//                   : renderSize
//                 : renderSize

const RenderFile = (props) => {
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  function handleSuccess({ numPages }) {
    if (numPages <= 5) setPages(numPages);
    else setPages(5);
    props.setPageN(numPages);
    setTotalPages(numPages);
  }

  const handleLoading = (e) => {
    setLoading(0);
    // console.log("Full: " + e.target.scrollHeight);
    // console.log("Top: " + e.target.scrollTop);
    if (e.target.scrollHeight - 800 < e.target.scrollTop) {
      // console.error("Maximum reached");
      if (pages + 5 > totalPages) {
        setPages(totalPages);
      } else setPages(pages + 5);
    }
  };

  return (
    <div
      ref={props.reference}
      className={`flex-1 overflow-y-auto`}
      // onScroll={(e) => console.log(e)}
      onScrollCapture={(e) => {
        handleLoading(e);
      }}
    >
      <div className={"relative overflow-y-auto md:px-5"}>
        <Document
          file={props.file}
          loading={<p>Loading PDF</p>}
          onLoadSuccess={handleSuccess}
          className="flex flex-col gap-10 items-center"
          // renderMode="svg"
        >
          {Array.apply(null, Array(pages))
            .map((x, i) => i + 1)
            .map((page) => (
              <Page
                pageNumber={page}
                loading={<p>Loading page...</p>}
                onRenderSuccess={() => {
                  setLoading(loading + 1);
                  console.log("rendered");
                }}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                width={props.size - 100 || 200}
                className="w-min shadow-xl shadow-slate-300 first:mt-10 last:mb-10"
                key={page}
              />
            ))}
        </Document>
      </div>
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

const Share = (props) => {
  const handleCopy = () => {
    window.navigator.clipboard.writeText(props.link).then(() => {
      props.setShare(false);
      console.log("Copied to clipboard");
    });
  };
  return (
    <div className="absolute z-30 bg-gray-50 top-10 w-60 min-w-min p-3 rounded-lg">
      <div>
        <h1 className="text-md font-semibold">
          Share this note with your friends.
        </h1>
        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={props.link || "Sorry, we can't generate a link"}
            className="py-1 px-2 text-sm rounded-md bg-gray-100 text-slate-900 outline-none focus:ring-2 ring-blue-500 transition"
            readOnly
          />
          <Button icon={LinkIcon} action={() => handleCopy()} />
        </div>
      </div>
    </div>
  );
};
