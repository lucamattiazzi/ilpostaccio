import { readFileSync, writeFile } from "fs"

const CACHE_FILE = "./cache.json"
const cacheFileContent = JSON.parse(readFileSync(CACHE_FILE, "utf-8")) as Record<string, string>
const cacheMap = new Map<string, string>(Object.entries(cacheFileContent))

function get(key: string): string | undefined {
  return cacheMap.get(key)
}

function set(key: string, value: string) {
  cacheMap.set(key, value)
  const cacheFileContent = JSON.stringify(Object.fromEntries(cacheMap), null, 2)
  writeFile(CACHE_FILE, cacheFileContent, err => null)
}

export const cache = {
  get, set
}

export type Cache = typeof cache