import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// Typage des données du contexte
export type Anime = {
  user_id: number;
  anime_id: number;
  id: number;
  title: string;
  synopsis: string;
  portrait: string;
  date: string;
  landscape: string;
  video: string;
  genre_id: number;
  types?: { id: number; name: string }[];
  genre?: { id: number; name: string };
  type_id?: number;
};

// Typage des fonctions du contexte
type AnimeContextType = {
  anime: Anime[];
  animeSearch: Anime[];
  setAnimeSearch: (animeSearch: Anime[]) => void;
  animeSelected: Anime | null;
  setAnimeSelected: (animeSelected: Anime | null) => void;
  fetchAnimeType: (
    genre: number | string,
    type: number | string,
  ) => Promise<void>;
  fetchAnime: () => Promise<void>;
  getAnimebyId: (id: number) => Promise<Anime | null>;
  createAnime: (anime: Omit<Anime, "id">) => Promise<number>;
  updateAnime: (id: number, data: Partial<Anime>) => Promise<void>;
  deleteAnime: (id: number) => Promise<void>;
};

const AnimeContext = createContext<AnimeContextType | undefined>(undefined);

export const AnimeProvider = ({ children }: { children: React.ReactNode }) => {
  const [anime, setAnime] = useState<Anime[]>([]);
  const [animeSearch, setAnimeSearch] = useState<Anime[]>([]);
  const [animeSelected, setAnimeSelected] = useState<Anime | null>(null);

  useEffect(() => {
    fetchAnime();
  }, []);

  interface FetchAnimeTypeParams {
    genre: number | string;
    type: number | string;
  }

  const fetchAnimeType = useCallback(
    async (
      genre: FetchAnimeTypeParams["genre"],
      type: FetchAnimeTypeParams["type"],
    ): Promise<void> => {
      try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/animetype/${genre}/${type}`,
      );

      if (!response.ok) {
        const errorData = await response.json(); // ← ici, on récupère le message
        console.warn("Avertissement :", errorData.message);
        setAnimeSearch([]); // On vide la liste si rien trouvé
        return;
      }

      const data: Anime[] = await response.json();
      setAnimeSearch(data);
    } catch (error) {
      console.error("Erreur dans fetchAnimeType :", error);
    }
  },
  [],
  );

  const fetchAnime = (): Promise<void> => {
    return fetch(`${import.meta.env.VITE_API_URL}/api/anime`)
      .then((res) => res.json())
      .then((data) => {
        setAnime(data);
      });
  };

  const getAnimebyId = (id: number): Promise<Anime | null> => {
    return fetch(`${import.meta.env.VITE_API_URL}/api/anime/${id}`)
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => data || null);
  };

  const createAnime = (newAnime: Omit<Anime, "id">): Promise<number> => {
    return fetch(`${import.meta.env.VITE_API_URL}/api/anime`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(newAnime),
    })
      .then((res) => res.json())
      .then((data) => {
        fetchAnime();
        return data.insertId;
      });
  };

  const updateAnime = async (
    id: number,
    updateData: Partial<Anime>,
  ): Promise<void> => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/anime/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      },
    );
    if (!response.ok) {
      throw new Error(
        `Erreur lors de la mise à jour de l'anime avec l'ID ${id}`,
      );
    }
    setAnime((prev) =>
      prev.map((anime) =>
        anime.id === id ? { ...anime, ...updateData } : anime,
      ),
    );
  };

  const deleteAnime = async (id: number): Promise<void> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/anime/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!response.ok) {
        throw new Error(
          `Erreur lors de la suppression de l'anime avec l'ID ${id}`,
        );
      }
      const deletedAnime = await response.json();
      setAnime((prev) => prev.filter((anime) => anime.id !== deletedAnime.id));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'anime :", error);
    }
  };

  return (
    <AnimeContext.Provider
      value={{
        anime,
        animeSearch,
        setAnimeSearch,
        animeSelected,
        setAnimeSelected,
        fetchAnimeType,
        fetchAnime,
        getAnimebyId,
        createAnime,
        updateAnime,
        deleteAnime,
      }}
    >
      {children}
    </AnimeContext.Provider>
  );
};

// Création du hook personnalisé
export const useAnimeContext = () => {
  const context = useContext(AnimeContext);
  if (!context) {
    throw new Error("useAnimeContext doit être utilisé dans un AnimeProvider");
  }
  return context;
};
