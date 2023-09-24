import DiscountCards from "./DiscountCards";

const Discounts = () => {
  return (
    <div className="flex flex-col w-full  mt-10 mb-32">
      <h3 className="text-4xl text-[#698294] px-16 mb-10 max-[500px]:px-0">
        Daily discounts
      </h3>
      <div className="bg-[#D9ECEF] py-5 rounded-sm">
        <DiscountCards />
      </div>
    </div>
  );
};

export default Discounts;
