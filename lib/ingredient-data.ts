// Kek Lapis ingredients, spices, and component data including flavor profiles and usage characteristics

export interface IngredientInfo {
  name: string
  symbol: string
  healthBenefit: string
  dailyIntake?: number // in grams per serving reference if applicable
  unit: string
  color: string
  icon: string // emoji or icon name
}

export const ingredientDatabase: Record<string, IngredientInfo> = {
  butter: {
    name: "Butter",
    symbol: "But",
    healthBenefit: "Provides rich moisture, distinct mouthfeel, and traditional aroma",
    dailyIntake: undefined,
    unit: "g",
    color: "#f59e0b", // amber
    icon: "🧈",
  },
  sugar: {
    name: "Sugar",
    symbol: "Sgc",
    healthBenefit: "Provides sweetness, structure, and browning during baking",
    dailyIntake: undefined,
    unit: "g",
    color: "#fbbf24", // yellow
    icon: "🧂",
  },
  flour: {
    name: "Flour",
    symbol: "Flr",
    healthBenefit: "Provides structural matrix and binding for layers",
    dailyIntake: undefined,
    unit: "g",
    color: "#d97706", // warm amber
    icon: "🌾",
  },
  eggs: {
    name: "Eggs",
    symbol: "Egg",
    healthBenefit: "Acts as a natural leavening agent, binder, and adds richness",
    dailyIntake: undefined,
    unit: "g",
    color: "#f97316", // orange
    icon: "🥚",
  },
  kaya: {
    name: "Kaya",
    symbol: "Kya",
    healthBenefit: "Adds traditional coconut-egg jam flavor and rich sweetness",
    dailyIntake: undefined,
    unit: "g",
    color: "#10b981", // green
    icon: "🥥",
  },
  horlicks: {
    name: "Horlicks",
    symbol: "Hlk",
    healthBenefit: "Imparts a distinct malty sweetness and traditional depth",
    dailyIntake: undefined,
    unit: "g",
    color: "#8b5cf6", // purple
    icon: "🥛",
  },
  milk: {
    name: "Condensed/Evaporated Milk",
    symbol: "Milk",
    healthBenefit: "Adds creaminess, moisture, and milky caramel notes",
    dailyIntake: undefined,
    unit: "g",
    color: "#06b6d4", // cyan
    icon: "🥛",
  },
  spices: {
    name: "Mixed Spices (Rempah Kek Lapis)",
    symbol: "Spc",
    healthBenefit: "Provides the signature warm aromatic fragrance and complex spice profile",
    dailyIntake: undefined,
    unit: "g",
    color: "#dc2626", // red
    icon: "🌿",
  },
  salt: {
    name: "Salt",
    symbol: "Na",
    healthBenefit: "Balances sweetness and enhances overall flavor notes",
    dailyIntake: 5, // g max recommended
    unit: "g",
    color: "#3b82f6", // blue
    icon: "🧂",
  },
  preservatives: {
    name: "Permitted Preservatives",
    symbol: "Prs",
    healthBenefit: "Extends shelf-life and maintains product freshness",
    dailyIntake: undefined,
    unit: "g",
    color: "#78716c", // stone
    icon: "🛡️",
  },
}

// Helper function to get ingredient information
export function getIngredientInfo(ingredientName: string): IngredientInfo {
  const key = ingredientName.toLowerCase().trim()
  return ingredientDatabase[key] || {
    name: ingredientName,
    symbol: ingredientName.substring(0, 3).toUpperCase(),
    healthBenefit: "Contributes to overall recipe composition and texture",
    dailyIntake: undefined,
    unit: "g",
    color: "#6b7280", // gray
    icon: "🍰",
  }
}

// Calculate percentage of daily intake if applicable
export function calculateDailyIntakePercentage(
  ingredientName: string,
  amount: number, // in grams
  dailyConsumption: number = 1 // servings per day
): number | null {
  const info = getIngredientInfo(ingredientName)
  if (!info.dailyIntake) return null

  const totalIntake = amount * dailyConsumption
  return (totalIntake / info.dailyIntake) * 100
}