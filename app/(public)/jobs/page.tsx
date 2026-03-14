import AllJobs from "@/components/Pages/AllJobs/AllJobs";
import Header from "@/components/UI/Header/Header";

const JobsHome = () => {
  return (
    <section className="container-layout">
      <Header />
      <AllJobs />
    </section>
  );
};

export default JobsHome;
