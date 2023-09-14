import Image from "next/image";
import "@/styles/card.css";
import Reveal from "./Reveal";

const CoreValues = () => {
  return (
    <div className="flex-between">
      <Image
        src="/assets/images/grow-arrow.png"
        alt="grow arraw"
        width={700}
        height={1000}
        className="hidden md:flex md:mt-64 scale-x-125"
      />
      <div className="flex flex-col px-5">
        <Reveal>
          <div className="card sm:flex-row flex-col px-5 gap-5 grow-card">
            <Image
              src="/assets/icons/diamond.svg"
              width={70}
              height={70}
              className="sm:m-5 m-5 mb-0"
              alt="diamond-icon"
            />
            <p className="text-blue-50 p-5 pl-0 text-lg">
              We are committed to delivering excellence in everything we do. We
              continuously strive for the highest standards of quality,
              innovation, and performance. Our pursuit of excellence drives us
              to exceed expectations and achieve outstanding results.
            </p>
          </div>
        </Reveal>
        <Reveal>
          <div className="card sm:flex-row flex-col px-5 gap-5 grow-card">
            <Image
              src="/assets/icons/integrity.svg"
              width={70}
              height={70}
              className="sm:m-5 m-5 mb-0"
              alt="growth-icon"
            />
            <p className="text-blue-50 p-5 pl-0 text-lg">
              Integrity is at the heart of our business. We conduct ourselves
              with honesty, transparency, and ethical behavior. We honor our
              commitments, and our word is our bond. Trust is the cornerstone of
              our relationships, both internally and externally.
            </p>
          </div>
        </Reveal>
        <Reveal>
          <div className="card sm:flex-row flex-col px-5 gap-5 grow-card">
            <Image
              src="/assets/icons/growth.svg"
              width={70}
              height={70}
              className="sm:m-5 m-5 mb-0"
              alt="integrity-icon"
            />
            <p className="text-blue-50 p-5 pl-0 text-lg">
              We embrace creativity and innovation as catalysts for growth. We
              encourage fresh ideas, new perspectives, and continuous
              improvement. By staying at the forefront of industry trends, we
              can adapt, evolve, and lead in a rapidly changing world.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default CoreValues;
