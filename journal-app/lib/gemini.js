// lib/gemini.js
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { GEMINI_API_KEY } from '@env'; 
const MODEL_NAME = "gemini-1.5-pro-002";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function analyzeMood(text) {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const parts = [
      {
        text: `Analyze the following journal entry and provide two things:
        1. A primary mood label (choose one: happy, sad, anxious, calm, angry, joyful, fearful)
        2. A JSON object containing mood scores from 0.0 to 1.0 for: happiness, sadness, anger, fear, joy, calmness

        Format your response exactly like this (keep the exact spacing):
        Primary Mood: [mood]

        {
          "happiness": 0.0,
          "sadness": 0.0,
          "anger": 0.0,
          "fear": 0.0,
          "joy": 0.0,
          "calmness": 0.0
        }

        Journal Entry:
        ${text}`,
      },
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });

    const response = result.response.text().trim();
    console.log("Raw response:", response); // Debug log

    // Extract primary mood - using a more flexible regex
    const moodMatch = response.match(/Primary Mood:\s*(\w+)/i);
    if (!moodMatch) {
      throw new Error("Could not find primary mood in response");
    }
    const primaryMood = moodMatch[1].toLowerCase();

    // Find the JSON part - looking for anything between { and }
    const jsonRegex = /\{[\s\S]*?\}/;
    const jsonMatch = response.match(jsonRegex);
    
    if (!jsonMatch) {
      console.error("Full response:", response);
      throw new Error("Could not find mood scores JSON in response");
    }

    let moodScores;
    try {
      const jsonStr = jsonMatch[0].replace(/[\u201C\u201D]/g, '"'); // Replace any fancy quotes
      moodScores = JSON.parse(jsonStr);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      console.error("JSON string attempted to parse:", jsonMatch[0]);
      throw new Error("Invalid mood scores JSON format");
    }

    // Validate mood scores object
    const requiredKeys = ['happiness', 'sadness', 'anger', 'fear', 'joy', 'calmness'];
    const missingKeys = requiredKeys.filter(key => !(key in moodScores));
    if (missingKeys.length > 0) {
      throw new Error(`Missing required mood scores: ${missingKeys.join(', ')}`);
    }

    // Log successful parsing
    console.log("Successfully parsed mood analysis:", { primaryMood, moodScores });

    return { primaryMood, moodScores };
  } catch (error) {
    console.error("Error analyzing mood:", error);
    // Return a safe default in case of error
    return {
      primaryMood: "neutral",
      moodScores: {
        happiness: 0.5,
        sadness: 0.5,
        anger: 0.5,
        fear: 0.5,
        joy: 0.5,
        calmness: 0.5
      }
    };
  }
}