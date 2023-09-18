"use client";
import { useState, useEffect } from "react";
import CountUp from "react-countup";

const Cards = () => {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      });
    });

    document.querySelectorAll(".why-card").forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col flex-center gap-10 mt-16">
      <div className="flex flex-row gap-10 wrapping">
        <div className="why-card bg-[#A0B6DD]">
          <h3 className="title mt-5">
            {inView && <CountUp end={64208} duration={3} />}+
          </h3>
          <p className="subtitle text-center">Happy customers served</p>
        </div>
        <div
          className="why-card decreased bg-[#1D3235] border-b-2 border-white"
          id="card-2"
        >
          <h3 className="title mt-5">
            {inView && <CountUp end={100} duration={4} />}+
          </h3>
          <p className="subtitle text-center">Gray clothes varieties</p>
        </div>

        <div className="why-card bg-[#DDC7A0]">
          <h3 className="title mt-5">
            {inView && <CountUp end={4.82} duration={4} decimals={2} />} /{" "}
            {inView && <CountUp end={5} duration={4} />}
          </h3>
          <p className="subtitle text-center">Average customer rating</p>
        </div>
      </div>
      <div className="flex flex-row gap-10 wrapping">
        <div className="why-card bg-[#1D3235] border-b-2 border-white">
          <h3 className="title mt-5">
            {" "}
            {inView && <CountUp end={10000} duration={4} />}+
          </h3>
          <p className="subtitle text-center">Orders shipped monthly</p>
        </div>
        <div className="why-card decreased bg-[#A0D5DD]">
          <h3 className="title mt-5">
            {" "}
            {inView && <CountUp end={25} duration={5} />}%
          </h3>
          <p className="subtitle text-center">More eco-friendly</p>
        </div>
        <div className="why-card bg-[#1D3235] border-b-2 border-white">
          <h3 className="title mt-5">
            {" "}
            {inView && <CountUp end={13} duration={5} />}
          </h3>
          <p className="subtitle text-center">Locations in lots of cities</p>
        </div>
      </div>
    </div>
  );
};

export default Cards;
