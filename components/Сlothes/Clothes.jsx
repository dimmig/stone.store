import "@/styles/clothes.css";
import Collections from "./Collections";
import Quality from "./Quality";
import Confidence from "./Confidence";
import Reveal from "../Reveal";

const Clothes = () => {
  return (
    <div className="clothes-bg" id="clothes">
      <Reveal>
        <h1 className="heading-text md:text-8xl text-center text-blue-50 pt-20">
          Clothes
        </h1>
        <p className="desc md:text-2xl  text-center mt-2 mr-4 font-thin pb-20">
          Discover your own style
        </p>
      </Reveal>
      <Collections />
      <Quality />
      <Confidence />
    </div>
  );
};

export default Clothes;
