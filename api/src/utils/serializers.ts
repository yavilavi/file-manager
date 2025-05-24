/**
 * Serializes an object or array that may contain BigInt values
 * by converting BigInt to strings
 * 
 * @param data The data to serialize
 * @returns A copy of the data with BigInt values converted to strings
 */
export function serializeBigInt(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }
  
  if (typeof data === 'bigint') {
    return data.toString();
  }
  
  if (Array.isArray(data)) {
    return data.map(item => serializeBigInt(item));
  }
  
  if (typeof data === 'object') {
    const result: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        result[key] = serializeBigInt(data[key]);
      }
    }
    return result;
  }
  
  return data;
} 