import { useState, useCallback, useRef, useMemo } from "react";
import { buildVORO_SystemPrompt } from "../utils/aiPrompts";
import { voroAIClient } from "../utils/ai";

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted Module Constants.
 * Pre-allocating the static system prompt and empty array fallback prevents
 * string recreation and array allocations on every invocation.
 */
const EMPTY_ARRAY = Object.freeze([]);
const SYSTEM_PROMPT = buildVORO_SystemPrompt();

export const useAI = () => {
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Consolidated State.
   * Grouping loading, error, and response into a single state object
   * eliminates redundant render cycles during asynchronous state transitions.
   */
  const [state, setState] = useState({
    loading: false,
    error: null,
    response: null
  });

  const abortControllerRef = useRef(null);

  // Helper to update state partially
  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Generate meal plan
  const generateMealPlan = useCallback(async (userProfile) => {
    if (!voroAIClient) {
      updateState({ error: "AI client not initialized" });
      return null;
    }

    updateState({ loading: true, error: null });
    abortControllerRef.current = new AbortController();

    try {
      const result = await voroAIClient.generateMealPlan(
        userProfile,
        SYSTEM_PROMPT
      );
      updateState({ response: result, loading: false });
      return result;
    } catch (err) {
      const errorMessage = err.message || "Failed to generate meal plan";
      updateState({ error: errorMessage, loading: false });
      console.error("Meal plan generation error:", err);
      return null;
    }
  }, [updateState]);

  // Generate training plan
  const generateTrainingPlan = useCallback(async (userProfile) => {
    if (!voroAIClient) {
      updateState({ error: "AI client not initialized" });
      return null;
    }

    updateState({ loading: true, error: null });
    abortControllerRef.current = new AbortController();

    try {
      const result = await voroAIClient.generateTrainingPlan(
        userProfile,
        SYSTEM_PROMPT
      );
      updateState({ response: result, loading: false });
      return result;
    } catch (err) {
      const errorMessage = err.message || "Failed to generate training plan";
      updateState({ error: errorMessage, loading: false });
      console.error("Training plan generation error:", err);
      return null;
    }
  }, [updateState]);

  // Get coaching advice
  const getCoachingAdvice = useCallback(async (userProfile) => {
    if (!voroAIClient) {
      updateState({ error: "AI client not initialized" });
      return null;
    }

    updateState({ loading: true, error: null });
    abortControllerRef.current = new AbortController();

    try {
      const result = await voroAIClient.generateCoachingAdvice(
        userProfile,
        SYSTEM_PROMPT
      );
      updateState({ response: result, loading: false });
      return result;
    } catch (err) {
      const errorMessage = err.message || "Failed to get coaching advice";
      updateState({ error: errorMessage, loading: false });
      console.error("Coaching advice error:", err);
      return null;
    }
  }, [updateState]);

  // Analyze nutrition
  const analyzeNutrition = useCallback(async (nutritionData) => {
    if (!voroAIClient) {
      updateState({ error: "AI client not initialized" });
      return null;
    }

    updateState({ loading: true, error: null });
    abortControllerRef.current = new AbortController();

    try {
      const result = await voroAIClient.analyzeNutrition(
        nutritionData,
        SYSTEM_PROMPT
      );
      updateState({ response: result, loading: false });
      return result;
    } catch (err) {
      const errorMessage = err.message || "Failed to analyze nutrition";
      updateState({ error: errorMessage, loading: false });
      console.error("Nutrition analysis error:", err);
      return null;
    }
  }, [updateState]);

  // Analyze body composition
  const analyzeBodyComposition = useCallback(async (metrics) => {
    if (!voroAIClient) {
      updateState({ error: "AI client not initialized" });
      return null;
    }

    updateState({ loading: true, error: null });
    abortControllerRef.current = new AbortController();

    try {
      const result = await voroAIClient.analyzeBodyComposition(
        metrics,
        SYSTEM_PROMPT
      );
      updateState({ response: result, loading: false });
      return result;
    } catch (err) {
      const errorMessage = err.message || "Failed to analyze body composition";
      updateState({ error: errorMessage, loading: false });
      console.error("Body composition analysis error:", err);
      return null;
    }
  }, [updateState]);

  // General chat
  const chat = useCallback(async (message, conversationHistory = EMPTY_ARRAY) => {
    if (!voroAIClient) {
      updateState({ error: "AI client not initialized" });
      return null;
    }

    updateState({ loading: true, error: null });
    abortControllerRef.current = new AbortController();

    try {
      const result = await voroAIClient.chat(
        message,
        conversationHistory,
        SYSTEM_PROMPT
      );
      updateState({ response: result, loading: false });
      return result;
    } catch (err) {
      const errorMessage = err.message || "Chat request failed";
      updateState({ error: errorMessage, loading: false });
      console.error("Chat error:", err);
      return null;
    }
  }, [updateState]);

  // Cancel ongoing request
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      updateState({ loading: false });
    }
  }, [updateState]);

  // Clear error
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Memoized Hook Interface.
   * Wrapping the returned object in useMemo ensures referential stability,
   * preventing unnecessary re-renders in consumer components when parent state updates.
   */
  return useMemo(() => ({
    ...state,
    generateMealPlan,
    generateTrainingPlan,
    getCoachingAdvice,
    analyzeNutrition,
    analyzeBodyComposition,
    chat,
    cancel,
    clearError
  }), [
    state,
    generateMealPlan,
    generateTrainingPlan,
    getCoachingAdvice,
    analyzeNutrition,
    analyzeBodyComposition,
    chat,
    cancel,
    clearError
  ]);
};

export default useAI;
