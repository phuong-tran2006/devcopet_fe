import React from "react";

interface EggProps {
  id: number;
  name: string;
  desc: string;
  img: string;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

const EggCard: React.FC<EggProps> = ({
  id,
  name,
  desc,
  img,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`egg-card-custom ${isSelected ? "egg-card-active" : ""}`}
      onClick={() => onSelect(id)}
    >
      <div className="flex justify-center mb-5">
        <img
          src={img}
          alt={name}
          className="w-[150px] transition-transform duration-300 hover:scale-110"
        />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">{name}</h2>
      <p className="text-gray-500 text-sm leading-relaxed px-2">{desc}</p>
    </div>
  );
};

export default EggCard;
