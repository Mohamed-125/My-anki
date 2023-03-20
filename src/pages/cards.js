import React, { useState, useEffect, useRef, Suspense } from "react";
import Head from "next/head";
import { AiOutlineSearch } from "react-icons/ai";
import AddCardModal from "../../components/AddCardModal";
import EditCardModal from "../../components/EditCardModal";
import StudyCardModal from "../../components/StudyCardModal";
import { useRouter } from "next/router";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { getSavedValue } from "@/LocalStorage";
import { signOut } from "firebase/auth";
import { GiSpeaker } from "react-icons/gi";

const Decks = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [studyModal, setStudyModal] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const [editModal, setEditModal] = useState({ open: false, data: {} });
  const [cardsList, setCardsList] = useState([]);
  const [rendered, setRendered] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [id, setId] = useState();

  // refs

  const inputRef = useRef();
  const addCardButtonRef = useRef();
  const editCardButtonRef = useRef();
  const showAnswerButtonRef = useRef();
  const nextCardButtonRef = useRef();
  const router = useRouter();

  const shortcuts = (e) => {
    if (e.code === "Enter" && e.ctrlKey) {
      if (!studyModal && !editModal.open) {
        setAddModalOpen(true);
      }
      if (addModalOpen) {
        addCardButtonRef?.current?.click();
      }
      if (editModal.open) {
        editCardButtonRef?.current?.click();
      }
      if (studyModal) {
        if (showAnswer) {
          nextCardButtonRef?.current?.click();
        } else if (!showAnswer) {
          showAnswerButtonRef?.current?.click();
        }
      }
    } else if (e.code === "Escape") {
      setStudyModal(false);
      setAddModalOpen(false);
      setEditModal((pre) => {
        return { ...pre, open: false };
      });
    }
  };
  useEffect(() => {
    if (!getSavedValue("user")?.uid) {
      router.push("/");
    } else {
      setId(getSavedValue("user").uid);
      const docRef = doc(db, "users", getSavedValue("user")?.uid);
      getDoc(docRef).then((res) => {
        if (!res.exists()) {
          setDoc(doc(db, "users", getSavedValue("user")?.uid), {
            name: getSavedValue("user").displayName,
            email: getSavedValue("user").email,
            cards: [],
          });
        }
      });

      document.body.addEventListener("keyup", shortcuts);
    }
    return () => {
      document.body.removeEventListener("keyup", shortcuts);
    };
  }, [studyModal, editModal.open, addModalOpen, showAnswer]);

  useEffect(() => {
    if (id) {
      getDoc(doc(db, "users", id)).then((res) => {
        if (res.exists()) {
          setCardsList(
            res.data().cards.sort((a, b) => 0.5 - Math.random() * 0.9)
          );
        }
      });
    }
  }, [id]);

  let filteredCardList = cardsList.filter((card) => {
    if (
      card.frontSide
        .trim()
        .toLowerCase()
        .includes(searchWord.trim().toLowerCase()) ||
      card.backSide
        .trim()
        .toLowerCase()
        .includes(searchWord.trim().toLowerCase())
    ) {
      return card;
    }
  });

  useEffect(() => {
    if (id) {
      if (rendered) {
        filteredCardList = cardsList;

        const cardsRef = doc(db, "users", id);
        updateDoc(cardsRef, {
          cards: cardsList,
        });
      } else {
        setRendered(true);
      }
    }
  }, [cardsList, id]);

  return (
    <div className="container">
      {studyModal && (
        <StudyCardModal
          cardsList={cardsList}
          setEditModal={setEditModal}
          setCardsList={setCardsList}
          setStudyModal={setStudyModal}
          showAnswerButtonRef={showAnswerButtonRef}
          nextCardButtonRef={nextCardButtonRef}
          setShowAnswer={setShowAnswer}
          showAnswer={showAnswer}
        />
      )}
      {addModalOpen && (
        <AddCardModal
          setModalOpen={setAddModalOpen}
          setCardsList={setCardsList}
          cardsList={cardsList}
          buttonRef={addCardButtonRef}
        />
      )}
      {editModal?.open && (
        <EditCardModal
          setEditModal={setEditModal}
          setCardsList={setCardsList}
          data={editModal.data}
          editCardButtonRef={editCardButtonRef}
        />
      )}
      <h1 className="text-center font-blod">My Anki</h1>

      <div className="flex justify-center">
        <button
          className="mt-10  bg-red-500"
          type="button"
          onClick={() => {
            signOut(auth).then((res) => {
              localStorage.removeItem("user");
              router.push("/");
            });
          }}
        >
          Log Out
        </button>
      </div>
      <div className="flex gap-3 items-center  mt-10  justify-between">
        <h2>Cards {cardsList.length}</h2>
        <div className="flex gap-3 items-center">
          <button
            disabled={cardsList.length !== 0 ? false : true}
            style={
              cardsList.length === 0 ? { opacity: "0.5" } : { opacity: "1" }
            }
            className="bg-[var(--cyan-color)]"
            onClick={() => {
              setStudyModal(true);
            }}
          >
            Study Cards
          </button>
          <button
            className="bg-[var(--black-color)]"
            onClick={() => {
              setAddModalOpen(true);
            }}
          >
            Add Cards
          </button>
        </div>
      </div>
      <div className="bg-[var(--gray-color)] flex gap-4 h-14 items-center px-5 rounded-3xl mt-7">
        <AiOutlineSearch className="text-2xl" />
        <input
          placeholder="Search cards"
          type="text"
          ref={inputRef}
          onChange={(e) => {
            setSearchWord(e.target.value);
          }}
        />
      </div>
      {searchWord ? (
        <h2 className="mt-3 ml-3 text-gray-500  text-lg">
          Search Results {filteredCardList.length}
        </h2>
      ) : null}
      <div className="cards-div mt-10">
        {filteredCardList.reverse()?.map((card) => {
          return (
            <div
              onClick={(e) => {
                if (!e.target.classList.contains("speaker-button")) {
                  setEditModal(() => {
                    return {
                      open: true,
                      data: {
                        frontSide: card.frontSide,
                        backSide: card.backSide,
                        id: card.id,
                      },
                    };
                  });
                }
              }}
              key={card.id}
              className="flex gap-10 cursor-pointer hover:bg-[var(--gray-color)] justify-between items-center h-14 px-7 rounded-lg"
            >
              <p>{card.frontSide}</p>
              <div className="flex gap-3 items-center">
                <p className="text-right">{card.backSide}</p>
                <button
                  className="!p-0 text-lg hover:bg-[var(--cyan-color)] speaker-button"
                  type="button"
                  onClick={(e) => {
                    const backSideWord = new SpeechSynthesisUtterance();
                    backSideWord.lang = "de-DE";
                    backSideWord.voice = speechSynthesis.getVoices()[3];
                    backSideWord.rate = 0.8;
                    backSideWord.text = card.backSide;
                    window.speechSynthesis.speak(backSideWord);
                  }}
                >
                  <GiSpeaker className="text-3xl mx-auto text-[var(--black-color)]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Decks;
