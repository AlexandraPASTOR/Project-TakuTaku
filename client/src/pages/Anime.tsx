import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAnimeContext } from "../../context/AnimeContext";
import type { Anime } from "../../context/AnimeContext";
import DesktopAnime from "../components/Anime/DesktopAnime";
import MobileAnime from "../components/Anime/MobileAnime";

function Anime() {
  const { id } = useParams(); // Recupère l'ID de l'anime depuis l'URL
  const { animeSelected, setAnimeSelected, getAnimebyId } = useAnimeContext();

  useEffect(() => {
    if (id) {
      getAnimebyId(Number(id)).then((data) => {
        if (data) {
          setAnimeSelected(data);
        }
      });
    }
  }, [id]);

  if (!animeSelected) {
    return (
      <div className="text-tertiary text-center mt-10">
        <p>Aucun anime sélectionné.</p>
      </div>
    );
  }

  return (
    <>
      <MobileAnime />
      <DesktopAnime />
    </>
  );
}

export default Anime;
