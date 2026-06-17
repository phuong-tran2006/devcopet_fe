import React from "react";
import { mascotAxolotl } from "../../users/constants/authImages";

const PetCard = () => {
  return (
    <div className="bg-surface border border-outline/20 rounded-2xl p-6 flex flex-col w-full transition-colors duration-300 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-on-surface transition-colors duration-300">
            Flagellate Pet
          </h2>
          <p className="text-on-surface-variant text-sm transition-colors duration-300">
            Digital Amoeboid • Stage 2
          </p>
        </div>
        <div className="bg-primary-fixed text-primary-fixed-dim text-xs font-bold px-3 py-1 rounded uppercase tracking-wider transition-colors duration-300">
          EVOLUTION PHASE
        </div>
      </div>

      {/* Pet Image Container */}
      <div className="w-full aspect-square bg-surface-container-lowest rounded-xl flex items-center justify-center mb-6 overflow-hidden transition-colors duration-300 border border-outline/10">
        {/* Placeholder for Axolotl image, replace with mascotAxolotl when ready */}
        <img
          src={mascotAxolotl}
          alt="Pet"
          className="w-[80%] h-[80%] object-contain"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4 mb-8">
        <button className="flex-1 bg-primary-fixed-dim text-on-primary font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-primary transition-colors duration-300">
          <span className="material-symbols-outlined text-[18px]">
            restaurant
          </span>
          Feed Logic
        </button>
        <button className="flex-1 bg-transparent border border-outline text-on-surface font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-on-surface/5 transition-colors duration-300">
          <span className="material-symbols-outlined text-[18px]">
            keyboard_double_arrow_up
          </span>
          Evolve
        </button>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm font-semibold text-on-surface-variant mb-2 transition-colors duration-300">
            <span>Hunger</span>
            <span>85%</span>
          </div>
          <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden transition-colors duration-300">
            <div className="h-full bg-primary-fixed-dim w-[85%] rounded-full transition-colors duration-300"></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm font-semibold text-on-surface-variant mb-2 transition-colors duration-300">
            <span>Evolution Progress</span>
            <span>42%</span>
          </div>
          <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden transition-colors duration-300">
            <div className="h-full bg-secondary-fixed-dim w-[42%] rounded-full transition-colors duration-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetCard;
