import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { db } from "../firebase/server";
import { doc, getDoc } from "firebase/firestore";
import { ArrowNarrowRightIcon } from "@heroicons/react/outline";

import googleIcon from "../assets/icons/google.svg";
import ScreenLoad from "../components/ScreenLoad";
import Alerts from "../components/Alerts";

export default function Login(props) {
  const provider = new GoogleAuthProvider();
  const nav = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loggedUser, setLoggedUser] = useState(false);

  const [alert, setAlert] = useState([]);
  const [data, setData] = useState({
    email: "",
    pass: "",
  });

  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // nav("/dashboard");
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setLoggedUser({
            userName: data.user,
            fname: data.fname,
            lname: data.lname,
          });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
          setLoggedUser(false);
        }
      } else {
        setLoading(false);
      }
    });
  }, [auth]);

  if (loggedUser) console.log(loggedUser);

  const getLogged = (prov) => {
    if (prov === "google") {
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          // const credential = GoogleAuthProvider.credentialFromResult(result);
          // const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          // ...
          setAlert({
            show: true,
            title: "welcome ✨",
            text: "You logged in with Google! - (email: " + user.email + ")",
            type: true,
          });
          nav("/dashboard");
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          // const email = error.email;
          // The AuthCredential type that was used.
          // const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
          if (errorCode === "auth/user-not-found") {
            setAlert((a) => [
              ...a,
              {
                title: "dove sei?",
                text: "Sembra che non ci sia alcun account registrato con questa e-mail. Controlla l'email o crea un nuovo account.",
                type: false,
              },
            ]);
          } else if (errorCode !== "auth/popup-closed-by-user") {
            setAlert((a) => [
              ...a,
              {
                title: errorCode,
                text: errorMessage,
                type: false,
              },
            ]);
          }
        });
    } else if (prov === "cred") {
      if (data.email && data.pass) {
        signInWithEmailAndPassword(auth, data.email, data.pass)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            setAlert({
              show: true,
              title: "Logged in",
              text: "Logged in as: " + user.email,
              type: true,
            });
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode === "auth/user-not-found") {
              console.log("not found");
              setAlert((a) => [
                ...a,
                {
                  show: true,
                  title: "Non ti troviamo 🥲",
                  text: "Sembra che non ci sia alcun account registrato con questa e-mail.",
                  type: false,
                },
              ]);
            } else if (errorCode === "auth/wrong-password") {
              setAlert((a) => [
                ...a,
                {
                  title: "Password errata",
                  text: "Sembra che la password che hai inserito non è corretta. Riprova o ripristinala subito.",
                  type: false,
                },
              ]);
            } else {
              setAlert((a) => [
                ...a,
                {
                  show: true,
                  title: errorCode,
                  text: errorMessage,
                  type: false,
                },
              ]);
            }
          });
      } else {
        setAlert({
          show: true,
          title: "Fields",
          text: "You missed some fields. Check them better.",
        });
      }
    }
  };

  return (
    <div className="flex w-screen h-screen justify-center items-center">
      {loading ? <ScreenLoad /> : null}
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
      <div className="w-80">
        <h1 className="text-2xl font-semibold">Login to your account.</h1>
        <p className=" text-sm">
          Non hai un account?{" "}
          <Link to={"/signup"} className="underline">
            Registrati
          </Link>
          .
        </p>
        <div className="pt-6 pb-4 border-b-2 border-b-slate-100">
          <button
            onClick={() => getLogged("google")}
            className="flex items-center py-2 px-3 bg-slate-100 rounded-xl hover:ring-4 ring-slate-200 transition"
          >
            <img src={googleIcon} alt="Login with Google" className="w-5" />
            <p className="pl-2 text-sm font-medium">Login with Google</p>
          </button>
        </div>
        <form className="flex flex-col gap-4 w-full py-4">
          <label htmlFor="email" className="flex flex-col">
            <span className="text-sm font-medium uppercase pb-1 text-slate-500">
              e-mail
            </span>
            <TextField
              type="email"
              name="email"
              value={data.email}
              set={setData}
              req
            />
          </label>
          <label htmlFor="pass" className="flex flex-col">
            <span className="text-sm font-medium uppercase pb-1 text-slate-500">
              password
            </span>
            <TextField
              type="password"
              name="pass"
              value={data.pass}
              set={setData}
              req
            />
          </label>
        </form>
        {loggedUser ? (
          <div className="w-full flex flex-col items-center gap-3 pb-10 animate-fadeInDown">
            <p className="text-slate-800 opacity-50">oppure</p>
            <div>
              <button
                className="flex items-center bg-slate-100 text-slate-800 font-medium py-2 px-4 rounded-full hover:ring-4 ring-blue-500 transition-all cursor-pointer"
                onClick={() => nav("/dashboard")}
              >
                <p>
                  Continua come{" "}
                  <span className="font-semibold">{loggedUser.fname}</span>
                </p>
                <ArrowNarrowRightIcon className="w-5 ml-2" />
              </button>
            </div>
          </div>
        ) : null}
        <div className="flex items-center gap-4 py-4 justify-between transition-all">
          <button
            className={`font-medium transition-opacity ${
              data ? "opacity-100" : "opacity-30 pointer-events-none"
            }`}
            onClick={() => {
              setData({
                email: "",
                pass: "",
              });
            }}
          >
            clear fields
          </button>

          <input
            type="submit"
            name="login"
            className="bg-slate-900 text-white font-medium py-2 px-4 rounded-full hover:ring-4 ring-orange-300 transition-all cursor-pointer"
            onClick={() => getLogged("cred")}
            value={"get in 🐸"}
          />
        </div>
      </div>
    </div>
  );
}

const TextField = (props) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(e);
    console.log("name: " + name + " | val: " + value);
    props.set((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <input
      type={props.type || "text"}
      name={props.name || "textfield"}
      id={props.name || "textfield"}
      className="py-1 px-2 ring-1 ring-slate-300 outline-none rounded-md w-full focus:ring-4 focus:ring-orange-300 hover:ring-2 hover:ring-slate-200 transition"
      value={props.value}
      onChange={handleChange}
      required={props.req || false}
    />
  );
};
