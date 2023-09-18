import Image from "next/image";
import HowToUse from "./HowToUse";
import "@/styles/card.css";
import Reveal from "../Reveal";

const App = () => {
  return (
    <div className="clothes-bg text-center" id="how-to-use">
      <Reveal isFull={true}>
        <h1 className="heading-text md:text-8xl text-center text-blue-50 pt-20">
          App guide
        </h1>
        <p className="desc md:text-2xl text-center mt-2 font-thin pb-32">
          Navigate with ease: your app user manual
        </p>
      </Reveal>
      <div className="flex flex-around max-[1200px]:flex-col max-[1200px]:gap-20 min-w-[375px]">
        <div className="relative select-none pointer-events-none">
          <Reveal isFull={false}>
            <Image
              src="/assets/icons/mock/mobile.png"
              width={400}
              height={750}
            />
          </Reveal>
          <Reveal
            delay={0.1}
            styles={"flex gap-28 absolute bottom-[270px] left-12"}
          >
            <Image
              src="/assets/icons/mock/stone-preview.svg"
              width={160}
              height={50}
            />
            <Image
              src="/assets/icons/mock/menu.svg"
              width={27}
              height={21}
              className="max-[400px]:mr-[40px]"
            />
          </Reveal>
          <Reveal
            styles={
              "absolute top-32 left-10 max-[400px]:w-[300px]  max-[400px]:h-[130px]  max-[400px]:right-[20px]"
            }
            isFull={false}
            delay={0.1}
          >
            <Image
              src="/assets/icons/mock/orange-part.svg"
              width={320}
              height={180}
            />
          </Reveal>
          <Reveal
            styles={
              "absolute top-[299px] left-10 max-[400px]:w-[300px] max-[400px]:h-[200px] max-[400px]:top-[290px]"
            }
            isFull={false}
            delay={0.2}
          >
            <Image
              src="/assets/icons/mock/purple-part.svg"
              width={320}
              height={180}
            />
          </Reveal>
          <Reveal
            styles={
              "absolute top-3/4 left-10 max-[400px]:w-[280px] max-[100px]:h-[200px]  max-[400px]:left-[50px]"
            }
            isFull={false}
            delay={0.3}
          >
            <Image
              src="/assets/icons/mock/green-part.svg"
              width={320}
              height={180}
            />
          </Reveal>
        </div>
        <HowToUse />
      </div>
    </div>
  );
};

export default App;
