import TopHeader from "../molecules/THeader";
import Header from "../molecules/Header";
import Footer from "../molecules/Footer";
import { Outlet } from "react-router-dom";
export default function Public() {
  return (
    <>
      <header>
        <TopHeader />
        <Header />
      </header>      
        <Outlet />
      <Footer />
    </>
  );
}
