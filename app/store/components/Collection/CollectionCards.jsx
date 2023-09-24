import Image from "next/image";

const CollectionCards = () => {
  return (
    <div className="w-full flex flex-around flex-wrap py-5 gap-10">
      <div className="flex flex-col  gap-5">
        <div className="w-[420px] h-[310px] bg-[#F6FBFC] rounded-[10px] relative">
          <div className="absolute flex-center right-0 w-[100px] h-[40px] bg-[#9DB2BF] rounded-[10px]">
            <p className="text-xl font-bold text-white">31 items</p>
          </div>
          <Image
            src="/assets/icons/clothes/black_hoodie.png"
            width={320}
            height={300}
            className="absolute top-2 left-10"
            alt="black hoodie"
          />
        </div>
        <div className="w-[420px] h-[130px] bg-[#9DB2BF] rounded-[10px] flex-center collection-item">
          <h3 className="text-white font-bold text-6xl">Hodies</h3>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="w-[420px] h-[310px] bg-[#F6FBFC] rounded-[10px] relative">
          <div className="absolute flex-center right-0 w-[100px] h-[40px] bg-[#9DB2BF] rounded-[10px]">
            <p className="text-xl font-bold text-white">24 items</p>
          </div>
          <Image
            src="/assets/icons/clothes/jeans.png"
            width={160}
            height={300}
            className="absolute top-2 left-32"
            alt="blue jeans"
          />
        </div>
        <div className="flex-center w-[420px] h-[130px] bg-[#9DB2BF] rounded-[10px] collection-item">
          <h3 className="text-white font-bold text-6xl">Jeans</h3>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="w-[420px] h-[310px] bg-[#F6FBFC] rounded-[10px] relative">
          <div className="absolute flex-center right-0 w-[100px] h-[40px] bg-[#9DB2BF] rounded-[10px]">
            <p className="text-xl font-bold text-white">27 items</p>
          </div>
          <Image
            src="/assets/icons/clothes/black_shorts.png"
            width={350}
            height={300}
            className="absolute top-10 left-10"
            alt="black shorts"
          />
        </div>
        <div className="flex-center w-[420px] h-[130px] bg-[#9DB2BF] rounded-[10px] collection-item">
          <h3 className="text-white font-bold text-6xl">Shorts</h3>
        </div>
      </div>
    </div>
  );
};

export default CollectionCards;
