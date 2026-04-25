import React, { useState } from "react";
import "./App.css";
import EggCard from "./components/Login/EggCard";

import fireEgg from "./assets/fire.png";
import waterEgg from "./assets/water.png";
import plantEgg from "./assets/plant.png";

const eggs = [
  {
    id: 1,
    name: "Fire Dragon",
    desc: "Analyzes code errors in real-time",
    img: fireEgg,
  },
  {
    id: 2,
    name: "Water Spirit",
    desc: "Provides contextual hints",
    img: waterEgg,
  },
  {
    id: 3,
    name: "Forest Guardian",
    desc: "Protects your score streak",
    img: plantEgg,
  },
];

function App() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="container">
      <h1>Choose Your Companion</h1>
      <p className="subtitle">Select an egg to hatch your coding companion</p>

      <div className="egg-grid">
        {eggs.map((egg) => (
          <EggCard
            key={egg.id}
            id={egg.id}
            name={egg.name}
            desc={egg.desc}
            img={egg.img}
            isSelected={selected === egg.id}
            onSelect={setSelected}
          />
        ))}
      </div>

      <button className="back-btn">← Back</button>
    </div>
  );
}

export default App;
