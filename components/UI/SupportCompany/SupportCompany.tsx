import Image from "next/image";

const SupportCompany = () => {
  return (
    <section className="container-layout py-8 md:py-14">
      <div className="space-y-8 md:space-y-10">
        <h3 className="font-epilogue text-base md:text-lg leading-[160%] text-second-gray/50">
          Companies we helped grow
        </h3>
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 md:gap-8">
          <Image
            width={100}
            height={20}
            src="/images/suprt-company/vodafone-logo.png"
            alt="vodafone"
            priority
            className="w-20 md:w-28 h-auto"
          />
          <Image
            width={100}
            height={20}
            src={`/images/suprt-company/intel-3.png`}
            alt="Intel"
            priority
            className="w-20 md:w-28 h-auto"
          />
          <Image
            width={100}
            height={20}
            src={`/images/suprt-company/tesla-91.png`}
            alt="Tesla"
            priority
            className="w-20 md:w-28 h-auto"
          />
          <Image
            width={100}
            height={20}
            src={`/images/suprt-company/amd-logo-1.png`}
            alt="Amd"
            priority
            className="w-20 md:w-28 h-auto"
          />
          <Image
            width={100}
            height={20}
            src={`/images/suprt-company/talkit.png`}
            alt="Talkit"
            priority
            className="w-20 md:w-28 h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default SupportCompany;
