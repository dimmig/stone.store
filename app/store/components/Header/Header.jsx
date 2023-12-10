"use client";

import Image from "next/image";
import Menu from "./Menu";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DEFAULT_MENU_COLOR, generateTints } from "@/utils/colors";
import tinycolor from "tinycolor2";

const Header = ({ headerColor }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (headerColor !== DEFAULT_MENU_COLOR) {
      document.getElementById("store-header").style.backgroundColor = tinycolor(
        headerColor
      ).isDark()
        ? tinycolor(headerColor).lighten(10)
        : tinycolor(headerColor).darken(1);
      console.log(document.getElementById("store-header"));
      document.getElementById("header-input").style.backgroundColor = tinycolor(
        headerColor
      ).isDark()
        ? tinycolor(headerColor).lighten(7)
        : tinycolor(headerColor).darken(7);

      document.getElementById("search-btn").style.backgroundColor = tinycolor(
        headerColor
      ).isDark()
        ? tinycolor(headerColor).lighten(7)
        : tinycolor(headerColor).darken(7);
    } else {
      document.getElementById("store-header").style.backgroundColor =
        DEFAULT_MENU_COLOR;
    }
  }, [headerColor]);

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  };

  const mouseOver = (e) => {
    document.querySelectorAll(".menu-card").forEach((el) => {
      if (!el.classList.contains("hidden")) {
        el.classList.add("hidden");
      }
    });
    document.getElementById(`${e.target.id}-items`).classList.add("py-10");

    document.getElementById(`${e.target.id}-items`).classList.remove("hidden");
  };

  const mouseLeave = () => {
    document.querySelectorAll(".menu-card").forEach((el) => {
      if (!el.classList.contains("hidden")) {
        el.classList.add("hidden");
      }
    });
  };

  return (
    <div
      className="flex-between relative"
      id="store-header"
      onMouseLeave={mouseLeave}
    >
      <Image
        src="/assets/icons/app-logo-white.svg"
        width={180}
        height={40}
        alt="app-logo-icon"
      />
      <div className="flex flex-row text-white text-2xl ml-10 max-[880px]:ml-0 max-[540px]:text-[14px]">
        <h3
          className="cursor-pointer hover:opacity-80"
          id="men"
          onMouseOver={(e) => mouseOver(e)}
        >
          Men
        </h3>
        <h3 className="mx-5 max-[540px]:mx-1">|</h3>
        <h3
          className="cursor-pointer hover:opacity-80"
          id="women"
          onMouseOver={(e) => mouseOver(e)}
        >
          Women
        </h3>
        <h3 className="mx-5 max-[540px]:mx-1">|</h3>
        <h3
          className="cursor-pointer hover:opacity-80"
          id="kids"
          onMouseOver={(e) => mouseOver(e)}
        >
          Kids
        </h3>
      </div>
      <div className="flex flex-row gap-2 w-2/5 flex-center max-[880px]:hidden">
        <input
          placeholder="Search"
          className="outline-none border-none bg-[#526D82B2] py-2 px-2 text-white rounded-[10px] w-2/4"
          id="header-input"
        />
        <button
          className="flex flex-center bg-[#DDE6ED] px-5 py-2 rounded-[10px] hover:bg-[#D7E2EA]"
          id="search-btn"
        >
          <Image
            src="/assets/icons/search.svg"
            width={20}
            height={20}
            alt="search-icon"
          />
        </button>
      </div>
      <div className="flex flex-row max-[1100px]:hidden">
        <div className="flex flex-row gap-16 mr-16">
          <div className="min-w-[30px]">
            <Link href="/store/purchases">
              <Image
                src="/assets/icons/purchase.svg"
                width={25}
                height={40}
                alt="purchase-icon"
                className="cursor-pointer hover:opacity-80"
              />
            </Link>
          </div>
          <Image
            src="/assets/icons/heart.svg"
            width={30}
            height={35}
            alt="favourites-icon"
            className="cursor-pointer hover:opacity-80"
          />
          <Image
            src="/assets/icons/user-icon-white.svg"
            width={25}
            height={40}
            alt="user-icon"
            className="cursor-pointer hover:opacity-80"
          />
        </div>
        <Image
          src="/assets/icons/moon.svg"
          width={30}
          height={35}
          alt="dark-theme-icon"
          className="mx-10 ml-16 cursor-pointer hover:opacity-80"
        />
      </div>
      <div className="min-[1100px]:hidden relative  flex-center">
        <motion.div
          className="ml-10 max-[500px]:ml-5 menu-icon min-w-[40px]"
          whileTap={{ scale: "0.8" }}
        >
          <Image
            src="/assets/icons/white-menu-icon.svg"
            width={50}
            height={50}
            onClick={() => setIsOpen((prev) => !prev)}
            alt="menu-icon"
          />
        </motion.div>
        <motion.div
          className="absolute top-16 flex flex-col items-center justify-center w-[300px] bg-[#9DB2BF] right-1 py-5 gap-5"
          variants={{
            open: {
              clipPath: "inset(0% 0% 0% 0% round 10px)",
              transition: {
                type: "spring",
                bounce: 0,
                duration: 0.7,
                delayChildren: 0.3,
                staggerChildren: 0.05,
              },
            },
            closed: {
              clipPath: "inset(10% 50% 90% 50% round 10px)",
              transition: {
                type: "spring",
                bounce: 0,
                duration: 0.3,
              },
            },
          }}
          initial={false}
          animate={isOpen ? "open" : "closed"}
        >
          <motion.div
            variants={itemVariants}
            className="flex flex-row flex-center gap-5 min-[880px]:hidden"
          >
            <input
              placeholder="Search"
              className="outline-none border-none bg-[#526D82B2] py-2 px-2 text-white rounded-[10px] w-2/4"
            />
            <button className="flex flex-center bg-[#DDE6ED] px-5 py-2 rounded-[10px] hover:bg-[#D7E2EA]">
              <Image
                src="assets/icons/search.svg"
                width={20}
                height={20}
                alt="search-icon"
              />
            </button>
          </motion.div>
          <motion.p
            className="flex flex-row items-center gap-5 link text-gray-200 hover:text-white cursor-pointer active:text-gray-600"
            variants={itemVariants}
          >
            <Image
              src="assets/icons/purchase.svg"
              width={15}
              height={40}
              alt="purchase-icon"
              className="cursor-pointer hover:opacity-80"
            />{" "}
            Purchases
          </motion.p>
          <motion.p
            className="flex flex-row items-center gap-5 link text-gray-200 hover:text-white cursor-pointer active:text-gray-600"
            variants={itemVariants}
          >
            <Image
              src="assets/icons/heart.svg"
              width={20}
              height={40}
              alt="purchase-icon"
              className="cursor-pointer hover:opacity-80"
            />{" "}
            Favourites
          </motion.p>
          <motion.p
            className="flex flex-row items-center gap-5 ml-1 link text-gray-200  hover:text-white cursor-pointer active:text-gray-600"
            variants={itemVariants}
          >
            <Image
              src="assets/icons/user-icon-white.svg"
              width={20}
              height={40}
              alt="purchase-icon"
              className="cursor-pointer hover:opacity-80"
            />{" "}
            My account
          </motion.p>
        </motion.div>
      </div>
      <Menu menuColor={headerColor} />
    </div>
  );
};

export default Header;
