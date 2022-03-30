import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { db } from "../firebase/server";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { UserIcon, AtSymbolIcon, KeyIcon } from "@heroicons/react/outline";
import googleIcon from "../assets/icons/google.svg";
import Alerts from "../components/Alerts";
import ScreenLoad from "../components/ScreenLoad";

export default function SignUp() {
  const nav = useNavigate();
  const provider = new GoogleAuthProvider();

  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState({
    show: false,
  });
  const [data, setData] = useState({
    fname: "",
    lname: "",
    user: "",
    email: "",
    pass: "",
    repass: "",
  });

  const auth = getAuth();

  const genAvatar = () => {
    const max = 9;
    const min = 0;
    const num = Math.floor(Math.random() * (max - min + 1) + min);
    return "Sample-" + num + ".svg";
  };

  const welcomeFileHandler = async (uid) => {
    const docRef = await addDoc(collection(db, "users", uid, "library"), {
      savedAt: serverTimestamp(),
      ref: doc(db, "publishings/cDoogiKqVv20UvPWzNlL"),
    });
    console.log("Document written with ID: ", docRef.id);
  };

  const getSignup = (prov) => {
    setLoading(true);
    if (prov === "google") {
      signInWithPopup(auth, provider)
        .then(async (result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          // const credential = GoogleAuthProvider.credentialFromResult(result);
          // const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          console.log(user);
          var name = user.displayName.split(" ");
          var tempUser = "user" + user.metadata.createdAt;
          await setDoc(doc(db, "users", user.uid), {
            fname: name[0],
            lname: name[1],
            user: tempUser,
            email: user.email,
            photoURL: user.photoURL,
            avatar: genAvatar(),
            signedAt: serverTimestamp(),
          });

          welcomeFileHandler(user.uid).then(() => {
            setTimeout(() => {
              setLoading(false);
              nav("/dashboard");
            }, 2000);
          });
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
          setLoading(false);

          setAlert({
            show: true,
            title: errorCode,
            text: errorMessage,
            type: false,
          });
        });
    } else if (prov === "cred") {
      if (data.user.length >= 8 && data.email && data.pass === data.repass) {
        createUserWithEmailAndPassword(auth, data.email, data.pass)
          .then(async (userCredential) => {
            // Signed in
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
              fname: data.fname,
              lname: data.lname,
              user: data.user,
              email: user.email,
              avatar: genAvatar(),
              signedAt: serverTimestamp(),
            });

            console.log(user);
            welcomeFileHandler(user.uid).then(() => {
              setTimeout(() => {
                setLoading(false);
                nav("/dashboard");
              }, 2000);
            });
          })
          .catch((error) => {
            const errorCode = error.code;
            console.log(error);
            setLoading(false);
            // const errorMessage = error.message;
            if (errorCode === "auth/email-already-in-use") {
              setAlert({
                show: true,
                title: "sign-up",
                text: "This e-email is already registered. Try to login or reset your password.",
              });
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
      {alert.show ? <Alerts data={alert} close={setAlert} /> : null}
      <div className="w-80">
        <h1 className="text-2xl font-semibold">Ready for a trip? Join now!</h1>
        <p className=" text-sm">
          Hai già un account?{" "}
          <Link to={"/login"} className="underline">
            Accedi
          </Link>
          .
        </p>
        <div className="pt-6 pb-4 border-b-2 border-b-slate-100">
          <button
            onClick={() => getSignup("google")}
            className="flex items-center py-2 px-3 bg-slate-100 rounded-xl hover:ring-4 ring-slate-200 transition"
          >
            <img src={googleIcon} alt="Login with Google" className="w-5" />
            <p className="pl-2 text-sm font-medium">Sign-up with Google</p>
          </button>
        </div>
        <form className="flex flex-col gap-4 w-full py-4">
          <div className="flex items-center gap-2">
            <label htmlFor="fname" className="flex flex-1 flex-col">
              <span className="text-sm font-medium uppercase pb-1 text-slate-500">
                first name
              </span>
              <TextField
                name="fname"
                value={data.fname}
                ph="Marco"
                set={setData}
                req
              />
            </label>
            <label htmlFor="lname" className="flex flex-1 flex-col">
              <span className="text-sm font-medium uppercase pb-1 text-slate-500">
                last name
              </span>
              <TextField
                name="lname"
                value={data.lname}
                ph="Rossi"
                set={setData}
                req
              />
            </label>
          </div>
          <label htmlFor="user" className="flex flex-col">
            <span className="flex items-center text-sm font-medium uppercase pb-1 text-slate-500">
              <UserIcon className="w-3 mr-1" />
              username
            </span>
            <TextField
              name="user"
              value={data.user}
              ph="marcorossi"
              set={setData}
              req
            />
          </label>
          <label htmlFor="email" className="flex flex-col">
            <span className="flex items-center text-sm font-medium uppercase pb-1 text-slate-500">
              <AtSymbolIcon className="w-3 mr-1" />
              e-mail
            </span>
            <TextField
              type="email"
              name="email"
              value={data.email}
              ph="marco.r@email.com"
              set={setData}
              req
            />
          </label>
          <label htmlFor="pass" className="flex flex-col">
            <span className="flex items-center text-sm font-medium uppercase pb-1 text-slate-500">
              <KeyIcon className="w-3 mr-1" />
              password
            </span>
            <TextField
              type="password"
              name="pass"
              value={data.pass}
              ph="impegnati :)"
              set={setData}
              req
            />
          </label>
          <label htmlFor="repass" className="flex flex-col">
            <span className="flex items-center text-sm font-medium uppercase pb-1 text-slate-500">
              <KeyIcon className="w-3 mr-1" />
              retype password
            </span>
            <TextField
              type="password"
              name="repass"
              value={data.repass}
              ph="quasi finito"
              set={setData}
              req
            />
          </label>
        </form>
        <div className="flex items-center gap-4 py-4 justify-between">
          <button
            className={`font-medium transition-opacity ${
              data ? "opacity-100" : "opacity-30 pointer-events-none"
            }`}
            onClick={() => {
              setData({
                fname: "",
                lname: "",
                user: "",
                email: "",
                pass: "",
                repass: "",
              });
            }}
          >
            clear fields
          </button>

          <input
            type="submit"
            name="login"
            className="bg-slate-900 text-white font-medium py-2 px-4 rounded-full hover:ring-4 ring-orange-300 transition-all cursor-pointer"
            onClick={() => getSignup("cred")}
            value={" let's staaart 🚀"}
          />
        </div>
      </div>
    </div>
  );
}

const TextField = (props) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log(e);
    // console.log("name: " + name + " | val: " + value);
    props.set((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <input
      type={props.type || "text"}
      name={props.name || "textfield"}
      id={props.name || "textfield"}
      className="py-2 px-3 text-sm ring-1 ring-slate-300 outline-none rounded-md w-full focus:ring-4 focus:ring-orange-300 hover:ring-2 hover:ring-slate-200 transition"
      value={props.value}
      onChange={handleChange}
      required={props.req || false}
      placeholder={props.ph || null}
    />
  );
};
