import CollectionCards from "./CollectionCards";

const StoneCollection = () => {
  return (
    <div className="flex flex-col w-full  mt-10">
      <h3 className="text-4xl text-[#698294] px-16 mb-10 max-[500px]:px-0">
        Stone collection
      </h3>
      <div className="bg-[#D4DFE5] rounded-sm">
        <CollectionCards />
      </div>
    </div>
  );
};

export default StoneCollection;
