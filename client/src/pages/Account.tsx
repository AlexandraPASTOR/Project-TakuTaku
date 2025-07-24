import Abonnement from "../components/Abonnement/Abonnement";
import ProfilePicture from "../components/Account/ProfilePicture";
import ProfileSettings from "../components/Account/ProfileSettings";

function Account() {
  return (
    <section className="mx-6 mt-20 md:mt-0 flex flex-col items-center justify-center gap-4">
      <h1 className="text-tertiary text-3xl pt-6 text-center uppercase">
        Mon compte
      </h1>
      <ProfilePicture />
      <ProfileSettings />
      <div className="w-full mt-6">
      <Abonnement />
      </div>
    </section>
  );
}

export default Account;
