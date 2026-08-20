import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dataFile = path.join(root, "data", "db.json");
const backupFile = path.join(root, "data", "db.pre-flat.json");
const oldImageDir = path.join(root, "public", "images", "db");
const newImageDir = path.join(root, "public", "images", "products");

const db = JSON.parse(await readFile(dataFile, "utf8"));

if (db.schema_version === 2) {
  throw new Error("data/db.json is already using flat schema version 2");
}

const slugify = (value) =>
  String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const numberOrNull = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const mineralKey = (value) =>
  slugify(value)
    .replaceAll("-", "_")
    .replace("sulphate", "sulphate");

const brands = new Map(db.brands.map((item) => [item.id, item]));
const manufacturers = new Map(db.manufacturers.map((item) => [item.id, item]));
const sources = new Map(db.sources.map((item) => [item.id, item]));
const images = new Map(db.images.map((item) => [item.id, item]));
const linksByProduct = new Map(
  db.productImages.map((link) => [link.product_id, link])
);

const usedIds = new Set();
const migrationImages = [];

const products = db.products.map((product) => {
  const brand = brands.get(product.brand_id);
  const manufacturer = manufacturers.get(product.manufacturer_id);
  const source = sources.get(product.source_id);

  if (!brand) throw new Error(`Missing brand for product ${product.id}`);
  if (!manufacturer) throw new Error(`Missing manufacturer for product ${product.id}`);
  if (!source) throw new Error(`Missing source for product ${product.id}`);

  const type = "layered-cake";
  const id = `${slugify(brand.brand_name)}-${type}`;

  if (usedIds.has(id)) {
    throw new Error(`Duplicate brand/type product ID: ${id}`);
  }
  usedIds.add(id);

  const minerals = {};
  for (const mineral of Object.values(product.minerals_json ?? {})) {
    if (!mineral || typeof mineral !== "object" || !mineral.name) continue;
    minerals[mineralKey(mineral.name)] = numberOrNull(mineral.amount);
  }

  const linked = images.get(linksByProduct.get(product.id)?.image_id);
  const brandSlug = slugify(brand.brand_name);
  const linkedLooksCorrect =
    linked &&
    (slugify(linked.filename).includes(brandSlug) || linked.id === product.id);
  const brandImage = db.images.find((image) => {
    const filename = slugify(image.filename);
    return filename.includes(brandSlug) || filename.startsWith(brandSlug.split("-")[0]);
  });
  const selectedImage = linkedLooksCorrect ? linked : brandImage;

  migrationImages.push({
    productId: id,
    sourceId: selectedImage?.id ?? null,
    sourceExt: selectedImage?.ext ?? null,
  });

  return {
    id,
    brand: brand.brand_name,
    type,
    product_name: product.product_name,
    parent_company: brand.parent_company,
    website_url: brand.website_url,
    manufacturer: manufacturer.name,
    manufacturer_address: manufacturer.address,
    barcode: product.barcode,
    sweetness: numberOrNull(product.sweetness ?? product.ph_level),
    richness_dri: numberOrNull(product.richness_dri ?? product.tds),
    minerals_mg_l: minerals,
    source_name: source.source_name,
    source_type: slugify(source.type),
    source_address: source.location_address,
    latitude: numberOrNull(source.lat),
    longitude: numberOrNull(source.lng),
    kkm_approval_number: source.kkm_approval_number,
    country: source.country,
    image: `${id}.webp`,
    status: product.status,
    submitted_by: product.submitted_by,
    created_at: product.created_at,
    updated_at: product.updated_at,
  };
});

const nextDb = {
  schema_version: 2,
  products,
  users: db.users,
};

await copyFile(dataFile, backupFile);
await mkdir(newImageDir, { recursive: true });

for (const item of migrationImages) {
  if (!item.sourceId || !item.sourceExt) {
    console.warn(`No source image for ${item.productId}`);
    continue;
  }
  await copyFile(
    path.join(oldImageDir, `${item.sourceId}.${item.sourceExt}`),
    path.join(newImageDir, `${item.productId}.webp`)
  );
}

await writeFile(dataFile, `${JSON.stringify(nextDb, null, 2)}\n`, "utf8");
console.log(`Migrated ${products.length} products to schema version 2`);
console.log(`Copied ${migrationImages.filter((item) => item.sourceId).length} product images`);
console.log(`Backup: ${path.relative(root, backupFile)}`);