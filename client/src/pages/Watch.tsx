import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAnimeContext } from "../../context/AnimeContext";
import EpisodeList from "../components/Watch/EpisodeList";
import SeasonList from "../components/Watch/SeasonList";
import SummaryEpisode from "../components/Watch/SummaryEpisode";
import WatchVideo from "../components/Watch/WatchVideo";

type Season = {
  id: number;
  number: number;
  anime_id: number;
};

type Episode = {
  id: number;
  number: number;
  title: string;
  synopsis: string;
  season_id: number;
};

function Watch() {
  const [seasonSelected, setSeasonSelected] = useState<Season | null>(null);
  const [episodeSelected, setEpisodeSelected] = useState<Episode | null>(null);
  const { setAnimeSelected,getAnimebyId } = useAnimeContext();
  const {id} = useParams(); // Récupération de l'ID de l'anime depuis l'URL


useEffect(() => {
  if (id) {
    getAnimebyId(Number(id)).then((anime) => {
      if (anime) {
        setAnimeSelected(anime);
      }
    });
  }
}, [id]);


  // Fonction pour gérer la sélection d'un épisode
  const handleEpisodeSelect = (episode: Episode) => {
    setEpisodeSelected(episode);
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll vers le haut de la page
    }
  };

  return (
    <section className="mx-5 mt-20 md:mt-0 md:mx-15 lg:mx-30 xl:mx-60 2xl:mx-80 3xl:mx-100">
      <WatchVideo episodeSelected={episodeSelected} />
      <SummaryEpisode
        seasonSelected={seasonSelected}
        episodeSelected={episodeSelected}
      />
      <SeasonList onSeasonSelect={setSeasonSelected} />
      <EpisodeList
        seasonSelected={seasonSelected}
        onEpisodeSelect={handleEpisodeSelect}
        episodeSelected={episodeSelected}
      />
    </section>
  );
}

export default Watch;
