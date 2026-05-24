// VORO Claude AI Integration
// API wrapper for Claude AI with streaming and error handling

const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-3-5-sonnet-20241022"; // Latest Claude model

// Initialize Anthropic client
class VoroAIClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = CLAUDE_API_URL;
    this.model = MODEL;
    this.maxRetries = 3;
  }

  // Call Claude API with full parameters
  async callAPI(messages, systemPrompt, options = {}) {
    const {
      temperature = 0.7,
      maxTokens = 2000,
      stream = false,
      abortSignal = null,
      retryCount = 0
    } = options;

    try {
      const payload = {
        model: this.model,
        messages,
        system: systemPrompt,
        max_tokens: maxTokens,
        temperature
      };

      // Handle streaming
      if (stream) {
        return await this.streamAPI(payload, abortSignal);
      }

      // Regular API call
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify(payload),
        signal: abortSignal
      });

      if (!response.ok) {
        if (response.status === 429 && retryCount < this.maxRetries) {
          // Rate limited - retry with exponential backoff
          const delay = Math.pow(2, retryCount) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.callAPI(messages, systemPrompt, { ...options, retryCount: retryCount + 1 });
        }

        const error = await response.json();
        throw new Error(`Claude API error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return {
        content: data.content[0].text,
        usage: {
          inputTokens: data.usage.input_tokens,
          outputTokens: data.usage.output_tokens
        },
        stopReason: data.stop_reason
      };
    } catch (error) {
      console.error("VORO AI Error:", error);
      throw error;
    }
  }

  // Stream API responses for real-time output
  async streamAPI(payload, abortSignal) {
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({ ...payload, stream: true }),
        signal: abortSignal
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Claude API error: ${error.error?.message || response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let content = "";
      let inputTokens = 0;
      let outputTokens = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === "content_block_delta") {
                if (data.delta.type === "text_delta") {
                  content += data.delta.text;
                }
              } else if (data.type === "message_start") {
                inputTokens = data.message.usage?.input_tokens || 0;
              } else if (data.type === "message_delta") {
                outputTokens = data.usage?.output_tokens || 0;
              }
            } catch (e) {
              // Ignore JSON parse errors for stream data
            }
          }
        }
      }

      return {
        content,
        usage: { inputTokens, outputTokens },
        stopReason: "end_turn"
      };
    } catch (error) {
      console.error("Stream API Error:", error);
      throw error;
    }
  }

  // Meal plan generation
  async generateMealPlan(userProfile, systemPrompt) {
    const userMessage = `Create a personalized 7-day meal plan for the following profile: ${JSON.stringify(userProfile)}`;

    return this.callAPI(
      [{ role: "user", content: userMessage }],
      systemPrompt,
      {
        temperature: 0.7,
        maxTokens: 3000,
        stream: false
      }
    );
  }

  // Training plan generation
  async generateTrainingPlan(userProfile, systemPrompt) {
    const userMessage = `Create a personalized 4-week training plan for the following profile: ${JSON.stringify(userProfile)}`;

    return this.callAPI(
      [{ role: "user", content: userMessage }],
      systemPrompt,
      {
        temperature: 0.7,
        maxTokens: 3000,
        stream: false
      }
    );
  }

  // Coaching advice
  async generateCoachingAdvice(userProfile, systemPrompt) {
    const userMessage = `Provide personalized coaching and motivational advice based on this user profile: ${JSON.stringify(userProfile)}`;

    return this.callAPI(
      [{ role: "user", content: userMessage }],
      systemPrompt,
      {
        temperature: 0.8,
        maxTokens: 2000,
        stream: true
      }
    );
  }

  // Analyze nutrition data
  async analyzeNutrition(nutritionData, systemPrompt) {
    const userMessage = `Analyze the following nutrition data and provide recommendations: ${JSON.stringify(nutritionData)}`;

    return this.callAPI(
      [{ role: "user", content: userMessage }],
      systemPrompt,
      {
        temperature: 0.6,
        maxTokens: 2000,
        stream: false
      }
    );
  }

  // Analyze body composition
  async analyzeBodyComposition(metrics, systemPrompt) {
    const userMessage = `Analyze this body composition data and provide insights: ${JSON.stringify(metrics)}`;

    return this.callAPI(
      [{ role: "user", content: userMessage }],
      systemPrompt,
      {
        temperature: 0.6,
        maxTokens: 2000,
        stream: false
      }
    );
  }

  // General conversation with context
  async chat(message, conversationHistory = [], systemPrompt) {
    const messages = [
      ...conversationHistory,
      { role: "user", content: message }
    ];

    return this.callAPI(
      messages,
      systemPrompt,
      {
        temperature: 0.7,
        maxTokens: 2000,
        stream: true
      }
    );
  }

  // Injury assessment and prevention
  async assessInjuryRisk(userData, systemPrompt) {
    const userMessage = `Based on this user data, assess injury risk and provide prevention recommendations: ${JSON.stringify(userData)}`;

    return this.callAPI(
      [{ role: "user", content: userMessage }],
      systemPrompt,
      {
        temperature: 0.6,
        maxTokens: 2000,
        stream: false
      }
    );
  }

  // Competition preparation
  async prepareForCompetition(userData, competitionDetails, systemPrompt) {
    const userMessage = `Create a competition preparation plan for: ${JSON.stringify({
      userData,
      competitionDetails
    })}`;

    return this.callAPI(
      [{ role: "user", content: userMessage }],
      systemPrompt,
      {
        temperature: 0.7,
        maxTokens: 2500,
        stream: false
      }
    );
  }
}

// Factory function to create client
export const createVoroAIClient = (apiKey = CLAUDE_API_KEY) => {
  if (!apiKey) {
    console.warn("Claude API key not found. AI features will be disabled.");
    return null;
  }

  return new VoroAIClient(apiKey);
};

// Helper function for simple calls
export const callVoroAI = async (
  prompt,
  systemPrompt,
  options = {}
) => {
  const client = createVoroAIClient();

  if (!client) {
    throw new Error("Claude API key not configured");
  }

  return client.callAPI(
    [{ role: "user", content: prompt }],
    systemPrompt,
    options
  );
};

// Export client for direct use
export const voroAIClient = createVoroAIClient();

export default {
  VoroAIClient,
  createVoroAIClient,
  callVoroAI,
  voroAIClient
};
