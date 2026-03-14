import Image from "next/image";

const SupportCompany = () => {
  return (
    <section className="container-layout py-14">
      <div className="space-y-10">
        <h3 className="font-epilogue text-lg leading-[160%] text-second-gray/50">
          Companies we helped grow
        </h3>
        <div className="flex flex-wrap lg:flex-row justify-between items-center">
          <Image
            width={108}
            height={20}
            src="/images/suprt-company/vodafone-logo.png"
            alt="vodafone"
            priority
          />
          <Image
            width={108}
            height={20}
            src={`/images/suprt-company/intel-3.png`}
            alt="Intel"
            priority
          />
          <Image
            width={108}
            height={20}
            src={`/images/suprt-company/tesla-91.png`}
            alt="Tesla"
            priority
          />
          <Image
            width={108}
            height={20}
            src={`/images/suprt-company/amd-logo-1.png`}
            alt="Amd"
            priority
          />
          <Image
            width={108}
            height={20}
            src={`/images/suprt-company/talkit.png`}
            alt="Talkit"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default SupportCompany;
