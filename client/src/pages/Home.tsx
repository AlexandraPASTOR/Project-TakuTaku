import Abonnement from "../components/Abonnement/Abonnement";
import Carousel from "../components/Home/Carousel";

function Home() {
  return (
    <>
      <Carousel />
      <section className="text-tertiary my-4 mx-6">
        <h2 className="text-3xl text-center py-12 px-4 lg:py-20 uppercase">
          Abonnements
        </h2>
        <Abonnement />
      </section>
    </>
  );
}

export default Home;
