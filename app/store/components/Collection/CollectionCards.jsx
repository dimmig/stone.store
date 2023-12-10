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
        <div className="relative w-full py-5 rounded-[10px] bg-[#9DB2BF] flex flex-row max-[540px]:gap-0">
          <div>
            <h3 className="text-white text-4xl font-bold px-10 pt-3">
              Stone hoodies
            </h3>
            <p className="text-white px-10 pt-2">More than 31 varieties</p>
            <p className="text-white px-10">of our branded hoodies</p>
          </div>

          <button className="absolute bottom-5 right-5 bg-[#C1CFD6] w-[130px] h-[35px] rounded-[10px] text-white font-bold text-2xl buy-btn  max-[540px]:w-[70px]">
            Observe
          </button>
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
        <div className="relative w-full py-5 rounded-[10px] bg-[#9DB2BF] flex flex-row max-[540px]:gap-0">
          <div>
            <h3 className="text-white text-4xl font-bold px-10 pt-3">
              Stone jeans
            </h3>
            <p className="text-white px-10 pt-2">More than 24 varieties</p>
            <p className="text-white px-10">of our branded jeans</p>
          </div>

          <button className="absolute bottom-5 right-5 bg-[#C1CFD6] w-[130px] h-[35px] rounded-[10px] text-white font-bold text-2xl buy-btn  max-[540px]:w-[70px]">
            Observe
          </button>
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
        <div className="relative w-full py-5 rounded-[10px] bg-[#9DB2BF] flex flex-row max-[540px]:gap-0">
          <div>
            <h3 className="text-white text-4xl font-bold px-10 pt-3">
              Stone shorts
            </h3>
            <p className="text-white px-10 pt-2 m-0">More than 27 varieties</p>
            <p className="text-white px-10">of our branded shorts</p>
          </div>

          <button className="absolute bottom-5 right-5 bg-[#C1CFD6] w-[130px] h-[35px] rounded-[10px] text-white font-bold text-2xl buy-btn  max-[540px]:w-[70px]">
            Observe
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionCards;
