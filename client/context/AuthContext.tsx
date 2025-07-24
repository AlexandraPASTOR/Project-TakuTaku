import { createContext, useContext, useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";

// Typage des données du context
export type Auth = {
  mail: string;
  password: string;
};

// Typage du context User
type LoginContextType = {
  connected: boolean;
  setConnected: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogin: (auth: Auth) => Promise<void>;
  handleLogOut: () => void;
  loading: boolean;
  checkAuth: () => Promise<void>;
};

const AuthContext = createContext<LoginContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const { setUser } = useUserContext();


  const checkAuth = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/connected`, 
        {
          credentials: "include",
        });
      if (response.status === 401) {
        setUser(null);
        setConnected(false);
        return;
      }
      if (!response.ok) {
        throw new Error("Utilisateur non authentifié");
      }
      const data = await response.json();
        setUser({
          ...data,
          is_admin: Boolean(data.is_admin),
          is_actif: Boolean(data.is_actif),
        });
        setConnected(true);
    } catch (error) {
      setUser(null);
      setConnected(false);
      console.error("❌ Erreur lors de la vérification de l'authentification :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  checkAuth();
}, []);

  // Fonction qui gère la connexion de l'utilisateur
  const handleLogin = async ({ mail, password }: Auth) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ mail, password }),
        },
      );

      if (!response.ok) {
        throw new Error("Email ou mot de passe incorrect");
      }
      await checkAuth(); // Vérifie l'authentification après la connexion
    } catch (error) {
      console.error("❌ Erreur lors de la connexion :", error);
      setUser(null);
      setConnected(false);
    }
  };

  const handleLogOut = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signout`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Déconnexion échouée");
      }
      setUser(null);
      setConnected(false);
      window.location.href = "/";
    } catch (error) {
      console.error("❌ Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        connected,
        setConnected,
        handleLogin,
        handleLogOut,
        loading,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Création du hook personnalisé
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext doit être utilisé dans un AuthProvider");
  }
  return context;
};
