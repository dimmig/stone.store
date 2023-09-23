const Menu = () => {
  return (
    <div
      className="absolute top-[105px] left-64 bg-[#9DB2BF] w-1/2 pl-10 text-white rounded-[10px]"
      id="items-wrapper"
    >
      <div className="flex justify-around hidden" id="men-items">
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-2xl">Tops</h3>
          <p>Shirts</p>
          <p>T-Shirts</p>
          <p>Longsleeves</p>
          <p>Hoodies</p>
          <p>Sweetshirts</p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-2xl">Bottoms</h3>
          <p>Trousers</p>
          <p>Jeans</p>
          <p>Shorts</p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-2xl">Additions</h3>
          <p>Ties</p>
          <p>Socks</p>
          <p>Glowes</p>
          <p>Hats</p>
          <p>Underwear</p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-2xl">Accessories</h3>
          <p>Belts</p>
          <p>Ties</p>
          <p>Wallets</p>
          <p>Backpacks</p>
        </div>
      </div>
      <div className="flex justify-around hidden" id="women-items">
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-2xl">Tops</h3>
          <p>Dresses</p>
          <p>Skirts</p>
          <p>Cardigans</p>
          <p>Blazers</p>
          <p>T-Shirts</p>
          <p>Longsleeves</p>
          <p>Hoodies</p>
          <p>Sweetshirts</p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-2xl">Bottoms</h3>
          <p>Trousers</p>
          <p>Jeans</p>
          <p>Shorts</p>
          <p>Leggins</p>
          <p>Culottes</p>
          <p>Flare pantss</p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-2xl">Additions</h3>
          <p>Scarves</p>
          <p>Socks</p>
          <p>Glowes</p>
          <p>Hats</p>
          <p>Undergarments</p>
          <p>Sunglasses</p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-2xl">Accessories</h3>
          <p>Scarves</p>
          <p>Belts</p>
          <p>Wallets</p>
          <p>Backpacks</p>
          <p>Handbags</p>
        </div>
      </div>
    </div>
  );
};

export default Menu;
