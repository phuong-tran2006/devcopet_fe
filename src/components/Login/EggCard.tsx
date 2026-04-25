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
      className={`egg-card ${isSelected ? "active" : ""}`}
      onClick={() => onSelect(id)}
    >
      <div className="egg-image-container">
        <img src={img} alt={name} className="egg-main" />
      </div>
      <h2>{name}</h2>
      <p>{desc}</p>
    </div>
  );
};

export default EggCard;
