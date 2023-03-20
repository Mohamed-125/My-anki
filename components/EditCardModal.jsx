import React, { useEffect, useState, useRef } from "react";
import { GiSpeaker } from "react-icons/gi";

const EditCardModal = ({
  setCardsList,
  setEditModal,
  data,
  editCardButtonRef,
}) => {
  const backSideWord = new SpeechSynthesisUtterance();
  backSideWord.lang = "de-DE";
  backSideWord.voice = speechSynthesis.getVoices()[6];
  backSideWord.rate = 0.9;

  const closeModal = (e) => {
    if (e.target.classList.contains("overlay")) {
      setEditModal((pre) => {
        return { ...pre, open: false };
      });
    }
  };

  const editCardHandler = (e) => {
    e.preventDefault();
    setCardsList((pre) =>
      pre.map((card) => {
        if (card.id === data.id) {
          return {
            ...card,
            frontSide: frontInputRef.current.value,
            backSide: backInputRef.current.value,
          };
        } else {
          return card;
        }
      })
    );
    setEditModal((pre) => {
      return { ...pre, open: false };
    });
  };

  const deleteCardHandler = () => {
    setCardsList((pre) => pre.filter((card) => card.id !== data.id));
    setEditModal((pre) => {
      return { ...pre, open: false };
    });
  };
  const frontInputRef = useRef();
  const backInputRef = useRef();

  useEffect(() => {
    frontInputRef.current.value = data.frontSide;
    backInputRef.current.value = data.backSide;
  }, []);

  return (
    <div className="overlay" onClick={closeModal}>
      <form onSubmit={editCardHandler} className="modal">
        <div>
          <p className="font-bold">Front side</p>
          <textarea
            required
            placeholder="Enter text here"
            ref={frontInputRef}
          />
        </div>
        <div>
          <p className="font-bold">Back side</p>
          <textarea required placeholder="Enter text here" ref={backInputRef} />
        </div>
        <button
          className="!p-0"
          type="button"
          onClick={() => {
            backSideWord.text = backInputRef.current.value;
            window.speechSynthesis.speak(backSideWord);
          }}
        >
          <GiSpeaker className="text-5xl mx-auto !text-[var(--black-color)]" />
        </button>
        <div className="mt-auto flex gap-5">
          <button
            type="submit"
            ref={editCardButtonRef}
            className="bg-[var(--black-color)] update-cart-btn"
          >
            Update Card
          </button>
          <button
            type="button"
            onClick={deleteCardHandler}
            className="bg-red-500"
          >
            Delete This Card
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCardModal;
