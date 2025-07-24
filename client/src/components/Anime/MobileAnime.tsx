import { useAnimeContext } from "../../../context/AnimeContext";
import Note from "../../components/Anime/Note";
import WatchButton from "../../components/Watch/WatchButton";

function MobileAnime() {
  const { animeSelected } = useAnimeContext();

  if (!animeSelected) {
    return (
      <div className="text-tertiary text-center mt-10">
        <p>Aucun anime sélectionné.</p>
      </div>
    );
  }

  return (
    <section className="lg:hidden text-tertiary mt-20 md:mt-0">
      <div className="flex flex-col justify-center items-center gap-2">
        <img
          src={animeSelected.landscape}
          alt={animeSelected.title}
          className="w-full object-cover lg:h-[350px] xl:h-[450px]"
        />
        <p className="text-sm font-semibold mt-2">
          {animeSelected.genre?.name}
        </p>
        <h1 className="text-2xl uppercase text-center mx-8 ">
          {animeSelected.title}
        </h1>
        <p className="text-sm">Année de sortie : {animeSelected.date}</p>
      </div>

      <ul className="flex mx-8 my-5 gap-5 justify-center">
        {animeSelected.types?.map((type) => (
          <li key={type.id} className="border-1 rounded-full px-2 py-1">
            {type.name}
          </li>
        ))}
      </ul>

      <div className="flex justify-center items-center">
        <Note />
      </div>
      <div className="flex flex-col items-center mx-8 my-5 md:mx-20 text-sm leading-relaxed">
        <p className="mb-4">{animeSelected.synopsis}</p>

        <WatchButton anime={animeSelected} />
      </div>
    </section>
  );
}

export default MobileAnime;
