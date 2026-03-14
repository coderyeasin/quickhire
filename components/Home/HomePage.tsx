import React from "react";
import Header from "../Header/Header";
import HeroSection from "../HeroSection/HeroSection";
import SupportCompany from "../SupportCompany/SupportCompany";
import Categories from "../Categories/Categories";
import FeaturedJobs from "../FeaturedJobs/FeaturedJobs";
import LatestJobs from "../LatestJobs/LatestJobs";
import Footer from "../Footer/Footer";

const HomePage = () => {
  return (
    <section className="bg-white">
      <div className="w-full h-196 bg-[#F8F8FD] bg-[url(/images/hero/Pattern.png)] bg-no-repeat bg-contain bg-right [clip-path:polygon(0_0,100%_0,100%_60%,67%_100%,0_100%)]">
        <Header />
        <HeroSection />
      </div>
      <SupportCompany />
      <Categories />
      <FeaturedJobs />
      <LatestJobs />
      <Footer />
    </section>
  );
};

export default HomePage;
