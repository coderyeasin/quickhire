"use client";
import HeroSection from "../HeroSection/HeroSection";
import SupportCompany from "../SupportCompany/SupportCompany";
import Categories from "../Categories/Categories";
import FeaturedJobs from "../FeaturedJobs/FeaturedJobs";
import LatestJobs from "../LatestJobs/LatestJobs";

const HomePage = () => {
  return (
    <section className="bg-white">
      <div
        className={`w-full h-200 bg-[#F8F8FD] bg-[url(/images/hero/Pattern.png)] bg-no-repeat bg-contain bg-right 
        ${" lg:[clip-path:polygon(0_0,100%_0,100%_60%,67%_100%,0_100%)]"}
        `}
      >
        <HeroSection />
      </div>

      <SupportCompany />
      <Categories />
      <FeaturedJobs />
      <LatestJobs />
    </section>
  );
};

export default HomePage;
