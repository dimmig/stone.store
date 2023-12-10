import Link from "next/link";
import Image from "next/image";
import {
  buildRgb,
  drawColors,
  getImageData,
  quantization,
} from "@/utils/colors";

const SuggestionItem = ({ item }) => {
  return (
    <div className="w-[420px] h-[430px] bg-[#F6FBFC] relative rounded-[10px] flex justify-center items-start mb-20">
      <Image
        src={item.image[item.colors[0]]}
        width={item.width}
        height={item.height}
        alt={`${item.name}-image`}
        id={item.id}
        className="ml-[70%]"
      />
      <div className="flex flex-col absolute gap-5 left-5 top-[25%]">
        {drawColors(item, 20, 20)}
      </div>
      <div className="absolute bottom-0 w-full h-[30%] rounded-[10px] bg-[#A0B6DD] flex flex-row max-[540px]:gap-0">
        <div>
          <h3 className="text-white text-4xl font-bold px-10 pt-3">
            {item.name}
          </h3>
          <p className="text-white px-10 pt-2">In 3 original colors</p>
          <p className="text-white px-10">M/S/Xs/2Xs</p>
        </div>
        <Link
          href={`store/buy/${item.id}`}
          onClick={() => {
            const imgData = getImageData(item);
            const rgbValues = buildRgb(imgData);
            sessionStorage.setItem(
              "primary-color",
              JSON.stringify(quantization(rgbValues, 4))
            );
          }}
        >
          <button className="absolute bottom-5 right-5 bg-[#DDE5F3] w-[130px] h-[35px] rounded-[10px] text-white font-bold text-2xl buy-btn  max-[540px]:w-[70px]">
            Buy
          </button>
        </Link>
      </div>
      <canvas id="canvas"></canvas>
    </div>
  );
};

export default SuggestionItem;
