import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { AiOutlineSearch } from "react-icons/ai";
import AddCardModal from "../../components/AddCardModal";
import EditCardModal from "../../components/EditCardModal";
import StudyCardModal from "../../components/StudyCardModal";
import { useRouter } from "next/router";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { getSavedValue } from "@/LocalStorage";
import { signOut } from "firebase/auth";

const Decks = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [studyModal, setStudyModal] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const [editModal, setEditModal] = useState({ open: false, data: {} });
  const [cardsList, setCardsList] = useState([]);
  const [rendered, setRendered] = useState(false);
  const [id, setId] = useState();
  const inputRef = useRef();
  const router = useRouter();

  useEffect(() => {
    setId(getSavedValue("user").uid);
  }, []);

  useEffect(() => {
    if (id) {
      getDoc(doc(db, "users", id)).then((res) => {
        if (res.exists()) {
          setCardsList(res.data().cards);
        }
      });
    }
  }, [id]);

  let filteredCardList = cardsList.filter((card) => {
    if (
      card.frontSide.trim().toLowerCase().includes(searchWord.trim()) ||
      card.backSide.trim().toLowerCase().includes(searchWord.trim())
    ) {
      return card;
    }
  });

  useEffect(() => {
    if (id) {
      if (rendered) {
        filteredCardList = cardsList;
        console.log(cardsList);

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
          setCardsList={setCardsList}
          setStudyModal={setStudyModal}
        />
      )}
      <h1 className="text-center font-blod">My Anki</h1>

      <div className="flex justify-center">
        <button
          className="mt-10  bg-red-500"
          type="button"
          onClick={() => {
            signOut(auth)
              .then((res) => {
                localStorage.removeItem("user");
                router.push("/");
              })
              .catch((err) => console.log(err));
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
      {addModalOpen && (
        <AddCardModal
          setModalOpen={setAddModalOpen}
          setCardsList={setCardsList}
          cardsList={cardsList}
        />
      )}
      {editModal?.open && (
        <EditCardModal
          setEditModal={setEditModal}
          setCardsList={setCardsList}
          data={editModal.data}
        />
      )}
      <div className="cards-div mt-10">
        {filteredCardList?.map((card) => {
          return (
            <div
              onClick={() => {
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
              }}
              key={card.id}
              className="flex gap-10 cursor-pointer hover:bg-[var(--gray-color)] justify-between items-center h-14 px-7 rounded-lg"
            >
              <p>{card.frontSide}</p>
              <p className="text-right">{card.backSide}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Decks;
