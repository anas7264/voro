import React from "react";
import { Card } from "./Card";
import { Zap } from "lucide-react";

export const ChallengeCard = ({ challenge, progress, completed, onAccept }) => {
  return (
    <Card>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-white text-lg">{challenge.name}</h3>
            <p className="text-sm text-gray-400">{challenge.duration} Challenge</p>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500 bg-opacity-20 rounded">
            <Zap size={16} className="text-yellow-400" />
            <span className="text-yellow-400 font-semibold">{challenge.xpReward} XP</span>
          </div>
        </div>
        <p className="text-sm text-gray-300">{challenge.description}</p>
        {progress !== undefined && (
          <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>
        )}
        <div className="flex gap-2">
          {onAccept && !completed && <button onClick={onAccept} className="flex-1 px-3 py-2 text-sm bg-primary rounded hover:opacity-90">Accept Challenge</button>}
          {completed && <button className="flex-1 px-3 py-2 text-sm bg-green-500 rounded opacity-75 cursor-default">Completed</button>}
        </div>
      </div>
    </Card>
  );
};

export default ChallengeCard;
