import Image from "next/image";
import TestimonialsMobile from "./TestimonialsMobile";
import Reveal from "../Reveal";

const Testimonials = () => {
  return (
    <div>
      {/* Desktop */}
      <div className="hidden md:flex md:flex-row md:justify-center gap-5 md:px-10 md:pb-10">
        <div className="card testimonial-card __right scale-90 blur-sm card-bb-1 testimonial-animatable">
          <div className="flex flex-col">
            <div className="w-full  flex md:flex-row flex-col gap-5 flex-center p-10">
              <div className="user-circle flex-center rounded-full">
                <Image
                  src="assets/icons/user-icon-red.svg"
                  width={40}
                  height={60}
                  alt="user-icon"
                  className="red"
                />
              </div>
              <h3 className="username font-normal ">Dan Brown</h3>
            </div>
            <hr className="w-5/6 color-white p-5" />
            <h4 className="username p-5 pb-0">User friendly app!</h4>
            <p className="desc font-thin p-5">
              Your app is incredibly user-friendly and intuitive. It makes
              shopping a breeze. I appreciate the seamless experience and easy
              navigation. Keep up the great work!
            </p>
          </div>
        </div>
        <div className="card active-card testimonial-card z-10 card-bb-2">
          <div className="flex flex-col">
            <div className="w-full flex  md:flex-row flex-col gap-5 flex-center p-10">
              <div className="user-circle flex-center rounded-full">
                <Image
                  src="assets/icons/user-icon-blue.svg"
                  width={40}
                  height={60}
                  alt="user-icon"
                />
              </div>
              <h3 className="username font-normal">Ann Smith</h3>
            </div>
            <hr className="w-5/6 color-white p-5" />
            <h4 className="username p-5 pb-0">Exceptional Service</h4>
            <p className="desc font-thin p-5">
              I've been a customer for years, and I'm always impressed with the
              level of service I receive. The team goes above and beyond to meet
              my needs. Thank you for your dedication to excellence!
            </p>
          </div>
        </div>
        <div className="card testimonial-card scale-90 __left blur-sm card-bb-3 testimonial-animatable">
          <div className="flex flex-col">
            <div className="w-full  flex  md:flex-row flex-col gap-5 flex-center p-10">
              <div className="user-circle flex-center rounded-full">
                <Image
                  src="assets/icons/user-icon-purple.svg"
                  width={40}
                  height={60}
                  alt="user-icon"
                  className="red"
                />
              </div>
              <h3 className="username font-normal">Peter Pen</h3>
            </div>
            <hr className="w-5/6 color-white p-5" />
            <h4 className="username p-5 pb-0">Responsive Team</h4>
            <p className="desc font-thin p-5">
              I've been a customer for years, and I'm always impressed with the
              level of service I receive. The team goes above and beyond to meet
              my needs. Thank you for your dedication to excellence!
            </p>
          </div>
        </div>
      </div>
      {/* Mobile */}
      <TestimonialsMobile />
    </div>
  );
};

export default Testimonials;
