import { getAll } from "@/lib/json-store";
import type { Source, SourceType } from "@/lib/types/db";
import { expandProduct } from "./products";

export async function getSources(): Promise<Source[]> {
  const sources = new Map<string, Source>();
  for (const raw of await getAll("products")) {
    const source = expandProduct(raw).source;
    if (source && !sources.has(source.id)) sources.set(source.id, source);
  }
  return [...sources.values()].sort((a, b) => (a.source_name ?? "").localeCompare(b.source_name ?? ""));
}

export async function getSourceById(id: string): Promise<Source | null> {
  return (await getSources()).find((source) => source.id === id) ?? null;
}

export async function createSource(_data?: Partial<Source>): Promise<never> {
  throw new Error("Sources are stored inside flat product records");
}

export async function updateSource(_id?: string, _data?: Partial<Source>): Promise<never> {
  throw new Error("Update the containing flat product records instead");
}

export async function deleteSource(_id?: string): Promise<boolean> {
  throw new Error("Delete or update the containing product records instead");
}

export async function getSourcesByType(type: SourceType): Promise<Source[]> {
  return (await getSources()).filter((source) => source.type === type);
}

export async function getSourcesWithCoordinates(): Promise<Source[]> {
  return (await getSources()).filter((source) => source.lat !== null && source.lng !== null);
}

export async function getSourceTypes(): Promise<string[]> {
  return [...new Set((await getSources()).map((source) => source.type).filter((type): type is SourceType => Boolean(type)))].sort();
}