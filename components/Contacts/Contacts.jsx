import Image from "next/image";
import Reveal from "../Reveal";

const Contacts = () => {
  return (
    <div className="bg-[#132A2D] pb-32" id="contacts">
      <Reveal>
        <h1 className="heading-text md:text-8xl text-center text-blue-50 pt-20">
          Contacts
        </h1>
        <p className="desc md:text-2xl  text-center mt-2 mr-10 font-thin pb-20">
          Your questions - our answers
        </p>
      </Reveal>
      <div className="flex-wrap basis-[300px] flex justify-center flex-row gap-5 px-10">
        <Reveal
          isCentered={true}
          isFull={false}
          styles="card start max-width justify-center py-10 border-b-2 border-b-[#DDC7A0] px-10"
          delay={0.1}
        >
          <div className="flex flex-col items-center gap-10">
            <div className="flex-center w-[150px] h-[150px] bg-[#DDC7A0] rounded-full">
              <Image src="/assets/icons/phone.svg" width={60} height={70} />
            </div>
            <h3 className="text-6xl text-[#CAE1E6]">Call</h3>
            <p className="desc md:text-2xl  text-center font-thin">
              Monday-Friday, 9am-6pm
            </p>
            <div className="flex flex-col w-full mt-5">
              <div className="flex flex-row gap-5 items-center">
                <Image
                  src="/assets/images/ukraine-flag.png"
                  width={32}
                  height={32}
                />
                <p className="text-2xl text-white">+380457894743</p>
              </div>

              <div className="flex flex-row gap-5 items-center mt-5">
                <Image
                  src="/assets/images/polish-flag.png"
                  width={32}
                  height={32}
                />
                <p className="text-2xl text-white">+48749294720</p>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal
          isCentered={true}
          isFull={false}
          styles="card start max-width  justify-center py-10 border-b-2 border-b-[#A0B6DD] px-10"
          delay={0.2}
        >
          <div className="flex flex-col items-center gap-10">
            <div className="flex-center w-[150px] h-[150px] bg-[#A0B6DD] rounded-full">
              <Image src="/assets/icons/location.svg" width={60} height={70} />
            </div>
            <h3 className="text-6xl text-[#CAE1E6]">Visit</h3>
            <p className="desc md:text-2xl  text-center font-thin">
              We are glad to see you here
            </p>
            <div className="flex flex-col w-full mt-5">
              <div className="flex flex-row gap-5 items-center">
                <p className="text-lg md:text-2xl text-white">
                  Kyiv: Kreschatyk 5, 42100
                </p>
              </div>

              <div className="flex flex-row gap-5 items-center mt-5">
                <p className="text-lg md:text-2xl text-white">
                  Warshaw: Daszyńskiego 13, 56799
                </p>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal
          isCentered={true}
          isFull={false}
          styles="card start max-width justify-center py-10 border-b-2 border-b-[#A0D5DD] px-10"
          delay={0.3}
        >
          <div className="flex flex-col items-center gap-10">
            <div className="flex-center w-[150px] h-[150px] bg-[#A0D5DD] rounded-full">
              <Image src="/assets/icons/mail.svg" width={60} height={70} />
            </div>
            <h3 className="text-6xl text-[#CAE1E6]">Type</h3>
            <p className="desc md:text-2xl  text-center font-thin">
              Our team is ready to help you
            </p>
            <div className="flex flex-col w-full mt-5 gap-5">
              <p className="text-xl md:text-2xl text-white">
                stone.questions@gmail.com
              </p>
              <p className="text-xl  md:text-2xl text-white">
                stone.support@gmail.com
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default Contacts;
