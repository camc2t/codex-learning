import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export async function loadMdxContent(relativePath: string) {
  const fullPath = path.join(process.cwd(), "content", relativePath);
  const raw = await fs.readFile(fullPath, "utf-8");
  const { content, data } = matter(raw);
  return { content, data };
}

export async function loadJsonContent<T>(relativePath: string): Promise<T> {
  const fullPath = path.join(process.cwd(), "content", relativePath);
  const raw = await fs.readFile(fullPath, "utf-8");
  return JSON.parse(raw) as T;
}
