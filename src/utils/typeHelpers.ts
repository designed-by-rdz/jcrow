export function isObject(value: any) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isArray(value: any) {
  return Array.isArray(value);
}

export function isPrimitive(value: any) {
  return !isObject(value) && !isArray(value);
}