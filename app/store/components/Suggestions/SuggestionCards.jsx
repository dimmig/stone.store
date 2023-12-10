import Image from "next/image";
import Link from "next/link";
import data from "../../../../mock_data/data.json";
import SuggestionItem from "./SuggestionItem";

const SuggestionCard = () => {
  function renderList(data) {
    return data.map((el) => {
      if (!el.discount) return <SuggestionItem key={el.id} item={el} />;
    });
  }

  return (
    <div className="bg-[#DDE5F3] flex flex-col w-full px-16 pt-16 rounded-sm max-[500px]:px-0">
      <div className="flex flex-around flex-wrap mb-10">{renderList(data)}</div>
    </div>
  );
};

export default SuggestionCard;
