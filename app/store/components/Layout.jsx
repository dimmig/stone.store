import Footer from "../Footer/Footer";
import Header from "./Header/Header";

const Layout = ({ children, color }) => {
  return (
    <>
      <Header headerColor={color} />
      {children}
      <Footer footerColor={color} />
    </>
  );
};

export default Layout;
