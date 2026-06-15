// @ts-nocheck
import React from "react";
import { twMerge } from "tailwind-merge";

const Line = ({
  orientation = "horizontal",
  color = "#3e4949",
  thickness = "1px",
  width,
  height,
  className,
  style,
  ...props
}) => {
  const isHorizontal = orientation === "horizontal";

  const lineStyles = {
    backgroundColor: color,
    ...(isHorizontal
      ? {
          height: thickness,
          width: width || "100%",
        }
      : {
          width: thickness,
          height: height || "100%",
        }),
    ...style,
  };

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={twMerge("flex-shrink-0", className)}
      style={lineStyles}
      {...props}
    />
  );
};

export default Line;
