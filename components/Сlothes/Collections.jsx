"use client";

import Image from "next/image";
import Reveal from "../Reveal";
import { useEffect } from "react";

const Collections = () => {
  useEffect(() => {
    document.querySelectorAll(".color-card").forEach((el) => {
      el.addEventListener("mouseover", () => {
        el.children[1].classList.add("hidden");
        el.children[0].classList.remove("hidden");
      });
      el.addEventListener("mouseleave", () => {
        el.children[1].classList.remove("hidden");
        el.children[0].classList.add("hidden");
      });
    });
    return () =>
      document.querySelectorAll(".color-card").forEach((el) => {
        el.removeEventListener("mouseover", handleMouseOver);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
  }, []);

  return (
    <div className="clothes-secondary-bg">
      <Reveal>
        <p className="desc md:text-2xl p-10 mt-16 font-thin">
          Explore our exquisite collections and colors
        </p>
      </Reveal>
      <div className="max-[1300px]:flex-col max-[1300px]:flex-center flex-between mt-10 gap-10">
        <div className="colors max-[1300px]:m-0 ml-16 flex flex-col gap-5">
          <div className="flex flex-row gap-5 max-[600px]:flex-col max-[600px]:items-start">
            <Reveal isScale={true} delay={0.1}>
              <div className="color-card flex-center bg-[#5B7682]">
                <button className="observe-btn bg-[#5B7682] text-[#B8C6CC] hidden">
                  Observe
                </button>
                <h3 className="color-name text-[#B8C6CC]">Payne's gray</h3>
              </div>
            </Reveal>
            <Reveal isScale={true} delay={0.2}>
              <div className="color-card flex-center less-width bg-[#B8C6CC]">
                <button className="observe-btn bg-[#B8C6CC] text-[#5B7682] hidden">
                  Observe
                </button>
                <h3 className="color-name text-[#5B7682]">French gray</h3>
              </div>
            </Reveal>
          </div>
          <div className="flex flex-row gap-5 max-[600px]:flex-col max-[600px]:items-start">
            <Reveal isScale={true} delay={0.3}>
              <div className="color-card flex-center color-row-2 bg-[#7D888C]">
                <button className="observe-btn bg-[#7D888C] text-[#D9D9D9] hidden">
                  Observe
                </button>
                <h3 className="color-name text-[#D9D9D9]">Battleship gray</h3>
              </div>
            </Reveal>
            <Reveal isScale={true} delay={0.4}>
              <div className="color-card flex-center less-width color-row-2 bg-[#5F7984]">
                <button className="observe-btn bg-[#5F7984] text-[#D0D2D2] hidden">
                  Observe
                </button>
                <h3 className="color-name text-[#D0D2D2]">Slate gray</h3>
              </div>
            </Reveal>
          </div>
        </div>
        <div className="features max-[1300px]:m-10 max-[1300px]:flex-row max-[1100px]:flex-col flex flex-col mr-16 max-[1300px]:gap-10 gap-5 mb-20">
          <div className="flex flex-row max-[1300px]:gap-10 gap-5 justify-center max-[600px]:flex-col max-[600px]:items-center">
            <Reveal isScale={true}>
              <div className="flex flex-col items-center justify-center max-[1300px]:m-0 mr-32">
                <Image
                  src="/assets/icons/colors.svg"
                  width={50}
                  height={50}
                  className="mb-5"
                  alt="colors"
                />
                <div className="feature-card color-feature flex-center">
                  <h3 className="feature-name">New colors</h3>
                </div>
              </div>
            </Reveal>
            <Reveal isScale={true}>
              <div className="flex flex-col items-center justify-end ">
                <Image
                  src="/assets/icons/infinity.svg"
                  width={50}
                  height={50}
                  className="mb-5"
                  alt="limited"
                />
                <div className="feature-card bg-[#A0B6DD] flex-center">
                  <h3 className="feature-name">Limited edition</h3>
                </div>
              </div>
            </Reveal>
          </div>
          <div className="flex flex-row max-[1300px]:gap-10 gap-5 justify-center max-[600px]:flex-col max-[600px]:items-center">
            <Reveal isScale={true}>
              <div className="flex flex-col items-center justify-end max-[1300px]:m-0 mr-32">
                <Image
                  src="/assets/icons/star.svg"
                  width={50}
                  height={50}
                  className="mb-5"
                  alt="premium"
                />
                <div className="feature-card bg-[#DDC7A0] flex-center">
                  <h3 className="feature-name">Premium materials</h3>
                </div>
              </div>
            </Reveal>
            <Reveal isScale={true}>
              <div className="flex flex-col items-center justify-end">
                <Image
                  src="/assets/icons/hanger.svg"
                  width={50}
                  height={50}
                  className="mb-5"
                  alt="hanger"
                />
                <div className="feature-card bg-[#A0D5DD] flex-center">
                  <h3 className="feature-name">Size inclusivity</h3>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collections;
