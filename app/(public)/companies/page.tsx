import CompaniesJobs from "@/components/Pages/CompaniesJobs/CompaniesJobs";

const CompaniesHome = () => {
  return (
    <section className="container-layout min-h-screen py-6 md:py-8 lg:py-10">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-clash text-dark-text mb-6 md:mb-8 lg:mb-10">
        Browse <span className="text-blue-text">Companies</span>
      </h1>
      <CompaniesJobs />
    </section>
  );
};

export default CompaniesHome;
