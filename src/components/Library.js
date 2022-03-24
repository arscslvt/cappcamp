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
        // doc.data() is never undefined for query doc snapshots
        const income = maindoc.data();
        console.log(income);

        const docRef = doc(db, "publishings", income.pubId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          let bookData = docSnap.data();
          // const imagesRef = ref(storage, "users");
          const spaceRef = ref(
            storage,
            "users/" + docSnap.data().authorId + "/avatar/cappcamp-staff.png"
          );
          console.log(spaceRef);
          getDownloadURL(spaceRef)
            .then((url) => {
              // Insert url into an <img> tag to "download"
              console.log("Image url: " + url);
              setLibrary((l) => [
                ...l,
                {
                  title: bookData.title,
                  authorId: bookData.authorId,
                  authorAvatar: url,
                  publishDate: bookData.publishDate.toDate(),
                  pagesNumber: bookData.pages,
                  file: bookData.file,
                },
              ]);
            })
            .catch((error) => {
              // A full list of error codes is available at
              // https://firebase.google.com/docs/storage/web/handle-errors
              console.log(
                "Some error occured. Try later. [Err: " + error + "]."
              );
              setLibrary((l) => [
                ...l,
                {
                  title: bookData.title,
                  authorId: bookData.authorId,
                  publishDate: bookData.publishDate,
                  pagesNumber: bookData.pages,
                  file: bookData.file,
                },
              ]);
            });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
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
                  title={element.title}
                  author={element.authorId}
                  authorAvatar={
                    element.authorAvatar ? element.authorAvatar : null
                  }
                  pages={element.pagesNumber}
                  upDate={element.publishDate}
                  key={index}
                  theme={tilesThemes[1]}
                  file={element.file ? element.file : false}
                />
              );
            })
            // console.log(library)
          }
        </div>
      </div>
    );
}
