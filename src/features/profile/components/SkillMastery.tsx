import React from "react";

const SkillMastery = () => {
  const skills = [
    { name: "Python", rank: "MASTER II", progress: 85, color: "#85e2d1" },
    { name: "Java", rank: "EXPERT I", progress: 60, color: "#b1d670" },
    { name: "C++", rank: "ARCH IV", progress: 40, color: "#d4a8d4" },
  ];

  return (
    <div className="bg-surface border border-outline/20 rounded-2xl p-6 w-full transition-colors duration-300 shadow-sm">
      <h2 className="text-xl font-bold text-on-surface mb-6 transition-colors duration-300">
        Skill Mastery
      </h2>
      <div className="flex flex-wrap gap-4">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex-1 min-w-[120px] bg-surface-container border border-outline/10 rounded-xl p-4 transition-colors duration-300"
          >
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold text-on-surface transition-colors duration-300">
                {skill.name}
              </span>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider transition-colors duration-300">
                {skill.rank}
              </span>
            </div>
            <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden transition-colors duration-300">
              <div
                className="h-full rounded-full transition-colors duration-300"
                style={{
                  width: `${skill.progress}%`,
                  backgroundColor: skill.color,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillMastery;
