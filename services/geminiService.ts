
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function cleanDataWithGemini(csvData: string): Promise<string> {
  const model = 'gemini-2.5-flash';
  
  const prompt = `
You are a world-class data cleaning AI. A user has uploaded a CSV file with various issues. Your task is to meticulously clean the data and return it as a valid CSV string.

Here is the raw CSV data:
---
${csvData}
---

Please apply the following cleaning rules:
1.  **Header Row**: The first row is the header. Preserve it in the output.
2.  **Remove Duplicates**: Delete any rows that are complete duplicates of another row.
3.  **Handle Missing Values**:
    - For columns that appear to be numeric (e.g., 'Quantity', 'Price', 'Total Sales'), fill any missing or non-numeric values with the average of that column. If the average cannot be calculated (e.g., all values are missing), fill with 0.
    - For columns that appear to be text/categorical (e.g., 'Product Name', 'City'), fill any missing values with the string 'Unknown'.
4.  **Standardize Date Formats**: Find any column that contains dates. Convert all dates in that column to a consistent 'YYYY-MM-DD' format.
5.  **Normalize Text**:
    - Trim leading/trailing whitespace from all text cells.
    - Standardize capitalization for categorical data where it makes sense (e.g., 'new york', 'New York', 'NY' could all become 'New York'). Use your best judgment to identify such columns.
6.  **Verify Calculations**: Look for a column named 'Total Sales' or similar. If it exists, and there are columns like 'Quantity' and 'Unit Price', verify that 'Total Sales' equals 'Quantity' * 'Unit Price'. Correct any discrepancies. If 'Total Sales' does not exist but the others do, create it and calculate its values.

Your final output must be ONLY the cleaned data in CSV format, including the header. Do not add any introductory text, explanation, summaries, or code fences (like \`\`\`csv ... \`\`\`).
`;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt
    });
    
    // Sometimes the model might wrap the output in markdown, so we clean it.
    let cleanedText = response.text.trim();
    if (cleanedText.startsWith('```csv')) {
        cleanedText = cleanedText.substring(6);
    }
    if (cleanedText.endsWith('```')) {
        cleanedText = cleanedText.substring(0, cleanedText.length - 3);
    }

    return cleanedText.trim();

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to process data with AI. The API call failed.");
  }
}
