"use client";
import Image from "next/image";
import { useRef, useState } from "react";

const TestimonialsMobile = () => {
  const [currentCard, setCurrentCard] = useState(2);
  const cardListRef = useRef(null);
  const cardColors = ["year-color__1", "year-color__2", "year-color__3"];

  const handleItemChange = (direction) => {
    let nextCard = currentCard + direction;

    if (nextCard < 1) {
      nextCard = 3;
    } else if (nextCard > 3) {
      nextCard = 1;
    }

    const selectedCard = cardListRef.current.querySelector(
      `#card-${currentCard}`
    );

    const cardId = nextCard.toString();
    const itemToDisplay = cardListRef.current.querySelector(`#card-${cardId}`);

    selectedCard.classList.add("hidden");
    selectedCard.classList.remove("card");
    itemToDisplay.classList.remove("hidden");
    itemToDisplay.classList.add("card");

    itemToDisplay.animate([{ opacity: 0.3 }, { opacity: 1 }], {
      duration: 300,
    });

    setCurrentCard(nextCard);

    const nextCardColor = cardColors[nextCard] ?? cardColors[0];
    const previousCardColor = cardColors[nextCard - 2] ?? cardColors[2];
    updateButtonColors(nextCardColor, previousCardColor);
  };

  const updateButtonColors = (nextCardColor, previousCardColor) => {
    const rightBtn = document.getElementById("right-select-btn");
    const leftBtn = document.getElementById("left-select-btn");
    const rightColorToDelete =
      rightBtn.classList[rightBtn.classList.length - 1];
    const leftColorToDelete = leftBtn.classList[leftBtn.classList.length - 1];

    rightBtn.classList.remove(rightColorToDelete);
    rightBtn.classList.add(nextCardColor);

    leftBtn.classList.remove(leftColorToDelete);
    leftBtn.classList.add(previousCardColor);
  };

  return (
    <ul
      className="md:hidden flex items-center flex-row flex-around relative pb-10"
      ref={cardListRef}
    >
      <button
        className="select-btn w-15 h-15 bg-white rounded-full p-5 transition duration-300 year-color__1" // Color must be last
        id="left-select-btn"
        onClick={() => handleItemChange(-1)}
      >
        <Image
          src="/assets/icons/select-arrow.svg"
          width={10}
          height={10}
          className="rotate-180"
        />
      </button>
      <li className="hidden testimonial-card card-bb-1" id="card-1">
        <div className="flex flex-col">
          <div className="w-full  flex md:flex-row flex-col gap-5 flex-center p-10">
            <div className="user-circle flex-center rounded-full">
              <Image
                src="assets/icons/user-icon-red.svg"
                width={40}
                height={60}
                alt="user-icon"
                className="red"
              />
            </div>
            <h3 className="username whitespace-nowrap font-normal">
              Dan Brown
            </h3>
          </div>
          <hr className="w-5/6 mb-5 border-none h-px bg-white" />
          <h4 className="username p-5 pb-0">User friendly app!</h4>
          <p className="desc font-thin p-5">
            Your app is incredibly user-friendly and intuitive. It makes
            shopping a breeze. I appreciate the seamless experience and easy
            navigation. Keep up the great work!
          </p>
        </div>
      </li>
      <li className="card testimonial-card card-bb-2" id="card-2">
        <div className="flex flex-col">
          <div className="w-full flex  md:flex-row flex-col gap-5 flex-center p-10">
            <div className="user-circle flex-center rounded-full">
              <Image
                src="assets/icons/user-icon-blue.svg"
                width={40}
                height={60}
                alt="user-icon"
              />
            </div>
            <h3 className="username whitespace-nowrap font-normal">
              Ann Smith
            </h3>
          </div>
          <hr className="w-5/6 mb-5 border-none h-px bg-white" />
          <h4 className="username p-5 pb-0">Exceptional Service</h4>
          <p className="desc font-thin p-5">
            I've been a customer for years, and I'm always impressed with the
            level of service I receive. The team goes above and beyond to meet
            my needs. Thank you for your dedication to excellence!
          </p>
        </div>
      </li>
      <li className="hidden testimonial-card  card-bb-3 " id="card-3">
        <div className="flex flex-col">
          <div className="w-full  flex  md:flex-row flex-col gap-5 flex-center p-10">
            <div className="user-circle flex-center rounded-full">
              <Image
                src="assets/icons/user-icon-purple.svg"
                width={40}
                height={60}
                alt="user-icon"
                className="red"
              />
            </div>
            <h3 className="username whitespace-nowrap font-normal">
              Peter Pen
            </h3>
          </div>
          <hr className="w-5/6 mb-5 border-none h-px bg-white" />
          <h4 className="username p-5 pb-0">Responsive Team</h4>
          <p className="desc font-thin p-5">
            I've been a customer for years, and I'm always impressed with the
            level of service I receive. The team goes above and beyond to meet
            my needs. Thank you for your dedication to excellence!
          </p>
        </div>
      </li>
      <button
        className="select-btn w-15 h-15 bg-white rounded-full p-5 transition duration-300 year-color__3" // Color must be last
        id="right-select-btn"
        onClick={() => handleItemChange(1)}
      >
        <Image
          src="/assets/icons/select-arrow.svg"
          width={10}
          height={10}
          alt="select-arrow"
        />
      </button>
    </ul>
  );
};

export default TestimonialsMobile;
