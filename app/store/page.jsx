"use client";
import Image from "next/image";
import Suggestions from "./components/Suggestions/Suggestions";
import StoneCollection from "./components/Collection/StoneCollection";
import Discounts from "./components/Discounts/Discounts";
import Layout from "./components/Layout";
import { DEFAULT_MENU_COLOR } from "@/utils/colors";

const Store = () => {
  const hideMenuItems = () => {
    if (document.getElementById("items-wrapper").classList.contains("py-5")) {
      document.querySelectorAll(".menu-card").forEach((el) => {
        if (!el.classList.contains("hidden")) {
          el.classList.add("hidden");
          document.getElementById("items-wrapper").classList.remove("py-5");
        }
      });
    }
  };
  return (
    <div>
      <div className="h-screen" onMouseOver={hideMenuItems}>
        <Layout color={DEFAULT_MENU_COLOR}>
          <div className="flex flex-col items-center gap-20 pt-20 bg-[#EAEFF4] px-5">
            <h1 className="text-[#698294] text-5xl max-[570px]:text-3xl">
              Discover your own style
            </h1>
            <div className="flex flex-row gap-10 max-[1130px]:flex-col">
              <Image
                src="/assets/images/men-image.png"
                width={600}
                height={500}
                className="cursor-pointer darker transition duration-1"
                alt="men-image"
              />

              <Image
                src="/assets/images/women-image.png"
                width={600}
                height={500}
                className="cursor-pointer darker transition duration-1"
                alt="women-image"
              />
            </div>
            <Suggestions />
            <StoneCollection />
            <Discounts />
          </div>
        </Layout>
      </div>
    </div>
  );
};

export default Store;
