import Image from "next/image";
import HeroJobSearch from "./HeroJobSearch";

const HeroSection = () => {
  return (
    <section className="container-layout relative py-6 md:py-10">
      <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start relative gap-6 md:gap-10">
        <div className="flex flex-col items-start justify-center z-10 space-y-12 py-10 md:py-20 w-full lg:w-1/2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[72px] font-bold text-dark-text leading-tight md:leading-20 font-clash">
            Discover <br /> more than <br />
            <span className="text-blue-text">5000+ Jobs</span>
            <Image
              src="/images/line-shape.png"
              alt="line-shape"
              width={400}
              height={50}
              className="object-contain h-8 md:h-12 mt-2"
              priority
            />
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-primary-gray/70 leading-relaxed md:leading-[160%]">
            Great platform for the job seeker that searching for new career
            heights and passionate about startups.
          </p>
          <HeroJobSearch />
          <p className="text-sm md:text-md font-epilogue text-second-gray/70">
            Popular : UI Designer, UX Researcher, Android, Admin
          </p>
        </div>

        <div className="relative flex justify-center lg:justify-end z-0 w-full lg:w-1/2 py-6 md:py-0">
          <div className="relative lg:absolute lg:translate-y-1/12 w-full h-auto max-w-xs md:max-w-sm lg:max-w-none lg:w-125.25 lg:h-176.75">
            <Image
              src="/images/hero/candidates.png"
              alt="hero"
              fill
              className="object-contain lg:[clip-path:polygon(0_0,100%_0,100%_80%,94%_100%,0_100%)]"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
