export interface TasteProfile {
  sweetness: number // 0 - 10
  richness: number  // 0 - 300 g/kg
  moisture: number  // 0 - 10
  spice: number     // 0 - 10
}

/**
 * Converts a qualitative taste profile into a normalized 4D vector array
 * suitable for Typesense vector search fields.
 */
export function tasteProfileToVector(profile: TasteProfile): number[] {
  // Normalize parameters to roughly a 0-1 scale for balanced vector distance calculation
  const normalizedSweetness = Math.min(Math.max(profile.sweetness / 10, 0), 1)
  const normalizedRichness = Math.min(Math.max(profile.richness / 300, 0), 1)
  const normalizedMoisture = Math.min(Math.max(profile.moisture / 10, 0), 1)
  const normalizedSpice = Math.min(Math.max(profile.spice / 10, 0), 1)

  return [normalizedSweetness, normalizedRichness, normalizedMoisture, normalizedSpice]
}

/**
 * Calculates Euclidean similarity score (0 to 1) between two taste vectors.
 */
export function calculateTasteSimilarity(vectorA: number[], vectorB: number[]): number {
  if (vectorA.length !== vectorB.length || vectorA.length === 0) return 0

  let sumSquares = 0
  for (let i = 0; i < vectorA.length; i++) {
    const diff = vectorA[i] - vectorB[i]
    sumSquares += diff * diff
  }

  const distance = Math.sqrt(sumSquares)
  // Convert distance to similarity score (max possible distance in 4D unit hypercube is sqrt(4) = 2)
  const similarity = Math.max(0, 1 - distance / 2)
  return Number(similarity.toFixed(4))
}

/**
 * Generates "If you like X, try Y" recommendations from a master product array.
 */
export function getProductRecommendations<T extends { id: string; taste_vector?: number[] }>(
  targetProduct: T,
  allProducts: T[],
  limit: number = 3
): T[] {
  if (!targetProduct.taste_vector) return []

  return allProducts
    .filter((p) => p.id !== targetProduct.id && p.taste_vector)
    .map((p) => ({
      product: p,
      similarity: calculateTasteSimilarity(targetProduct.taste_vector!, p.taste_vector!),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map((item) => item.product)
}