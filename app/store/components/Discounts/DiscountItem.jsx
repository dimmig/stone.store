import {
  buildRgb,
  drawColors,
  getImageData,
  quantization,
} from "@/utils/colors";
import Image from "next/image";
import Link from "next/link";

const DiscountItem = ({ item }) => {
  return (
    <div className="relative flex flex-col gap-5">
      <div className="w-[420px] h-[310px]  bg-[#F6FBFC] rounded-[10px] relative">
        <div className="absolute flex-center right-0 w-[100px] h-[40px] bg-[#C3E4E9] rounded-[10px]">
          <p className="text-xl font-bold text-white">-{item.discount}%</p>
        </div>
        <Image
          src={item.image[item.colors[0]]}
          width={item.width}
          height={item.height}
          alt={`${item.name}-image`}
          id={item.id}
          className="ml-[20%]"
        />
        <div className="flex flex-col absolute gap-5 left-5 top-[30%]">
          {drawColors(item, 20, 20)}
        </div>
      </div>
      <div className="relative w-[420px] h-[130px] bg-[#C3E4E9] rounded-[10px] flex flex-row">
        <div>
          <h3 className="text-white text-4xl font-bold px-5 pt-3">
            {item.name}
          </h3>
          <p className="text-white text-xl px-5 pt-2">In 4 original colors</p>
          <p className="text-white text-xl px-5">M/S/Xs/2Xs</p>
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
          <button className="absolute bottom-5 right-5 bg-[#DDEFF3] w-[130px] h-[35px] rounded-[10px] text-white font-bold text-2xl buy-btn  max-[540px]:w-[70px]">
            Buy
          </button>
        </Link>
      </div>
    </div>
  );
};

export default DiscountItem;
