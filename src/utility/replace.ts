/**
 * Replace a property of an object with a new function
 *
 * @param obj The object containing the property to replace
 * @param name The name of the property to replace
 * @param replacement A function that takes the original value and returns the replacement
 * @param replacements Optional object to store replacement history
 * @param type Optional string indicating the type of replacement
 */
export default function replace(
  obj: Record<string, any>,
  name: string,
  replacement: (orig: any) => any,
  replacements?: { [key: string]: Array<[Record<string, any>, string, any]> },
  type?: string,
): void {
  const orig = obj[name];
  obj[name] = replacement(orig);
  if (replacements && type) {
    replacements[type].push([obj, name, orig]);
  }
}
