import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { AiOutlineSearch } from "react-icons/ai";
import addToLocalStorage, { getSavedValue } from "@/LocalStorage";
import AddCardModal from "../../components/AddCardModal";
import EditCardModal from "../../components/EditCardModal";
import StudyCardModal from "../../components/StudyCardModal";
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.js"></script>;

export default function Home() {
  const [cardsList, setCardsList] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [studyModal, setStudyModal] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const [editModal, setEditModal] = useState({ open: false, data: {} });
  const inputRef = useRef();
  let filteredCardList = cardsList.filter((card) => {
    if (
      card.frontSide.trim().toLowerCase().includes(searchWord.trim()) ||
      card.backSide.trim().toLowerCase().includes(searchWord.trim())
    ) {
      return card;
    }
  });

  useEffect(() => {
    if (getSavedValue("cardsList")) setCardsList(getSavedValue("cardsList"));
  }, []);

  useEffect(() => {
    if (cardsList.length > 0) {
      addToLocalStorage("cardsList", cardsList);
    }
    filteredCardList = cardsList;
  }, [cardsList]);

  // const studyCardsHandler = () => {};

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
      <div className="flex gap-3 items-center  mt-10  justify-between">
        <h2>Cards {cardsList.length}</h2>
        <div className="flex gap-3 items-center">
          <button
            disabled={filteredCardList.length !== 0 ? false : true}
            style={
              filteredCardList.length === 0
                ? { opacity: "0.5" }
                : { opacity: "1" }
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
              className="flex gap-4 cursor-pointer hover:bg-[var(--gray-color)] justify-between items-center h-14 px-7 rounded-lg"
            >
              <p>{card.frontSide}</p>
              <p>{card.backSide}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
