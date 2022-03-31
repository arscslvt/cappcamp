import React, { useEffect, useState } from "react";
import TileItem from "./TileItem";
import "../firebase/server";
import { db } from "../firebase/server";
import { collection, getDocs, getDoc, query, limit } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { CollectionIcon } from "@heroicons/react/outline";
import { isMobile } from "react-device-detect";

export default function Library(props) {
  const [library, setLibrary] = useState([]);
  const tilesThemes = {
    lime: { bg: "bg-lime-300", tx: "text-slate-800" },
    blue: { bg: "bg-blue-300", tx: "text-white" },
  };

  useEffect(() => {
    const getLibrary = async () => {
      const q = query(
        collection(db, "users", props.userId, "library"),
        limit(4)
      );
      const querySnapshot = await getDocs(q);
      const storage = getStorage();
      querySnapshot.forEach(async (maindoc) => {
        let courseData;
        // FETCH ALL DATA
        const income = maindoc.data();
        if (income.ref) {
          // FETCH BOOK DATA
          const getBook = await getDoc(income.ref);
          if (getBook.exists()) {
            console.log(getBook.data());
            const bookData = getBook.data();
            if (bookData.course) {
              const getCourse = await getDoc(bookData.course);
              if (getCourse.exists()) {
                courseData = getCourse.data();
              }
            }
            if (bookData.author) {
              // FETCH AUTHOR DATA
              const getAuthor = await getDoc(bookData.author);
              if (getAuthor.exists()) {
                const authorData = getAuthor.data();
                if (authorData.avatar) {
                  const pathReference = ref(
                    storage,
                    "general/assets/avatars/" + authorData.avatar
                  );
                  getDownloadURL(pathReference)
                    .then((url) => {
                      setLibrary((l) => [
                        ...l,
                        {
                          author: {
                            id: getAuthor.id,
                            user: authorData.user,
                            image: authorData.photoURL
                              ? authorData.photoURL
                              : false,
                            avatar: url,
                          },
                          book: {
                            id: getBook.id,
                            title: bookData.title,
                            pages: bookData.pages,
                            publishDate: bookData.publishDate,
                            file: bookData.file,
                            courseName: courseData ? courseData.name : false,
                          },
                        },
                      ]);
                    })
                    .catch((error) => {
                      console.error(error);
                      setLibrary((l) => [
                        ...l,
                        {
                          author: {
                            id: getAuthor.id,
                            user: authorData.user,
                            image: authorData.photoURL
                              ? authorData.photoURL
                              : false,
                            avatar: false,
                          },
                          book: {
                            id: bookData.id,
                            title: bookData.title,
                            pages: bookData.pages,
                            publishDate: bookData.publishDate,
                            file: bookData.file,
                          },
                        },
                      ]);
                    });
                  console.log(pathReference);
                }
              } else {
                setLibrary((l) => [
                  ...l,
                  {
                    book: {
                      id: bookData.id,
                      title: bookData.title,
                      pages: bookData.pages,
                      publishDate: bookData.publishDate,
                    },
                  },
                ]);
              }
            }
          } else {
            console.warn(
              "We couldn't find this publishing you're searching for."
            );
            setLibrary((l) => [...l, false]);
          }
        } else {
          setLibrary((l) => [...l, false, false]);
        }
      });
    };
    getLibrary();
  }, [props.userId]);

  if (library.length === 0) {
    return <></>;
  } else
    return (
      <div className="max-w-screen py-5 bg-slate-100 mb-2">
        <div className="flex px-5 justify-between items-center">
          <h1 className="font-Playfair text-3xl font-semibold text-slate-900">
            La tua libreria
          </h1>
          <div className="flex items-center gap-2">
            <button className="items-center gap-2 ml-7 text-white bg-slate-800 py-2 px-3 rounded-lg hover:ring-4 hover:ring-gray-200 transition hidden md:flex">
              <CollectionIcon className="w-4" />
              <span className="font-medium text-sm">View full library</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col mt-5 gap-4 md:gap-0 md:flex-row max-w-full overflow-x-auto px-4 md:px-0">
          {
            library.map((element, index) => {
              return (
                <TileItem
                  book={element.book}
                  author={element.author ? element.author : false}
                  key={index}
                  theme={tilesThemes[1]}
                  mobile={isMobile}
                  link={"viewer/" + element.book.id}
                />
              );
            })
            // console.log(library)
          }
        </div>
      </div>
    );
}
