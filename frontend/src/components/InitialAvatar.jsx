// components/InitialAvatar.jsx
import React, { useMemo } from "react";

const bgColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
];

const getColorFromChar = (char) => {
  const index = char.charCodeAt(0) % bgColors.length;
  return bgColors[index];
};

const InitialAvatar = ({ name = "", size = "w-8 h-8", textSize = "text-lg" }) => {
  const firstChar = name?.charAt(0)?.toUpperCase() || "?";

  const bgColor = useMemo(() => getColorFromChar(firstChar), [firstChar]);

  return (
    <div
      className={`rounded-full ${size} ${bgColor} ${textSize} text-white flex items-center justify-center font-semibold`}
      title={name}
    >
      {firstChar}
    </div>
  );
};

export default InitialAvatar;
