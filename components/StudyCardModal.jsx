import React, { useEffect, useState, useRef } from "react";
import { GiSpeaker } from "react-icons/gi";

const StudyCardModal = ({
  cardsList,
  setStudyModal,
  setCardsList,
  setEditModal,
  showAnswerButtonRef,
  nextCardButtonRef,
  showAnswer,
  setShowAnswer,
}) => {
  const [currentCardNum, setCurrentCardNum] = useState(0);

  const backSideWord = new SpeechSynthesisUtterance();
  backSideWord.lang = "de-DE";
  backSideWord.voice = speechSynthesis.getVoices()[6];
  backSideWord.rate = 0.9;
  const closeModal = (e) => {
    if (e.target.classList.contains("overlay")) {
      setStudyModal(false);
    }
  };
  const nextCardHandler = () => {
    if (currentCardNum === cardsList.length - 1) {
      setShowAnswer(false);
      setStudyModal(false);
      setCurrentCardNum(0);
    } else {
      setShowAnswer(false);
      setCurrentCardNum((pre) => pre + 1);
    }
  };

  useEffect(() => {
    document
      .querySelector(".progress-bar")
      .style.setProperty(
        "--value",
        `${((currentCardNum + 1) * 100) / cardsList.length}%`
      );
  }, [currentCardNum]);

  const deleteCardHandler = ({ target }) => {
    setCardsList((pre) => pre.filter((card) => +card.id !== +target.id));
    nextCardHandler();
  };

  return (
    <div className="overlay" onClick={closeModal}>
      <div className="modal study-cards">
        <div className="flex !flex-row items-center !gap-6">
          <div className="min-w-max font-bold text-2xl">
            {currentCardNum + 1} / {cardsList.length}
          </div>
          <div className="progress-bar"></div>
        </div>
        <p>{cardsList[currentCardNum]?.frontSide}</p>
        {showAnswer && (
          <>
            <p>{cardsList[currentCardNum]?.backSide}</p>
            <button
              className="!p-0"
              onClick={() => {
                backSideWord.text = cardsList[currentCardNum].backSide;
                window.speechSynthesis.speak(backSideWord);
              }}
            >
              <GiSpeaker className="text-5xl mx-auto !text-[var(--black-color)]" />
            </button>
          </>
        )}
        <div className="mt-auto flex gap-5 flex-wrap">
          {showAnswer ? (
            <button
              ref={nextCardButtonRef}
              className="bg-green-500"
              onClick={nextCardHandler}
            >
              Next Card
            </button>
          ) : (
            <button
              className="bg-[var(--black-color)]"
              ref={showAnswerButtonRef}
              onClick={() => setShowAnswer((pre) => !pre)}
            >
              Show answer
            </button>
          )}
          <button
            type="button"
            onClick={deleteCardHandler}
            className="bg-red-500"
            id={cardsList[currentCardNum]?.id}
          >
            Delete This Card
          </button>
          <button
            type="button"
            onClick={() => {
              setEditModal(() => {
                return {
                  open: true,
                  data: {
                    frontSide: cardsList[currentCardNum]?.frontSide,
                    backSide: cardsList[currentCardNum]?.backSide,
                    id: cardsList[currentCardNum]?.id,
                  },
                };
              });
            }}
            className="bg-[var(--cyan-color)]"
            id={cardsList[currentCardNum]?.id}
          >
            Edit This Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyCardModal;
