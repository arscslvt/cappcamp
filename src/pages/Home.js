import React, { useState, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import Nav from "../components/Nav";
import Alerts from "../components/Alerts";
import { doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "../firebase/server";
import ScreenLoad from "../components/ScreenLoad";
import HomeComponents from "../components/HomeComponents";
import { isSafari } from "react-device-detect";
import Viewer from "./Viewer";
import UploadFile from "./UploadFile";

export default function Home() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState([]);
  const [userData, setUserData] = useState(false);

  const auth = getAuth();

  const logOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        setAlert((a) => [
          ...a,
          {
            title: "Mmh...",
            text: "Abbiamo riscontrato problemi durante il tuo logout. Prova più tardi.",
            type: false,
            show: true,
          },
        ]);
      });
  };

  useEffect(() => {
    if (isSafari) {
      console.log(isSafari);
      setAlert((a) => [
        ...a,
        {
          title: "accesso da safari",
          text: "Al momento questo browser non è pienamente supportato. Utilizza dei browser Chromium based come Google Chrome, MS Edge oppure Firefox/Opera.",
          type: false,
        },
        {
          title: "🚧 bee, boop, beep",
          text: "CappCamp è ancora in fase ALPHA1.3, e non è ancora stato completamente testato su tutti i browser. Se riscontri problemi, contatta @cappcamp_team su Twitter.",
          type: true,
        },
      ]);
    }
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uidd = user.uid;
        console.log("Logged as: " + uidd);
        const docRef = doc(db, "users", uidd);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData({
            uid: uidd,
            fname: data.fname,
            lname: data.lname,
            photoURL: data.photoURL ? data.photoURL : null,
            user: data.user,
            avatar: data.avatar ? data.avatar : false,
          });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      } else {
        navigate("/login");
      }
    });
  }, [auth, navigate]);

  if (!userData) return <ScreenLoad />;
  return (
    <main className="flex flex-col w-screen h-screen">
      <div className="fixed z-20 top-2 left-0 w-screen px-2 flex flex-col items-center gap-2">
        {alert.length > 0
          ? alert.map((a, index) => {
              return (
                <Alerts
                  data={a}
                  close={() =>
                    setAlert(alert.filter((item) => item.text !== a.text))
                  }
                  key={index}
                />
              );
            })
          : null}
      </div>

      <Nav userData={userData ? userData : null} logout={logOut} />

      <Routes>
        <Route
          index
          element={<HomeComponents user={userData ? userData : null} />}
        />
        <Route
          path="viewer/:key"
          element={<Viewer user={userData ? userData : null} />}
        />

        <Route path="*" element={<ScreenLoad />} />
        <Route path="upload" element={<UploadFile />} />
      </Routes>
      {/* <Library userId={userData ? userData.uid : null} /> */}
    </main>
  );
}
