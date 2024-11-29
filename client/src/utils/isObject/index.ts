export function isObject(input: any): input is object {
  return (
    null !== input &&
    typeof input === "object" &&
    Object.prototype.isPrototypeOf.call(Object.getPrototypeOf(input), Object)
  );
}
