import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import Alerts from "../components/Alerts";
import "../firebase/server";
import { doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "../firebase/server";
import ScreenLoad from "../components/ScreenLoad";
import Library from "../components/Library";

export default function Home() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    show: false,
  });
  const [userData, setUserData] = useState(false);

  const auth = getAuth();

  const logOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        setAlert({
          title: "Mmh...",
          text: "Abbiamo riscontrato problemi durante il tuo logout. Prova più tardi.",
          type: false,
        });
      });
  };

  useEffect(() => {
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
          //   setUserData(docSnap.data());
          setUserData({
            uid: uidd,
            fname: data.fname,
            lname: data.lname,
            photoURL: data.photoURL ? data.photoURL : null,
            user: data.user,
            avatar: data.avatar,
          });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      } else {
        // User is signed out
        // ...
      }
    });
  }, [auth]);

  if (!userData) return <ScreenLoad />;
  return (
    <main className=" w-screen h-screen dark:bg-black">
      {alert.show ? <Alerts data={alert} close={setAlert} /> : null}
      <Nav userData={userData ? userData : null} logout={logOut} />
      <Library userId={userData ? userData.uid : null} />
    </main>
  );
}
