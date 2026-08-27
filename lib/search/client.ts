// ==========================================
// Search Client Configuration
// lib/search/client.ts
// ==========================================

import Typesense from "typesense";
import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";

// Initialize Typesense Client 
export const searchClient = new Typesense.Client({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST || "localhost",
      port: parseInt(process.env.TYPESENSE_PORT || "8108"),
      protocol: process.env.TYPESENSE_PROTOCOL || "http",
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY || "xyz",
  connectionTimeoutSeconds: 2,
});

/**
 * Ensures the lapis_products collection schema exists with faceting fields 
 * and vector embedding capabilities for taste similarity.
 */
export async function initSearchCollection() {
  const schema: CollectionCreateSchema = {
    name: "lapis_products",
    fields: [
      { name: "id", type: "string" },
      { name: "name", type: "string" },
      { name: "description", type: "string", optional: true },
      { name: "manufacturer", type: "string", facet: true, optional: true },
      { name: "region", type: "string", facet: true, optional: true },
      { name: "type", type: "string", facet: true },
      { name: "sweetness", type: "float" },
      { name: "richness", type: "float" },
      { name: "taste_embedding", type: "float[]", num_dim: 4 }, // Maps to embeddings.ts vector output
      { name: "created_at", type: "int64" },
    ] as const,
    default_sorting_field: "created_at",
  };

  try {
    await searchClient.collections("lapis_products").retrieve();
  } catch (error) {
    // Collection doesn't exist, create it
    await searchClient.collections().create(schema);
  }
}