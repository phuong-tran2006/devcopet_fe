import React, { useEffect } from "react";
import ProfileHeader from "../components/ProfileHeader";
import PetCard from "../components/PetCard";
import DailyQuests from "../components/DailyQuests";
import SkillMastery from "../components/SkillMastery";
import ActiveWorlds from "../components/ActiveWorlds";
import LeaderboardWidget from "../components/LeaderboardWidget";

const ProfilePage = () => {
  useEffect(() => {
    document.title = "Arena | Devcopet";
  }, []);

  return (
    <main className="min-h-screen bg-background text-on-surface p-6 md:p-10 lg:p-14 pb-24 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto">
        <ProfileHeader />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          {/* Left Column: Pet Info (approx 4/12 width) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <PetCard />
          </div>

          {/* Middle/Right Column: Quests, Skills, Worlds, Leaderboard (approx 8/12 width) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <DailyQuests />
              <div className="flex flex-col gap-6 w-full">
                <SkillMastery />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ActiveWorlds />
              <LeaderboardWidget />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
