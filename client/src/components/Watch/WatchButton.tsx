import { Link, useLocation } from "react-router";
import type { Anime } from "../../../context/AnimeContext";

type Props = {
  anime: Anime;
};

function WatchButton({ anime }: Props) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="mt-2 lg:mt-0 flex ">
      <Link to={`/watch/${anime.id}`}>
        <button
          type="button"
          className="bg-[var(--color-secondary)] text-[var(--color-primary)] py-1 px-4 !rounded-full font-semibold !text-lg cursor-pointer hover:scale-110 transition-transform duration-300"
        >
          {isHomePage ? "COMMENCER À REGARDER" : "LANCER LA VIDÉO"}
        </button>
      </Link>
    </div>
  );
}

export default WatchButton;
