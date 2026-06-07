import React, { memo } from "react";
import { Card } from "./Card";

/**
 * ⚡ OPTIMIZATION: Memoized NutritionCard to prevent redundant re-renders.
 */
export const NutritionCard = memo(({ meal, onEdit, onDelete }) => {
  return (
    <Card hover>
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-white text-lg">{meal.name}</h3>
            <p className="text-sm text-gray-400">{meal.mealType}</p>
          </div>
          <p className="text-xl font-bold text-primary">{meal.calories}</p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="bg-gray-800 rounded p-2">
            <p className="text-gray-400 text-xs">Protein</p>
            <p className="font-semibold text-white">{meal.protein}g</p>
          </div>
          <div className="bg-gray-800 rounded p-2">
            <p className="text-gray-400 text-xs">Carbs</p>
            <p className="font-semibold text-white">{meal.carbs}g</p>
          </div>
          <div className="bg-gray-800 rounded p-2">
            <p className="text-gray-400 text-xs">Fat</p>
            <p className="font-semibold text-white">{meal.fat}g</p>
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          {onEdit && <button onClick={onEdit} className="flex-1 px-3 py-1 text-sm bg-primary rounded hover:opacity-90">Edit</button>}
          {onDelete && <button onClick={onDelete} className="flex-1 px-3 py-1 text-sm bg-red-500 rounded hover:opacity-90">Delete</button>}
        </div>
      </div>
    </Card>
  );
});

NutritionCard.displayName = "NutritionCard";

export default NutritionCard;
