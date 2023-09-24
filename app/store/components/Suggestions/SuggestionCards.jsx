import Image from "next/image";

const SuggestionCard = () => {
  return (
    <div className="bg-[#DDE5F3] flex flex-col w-full px-16 pt-16 rounded-sm max-[500px]:px-0">
      <div className="flex flex-around flex-wrap mb-10">
        <div className="w-[420px] h-[430px] bg-[#F6FBFC] relative rounded-[10px] flex justify-center items-start mb-20">
          <Image
            src="/assets/icons/clothes/longsleeve.svg"
            width={300}
            height={300}
            alt="longsleeve-image"
          />
          <div className="flex flex-col absolute gap-5 left-5 top-[25%]">
            <div className="w-[20px] h-[20px] rounded-full bg-[#D6D6D6] color-circle" />
            <div className="w-[20px] h-[20px] rounded-full bg-[#DDC7A0] color-circle" />
            <div className="w-[20px] h-[20px] rounded-full bg-[#000000] color-circle" />
          </div>
          <div className="absolute bottom-0 w-full h-[30%] rounded-[10px] bg-[#A0B6DD] flex flex-row max-[540px]:gap-0">
            <div>
              <h3 className="text-white text-4xl font-bold px-10 pt-3">
                Longsleeve
              </h3>
              <p className="text-white px-10 pt-2">In 3 original colors</p>
              <p className="text-white px-10">M/S/Xs/2Xs</p>
            </div>
            <button className="absolute bottom-5 right-5 bg-[#DDE5F3] w-[130px] h-[35px] rounded-[10px] text-white font-bold text-2xl buy-btn  max-[540px]:w-[70px]">
              Buy
            </button>
          </div>
        </div>
        <div className="w-[420px] h-[430px] bg-[#F6FBFC] relative rounded-[10px] flex justify-center items-start  mb-20">
          <Image
            src="/assets/icons/clothes/hoodie.svg"
            width={250}
            height={300}
            alt="hoodie-image"
          />
          <div className="flex flex-col absolute gap-5 left-5 top-[25%]">
            <div className="w-[20px] h-[20px] rounded-full bg-[#ACABB0] color-circle" />
            <div className="w-[20px] h-[20px] rounded-full bg-[#E9A800] color-circle" />
            <div className="w-[20px] h-[20px] rounded-full bg-[#000000] color-circle" />
          </div>
          <div className="absolute bottom-0 w-full h-[30%] rounded-[10px] bg-[#A0B6DD] flex flex-row gap-14  max-[540px]:gap-5">
            <div>
              <h3 className="text-white text-4xl font-bold px-10 pt-3">
                Hoodie
              </h3>
              <p className="text-white px-10 pt-2">In 3 original colors</p>
              <p className="text-white px-10">M/S/Xs/2Xs</p>
            </div>

            <button className=" absolute bottom-5 right-5 bg-[#DDE5F3] w-[130px] h-[35px] rounded-[10px] text-white font-bold text-2xl max-[540px]:w-[70px] buy-btn">
              Buy
            </button>
          </div>
        </div>
        <div className="w-[420px] h-[430px] bg-[#F6FBFC] relative rounded-[10px] relative  mb-20 overflow-hidden">
          <Image
            src="/assets/icons/clothes/sweetshirt.svg"
            width={320}
            height={300}
            className="absolute bottom-[30%] left-[20%]"
            alt="sweetshirt-image"
          />
          <div className="flex flex-col absolute gap-5 left-5 top-[25%]">
            <div className="w-[20px] h-[20px] rounded-full bg-[#3D5E57] color-circle" />
            <div className="w-[20px] h-[20px] rounded-full bg-[#FFAEAE] color-circle" />
            <div className="w-[20px] h-[20px] rounded-full bg-[#B1D5D8] color-circle" />
          </div>
          <div className="absolute bottom-0 w-full h-[30%] rounded-[10px] bg-[#A0B6DD] flex flex-row gap-2">
            <div>
              <h3 className="text-white text-4xl font-bold px-10 pt-3">
                Sweetshirt
              </h3>
              <p className="text-white px-10 pt-2">In 3 original colors</p>
              <p className="text-white px-10">M/S/Xs/2Xs</p>
            </div>

            <button className="absolute bottom-5 right-5 bg-[#DDE5F3] w-[130px] h-[35px] rounded-[10px] text-white font-bold text-2xl buy-btn">
              Buy
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-around flex-wrap">
        <div className="w-[420px] h-[430px] bg-[#F6FBFC] relative rounded-[10px] flex justify-center items-start  mb-20">
          <Image
            src="/assets/icons/clothes/singlet.svg"
            width={200}
            height={300}
            alt="singlet-image"
          />
          <div className="flex flex-col absolute gap-5 left-5 top-[16%]">
            <div className="w-[20px] h-[20px] rounded-full bg-[#BC4C4D] color-circle" />
            <div className="w-[20px] h-[20px] rounded-full bg-[#000000] color-circle" />
            <div className="w-[20px] h-[20px] rounded-full bg-[#B2A9A9] color-circle" />
            <div className="w-[20px] h-[20px] rounded-full bg-[#FFC149] color-circle" />
            <div className="w-[20px] h-[20px] rounded-full bg-[#71E0A4] color-circle" />
          </div>
          <div className="absolute bottom-0 w-full h-[30%] rounded-[10px] bg-[#A0B6DD] flex flex-row gap-14">
            <div>
              <h3 className="text-white text-4xl font-bold px-10 pt-3">
                Singlet
              </h3>
              <p className="text-white px-10 pt-2">In 5 original colors</p>
              <p className="text-white px-10">M/S/Xs/2Xs</p>
            </div>

            <button className="absolute bottom-5 right-5 bg-[#DDE5F3] w-[130px] h-[35px] rounded-[10px] text-white font-bold text-2xl buy-btn">
              Buy
            </button>
          </div>
        </div>
        <div className="w-[420px] h-[430px] bg-[#F6FBFC] relative rounded-[10px] flex justify-center items-start  mb-20">
          <Image
            src="/assets/icons/clothes/shorts.svg"
            width={300}
            height={300}
            className="absolute top-5"
            alt="shorts-image"
          />
          <div className="flex flex-col absolute gap-5 left-5 top-[25%]">
            <div className="w-[20px] h-[20px] rounded-full bg-[#668C5B] color-circle" />
            <div className="w-[20px] h-[20px] rounded-full bg-[#000000] color-circle" />
            <div className="w-[20px] h-[20px] rounded-full bg-[#AD7979] color-circle" />
          </div>
          <div className="absolute bottom-0 w-full h-[30%] rounded-[10px] bg-[#A0B6DD] flex flex-row gap-14">
            <div>
              <h3 className="text-white text-4xl font-bold px-10 pt-3">
                Shorts
              </h3>
              <p className="text-white px-10 pt-2">In 3 original colors</p>
              <p className="text-white px-10">M/S/Xs/2Xs</p>
            </div>

            <button className="absolute bottom-5 right-5 bg-[#DDE5F3] w-[130px] h-[35px] rounded-[10px] text-white font-bold text-2xl buy-btn">
              Buy
            </button>
          </div>
        </div>
        <div className="w-[420px] h-[430px] bg-[#F6FBFC] relative rounded-[10px] relative  mb-20">
          <Image
            src="/assets/icons/clothes/jacket.svg"
            width={260}
            height={300}
            className="absolute bottom-[30%] left-[20%]"
            alt="jacket-image"
          />
          <div className="flex flex-col absolute gap-5 left-5 top-[25%]">
            <div className="w-[20px] h-[20px] rounded-full bg-[#B7B899] color-circle" />
            <div className="w-[20px] h-[20px] rounded-full bg-[#000000] color-circle" />
            <div className="w-[20px] h-[20px] rounded-full bg-[#8E6700] color-circle" />
          </div>
          <div className="absolute bottom-0 w-full h-[30%] rounded-[10px] bg-[#A0B6DD] flex flex-row">
            <div>
              <h3 className="text-white text-4xl font-bold pl-7 pt-3 whitespace-nowrap">
                Autumn jacket
              </h3>
              <p className="text-white pl-8 pt-2">In 3 original colors</p>
              <p className="text-white pl-8">M/S/Xs/2Xs</p>
            </div>

            <button className="absolute bottom-5 right-5 bg-[#DDE5F3] w-[130px] h-[35px] rounded-[10px] text-white font-bold text-2xl buy-btn">
              Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestionCard;
