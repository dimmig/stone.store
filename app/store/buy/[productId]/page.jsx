"use client";
import { useEffect, useState } from "react";
import data from "../../../../mock_data/data.json";
import { DEFAULT_TEXT_COLOR, drawColors, rgbToHex } from "@/utils/colors";
import Layout from "../../components/layout";
import Image from "next/image";
import tinycolor from "tinycolor2";
import { switchTab, switchToFeedbackTab, switchToItemTab } from "@/app/store/utils/tabsSwitcher";

const BuyPage = ({ params }) => {
  const [isFeedBackActive, setIsFeedBackActive] = useState(false);
  const primaryColor = JSON.parse(sessionStorage.getItem("primary-color"))[0];
  const el = data.filter((item) => item.id === params.productId)[0];
  sessionStorage.setItem("data", JSON.stringify(el));
  const itemData = JSON.parse(sessionStorage.getItem("data"));
  const [size, setSize] = useState(null);
  const [imgColor, setImgColor] = useState(
    rgbToHex(primaryColor.r, primaryColor.g, primaryColor.b)
  );

  useEffect(() => {
    document.querySelector(`.circle_${itemData.id}`).style.border =
      "3px solid #fff";
  }, []);

  useEffect(() => {
    let textColor = DEFAULT_TEXT_COLOR;

    if (imgColor === "#000000") {
      document.getElementById("main").style.backgroundColor =
        tinycolor(imgColor).lighten(15);
      document.getElementById("img-bg").style.backgroundColor =
        tinycolor(imgColor).lighten(17);
      document.getElementById("price-bg").style.backgroundColor =
        tinycolor(imgColor).lighten(16);
      document.getElementById("buy-bg").style.backgroundColor =
        tinycolor(imgColor).lighten(20);
      document.querySelectorAll("#description-bg").forEach((el) => {
        el.style.backgroundColor = tinycolor(imgColor).lighten(13);
      });
      document.querySelectorAll("#size-bg").forEach((el) => {
        el.style.backgroundColor = tinycolor(imgColor).lighten(13);
        el.addEventListener("mouseover", () => {
          el.style.scale = 1.1;
          el.style.backgroundColor = tinycolor(imgColor).isDark()
            ? tinycolor(imgColor).lighten(20)
            : tinycolor(imgColor).darken(20);
        });
        el.addEventListener("mouseleave", () => {
          el.style.scale = 1;
          el.style.backgroundColor = tinycolor(imgColor).isDark()
            ? tinycolor(imgColor).lighten(10)
            : tinycolor(imgColor).darken(10);
        });
      });
    } else {
      document.getElementById("main").style.backgroundColor = tinycolor(
        imgColor
      ).isDark()
        ? tinycolor(imgColor).lighten(8)
        : tinycolor(imgColor).darken(10);

      document.getElementById("img-bg").style.backgroundColor = tinycolor(
        imgColor
      ).isDark()
        ? tinycolor(imgColor).lighten(5)
        : tinycolor(imgColor).darken(5);

      document.getElementById("price-bg").style.backgroundColor = tinycolor(
        imgColor
      ).isDark()
        ? tinycolor(imgColor).lighten(10)
        : tinycolor(imgColor).darken(5);

      document.getElementById("price-bg").style.color = textColor;
      document.getElementById("buy-bg").style.backgroundColor = tinycolor(
        imgColor
      ).isDark()
        ? tinycolor(imgColor).lighten(0)
        : tinycolor(imgColor).darken(0);

      document.getElementById("buy-bg").style.color = textColor;
      document.querySelectorAll("#description-bg").forEach((el) => {
        el.style.backgroundColor = tinycolor(imgColor).isDark()
          ? tinycolor(imgColor).lighten(10)
          : tinycolor(imgColor).darken(5);
      });
      document.querySelectorAll("#size-bg").forEach((el) => {
        el.addEventListener("mouseover", () => {
          el.style.scale = 1.1;
          el.style.backgroundColor = tinycolor(imgColor).isDark()
            ? tinycolor(imgColor).lighten(20)
            : tinycolor(imgColor).darken(20);
        });
        el.addEventListener("mouseleave", () => {
          el.style.scale = 1;
          el.style.backgroundColor = tinycolor(imgColor).isDark()
            ? tinycolor(imgColor).lighten(10)
            : tinycolor(imgColor).darken(10);
        });
        if (el.style.borderBottom.length !== 0) {
          el.style.borderBottom = `5px solid ${imgColor}`;
        }
        el.addEventListener("click", () => {
          el.style.borderBottom = `5px solid ${imgColor}`;
          setSize(el.textContent);
          document.querySelectorAll("#size-bg").forEach((otherEl) => {
            if (otherEl !== el) {
              otherEl.style.borderBottom = "";
            }
          });
        });
        el.style.backgroundColor = tinycolor(imgColor).isDark()
          ? tinycolor(imgColor).lighten(10)
          : tinycolor(imgColor).darken(5);
      });
      document.querySelectorAll("#text-data").forEach((el) => {
        el.style.color = textColor;
      });
    }
    document.getElementById("item-image").src =
      imgColor === rgbToHex(primaryColor.r, primaryColor.g, primaryColor.b)
        ? itemData.image[itemData.colors[0]]
        : itemData.image[imgColor];

    if (itemData.discount) {
      document.getElementById("discount").style.backgroundColor = tinycolor(
        imgColor
      ).isDark()
        ? tinycolor(imgColor).lighten(1)
        : tinycolor(imgColor).darken(14);
    }
  }, [imgColor, isFeedBackActive]);

  function drawColors(item, w, h) {
    const colors = item.colors.map((color, index) => (
      <div
        key={item.id + index}
        className={`rounded-full color-circle circle_${item.id}`}
        style={{ backgroundColor: color, width: w, height: h }}
        id={item.id + index}
        onClick={() => {
          if (item.colors[0] !== color) {
            setImgColor(color);
          } else {
            setImgColor(
              rgbToHex(primaryColor.r, primaryColor.g, primaryColor.b)
            );
          }
          document.getElementById(item.id + index).style.border =
            "3px solid #fff";
          document.querySelectorAll(`.circle_${item.id}`).forEach((el) => {
            if (el.id !== item.id + index) {
              el.style.border = "none";
            }
          });
        }}
      />
    ));
    return colors;
  }

  return (
    <div className={`h-[100%] w-[100%] transition all duration-300`} id="main">
      <Layout
        color={
          imgColor === null
            ? rgbToHex(primaryColor.r, primaryColor.g, primaryColor.b)
            : imgColor
        }
      >
        <div className="flex flex-center">
          <div className="flex flex-col items-start w-max">
            <h1
              className="text-7xl font-bold tracking-wide text-white text-center mt-10"
              id="text-data"
            >
              {itemData.name}
            </h1>
            <p className="text-white text-2xl font-thin mt-2" id="text-data">
              Model: {itemData.model}
            </p>
          </div>
        </div>

        <div className="main-info flex flex-row justify-around mt-32 pb-16">
          <div className="relative p-10 pr-20 pl-48 rounded-sm" id="img-bg">
            {itemData.discount && (
              <div
                className="absolute flex-center right-0 top-0 w-[100px] h-[40px] "
                id="discount"
              >
                <p className="text-xl font-bold text-white">
                  -{itemData.discount}%
                </p>
              </div>
            )}
            <div className="flex flex-col absolute gap-10 left-10 top-[30%]">
              {drawColors(itemData, 50, 50)}
            </div>
            <Image
              src={itemData.image[itemData.colors[0]]}
              width={itemData.width * 1.8}
              height={itemData.height}
              id="item-image"
            />
          </div>
          <div className="mr-20">
            <div className="flex flex-row flex-between gap-10">
              <button
                className="item-tabs-sections text-3xl
                  border-b-4 border-white text-white"
                onClick={() => {
                  setIsFeedBackActive(false);
                  switchToFeedbackTab();
                }}
              >
                Item information
              </button>
              <button
                className="item-tabs-sections text-3xl border-b-4 text-[#adacac] border-[#adacac]"
                onClick={() => {
                  setIsFeedBackActive(true);
                  switchToItemTab();
                }}
              >
                Feedback
              </button>
            </div>
            {!isFeedBackActive ? (
                <div>
                  <div className="p-10 mt-10 rounded-sm" id="description-bg">
                    <p className="text-lg w-[300px]" id="text-data">
                      {itemData.description}
                    </p>
                  </div>
                  <div className="p-5 py-2 mt-5 rounded-sm" id="description-bg">
                    <p
                      className="text-white text-xl flex flex-center flex-row gap-3"
                      id="text-data"
                    >
                      {size ? (
                        <>
                          Your size is:
                          <h2 className="m-0 w-max font-bold">{size}</h2>
                        </>
                      ) : (
                        "Choose your size"
                      )}
                    </p>
                  </div>
                  <div className="flex flex-row flex-between">
                    <button
                      className="p-5 w-[100px] h-[50px] font-bold text-white text-2xl mt-5 rounded-sm flex-center hover:scale-110 transition duration-300"
                      id="size-bg"
                    >
                      M
                    </button>
                    <button
                      className="p-5 w-[100px] h-[50px] font-bold text-white text-2xl mt-5 rounded-sm flex-center hover:scale-110 transition duration-300"
                      id="size-bg"
                    >
                      Xs
                    </button>
                    <button
                      className="p-5 w-[100px] h-[50px] font-bold text-white text-2xl mt-5 rounded-sm flex-center hover:scale-110 transition duration-300"
                      id="size-bg"
                    >
                      L
                    </button>
                  </div>
                </div>
              ) :
              <div className="p-10 mt-10 rounded-sm">
                <p className="text-lg w-[300px]" id="text-data">
                  The best clothes in the world
                </p>
              </div>
            }
            <div className="flex flex-row flex-between gap-5">
              <button
                className="p-5 w-[200px] font-bold text-white text-3xl mt-5 rounded-sm flex-center hover:scale-110 transition duration-300"
                id="buy-bg"
                onMouseOver={() => {
                  document.getElementById("buy-bg").style.backgroundColor =
                    tinycolor(imgColor).isDark()
                      ? tinycolor(imgColor).lighten(30)
                      : tinycolor(imgColor).darken(30);
                }}
                onMouseOut={() => {
                  if (imgColor === "#000000") {
                    document.getElementById("buy-bg").style.backgroundColor =
                      tinycolor(imgColor).lighten(20);
                  } else {
                    document.getElementById("buy-bg").style.backgroundColor =
                      tinycolor(imgColor).isDark()
                        ? tinycolor(imgColor).lighten(0)
                        : tinycolor(imgColor).darken(0);
                  }
                }}
              >
                Buy
              </button>
              <div
                className="p-5 w-[200px] font-bold text-white text-3xl mt-5 rounded-sm flex-center"
                id="price-bg"
              >
                32,99$
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

async function getData() {
  return data;
}

export const getStaticPaths = async () => {
  const data = await getData();
  const pathsWithParams = data.map((item) => ({
    params: { productId: item.id }
  }));

  return {
    paths: pathsWithParams,
    fallback: false
  };
};

export default BuyPage;
