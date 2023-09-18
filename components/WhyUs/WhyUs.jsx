import Cards from "./Cards";
import "@/styles/why-us.css";

const WhyUs = () => {
  return (
    <div className="bg-[#132A2D] pb-32" id="why-us">
      <h1 className="heading-text md:text-8xl text-center text-blue-50 pt-20">
        Why us
      </h1>
      <p className="desc md:text-2xl  text-center mt-2 ml-5 font-thin pb-20">
        Because you deserve the best!
      </p>
      <Cards />
    </div>
  );
};

export default WhyUs;
