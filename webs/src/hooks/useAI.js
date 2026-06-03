import { useState, useCallback, useRef } from "react";
import { buildVORO_SystemPrompt } from "../utils/aiPrompts";
import { voroAIClient } from "../utils/ai";

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const abortControllerRef = useRef(null);

  // Generate meal plan
  const generateMealPlan = useCallback(async (userProfile) => {
    if (!voroAIClient) {
      setError("AI client not initialized");
      return null;
    }

    setLoading(true);
    setError(null);
    abortControllerRef.current = new AbortController();

    try {
      const result = await voroAIClient.generateMealPlan(
        userProfile,
        buildVORO_SystemPrompt
      );
      setResponse(result);
      return result;
    } catch (err) {
      const errorMessage = err.message || "Failed to generate meal plan";
      setError(errorMessage);
      console.error("Meal plan generation error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate training plan
  const generateTrainingPlan = useCallback(async (userProfile) => {
    if (!voroAIClient) {
      setError("AI client not initialized");
      return null;
    }

    setLoading(true);
    setError(null);
    abortControllerRef.current = new AbortController();

    try {
      const result = await voroAIClient.generateTrainingPlan(
        userProfile,
        buildVORO_SystemPrompt
      );
      setResponse(result);
      return result;
    } catch (err) {
      const errorMessage = err.message || "Failed to generate training plan";
      setError(errorMessage);
      console.error("Training plan generation error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get coaching advice
  const getCoachingAdvice = useCallback(async (userProfile) => {
    if (!voroAIClient) {
      setError("AI client not initialized");
      return null;
    }

    setLoading(true);
    setError(null);
    abortControllerRef.current = new AbortController();

    try {
      const result = await voroAIClient.generateCoachingAdvice(
        userProfile,
        buildVORO_SystemPrompt
      );
      setResponse(result);
      return result;
    } catch (err) {
      const errorMessage = err.message || "Failed to get coaching advice";
      setError(errorMessage);
      console.error("Coaching advice error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Analyze nutrition
  const analyzeNutrition = useCallback(async (nutritionData) => {
    if (!voroAIClient) {
      setError("AI client not initialized");
      return null;
    }

    setLoading(true);
    setError(null);
    abortControllerRef.current = new AbortController();

    try {
      const result = await voroAIClient.analyzeNutrition(
        nutritionData,
        buildVORO_SystemPrompt
      );
      setResponse(result);
      return result;
    } catch (err) {
      const errorMessage = err.message || "Failed to analyze nutrition";
      setError(errorMessage);
      console.error("Nutrition analysis error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Analyze body composition
  const analyzeBodyComposition = useCallback(async (metrics) => {
    if (!voroAIClient) {
      setError("AI client not initialized");
      return null;
    }

    setLoading(true);
    setError(null);
    abortControllerRef.current = new AbortController();

    try {
      const result = await voroAIClient.analyzeBodyComposition(
        metrics,
        buildVORO_SystemPrompt
      );
      setResponse(result);
      return result;
    } catch (err) {
      const errorMessage = err.message || "Failed to analyze body composition";
      setError(errorMessage);
      console.error("Body composition analysis error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // General chat
  const chat = useCallback(async (message, conversationHistory = []) => {
    if (!voroAIClient) {
      setError("AI client not initialized");
      return null;
    }

    setLoading(true);
    setError(null);
    abortControllerRef.current = new AbortController();

    try {
      const result = await voroAIClient.chat(
        message,
        conversationHistory,
        buildVORO_SystemPrompt
      );
      setResponse(result);
      return result;
    } catch (err) {
      const errorMessage = err.message || "Chat request failed";
      setError(errorMessage);
      console.error("Chat error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cancel ongoing request
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    response,
    generateMealPlan,
    generateTrainingPlan,
    getCoachingAdvice,
    analyzeNutrition,
    analyzeBodyComposition,
    chat,
    cancel,
    clearError
  };
};

export default useAI;
