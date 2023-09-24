import SuggestionCards from "./SuggestionCards";

const Suggestions = () => {
  return (
    <div className="flex flex-col items-start w-full  mt-10">
      <h3 className="text-4xl text-[#698294] px-16 mb-10 max-[500px]:px-0">
        Our suggestions
      </h3>
      <SuggestionCards />
    </div>
  );
};

export default Suggestions;
