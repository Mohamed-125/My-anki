import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getRedirectResult } from "firebase/auth";
import { auth } from "../firebase";
import { SignIn } from "../firebase";
import { usersCollectionRef, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import addToLocalStorage, { getSavedValue } from "@/LocalStorage";
export default function Home() {
  const [user, setUser] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (getSavedValue("user")) {
      setUser(getSavedValue("user"));
      router.push(
        {
          pathname: `/cards`,
          query: {
            id: user.uid,
          },
        },
        `/cards`
      );
    } else {
      getRedirectResult(auth)
        .then((response) => {
          if (response) {
            setUser(response?.user);
            addToLocalStorage("user", response?.user);

            router.push(
              {
                pathname: `/cards`,
                query: {
                  id: user.uid,
                },
              },
              `/cards`
            );
          }
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        gap: "30px",
      }}
    >
      <h1> Welcome to My-anki</h1>
      <button className="bg-black mx-auto" onClick={SignIn}>
        Sign In / Login
      </button>
    </div>
  );
}
