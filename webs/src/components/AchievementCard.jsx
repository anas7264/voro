import React from "react";
import { Card } from "./Card";
import { Trophy } from "lucide-react";

export const AchievementCard = ({ achievement, unlocked }) => {
  const rarityColors = {
    Common: "bg-blue-500",
    Uncommon: "bg-green-500",
    Rare: "bg-purple-500",
    Epic: "bg-orange-500",
    Legendary: "bg-yellow-500"
  };

  return (
    <Card className="flex flex-col items-center text-center">
      <div className={`w-16 h-16 rounded-full ${rarityColors[achievement.rarity]} mb-3 flex items-center justify-center ${!unlocked && "opacity-40"}`}>
        <Trophy size={32} className="text-white" />
      </div>
      <h3 className="font-bold text-white">{achievement.name}</h3>
      <p className="text-xs text-gray-400 my-1">{achievement.description}</p>
      <div className="flex items-center gap-2 mt-2 text-sm">
        <span className="px-2 py-1 bg-gray-800 rounded">{achievement.xpReward} XP</span>
        <span className={`px-2 py-1 rounded text-white text-xs ${rarityColors[achievement.rarity]}`}>
          {achievement.rarity}
        </span>
      </div>
    </Card>
  );
};

export default AchievementCard;
