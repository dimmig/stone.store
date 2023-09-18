import Timeline from "./Timeline";
import CoreValues from "./CoreValues";
import Testimonials from "./Testimonials/Testimonials.jsx";
import Reveal from "../Reveal";
import "@/styles/about.css";
import "@/styles/card.css";

const About = () => {
  return (
    <div className="about-bg" id="about">
      <Reveal delay={0}>
        <h1 className="heading-text md:text-8xl text-center text-blue-50 pt-10">
          About us
        </h1>
        <p className="desc md:text-2xl px-10 mt-16 font-thin">
          Crafting timeless elegance
        </p>
      </Reveal>
      <Timeline />
      <Reveal>
        <p className="desc md:text-2xl px-10 mt-16 font-thin">
          Elevating excellence, embracing integrity
        </p>
      </Reveal>
      <CoreValues />
      <Reveal>
        <p className="desc md:text-2xl px-10 mt-16 font-thin">
          Feedback fuels excellence
        </p>
      </Reveal>
      <Reveal>
        <Testimonials />
      </Reveal>
    </div>
  );
};

export default About;
