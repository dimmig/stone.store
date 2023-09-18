import Image from "next/image";
import Reveal from "../Reveal";

const Quality = () => {
  return (
    <div>
      <p className="desc md:text-2xl p-10 mt-16 font-thin">
        A commitment to quality
      </p>
      <div className="flex flex-col gap-24 mt-16 max-[1100px]:gap-32 max-[700px]:gap-24">
        <div className="flex-around max-[700px]:flex-col max-[700px]:gap-24">
          <Reveal isCentered={true}>
            <div className="flex flex-row gap-10  max-[1100px]:flex-col max-[1100px]:items-center">
              <Image
                src="assets/icons/tshirt.svg"
                width={100}
                height={100}
                alt="t-shirt"
              />
              <div className="quality-card">
                <div className="flex-around mt-4">
                  <div className="w-12 h-12 rounded-full bg-[#A0D5DD] flex-center">
                    <p className="text-white">100%</p>
                  </div>
                  <h3 className="text-2xl font-bold text-[#A0D5DD]">
                    Organic materials
                  </h3>
                </div>
                <p className=" py-5 px-7 text-white">
                  Our journey begins with the careful selection of fabrics. We
                  source our materials from trusted suppliers renowned for their
                  quality. From the softest cotton to luxurious silks, each
                  fabric is chosen with your comfort and style in mind.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal isCentered={true} delay={0.1}>
            <div className="flex flex-row gap-16  max-[1100px]:flex-col max-[1100px]:items-center max-[1100px]:gap-10">
              <Image
                src="assets/icons/team.svg"
                width={100}
                height={100}
                alt="team"
              />
              <div className="quality-card">
                <div className="flex flex-row gap-7 ml-7 mt-7 ">
                  <div className="w-20 rounded-sm bg-[#A0B6DD] flex-center">
                    <p className="text-white">50+</p>
                  </div>
                  <h3 className="text-2xl font-bold text-[#A0B6DD]">
                    Skilled stuff
                  </h3>
                </div>
                <p className="py-8 px-7 text-white">
                  Our team of skilled tailors and designers brings their
                  expertise to every garment. With an eye for detail and a
                  passion for perfection, they craft each piece to meet our high
                  standards.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
        <div className="flex-around items-center max-[700px]:flex-col max-[700px]:gap-24">
          <Reveal delay={0.2} isCentered={true}>
            <div className="flex flex-row gap-10 max-[1100px]:flex-col max-[1100px]:items-center">
              <Image
                src="assets/icons/search.svg"
                width={100}
                height={100}
                alt="search"
              />
              <div className="quality-card">
                <div className="flex flex-row gap-5 ml-7 mt-7">
                  <div className="w-24 rounded-sm bg-[#DDC7A0] flex-center">
                    <p className="text-white">Each item</p>
                  </div>
                  <h3 className="text-2xl font-bold text-[#DDC7A0]">
                    Quality checks
                  </h3>
                </div>
                <p className="pt-8 px-7 text-white">
                  Before any item finds its way to our shelves, it undergoes
                  rigorous quality control checks. We meticulously inspect each
                  garment for any imperfections, ensuring that what you take
                  home is nothing short of excellence.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal isCentered={true} delay={0.3}>
            <div className="flex flex-row gap-10 max-[1100px]:flex-col max-[1100px]:items-center  max-[1100px]:gap-12">
              <Image
                src="assets/icons/smile.svg"
                width={100}
                height={100}
                alt="satisfaction"
              />
              <div className="quality-card">
                <div className="flex flex-row gap-5 ml-7 mt-7">
                  <div className="w-20 rounded-sm bg-[#DDA0B6] flex-center">
                    <p className="text-white">Matters</p>
                  </div>
                  <h3 className="text-2xl font-bold text-[#DDA0B6]">
                    Your Satisfaction
                  </h3>
                </div>
                <p className="pt-8 px-7 text-white">
                  Your satisfaction is our top priority. Our attentive staff is
                  here to assist you, answer your questions, and ensure your
                  shopping experience is enjoyable. We believe that you should
                  not only love your clothing but also the experience of finding
                  it.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};

export default Quality;
