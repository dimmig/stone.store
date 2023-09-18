import Header from "@/components/Header/Header";
import About from "@/components/About/About";
import Clothes from "@/components/Сlothes/Clothes";
import WhyUs from "@/components/WhyUs/WhyUs";
import App from "@/components/App/App";
import Contacts from "@/components/Contacts/Contacts";

export default function Home() {
  return (
    <div>
      <Header />
      <About />
      <Clothes />
      <WhyUs />
      <App />
      <Contacts />
    </div>
  );
}
