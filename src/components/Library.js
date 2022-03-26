import React, { useEffect, useState } from "react";
import TileItem from "./TileItem";
import pdf from "../assets/pdf/test.pdf";
import Avatar1 from "../assets/avatars/sample-4.png";
import "../firebase/server";
import { db } from "../firebase/server";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export default function Library(props) {
  const [library, setLibrary] = useState([]);
  const tilesThemes = {
    lime: { bg: "bg-lime-300", tx: "text-slate-800" },
    blue: { bg: "bg-blue-300", tx: "text-white" },
  };

  useEffect(() => {
    const getLibrary = async () => {
      const querySnapshot = await getDocs(
        collection(db, "users", props.userId, "library")
      );
      const storage = getStorage();
      querySnapshot.forEach(async (maindoc) => {
        const income = maindoc.data();
        console.log(income);

        if (income.ref) {
          const docSnap = await getDoc(income.ref);
          if (docSnap.exists()) {
            console.log(docSnap.data());
            const bookData = docSnap.data();
            if (bookData.author) {
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
                            id: bookData.id,
                            title: bookData.title,
                            pages: bookData.pages,
                            publishDate: bookData.publishDate,
                            file: bookData.file,
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
          }
        }
      });
    };
    getLibrary();
  }, [props.userId]);

  if (library.length === 0)
    return (
      <div>
        <p>Loading library</p>
      </div>
    );
  else
    return (
      <div className="px-5 py-5">
        <h1 className="font-Playfair text-3xl font-medium text-slate-900 dark:text-white">
          La tua libreria
        </h1>
        <div className="flex mt-5">
          {
            library.map((element, index) => {
              return (
                <TileItem
                  book={element.book}
                  author={element.author ? element.author : false}
                  key={index}
                  theme={tilesThemes[1]}
                />
              );
            })
            // console.log(library)
          }
        </div>
      </div>
    );
}
