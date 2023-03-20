import React, { useEffect, useRef, useState } from "react";

const AddCardModal = ({ setCardsList, setModalOpen, buttonRef }) => {
  const containerRef = useRef();

  const closeModal = (e) => {
    if (e.target.classList.contains("overlay")) {
      setModalOpen((pre) => !pre);
    }
  };

  buttonRef?.current?.click();

  const addCardHandler = (e) => {
    e.preventDefault();
    setCardsList((pre) => [
      ...pre,
      {
        frontSide: e.target.children[0].children[1].value,
        backSide: e.target.children[1].children[1].value,
        id: Math.random() * 7498327493,
      },
    ]);
    setModalOpen((pre) => !pre);
  };

  return (
    <div className="overlay" onClick={closeModal}>
      <form onSubmit={addCardHandler} ref={containerRef} className="modal  ">
        <div>
          <p className="font-bold  ">Front side</p>
          <textarea required placeholder="Enter text here" />
        </div>
        <div>
          <p className="font-bold  ">Back side</p>
          <textarea required placeholder="Enter text here" />
        </div>
        <button
          type="submit"
          className="bg-[var(--black-color)] mt-auto  "
          ref={buttonRef}
        >
          Add Card
        </button>
      </form>
    </div>
  );
};

export default AddCardModal;
