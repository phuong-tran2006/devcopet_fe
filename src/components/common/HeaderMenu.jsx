import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

const HeaderMenu = ({ mobile = false }) => {
  const [activeItem, setActiveItem] = useState("Course");

  const menuItems = [
    { label: "Course", path: "/course" },
    { label: "Roadmap", path: "/roadmap" },
    { label: "Arena", path: "/arena" },
    { label: "Leaderboard", path: "/leaderboard" },
  ];

  const handleItemClick = (label) => {
    setActiveItem(label);
  };

  const baseItemClasses =
    "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-teal-light rounded px-3 py-2";
  const activeItemClasses = "text-[#76d6d5] font-medium";
  const inactiveItemClasses = "text-white/80 hover:text-white";

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className={twMerge(
        mobile ? "flex flex-col gap-2" : "flex flex-row gap-4 items-center",
      )}
    >
      {menuItems?.map((item) => {
        const isActive = activeItem === item?.label;

        return (
          <a
            key={item?.label}
            href={item?.path}
            role="menuitem"
            onClick={() => handleItemClick(item?.label)}
            className={twMerge(
              baseItemClasses,
              isActive ? activeItemClasses : inactiveItemClasses,
              mobile &&
                "text-base py-3 px-4 hover:bg-background-card rounded-lg",
            )}
            style={{
              fontSize: mobile ? "16px" : "16px",
              fontFamily: "Inter",
              fontWeight: isActive ? "500" : "400",
              lineHeight: "20px",
            }}
            aria-current={isActive ? "page" : undefined}
          >
            {item?.label}
          </a>
        );
      })}
    </nav>
  );
};

export default HeaderMenu;
