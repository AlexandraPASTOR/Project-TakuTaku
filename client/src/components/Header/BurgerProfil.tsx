import { Link, useLocation } from "react-router-dom";
import LogOutButton from "./LogOutButton";
import { useUserContext } from "../../../context/UserContext";

function BurgerProfil({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const location = useLocation();
  const isAccountPage = location.pathname === "/account";
  const isHistoryPage = location.pathname === "/history";
  const isAdminPage = location.pathname === "/admin";
  const { user } = useUserContext();
  const isAdmin = user?.is_admin === true;

  return (
    <nav
      className={`
        fixed top-0 right-0 h-full w-40 z-40
        bg-[var(--color-primary)] text-tertiary
        transform transition-transform duration-300 border-l border-secondary
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
    >
      <button
        onClick={onClose}
        aria-label="Fermer le menu"
        className="absolute top-4 right-4 text-2xl text-tertiary cursor-pointer"
      >
        <span className="absolute  h-0.5 w-8 bg-tertiary rotate-45 top-4 right-0" />
        <span className="absolute  h-0.5 w-8 bg-tertiary -rotate-45 top-4 right-0" />
      </button>

      <ul className="mt-10 px-4 text-right">
        <Link to="/account" onClick={onClose}>
          <li
            className={`mt-20  ${isAccountPage ? "text-secondary" : "hover:text-secondary"}`}
          >
            MON COMPTE
          </li>
        </Link>
        <Link to="/history" onClick={onClose}>
          <li
            className={`pt-4  ${isHistoryPage ? "text-secondary" : "hover:text-secondary"}`}
          >
            HISTORIQUE
          </li>
        </Link>
        {isAdmin && (
          <Link to="/admin" onClick={onClose}>
            <li
              className={`pt-4  ${isAdminPage ? "text-secondary" : "hover:text-secondary"}`}
            >
              ADMIN
            </li>
          </Link>
        )}
        <li className="pt-4 hover:text-secondary">
          <LogOutButton />
        </li>
      </ul>
    </nav>
  );
}

export default BurgerProfil;
