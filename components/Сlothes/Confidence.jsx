import Image from "next/image";
import Reveal from "../Reveal";

const Confidence = () => {
  return (
    <div className="clothes-secondary-bg pb-32">
      <p className="desc md:text-2xl p-10 mt-16 font-thin">
        Shop with confidence
      </p>
      <div className="flex flex-col px-10 gap-10 mt-10">
        <div className="flex-around gap-10 max-[1100px]:flex-col max-[1100px]:gap-10">
          <Reveal isCentered={true}>
            <div className="secure-card">
              <div className="md:flex md:flex-row md:justify-between md:items-center md:w-full flex-col flex-center gap-5 mt-5 w-full px-10">
                <Image
                  src="/assets/icons/lock.svg"
                  width={44}
                  height={44}
                  alt="secure"
                />
                <h3 className="text-white text-xl md:text-2xl m-auto">
                  Stay secure
                </h3>
              </div>
              <p className="text-white mt-16 px-10">
                Our website is equipped with state-of-the-art security measures
                to safeguard your personal information.
              </p>
            </div>
          </Reveal>
          <Reveal isCentered={true} delay={0.1}>
            <div className="secure-card">
              <div className="md:flex md:flex-row md:justify-between md:items-center md:w-full flex-col flex-center gap-5 mt-5 w-full px-10">
                <Image
                  src="/assets/icons/wallet.svg"
                  width={44}
                  height={44}
                  alt="payments"
                />
                <h3 className="text-white text-xl md:text-2xl m-auto">
                  Payment Options
                </h3>
              </div>
              <p className="text-white mt-16 px-10">
                We accept a variety of payment methods to provide you with
                flexibility and convenience.
              </p>
            </div>
          </Reveal>
        </div>
        <div className="flex-around gap-10 max-[1100px]:flex-col max-[1100px]:gap-10">
          <Reveal isCentered={true} delay={0.2}>
            <div className="secure-card more-height">
              <div className="md:flex md:flex-row md:justify-between md:items-center md:w-full flex-col flex-center gap-5 mt-5 w-full px-10">
                <Image
                  src="/assets/icons/return-arrow.svg"
                  width={44}
                  height={44}
                  alt="returns"
                />
                <h3 className="text-white text-xl md:text-2xl m-auto">
                  Easy Returns
                </h3>
              </div>
              <p className="text-white mt-16 px-10">
                We understand that sometimes a purchase may not meet your
                expectations. That's why we offer a hassle-free returns policy.
                you can return item within 14 days for a full refund or exchange
                if possible
              </p>
            </div>
          </Reveal>
          <Reveal isCentered={true} delay={0.3}>
            <div className="secure-card more-height">
              <div className="md:flex md:flex-row md:justify-between md:items-center md:w-full flex-col flex-center gap-5 mt-5 w-full px-10">
                <Image
                  src="/assets/icons/delivery.svg"
                  width={44}
                  height={44}
                  alt="delivery"
                />
                <h3 className="text-white text-xl md:text-2xl m-auto">
                  Prompt delivery
                </h3>
              </div>
              <p className="text-white mt-16 px-10">
                We know you're excited to receive your new items. We work
                diligently to process and ship your orders as quickly as
                possible. You can track your shipment to stay updated on its
                progress and estimated delivery date.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};

export default Confidence;
