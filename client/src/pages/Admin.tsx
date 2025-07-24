import AnimeManagement from "../components/Admin/AnimeManagement";
import RatingManagement from "../components/Admin/RatingManagement";
import UserManagement from "../components/Admin/UserManagement";

function Admin() {
  return (
    <>
      <h1 className="text-tertiary md:mt-0 mt-20  justify-center text-3xl pt-6 text-center uppercase">
        Tableau de bord
        <br />
        d’administration
      </h1>
      <UserManagement />
      <AnimeManagement />
      <RatingManagement />
    </>
  );
}

export default Admin;
