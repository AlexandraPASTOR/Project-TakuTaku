import Note from "../../components/Anime/Note";
import WatchButton from "../../components/Watch/WatchButton";
import { useAnimeContext } from "../../../context/AnimeContext";

function DesktopAnime() {
  const { animeSelected } = useAnimeContext();

  if (!animeSelected) {
    return (
      <div className="text-tertiary text-center mt-10">
        <p>Aucun anime sélectionné.</p>
      </div>
    );
  }
  return (
    <section className="hidden lg:block text-tertiary">
      <section className="relative flex flex-col justify-center items-center gap-2">
        <img
          src={animeSelected.landscape}
          alt={animeSelected.title}
          className="w-full object-cover lg:h-[250px] xl:h-[350px] blur-[1px]"
        />

        {/* Calque dégradé noir à gauche */}
        <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-black to-transparent" />

        <div className="absolute left-20 xl:left-30 flex flex-col gap-2">
          <p className="font-bold">{animeSelected.genre?.name}</p>
          <h1 className="text-4xl uppercase">{animeSelected.title}</h1>
          <p className="text-sm">Année de sortie : {animeSelected.date}</p>
        </div>
      </section>

      <section className="flex my-8 mx-20 xl:mx-40 2xl:mx-60 gap-8">
        <img
          src={animeSelected.portrait}
          alt={animeSelected.title}
          className="w-[190px] object-cover border-1 border-tertiary"
        />
        <div className="flex flex-col justify-between">
          <div className="">
            <p className="mb-4 text-sm leading-relaxed">
              {animeSelected.synopsis}
            </p>
            <ul className="flex gap-5">
              {animeSelected.types?.map((type) => (
                <li key={type.id} className="border-1 rounded-full px-2 py-1">
                  {type.name}
                </li>
              ))}
            </ul>
          </div>
          <WatchButton anime={animeSelected} />
        </div>
        <div>
          <Note />
        </div>
      </section>
    </section>
  );
}

export default DesktopAnime;
