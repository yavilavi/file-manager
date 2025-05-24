/**
 * Serializes an object or array that may contain BigInt values
 * by converting BigInt to strings
 *
 * @param data The data to serialize
 * @returns A copy of the data with BigInt values converted to strings
 */
export function serializeBigInt<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'bigint') {
    return data.toString() as T;
  }

  if (Array.isArray(data)) {
    return (data as unknown[]).map((item) => serializeBigInt(item)) as T;
  }

  if (typeof data === 'object') {
    const result: Record<string, unknown> = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        result[key] = serializeBigInt((data as Record<string, unknown>)[key]);
      }
    }
    return result as T;
  }

  return data;
}
