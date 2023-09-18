"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import "@/styles/animations.css";
import { useState } from "react";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  };

  return (
    <div className="w-full flex flex-between">
      <Image
        src="/assets/icons/app-logo.svg"
        width={200}
        height={80}
        className="pointer-events-none"
        alt="app-logo"
      />
      <div className="max-md:hidden w-1/2 flex flex-row flex-around text-gray-500 whitespace-nowrap">
        <p
          className="link"
          onClick={() =>
            document
              .getElementById("about")
              .scrollIntoView({ behavior: "smooth" })
          }
        >
          About us
        </p>
        <p
          className="link"
          onClick={() =>
            document
              .getElementById("clothes")
              .scrollIntoView({ behavior: "smooth" })
          }
        >
          Clothes
        </p>
        <p
          className="link"
          onClick={() =>
            document
              .getElementById("why-us")
              .scrollIntoView({ behavior: "smooth" })
          }
        >
          Why us
        </p>
        <p
          className="link"
          onClick={() =>
            document
              .getElementById("how-to-use")
              .scrollIntoView({ behavior: "smooth" })
          }
        >
          How to use
        </p>
        <p
          className="link"
          onClick={() =>
            document
              .getElementById("contacts")
              .scrollIntoView({ behavior: "smooth" })
          }
        >
          Contacts
        </p>
      </div>
      <div className="flex flex-row whitespace-nowrap w-max">
        <button className="max-md:hidden header-buttons bg-gray-600 mx-5 px-5 py-1 text-white rounded-full">
          Log in
        </button>
        <button className="max-md:hidden header-buttons sign-up-bg mx-5 px-5 text-white rounded-full">
          Sign up
        </button>
      </div>
      <div className="md:hidden relative flex flex-col flex-center">
        <motion.div className="mx-10 menu-icon" whileTap={{ scale: "0.8" }}>
          <Image
            src="/assets/icons/menu-icon.svg"
            width={50}
            height={50}
            onClick={() => setIsOpen((prev) => !prev)}
            alt="menu-icon"
          />
        </motion.div>
        <motion.div
          className="dropdown flex flex-col flex-center"
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
          <motion.p
            className="link text-gray-200 py-2 hover:text-white py-2 cursor-pointer active:text-gray-600"
            variants={itemVariants}
            onClick={() =>
              document
                .getElementById("about")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            About us
          </motion.p>
          <motion.p
            className="link text-gray-200 py-2 hover:text-white py-2 cursor-pointer active:text-gray-600"
            variants={itemVariants}
            onClick={() =>
              document
                .getElementById("clothes")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Clothes
          </motion.p>
          <motion.p
            className="link text-gray-200 py-2 hover:text-white py-2 cursor-pointer active:text-gray-600"
            variants={itemVariants}
            onClick={() =>
              document
                .getElementById("why-us")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Why us
          </motion.p>
          <motion.p
            className="link text-gray-200 py-2 hover:text-white py-2 cursor-pointer active:text-gray-600"
            variants={itemVariants}
            onClick={() =>
              document
                .getElementById("how-to-use")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            How to use
          </motion.p>
          <motion.p
            className="link text-gray-200 py-2 hover:text-white cursor-pointer active:text-gray-300"
            variants={itemVariants}
            onClick={() =>
              document
                .getElementById("contacts")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Contacts
          </motion.p>
          <motion.button
            className="bg-gray-600 mx-5 my-2 px-5 py-1 text-white rounded-full active:bg-gray-700"
            variants={itemVariants}
          >
            Log in
          </motion.button>
          <motion.button
            className="sign-up-bg mx-5 px-5 my-2 py-1 text-white rounded-full"
            variants={itemVariants}
          >
            Sign up
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Menu;
