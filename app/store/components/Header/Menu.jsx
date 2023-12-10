import "@/styles/animations.css";
import { DEFAULT_MENU_COLOR, generateTints } from "@/utils/colors";
import { useEffect } from "react";
import tinycolor from "tinycolor2";

const Menu = ({ menuColor }) => {
  useEffect(() => {
    if (menuColor === DEFAULT_MENU_COLOR) {
      document.getElementById("items-wrapper").style.backgroundColor =
        menuColor;
    } else {
      document.getElementById("items-wrapper").style.backgroundColor =
        tinycolor(menuColor).isDark()
          ? tinycolor(menuColor).lighten(5)
          : tinycolor(menuColor).darken(10);
    }
  }, [menuColor]);
  return (
    <div
      className="absolute top-[105px] left-64 w-1/2 pl-10 text-white rounded-[10px] max-[1100px]:w-full max-[1100px]:left-0 z-20"
      id="items-wrapper"
    >
      <div className="menu-card flex justify-around hidden" id="men-items">
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-2xl max-[540px]:text-xl">Tops</h3>
          <p className="menu-item">Shirts</p>
          <p className="menu-item">T-Shirts</p>
          <p className="menu-item">Longsleeves</p>
          <p className="menu-item">Hoodies</p>
          <p className="menu-item">Sweetshirts</p>
          <p className="menu-item">Jackets</p>
          <p className="menu-item">Coats</p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-2xl max-[540px]:text-xl">Bottoms</h3>
          <p className="menu-item">Trousers</p>
          <p className="menu-item">Jeans</p>
          <p className="menu-item">Shorts</p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-2xl max-[540px]:text-xl">Additions</h3>
          <p className="menu-item">Ties</p>
          <p className="menu-item">Socks</p>
          <p className="menu-item">Glowes</p>
          <p className="menu-item">Hats</p>
          <p className="menu-item">Underwear</p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-2xl max-[540px]:text-xl">
            Accessories
          </h3>
          <p className="menu-item">Belts</p>
          <p className="menu-item">Ties</p>
          <p className="menu-item">Wallets</p>
          <p className="menu-item">Backpacks</p>
        </div>
      </div>
      <div className="menu-card flex justify-around hidden" id="women-items">
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-2xl max-[540px]:text-xl">Tops</h3>
          <p className="menu-item">Dresses</p>
          <p className="menu-item">Skirts</p>
          <p className="menu-item">Cardigans</p>
          <p className="menu-item">Blazers</p>
          <p className="menu-item">T-Shirts</p>
          <p className="menu-item">Longsleeves</p>
          <p className="menu-item">Hoodies</p>
          <p className="menu-item">Sweetshirts</p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-2xl max-[540px]:text-xl">Bottoms</h3>
          <p className="menu-item">Trousers</p>
          <p className="menu-item">Jeans</p>
          <p className="menu-item">Shorts</p>
          <p className="menu-item">Leggins</p>
          <p className="menu-item">Culottes</p>
          <p className="menu-item">Flare pantss</p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-2xl max-[540px]:text-xl">Additions</h3>
          <p className="menu-item">Scarves</p>
          <p className="menu-item">Socks</p>
          <p className="menu-item">Glowes</p>
          <p className="menu-item">Hats</p>
          <p className="menu-item">Undergarments</p>
          <p className="menu-item">Sunglasses</p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-2xl max-[540px]:text-xl">
            Accessories
          </h3>
          <p className="menu-item">Scarves</p>
          <p className="menu-item">Belts</p>
          <p className="menu-item">Wallets</p>
          <p className="menu-item">Backpacks</p>
          <p className="menu-item">Handbags</p>
        </div>
      </div>
      <div
        className="menu-card flex justify-around hidden max-[540px]:gap-4"
        id="kids-items"
      >
        <div className="flex flex-col gap-2 ">
          <h3 className="font-bold text-2xl max-[540px]:text-xl">Tops</h3>
          <p className="menu-item  max-[540px]:text-xl:text-sm">Shirts</p>
          <p className="menu-item">T-Shirts</p>
          <p className="menu-item">Longsleeves</p>
          <p className="menu-item">Hoodies</p>
          <p className="menu-item">Sweetshirts</p>
          <p className="menu-item">Jackets</p>
          <p className="menu-item">Coats</p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-2xl max-[540px]:text-xl">Bottoms</h3>
          <p className="menu-item">Trousers</p>
          <p className="menu-item">Jeans</p>
          <p className="menu-item">Shorts</p>
          <p className="menu-item">Sport pants</p>
          <p className="menu-item">Cargo shorts</p>
          <p className="menu-item">Track pants</p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-2xl max-[540px]:text-xl">Additions</h3>
          <p className="menu-item">Ties</p>
          <p className="menu-item">Socks</p>
          <p className="menu-item">Glowes</p>
          <p className="menu-item">Hats</p>
          <p className="menu-item">Underwear</p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-2xl max-[540px]:text-xl">
            Accessories
          </h3>
          <p className="menu-item">Belts</p>
          <p className="menu-item">Ties</p>
          <p className="menu-item">Backpacks</p>
        </div>
      </div>
    </div>
  );
};

export default Menu;
