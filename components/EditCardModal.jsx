import React, { useEffect, useState, useRef } from "react";

const EditCardModal = ({ setCardsList, setEditModal, data }) => {
  console.log(data);
  const closeModal = (e) => {
    if (e.target.classList.contains("overlay")) {
      setEditModal((pre) => {
        return { ...pre, open: false };
      });
    }
  };

  const addCardHandler = (e) => {
    e.preventDefault();
    setCardsList((pre) =>
      pre.map((card) => {
        console.log(+card.id === +data.id, card.id, data.id);
        if (card.id === data.id) {
          console.log("founded");
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
      <form onSubmit={addCardHandler} className="modal">
        <div>
          <p className="font-bold">Front side</p>
          <textarea
            required
            placeholder="Enter text here"
            ref={frontInputRef}
          />
        </div>
        <div>
          <p className="font-bold  ">Back side</p>
          <textarea required placeholder="Enter text here" ref={backInputRef} />
        </div>
        <div className="mt-auto flex gap-5">
          <button type="submit" className="bg-[var(--black-color)]">
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
