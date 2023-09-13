import "@/styles/globals.css";
import "@/styles/header.css";
import Menu from "./Menu";
import Reveal from "./Reveal";

const Header = () => {
  return (
    <div className="header">
      <Reveal>
        <Menu />
        <div className="w-full flex-center flex-col mt-52">
          <div>
            <h1 className="heading-text md:text-8xl stone-color w-max">
              Stone
            </h1>
            <p className="desc md:text-2xl font-normal w-max">
              Sophistication in shades of gray
            </p>
          </div>
        </div>
        <div className="h-2/5 flex-center mt-24">
          <button className="shop-btn stone-color rounded-sm md:w-60 md:h-16 md:text-3xl md:mr-20">
            Shop now
          </button>
        </div>
      </Reveal>
    </div>
  );
};

export default Header;
