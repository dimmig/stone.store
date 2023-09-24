import Image from "next/image";

const Footer = () => {
  return (
    <div className="bg-[#CFDFEB] w-full py-10">
      <div className="flex-around flex-wrap max-[900px]:gap-16">
        <div className="flex flex-col">
          <h3 className="text-white text-4xl font-bold">Products</h3>
          <div className="flex flex-row gap-10 mt-5">
            <div className="flex flex-col gap-2">
              <p className="text-white text-xl footer-item">Shirt</p>
              <p className="text-white text-xl footer-item">T-shirts</p>
              <p className="text-white text-xl footer-item">Jeans</p>
              <p className="text-white text-xl footer-item">Shorts</p>
              <p className="text-white text-xl footer-item">Socks</p>
              <p className="text-white text-xl footer-item">Belts</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-white text-xl footer-item">Hoodies</p>
              <p className="text-white text-xl footer-item">Sweetshots</p>
              <p className="text-white text-xl footer-item">Jackets</p>
              <p className="text-white text-xl footer-item">Shirts</p>
              <p className="text-white text-xl footer-item">Ties</p>
              <p className="text-white text-xl footer-item">Wallets</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="text-white text-4xl font-bold">Colections</h3>
          <div className="flex flex-row gap-10 mt-5 flex-center">
            <div className="flex flex-col gap-2">
              <p className="text-white text-xl footer-item">Business</p>
              <p className="text-white text-xl footer-item">Casual</p>
              <p className="text-white text-xl footer-item">Winter</p>
              <p className="text-white text-xl footer-item">Autmn</p>
              <p className="text-white text-xl footer-item">Summer</p>
              <p className="text-white text-xl footer-item">Spring</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-center">
          <h3 className="text-white text-4xl font-bold">About us</h3>
          <div className="flex flex-row gap-10 mt-5 flex-center">
            <div className="flex flex-col gap-2 flex-center">
              <p className="text-white text-xl footer-item">Company</p>
              <p className="text-white text-xl footer-item">Founders</p>
              <p className="text-white text-xl footer-item">
                How we produce our clothes
              </p>
              <p className="text-white text-xl footer-item">Media feedback</p>
              <p className="text-white text-xl footer-item">Future plans</p>
              <p className="text-white text-xl footer-item">Privacy policy</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-center">
          <h3 className="text-white text-4xl font-bold">Subscribe us</h3>
          <div className="flex flex-row gap-10 mt-5 flex-center">
            <div className="flex flex-col gap-5 flex-start">
              <div className="flex flex-row gap-5">
                <Image
                  src="assets/icons/insta.svg"
                  width={35}
                  height={35}
                  className="footer-icon"
                  alt="instagram icon"
                />
                <p className="text-white text-xl">Instagram</p>
              </div>
              <div className="flex flex-row gap-5">
                <Image
                  src="assets/icons/facebook.svg"
                  width={35}
                  height={35}
                  className="footer-icon"
                  alt="facebook icon"
                />
                <p className="text-white text-xl">Facebook</p>
              </div>
              <div className="flex flex-row gap-5">
                <Image
                  src="assets/icons/telegram.svg"
                  width={35}
                  height={35}
                  className="footer-icon"
                  alt="telegram icon"
                />
                <p className="text-white text-xl">Telegram</p>
              </div>
              <div className="flex flex-row gap-5">
                <Image
                  src="assets/icons/email.svg"
                  width={35}
                  height={35}
                  className="footer-icon"
                  alt="email icon"
                />
                <p className="text-white text-xl">Write to support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
