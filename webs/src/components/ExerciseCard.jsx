import React, { memo } from "react";
import { Card } from "./Card";

/**
 * ⚡ OPTIMIZATION: Memoized ExerciseCard to prevent redundant re-renders.
 */
export const ExerciseCard = memo(({ exercise, onSelect, onEdit, onDelete }) => {
  return (
    <Card hover>
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-white text-lg">{exercise.name}</h3>
            <p className="text-sm text-gray-400">{exercise.category} • {exercise.difficulty}</p>
          </div>
          <span className="px-2 py-1 bg-primary bg-opacity-20 text-primary text-xs rounded">
            {exercise.caloriesPerMinute} cal/min
          </span>
        </div>
        <p className="text-sm text-gray-300">{exercise.description.substring(0, 100)}...</p>
        <div className="flex gap-2 pt-2">
          {onSelect && <button onClick={onSelect} className="flex-1 px-3 py-1 text-sm bg-primary rounded hover:opacity-90">Select</button>}
          {onEdit && <button onClick={onEdit} className="flex-1 px-3 py-1 text-sm bg-gray-700 rounded hover:opacity-90">Edit</button>}
          {onDelete && <button onClick={onDelete} className="flex-1 px-3 py-1 text-sm bg-red-500 rounded hover:opacity-90">Delete</button>}
        </div>
      </div>
    </Card>
  );
});

ExerciseCard.displayName = "ExerciseCard";

export default ExerciseCard;
