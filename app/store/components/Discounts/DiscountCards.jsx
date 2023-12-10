"use client";

import Image from "next/image";
import { useState } from "react";
import DiscountItem from "./DiscountItem";
import data from "../../../../mock_data/data.json";

const DiscountCards = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  function renderList(data) {
    return data.map((el) => {
      if (el.discount) return <DiscountItem key={el.id} item={el} />;
    });
  }

  return (
    <div className="flex flex-col w-full px-16 pt-16 rounded-sm max-[500px]:px-0">
      <div className="flex flex-around flex-wrap mb-10">{renderList(data)}</div>
    </div>
  );
};

export default DiscountCards;
