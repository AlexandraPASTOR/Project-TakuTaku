import { useEffect, useState } from "react";
import { useUserContext } from "../../../context/UserContext";
import type { User } from "../../../context/UserContext";

type ProfilPicture = {
  id: number;
  url: string;
};

function ProfilePicture() {
  const [choosePicture, setChoosePicture] = useState(false);
  const { user, setUser } = useUserContext();
  const [profilePictures, setProfilePictures] = useState<ProfilPicture[]>([]);
  const [urlPicture, setUrlPicture] = useState("");
  const [selectedPicture, setSelectedPicture] = useState<number | null>(
    user?.profilpicture_id || null,
  );

  // Pour l'affichage de la picture selon le user
  useEffect(() => {
    const getUrlPicture = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/profilpicture/${user?.id}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "content-type": "application/json",
            },
          },
        );
        const urlPicture = await response.json();
        const url = urlPicture.url;
        setUrlPicture(url);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'URL de la photo de profil",
          error,
        );
        setUrlPicture("");
      }
    };
    if (user) {
      getUrlPicture();
      setSelectedPicture(user.profilpicture_id);
    }
  }, [user]);

  // Pour l'affichage des pictures
  useEffect(() => {
    const getProfilPictures = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/profilpicture`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );
        const profilPicture = await response.json();
        setProfilePictures(profilPicture);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des photos de profil",
          error,
        );
        setProfilePictures([]);
      }
    };
    getProfilPictures();
  }, []);

  // Pour la sélection de la picture : on vérifie si l'url de la picture correspond à une picture de la liste
  // et on met à jour l'ID de la picture sélectionnée
  useEffect(() => {
    setSelectedPicture(
      profilePictures.find((picture) => picture.url === urlPicture)?.id ?? null,
    );
  }, [urlPicture, profilePictures]);

  // Pour la modification de la picture
  const handlePictureChange = async (user: User, profilpicture_id: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/profilpicture`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: user?.id,
            profilpicture_id: profilpicture_id,
          }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        setUser({ ...user, profilpicture_id: data.profilpicture_id });
        setSelectedPicture(profilpicture_id);
      }
      setChoosePicture(true);
    } catch (error) {
      console.error("Erreur lors du changement de la photo de profil", error);
    }
  };

  return (
    <>
      {urlPicture && (
        <img
          src={urlPicture}
          alt="Profile Pic"
          className="rounded-full w-20 h-20 border-2 border-tertiary"
        />
      )}
      <button
        type="button"
        onClick={() => setChoosePicture(true)}
        className="rounded-full bg-secondary my-2 p-2 cursor-pointer hover:scale-110 transition-transform duration-300"
      >
        Modifier ma photo de profil
      </button>
      {choosePicture && (
        <div className="fixed inset-0 bg-primary bg-opacity-50 z-50 flex justify-center items-center">
          <div className="rounded-xl shadow-lg p-6 w-[90%] max-w-md">
            <h2 className="text-lg mb-4 text-center text-tertiary">
              Choisis ta photo de profil
            </h2>
            <div className="flex flex-wrap justify-center gap-4 max-h-[300px] overflow-y-auto mb-6">
              {profilePictures.map((picture) => (
                <article key={picture.id}>
                  <img
                    src={picture.url}
                    alt="ProfilePicture"
                    className={`w-20 h-20 rounded-full border-2 hover:border-secondary transition cursor-pointer ${
                      picture.id === selectedPicture
                        ? "border-secondary"
                        : "border-transparent"
                    }`}
                    onClick={() => {
                      if (user) {
                        handlePictureChange(user, picture.id);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        if (user) {
                          handlePictureChange(user, picture.id);
                        }
                      }
                    }}
                  />
                </article>
              ))}
            </div>
            <button
              type="button"
              className="bg-[var(--color-secondary)] text-[var(--color-primary)] py-1 px-4 rounded-full font-medium hover:opacity-90 mx-auto block hover:scale-110 transition-transform duration-300"
              onClick={() => setChoosePicture(false)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ProfilePicture;
