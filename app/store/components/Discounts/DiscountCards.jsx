import Image from "next/image";

const DiscountCards = () => {
  return (
    <div className="flex-around flex-wrap gap-10">
      <div className="relative flex flex-col gap-5">
        <div className="w-[420px] h-[310px]  bg-[#F6FBFC] rounded-[10px] relative">
          <div className="absolute flex-center right-0 w-[100px] h-[40px] bg-[#C3E4E9] rounded-[10px]">
            <p className="text-xl font-bold text-white">-50%</p>
          </div>
          <Image
            src="/assets/icons/clothes/gray_shirt.svg"
            width={280}
            height={300}
            className="absolute bottom-2 left-20"
            alt="gray shirt"
          />
          <div className="flex flex-col absolute gap-5 left-5 top-[30%]">
            <div className="w-[20px] h-[20px] rounded-full bg-[#C7C7C7] olor-circle" />
            <div className="w-[20px] h-[20px] rounded-full bg-[#E7A0A0] color-circle" />
            <div className="w-[20px] h-[20px] rounded-full bg-[#000000] color-circle" />
            <div className="w-[20px] h-[20px] rounded-full bg-[#80B5C8] color-circle" />
          </div>
        </div>
        <div className="relative w-[420px] h-[130px] bg-[#C3E4E9] rounded-[10px] flex flex-row">
          <div>
            <h3 className="text-white text-4xl font-bold px-5 pt-3">
              Stone branded T-shirt
            </h3>
            <p className="text-white text-xl px-5 pt-2">In 4 original colors</p>
            <p className="text-white text-xl px-5">M/S/Xs/2Xs</p>
          </div>
          <button className="absolute bottom-5 right-5 bg-[#DDEFF3] w-[130px] h-[35px] rounded-[10px] text-white font-bold text-2xl buy-btn  max-[540px]:w-[70px]">
            Buy
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="w-[420px] h-[310px] bg-[#F6FBFC] rounded-[10px] relative">
          <div className="absolute flex-center right-0 w-[100px] h-[40px] bg-[#C3E4E9] rounded-[10px]">
            <p className="text-xl font-bold text-white">-50%</p>
          </div>
          <Image
            src="/assets/icons/clothes/winter_jacket.svg"
            width={280}
            height={300}
            className="absolute bottom-2 left-20"
            alt="winter jacket"
          />
          <div className="flex flex-col absolute gap-5 left-5 top-[30%]">
            <div className="w-[20px] h-[20px] rounded-full bg-[#8D8D8F] color-circle" />
            <div className="w-[20px] h-[20px] rounded-full bg-[#FFDDBD] color-circle" />
            <div className="w-[20px] h-[20px] rounded-full bg-[#363636] color-circle" />
          </div>
        </div>
        <div className="relative w-[420px] h-[130px] bg-[#C3E4E9] rounded-[10px] flex flex-row">
          <div>
            <h3 className="text-white text-4xl font-bold px-5 pt-3">
              Stone branded jacket
            </h3>
            <p className="text-white text-xl px-5 pt-2">In 3 original colors</p>
            <p className="text-white text-xl px-5">M/S/Xs/2Xs</p>
          </div>
          <button className="absolute bottom-5 right-5 bg-[#DDEFF3] w-[130px] h-[35px] rounded-[10px] text-white font-bold text-2xl buy-btn  max-[540px]:w-[70px]">
            Buy
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="w-[420px] h-[310px] bg-[#F6FBFC] rounded-[10px] relative">
          <div className="absolute flex-center right-0 w-[100px] h-[40px] bg-[#C3E4E9] rounded-[10px]">
            <p className="text-xl font-bold text-white">-50%</p>
          </div>
          <Image
            src="/assets/icons/clothes/blazer_shirt.png"
            width={280}
            height={300}
            className="absolute left-20"
            alt="blazer and shirt"
          />
          <div className="flex flex-col absolute gap-5 left-5 top-[30%]">
            <div className="flex flex-row gap-5">
              <div className="w-[20px] h-[20px] rounded-full bg-[#3A4049] color-circle" />
              <div className="w-[20px] h-[20px] rounded-full bg-[#DEDBDB] color-circle" />
            </div>
            <div className="flex flex-row gap-5">
              <div className="w-[20px] h-[20px] rounded-full bg-[#8C6A43] color-circle" />
              <div className="w-[20px] h-[20px] rounded-full bg-[#DED1C8] color-circle" />
            </div>
            <div className="flex flex-row gap-5">
              <div className="w-[20px] h-[20px] rounded-full bg-[#B2B1B4] color-circle" />
              <div className="w-[20px] h-[20px] rounded-full bg-[#C6C9D7] color-circle" />
            </div>
          </div>
        </div>
        <div className="relative w-[420px] h-[130px] bg-[#C3E4E9] rounded-[10px] flex flex-row">
          <div>
            <h3 className="text-white text-4xl font-bold px-5 pt-3">
              Stone blazer + shirt
            </h3>
            <p className="text-white text-xl px-5 pt-2">In 3 original colors</p>
            <p className="text-white text-xl px-5">M/S/Xs/2Xs</p>
          </div>
          <button className="absolute bottom-5 right-5 bg-[#DDEFF3] w-[130px] h-[35px] rounded-[10px] text-white font-bold text-2xl buy-btn  max-[540px]:w-[70px]">
            Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscountCards;
