import { promises as fs } from "node:fs";
import path from "node:path";
import type { FlatProductRecord } from "@/lib/types/db";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const TMP_FILE = DB_FILE + ".tmp";

export interface DatabaseShape {
  schema_version: 2;
  products: FlatProductRecord[];
  users: any[];
}

type CollectionName = "products" | "users";
let cache: DatabaseShape | null = null;
let writeChain: Promise<void> = Promise.resolve();

export async function now(): Promise<string> {
  return new Date().toISOString();
}

function emptyDb(): DatabaseShape {
  return { schema_version: 2, products: [], users: [] };
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

async function load(): Promise<DatabaseShape> {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(await fs.readFile(DB_FILE, "utf8"));
    if (parsed.schema_version !== 2 || !Array.isArray(parsed.products)) {
      throw new Error("Unsupported data/db.json schema; expected schema_version 2");
    }
    cache = { ...emptyDb(), ...parsed };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    cache = emptyDb();
    await persist(cache);
  }
  return cache!;
}

async function persist(data: DatabaseShape): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(TMP_FILE, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  await fs.rename(TMP_FILE, DB_FILE);
  cache = data;
}

export async function getAll<K extends CollectionName>(name: K): Promise<DatabaseShape[K]> {
  const db = await load();
  return deepClone(db[name]);
}

export async function findOne<K extends CollectionName>(
  name: K,
  predicate: (item: DatabaseShape[K][number]) => boolean
): Promise<DatabaseShape[K][number] | null> {
  const db = await load();
  const found = (db[name] as any[]).find(predicate);
  return found ? deepClone(found) : null;
}

export async function insert<K extends CollectionName>(
  name: K,
  record: DatabaseShape[K][number]
): Promise<DatabaseShape[K][number]> {
  return runWrite((db) => {
    if (!record || typeof record !== "object" || !("id" in record)) {
      throw new Error(`Records inserted into ${name} require an explicit stable id`);
    }
    (db[name] as any[]).push(record);
    return deepClone(record);
  });
}

export async function update<K extends CollectionName>(
  name: K,
  predicate: (item: DatabaseShape[K][number]) => boolean,
  patch: Partial<DatabaseShape[K][number]>
): Promise<DatabaseShape[K][number] | null> {
  return runWrite(async (db) => {
    const items = db[name] as any[];
    const index = items.findIndex(predicate);
    if (index === -1) return null;
    items[index] = { ...items[index], ...patch, id: items[index].id, updated_at: await now() };
    return deepClone(items[index]);
  });
}

export async function remove<K extends CollectionName>(
  name: K,
  predicate: (item: DatabaseShape[K][number]) => boolean
): Promise<number> {
  return runWrite((db) => {
    const items = db[name] as any[];
    const before = items.length;
    const remaining = items.filter((item) => !predicate(item));
    (db as any)[name] = remaining;
    return before - remaining.length;
  });
}

export async function write<T>(fn: (db: DatabaseShape) => Promise<T> | T): Promise<T> {
  return runWrite(fn);
}

export async function saveAll(data: DatabaseShape): Promise<void> {
  await runWrite((db) => Object.assign(db, data));
}

async function runWrite<T>(fn: (db: DatabaseShape) => Promise<T> | T): Promise<T> {
  const next = writeChain.then(async () => {
    const db = await load();
    const result = await fn(db);
    await persist(db);
    return result;
  });
  writeChain = next.then(() => undefined, () => undefined);
  return next;
}