import Image from "next/image";
import Reveal from "../Reveal";

const HowToUse = () => {
  return (
    <div>
      <Reveal>
        <h3 className="heading-text md:text-5xl text-center text-blue-50 pb-10">
          How to use
        </h3>
      </Reveal>
      <div className="flex flex-col flex-center max-[1200px]:gap-10">
        <Reveal isCentered={true}>
          <div className="use-card h-[168px] mb-2 border-b-2 border-[#DDC7A0] flex flex-between px-10 max-[600px]:h-max max-[600px]:flex-col max-[600px]:px-0 max-[600px]:py-5 max-[600px]:gap-5">
            <Image src="/assets/icons/purchase.svg" width={50} height={80} />
            <div className="flex flex-col items-start m-auto">
              <p className="use-card-text  text-white text-left text-start max-[600px]:text-xl max-[600px]:text-center text-2xl">
                Trace your purchases easily.
              </p>
              <p className="use-card-text text-[#DDC7A0] max-[600px]:text-xl text-2xl">
                Your purchases, your power!
              </p>
            </div>
          </div>
        </Reveal>
        <Reveal isCentered={true} delay={0.1}>
          <div className="use-card h-[239px] mb-2 border-b-2 border-[#A0B6DD] flex flex-between gap-16 px-10 max-[600px]:h-max  max-[600px]:px-0 max-[600px]:flex-col max-[600px]:py-5 max-[600px]:gap-5">
            <Image src="/assets/icons/suggestion.svg" width={60} height={80} />
            <div className="flex flex-col items-start m-auto">
              <p className="use-card-text text-left text-white  max-[600px]:text-xl  max-[600px]:text-center text-2xl">
                Our algorytm suggests clothes that you only need!
              </p>
              <p className="use-card-text text-[#A0B6DD] max-[600px]:text-xl   max-[600px]:w-full max-[600px]:text-center text-2xl">
                Your Daily Dose of Ideas!
              </p>
            </div>
          </div>
        </Reveal>
        <Reveal isCentered={true} delay={0.2}>
          <div className="use-card h-[100px] mb-12 border-b-2 border-[#A0D5DD] flex flex-between gap-10 px-10 max-[600px]:h-max max-[600px]:flex-col max-[600px]:px-0 max-[600px]:py-5 max-[600px]:gap-5">
            <Image src="/assets/icons/discount.svg" width={60} height={80} />
            <p className="use-card-text text-left text-[#A0D4DD] w-3/4  max-[600px]:text-lg text-2xl">
              Discounts That Never Rest!
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default HowToUse;
