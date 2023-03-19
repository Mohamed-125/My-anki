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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getRedirectResult(auth)
      .then((response) => {
        setUser(response?.user);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (getSavedValue("user")) setUser(getSavedValue("user"));
  }, []);

  useEffect(() => {
    if (user?.uid) {
      addToLocalStorage("user", user);
      const docRef = doc(db, "users", user.uid);
      getDoc(docRef).then((res) => {
        if (!res.exists()) {
          setDoc(doc(db, "users", user.uid), {
            name: user.displayName,
            email: user.email,
            cards: [],
          });
        }
      });

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
  }, [user]);
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
