import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const db = JSON.parse(await readFile(path.join(root, "data", "db.json"), "utf8"));
const errors = [];
const warnings = [];

if (db.schema_version !== 2) errors.push("schema_version must be 2");
if (!Array.isArray(db.products)) errors.push("products must be an array");

const ids = new Set();
for (const [index, product] of (db.products ?? []).entries()) {
  const location = `products[${index}]`;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*-layered-cake$/.test(product.id)) {
    errors.push(`${location}.id is not a brand/type slug: ${product.id}`);
  }
  if (ids.has(product.id)) errors.push(`duplicate product id: ${product.id}`);
  ids.add(product.id);
  if (!["layered-cake"].includes(product.type)) {
    errors.push(`${product.id}: unsupported type ${product.type}`);
  }
  const allowedImages = [`${product.id}.webp`, "placeholder.svg"];
  if (!allowedImages.includes(product.image)) {
    errors.push(`${product.id}: image must be ${product.id}.webp or placeholder.svg`);
  }
  for (const key of ["sweetness", "richness_dri", "latitude", "longitude"]) {
    if (product[key] !== null && typeof product[key] !== "number") {
      errors.push(`${product.id}: ${key} must be a number or null`);
    }
  }
  if (product.image !== "placeholder.svg") {
    try {
      await access(path.join(root, "public", "images", "products", product.image));
    } catch {
      warnings.push(`${product.id}: image file is not available yet`);
    }
  }
}

for (const warning of warnings) console.warn(`WARN ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`ERROR ${error}`);
  process.exit(1);
}
console.log(`Valid schema v2 catalogue: ${db.products.length} products, ${warnings.length} warning(s)`);