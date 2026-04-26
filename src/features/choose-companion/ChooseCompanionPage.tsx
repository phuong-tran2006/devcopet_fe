import { useState } from "react";
import { EGGS_DATA } from "./constants"; // Chỉnh lại đường dẫn vì cùng thư mục
import EggCard from "./EggCard"; // Chỉnh lại đường dẫn vì cùng thư mục

export default function ChooseCompanionPage() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="companion-container">
      <h1 className="text-5xl font-medium text-gray-900 mb-8">
        Choose Your Companion
      </h1>
      <p className="text-gray-500">
        Select an egg to hatch your coding companion
      </p>

      <div className="egg-grid-layout">
        {EGGS_DATA.map((egg) => (
          <EggCard
            key={egg.id}
            {...egg}
            isSelected={selected === egg.id}
            onSelect={setSelected}
          />
        ))}
      </div>

      <button className="btn-back">← Back</button>
    </div>
  );
}
