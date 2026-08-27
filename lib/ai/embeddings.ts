// ==========================================
// Taste Profile Embeddings & Vector Matching
// lib/ai/embeddings.ts
// ==========================================

import { searchClient } from "@/lib/search/client";

export interface TasteProfile {
  sweetness: number; // Scale 0 - 10
  richness: number;  // Scale 0 - 300 g/kg
  moisture: number;  // Scale 0 - 10
  spice: number;     // Scale 0 - 10
}

/**
 * Converts a cake's taste profile metrics into a normalized 4-dimensional vector
 * matching the num_dim: 4 schema defined in lib/search/client.ts.
 */
export function tasteProfileToVector(profile: TasteProfile): number[] {
  // Normalize values between 0 and 1 for optimal vector distance calculation
  const normSweetness = Math.min(Math.max(profile.sweetness / 10, 0), 1);
  const normRichness = Math.min(Math.max(profile.richness / 300, 0), 1);
  const normMoisture = Math.min(Math.max(profile.moisture / 10, 0), 1);
  const normSpice = Math.min(Math.max(profile.spice / 10, 0), 1);

  return [normSweetness, normRichness, normMoisture, normSpice];
}

/**
 * Performs a vector similarity search via Typesense using the searchClient
 * to find cakes matching a user's target taste preference cluster.
 */
export async function findSimilarTastes(targetProfile: TasteProfile, limit = 10) {
  const vectorQuery = tasteProfileToVector(targetProfile);

  try {
    const searchResults = await searchClient
      .collections("lapis_products")
      .documents()
      .search({
        q: "*",
        vector_query: `taste_embedding:([${vectorQuery.join(",")}], k: ${limit})`,
      });

    return searchResults.hits?.map((hit: any) => ({
      document: hit.document,
      similarityScore: hit.vector_distance,
    })) || [];
  } catch (error) {
    console.error("Vector taste similarity search failed:", error);
    throw new Error("Failed to fetch taste recommendations");
  }
}