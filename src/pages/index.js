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
  const en = [
    "All the time",
    "allowed",
    "announcent",
    "any",
    "any way - despite it - though",
    "assess, estimate, evaluate",
    "At the middle of - midst",
    "Battel",
    "Border",
    "both",
    "brain",
    "Break",
    "by the way",
    "create, establish, make",
    "currently",
    "Deal with",
    "DECISION",
    "Destroy",
    "die",
    "discover - found",
    "Film adaptation ",
    "give up",
    "Hardworking",
    "in my opinion",
    "invent",
    "its all over - its all gone",
    "knowledge",
    "lecture",
    "Link or shortcut",
    "lost - waste",
    "Mirror",
    "Miss - loss",
    "necessarily, absolutely, implicitly, really",
    "object",
    "Once and for all",
    "Origin",
    "outstanding , super , excellent",
    "past",
    "probably, presumably",
    "Progress",
    "proud",
    "Publish",
    "put",
    "Reached",
    "Remember",
    "requirements",
    "rescue",
    "result - outcome - score",
    "reveal - expose - give away",
    "rules",
    "several, multiple, various",
    "skills",
    "slang",
    "some",
    "strange",
    "strong",
    "support",
    "taken",
    "Things",
    "Weapon",
    "pretty hard ",
    "actually ",
  ];

  const de = [
    "ständig",
    "erlaubt",
    "ankündigung",
    "irgendwelche",
    "trotzdem",
    "einschätzen",
    "Inmitten",
    "Der Kampf",
    "die Grenze",
    "beide",
    "Das Gehirn",
    "zerbrechen",
    "übrigens",
    "schaffen",
    "derzeit",
    "umgehen mit",
    "ENTSCHEIDUNG",
    "zerstören",
    "sterben",
    "entdecken",
    "Verfilmung",
    "aufgeben",
    "Fleißig",
    "minens erachtens oder meine meinung",
    "erfinden",
    "ist alles vorbei",
    "Kenntnissen",
    "die Vorlesung",
    "Verknüpfung",
    "verlieren",
    "Der Spiegel",
    "Verpasst",
    "unbedingt",
    "der Gegenstand",
    "ein für alle mal",
    "Der Ursprung",
    "hervorragenden",
    "vergangenheit",
    "wahrscheinlich",
    "Fortschritt",
    "stolz",
    "Veröffentlichen",
    "stecken",
    "erreichten",
    "Erinnen",
    "Vo.raus.set.zun.gen",
    "retten",
    "das Ergebnis",
    "verrate",
    "gebiete - die regeln",
    "mehrere",
    "Fertigkeiten",
    "umgangssprache",
    "manche",
    "fremde",
    "starken",
    "unterstützen",
    "genommen",
    "Sachen - Dings",
    "die Waffe",
    "ziemlich schwierig",
    "eigentlich",
  ];

  console.log(
    en.map((e, i) => {
      return {
        frontSide: en[i],
        backSide: de[i],
        id: Math.random() * 42432423234234,
      };
    })
  );

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
      <h1> Welcome tho My-anki</h1>
      <button className="bg-black mx-auto" onClick={SignIn}>
        Sign In / Login
      </button>
    </div>
  );
}
