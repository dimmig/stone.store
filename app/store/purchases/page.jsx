import Image from "next/image";

const Purchases = () => {
  const purchasesList = [];

  return (
    <div className="w-screen h-screen bg-[#DDE6ED] text-center">
      <div className="w-full p-10 text-center">
        <h1 className="text-5xl text-[#698294]">Your purchases</h1>
      </div>
      <div className="flex-center">
        <div className="w-[1000px] h-[700px] bg-[#a4b4bf] rounded-sm flex-center">
          {purchasesList.length === 0 ? (
            <div className="flex-col">
              <Image
                className="ml-10"
                src="/assets/images/empty-cart.png"
                width={300}
                height={300}
              />
              <h3 className="py-10 text-2xl">
                It seems, you don't have any purchases
              </h3>
              <button className="bg-[#DDE6ED] px-10 py-5 text-2xl rounded-sm hover:scale-110 transition duration-300">
                Create a purchase now
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Purchases;
