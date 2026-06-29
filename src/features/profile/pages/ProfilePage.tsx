import React, { useEffect } from "react";
import ProfileHeader from "../components/ProfileHeader";
import PetCard from "../components/PetCard";
import { ProfileSettings } from "../components/ProfileSettings";
import { AccountSecurity } from "../components/AccountSecurity";
import { AppPreferences } from "../components/AppPreferences";
import { useTheme } from "../../../contexts/ThemeContext";
import MissionPanel from "../components/MissionPanel";

const ProfilePage = () => {
  const { theme } = useTheme();

  useEffect(() => {
    document.title = "Profile | Devcopet";
  }, []);

  return (
    <main className="min-h-screen bg-background text-on-surface px-4 py-6 md:px-8 lg:px-10 pb-24 transition-colors duration-300">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-6 xl:grid-cols-12 xl:items-start">
        <section className="xl:col-span-12">
          <ProfileHeader />
        </section>

        <section className="space-y-6 xl:col-span-7">
          <ProfileSettings theme={theme} />
          <MissionPanel />
          <AccountSecurity theme={theme} />
        </section>

        <aside className="space-y-6 xl:col-span-5">
          <AppPreferences theme={theme} toggleTheme={() => {}} />
          <PetCard />
        </aside>
      </div>
    </main>
  );
};

export default ProfilePage;
