export function isEmptyObject(value: Record<string, any>) {
  return Object.keys(value).length === 0 && value.constructor === Object;
}
