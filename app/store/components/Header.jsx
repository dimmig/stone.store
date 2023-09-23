import Image from "next/image";
import Menu from "./Menu";

const Header = () => {
  return (
    <div className="flex-between bg-[#9DB2BF] relative" id="store-header">
      <Image src="/assets/icons/app-logo-white.svg" width={180} height={40} />
      <div className="flex flex-row  text-white text-2xl ml-20">
        <h3 className="cursor-pointer hover:opacity-80" id="men">
          Men
        </h3>
        <h3 className="mx-5">|</h3>
        <h3 className="cursor-pointer hover:opacity-80" id="women">
          Women
        </h3>
        <h3 className="mx-5">|</h3>
        <h3 className="cursor-pointer hover:opacity-80" id="kids">
          {" "}
          Kids{" "}
        </h3>
      </div>
      <div className="flex flex-row gap-2 w-2/5 flex-center">
        <input
          placeholder="Search"
          className="outline-none border-none bg-[#526D82B2] py-2 px-2 text-white rounded-[10px] w-2/4"
        />
        <button className="flex flex-center bg-[#DDE6ED] px-5 py-2 rounded-[10px] hover:bg-[#D7E2EA]">
          <Image src="assets/icons/search.svg" width={20} height={20} />
        </button>
      </div>
      <div className="flex flex-row gap-16 mr-16">
        <Image
          src="assets/icons/purchase.svg"
          width={27}
          height={40}
          alt="purchase-icon"
          className="cursor-pointer hover:opacity-80"
        />
        <Image
          src="assets/icons/heart.svg"
          width={35}
          height={35}
          alt="favourites-icon"
          className="cursor-pointer hover:opacity-80"
        />
        <Image
          src="assets/icons/user-icon-white.svg"
          width={27}
          height={40}
          alt="user-icon"
          className="cursor-pointer hover:opacity-80"
        />
      </div>
      <Image
        src="assets/icons/moon.svg"
        width={35}
        height={35}
        alt="dark-theme-icon"
        className="mx-10 cursor-pointer hover:opacity-80"
      />
      <Menu />
    </div>
  );
};

export default Header;
